import type { Metadata } from "next";
import { Suspense } from "react";
import { getLiveProducts } from "@/lib/catalog/queries";
import { getOrders, getSession, getUsual, toUnit } from "@/lib/account/queries";
import { usualFromOrder } from "@/app/actions/account";
import { UsualEditor } from "@/components/account/UsualEditor";

export const metadata: Metadata = { title: "Your usual" };

export default function UsualPage() {
  return (
    <Suspense fallback={<div className="skeleton mt-2 h-72" aria-busy="true" />}>
      <Usual />
    </Suspense>
  );
}

async function Usual() {
  const s = await getSession();
  if (!s) return null;
  const [usual, products, orders] = await Promise.all([getUsual(s), getLiveProducts(), getOrders(s, 1)]);
  const live = new Set(products.map((p) => p.sku));
  const initial = usual.filter((u) => live.has(u.sku)).map((u) => ({ sku: u.sku, unit: toUnit(u.unit), qty: u.qty }));
  const last = orders[0];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="t-heading">Your usual</h2>
          <p className="mt-1 text-sm text-soil/70">The lines you reorder. Change units or quantities any time; one click puts the whole list in your cart.</p>
        </div>
        {initial.length === 0 && last ? (
          <form action={usualFromOrder}>
            <input type="hidden" name="orderId" value={last.id} />
            <button type="submit" className="btn btn-outline btn-sm">
              Start from your last order
            </button>
          </form>
        ) : null}
      </div>
      <UsualEditor key={initial.map((l) => `${l.sku}:${l.unit}:${l.qty}`).join("|")} products={products} initial={initial} />
    </div>
  );
}
