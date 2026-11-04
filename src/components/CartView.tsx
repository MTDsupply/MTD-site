"use client";
import Link from "next/link";
import { stockSentence } from "@/lib/site";
import { useState, useTransition } from "react";
import type { Product } from "@/lib/catalog/types";
import { useCart, setQty, removeLine } from "@/lib/store/cart";
import { useMode } from "@/lib/store/mode";
import { money } from "@/lib/format";
import { priceOrder, BULK_MIN_UNITS } from "@/lib/pricing";
import { count } from "@/lib/format";
import { startCheckout } from "@/app/actions/checkout";
import { track } from "@/lib/analytics/pixel";
import { quoteShipping, SHIPPING, COUNTRIES, type Country } from "@/lib/shipping";

export function CartView({ products }: { products: Product[] }) {
  const lines = useCart();
  const mode = useMode();
  const [error, setError] = useState<string | null>(null);
  const [country, setCountry] = useState<Country>("CA");
  const [pending, start] = useTransition();
  const order = priceOrder(lines, products);
  const { rows, subtotal } = order;
  const hasCases = rows.some((r) => r.info.kind === "case");
  const bulkEligible = products.some((p) => p.bulkUnitPrice != null);
  const ship = quoteShipping(rows.map((r) => r.line), subtotal, country);

  const checkout = () => {
    setError(null);
    track("InitiateCheckout", { value: subtotal, currency: "CAD", num_items: rows.reduce((n, r) => n + r.line.qty, 0) });
    start(async () => {
      const res = await startCheckout({ lines: rows.map((r) => r.line), mode, country });
      if (res?.error) setError(res.error);
    });
  };

  if (rows.length === 0) {
    return (
      <div className="mt-8 grid gap-6 border border-line bg-white p-8 md:grid-cols-[auto_1fr] md:items-center">
        <div className="relative h-28 w-28 overflow-hidden bg-paper">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/products/MTD-CUP-12H-front.jpg" alt="" className="h-full w-full bg-white object-contain" />
        </div>
        <div className="text-sm">
        <p className="t-card">Nothing in your cart yet.</p>
        <p className="mt-1 text-soil/70">{stockSentence()} Packs of 100, 200 or 500, or cases of 1,000.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/products" className="btn btn-primary btn-sm">
            Browse products
          </Link>
          <Link href="/quick-order" className="btn btn-outline btn-sm">
            Quick order by SKU
          </Link>
        </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="overflow-x-auto border border-line bg-white">
        <table className="price-table w-full text-sm">
          <thead>
            <tr>
              <th>Item</th>
              <th>Unit</th>
              <th className="num">Qty</th>
              <th className="num">Each</th>
              <th className="num">Line</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map(({ line, product, info, price: each, bulk }) => {
              return (
                <tr key={`${line.sku}-${line.unit}`}>
                  <td>
                    <Link href={`/products/${product.categorySlug}/${product.sku.toLowerCase()}`} className="font-medium hover:underline">
                      {product.name}
                    </Link>
                    <div className="sku text-soil/60">{product.sku}</div>
                  </td>
                  <td>
                    {info.label}
                    {bulk ? <div className="mt-0.5 text-[11px] font-medium uppercase tracking-wide text-sage-deep">Volume price</div> : null}
                  </td>
                  <td className="num">
                    <input
                      aria-label={`Quantity for ${product.name}`}
                      type="number"
                      min={1}
                      max={500}
                      value={line.qty}
                      onChange={(e) => setQty(line.sku, line.unit, Math.max(1, Math.min(500, Number(e.target.value) || 1)))}
                      className="input tnum w-16 py-1 text-right"
                    />
                  </td>
                  <td className="num">{money(each)}</td>
                  <td className="num">{money(each * line.qty)}</td>
                  <td>
                    <button type="button" onClick={() => removeLine(line.sku, line.unit)} className="text-xs text-soil/60 hover:text-clay-deep">
                      Remove
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <aside className="h-fit border border-line bg-white p-5 text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="tnum font-medium">{money(subtotal)}</span>
        </div>
        {order.bulk ? (
          <p className="mt-1 text-xs text-sage-deep">
            Volume price applied: {count(order.units)} units in this order.
            {order.listSubtotal > subtotal ? <> You save {money(order.listSubtotal - subtotal)}.</> : null}
          </p>
        ) : hasCases && bulkEligible ? (
          <p className="mt-1 text-xs text-soil/60">
            Orders of {count(BULK_MIN_UNITS)} units or more get the volume price on every case. {count(order.unitsToBulk)} more units to go.
          </p>
        ) : null}
        <div className="mt-3">
          <label htmlFor="ship-to" className="label">
            Ship to
          </label>
          <select id="ship-to" className="input" value={country} onChange={(e) => setCountry(e.target.value as Country)}>
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>
                {SHIPPING[c].label}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-3 flex justify-between">
          <span>Shipping</span>
          <span className="tnum">{ship.amount === 0 ? "Free" : money(ship.amount)}</span>
        </div>
        <div className="mt-1 flex justify-between border-t border-line pt-2">
          <span className="font-medium">Total before tax</span>
          <span className="tnum font-medium">{money(subtotal + ship.amount)}</span>
        </div>
        <p className="mt-2 text-xs text-soil/60">
          {ship.amount === 0 && rows.every((r) => r.line.unit !== "case")
            ? `Free shipping on pack orders over ${money(SHIPPING[country].packFreeOver)}.`
            : rows.every((r) => r.line.unit !== "case")
              ? `Free shipping on pack orders over ${money(SHIPPING[country].packFreeOver)}.`
              : `Cases ship by courier at ${money(SHIPPING[country].perCase)} each; packs ride along free.`}{" "}
          Tax is added at checkout.
        </p>
        <button type="button" onClick={checkout} className="btn btn-primary mt-4 w-full" disabled={pending}>
          {pending ? "Opening checkout…" : "Checkout"}
        </button>
        {error ? (
          <p className="mt-3 text-xs text-clay-deep" role="alert">
            {error}{" "}
            <Link href="/business#quote" className="underline">
              Request a quote
            </Link>
          </p>
        ) : null}
        {mode === "business" ? (
          <p className="mt-3 text-xs text-soil/60">
            Net-30 account?{" "}
            <Link href="/business#quote" className="link">
              Send this as a quote
            </Link>{" "}
            and we will invoice you.
          </p>
        ) : null}
      </aside>
    </div>
  );
}
