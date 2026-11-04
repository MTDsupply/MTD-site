import type { Metadata } from "next";
import { Suspense } from "react";
import { getAdminSession } from "@/lib/admin";
import { money } from "@/lib/format";
import { addressLine, formatDate, orderLabel, unitLabel, toUnit, type OrderRow } from "@/lib/account/queries";
import { StatusChip } from "@/components/account/OrderTable";
import { ShipForm } from "@/components/admin/ShipForm";
import { unship } from "@/app/actions/admin";

export const metadata: Metadata = { title: "Orders" };

export default function AdminOrdersPage() {
  return (
    <Suspense fallback={<div className="skeleton mt-2 h-72" aria-busy="true" />}>
      <Orders />
    </Suspense>
  );
}

async function Orders() {
  const admin = await getAdminSession();
  if (!admin) return null;
  const { data } = await admin.db.from("orders").select("*").order("created_at", { ascending: false }).limit(100);
  const orders = (data ?? []) as (OrderRow & { email: string; user_id: string | null })[];
  const open = orders.filter((o) => !o.shipped_at);
  const shipped = orders.filter((o) => o.shipped_at);

  const Card = ({ o }: { o: (typeof orders)[number] }) => (
    <article className="rounded-[20px] bg-cream p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-display text-[17px] font-semibold text-forest tnum">
            Order {orderLabel(o)} · {money(o.amount_total / 100)}
          </p>
          <p className="mt-0.5 text-sm text-soil/70 tnum">
            {formatDate(o.created_at)} · {o.email}
            {o.mode === "business" ? " · Business" : ""}
            {o.user_id ? " · has an account" : ""}
          </p>
        </div>
        <StatusChip order={o} />
      </div>
      <ul className="mt-3 space-y-0.5 text-sm tnum">
        {o.items.map((i, idx) => (
          <li key={idx}>
            {i.qty} × {i.name} · {unitLabel(toUnit(i.unit))} · {money(i.price * i.qty)}
            {(i as { volume?: boolean }).volume ? <span className="ml-2 chip chip-sage">Volume price</span> : null}
          </li>
        ))}
      </ul>
      {addressLine(o) ? <p className="mt-2 text-sm text-soil/70">Ship to: {addressLine(o)}</p> : null}
      <div className="mt-4 border-t border-line pt-4">
        {o.shipped_at ? (
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
            <p className="tnum">
              Shipped {formatDate(o.shipped_at)}
              {o.carrier ? ` · ${o.carrier}` : ""}
              {o.tracking_number ? ` · ${o.tracking_number}` : ""}
              {o.tracking_url ? (
                <>
                  {" · "}
                  <a href={o.tracking_url} className="link" target="_blank" rel="noopener noreferrer">
                    tracking link
                  </a>
                </>
              ) : null}
            </p>
            <form action={unship}>
              <input type="hidden" name="orderId" value={o.id} />
              <button type="submit" className="btn btn-ghost btn-sm">
                Undo shipped
              </button>
            </form>
          </div>
        ) : (
          <ShipForm orderId={o.id} />
        )}
      </div>
    </article>
  );

  return (
    <div className="space-y-10">
      <section>
        <h2 className="t-heading text-forest">To ship ({open.length})</h2>
        {open.length ? <div className="mt-4 space-y-4">{open.map((o) => <Card key={o.id} o={o} />)}</div> : <p className="mt-3 rounded-[16px] bg-mint-light p-4 text-sm text-forest">Nothing waiting. Every paid order has shipped.</p>}
      </section>
      <section>
        <h2 className="t-heading text-forest">Shipped ({shipped.length})</h2>
        <div className="mt-4 space-y-4">{shipped.map((o) => <Card key={o.id} o={o} />)}</div>
      </section>
    </div>
  );
}
