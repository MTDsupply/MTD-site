import Link from "next/link";
import { money } from "@/lib/format";
import { formatDate, orderLabel, orderStatus, toUnit, type OrderRow } from "@/lib/account/queries";
import { ReorderButton } from "@/components/ReorderButton";

export function StatusChip({ order }: { order: Pick<OrderRow, "status" | "shipped_at"> }) {
  const s = orderStatus(order);
  return <span className={`chip chip-${s.tone}`}>{s.label}</span>;
}

/** Order history rows. Reorder puts the still-live lines in the cart. */
export function OrderTable({ orders, liveSkus }: { orders: OrderRow[]; liveSkus: Set<string> }) {
  return (
    <div className="overflow-x-auto rounded-[20px] bg-white">
      <table className="price-table w-full text-sm">
        <thead>
          <tr>
            <th>Order</th>
            <th>Date</th>
            <th className="wrap">Items</th>
            <th className="num">Total</th>
            <th>Status</th>
            <th>
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>
                <Link href={`/account/orders/${o.id}`} className="link font-medium tnum">
                  {orderLabel(o)}
                </Link>
              </td>
              <td className="tnum">{formatDate(o.created_at)}</td>
              <td className="wrap text-soil/80">{o.items.map((i) => `${i.qty} × ${i.name}`).join(", ")}</td>
              <td className="num tnum">{money(o.amount_total / 100)}</td>
              <td>
                <StatusChip order={o} />
              </td>
              <td className="text-right">
                <ReorderButton
                  lines={o.items.filter((i) => liveSkus.has(i.sku)).map((i) => ({ sku: i.sku, unit: toUnit(i.unit), qty: i.qty }))}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
