import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getLiveProducts } from "@/lib/catalog/queries";
import { money } from "@/lib/format";
import { addressLine, formatDate, getOrder, getSession, orderLabel, toUnit, unitLabel } from "@/lib/account/queries";
import { receiptUrl } from "@/lib/account/receipt";
import { usualFromOrder } from "@/app/actions/account";
import { StatusChip } from "@/components/account/OrderTable";
import { ReorderButton } from "@/components/ReorderButton";

export const metadata: Metadata = { title: "Order" };

export default function OrderPage({ params }: PageProps<"/account/orders/[id]">) {
  return (
    <Suspense fallback={<div className="skeleton mt-2 h-72" aria-busy="true" />}>
      <OrderDetail params={params} />
    </Suspense>
  );
}

async function OrderDetail({ params }: { params: PageProps<"/account/orders/[id]">["params"] }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const s = await getSession();
  if (!s) return null;
  const order = await getOrder(s, id);
  if (!order) notFound();

  const [products, receipt] = await Promise.all([getLiveProducts(), receiptUrl(order.stripe_session_id)]);
  const liveSkus = new Set(products.map((p) => p.sku));
  const subtotal = order.items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const total = order.amount_total / 100;
  const address = addressLine(order);
  const lines = order.items.filter((i) => liveSkus.has(i.sku)).map((i) => ({ sku: i.sku, unit: toUnit(i.unit), qty: i.qty }));

  return (
    <div>
      <Link href="/account/orders" className="link text-sm">
        ← All orders
      </Link>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="t-heading tnum">Order {orderLabel(order)}</h2>
          <p className="mt-1 text-sm text-soil/70 tnum">
            Placed {formatDate(order.created_at)}
            {order.mode === "business" ? " · Business" : null}
          </p>
        </div>
        <StatusChip order={order} />
      </div>

      {order.shipped_at ? (
        <div className="mt-4 border border-sage bg-sage-tint p-4 text-sm">
          <p className="font-medium">Shipped {formatDate(order.shipped_at)}</p>
          {order.carrier || order.tracking_number ? (
            <p className="mt-1 text-soil/80 tnum">
              {order.carrier}
              {order.carrier && order.tracking_number ? " · " : null}
              {order.tracking_url ? (
                <a href={order.tracking_url} className="link" target="_blank" rel="noopener noreferrer">
                  {order.tracking_number ?? "Track the parcel"}
                </a>
              ) : (
                order.tracking_number
              )}
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="mt-4 overflow-x-auto border border-line bg-white">
        <table className="price-table w-full text-sm">
          <thead>
            <tr>
              <th>Item</th>
              <th>Unit</th>
              <th className="num">Qty</th>
              <th className="num">Each</th>
              <th className="num">Line</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((i, idx) => (
              <tr key={idx}>
                <td>
                  <span className="font-medium">{i.name}</span>
                  <div className="sku text-soil/60">{i.sku}</div>
                </td>
                <td>{unitLabel(i.unit)}</td>
                <td className="num tnum">{i.qty}</td>
                <td className="num tnum">{money(i.price)}</td>
                <td className="num tnum">{money(i.price * i.qty)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={4}>Items</td>
              <td className="num tnum">{money(subtotal)}</td>
            </tr>
            {total > subtotal ? (
              <tr>
                <td colSpan={4}>Shipping and tax</td>
                <td className="num tnum">{money(total - subtotal)}</td>
              </tr>
            ) : null}
            <tr>
              <td colSpan={4} className="font-medium">
                Total charged
              </td>
              <td className="num tnum font-medium">{money(total)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="border border-line bg-white p-5 text-sm">
          <h3 className="t-card">Delivered to</h3>
          {address ? <p className="mt-2 text-soil/80">{address}</p> : <p className="mt-2 text-soil/70">No delivery address was recorded for this order.</p>}
        </div>
        <div className="border border-line bg-white p-5 text-sm">
          <h3 className="t-card">Order again</h3>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <ReorderButton lines={lines} label="Reorder these items" className="btn btn-primary btn-sm" goToCart />
            <form action={usualFromOrder}>
              <input type="hidden" name="orderId" value={order.id} />
              <button type="submit" className="btn btn-outline btn-sm">
                Save as your usual
              </button>
            </form>
            {receipt ? (
              <a href={receipt} className="link" target="_blank" rel="noopener noreferrer">
                View receipt
              </a>
            ) : null}
          </div>
          {lines.length < order.items.length ? <p className="mt-3 text-xs text-soil/60">Items no longer in the range are left out of the reorder.</p> : null}
        </div>
      </div>
    </div>
  );
}
