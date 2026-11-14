"use client";
import { useState } from "react";
import Link from "next/link";
import { addToCart, type Unit } from "@/lib/store/cart";
import { useMode } from "@/lib/store/mode";
import { money, count, unitMoney } from "@/lib/format";
import { unitsFor, unitInfo } from "@/lib/units";
import { priceFor, bulkCasesFor } from "@/lib/pricing";
import type { Product } from "@/lib/catalog/types";

/**
 * The buy box. Full form (product page): the unit as a row of chips (each
 * pack size, then the case), a stepper bar that reads out the quantity, the
 * units it comes to, the price each and the line total, then one primary
 * "add to cart". Compact form (tiles elsewhere): a select, a quantity and an
 * outlined add. Both follow the Business/Consumer toggle until the buyer
 * picks a unit themselves.
 */
export function AddToCart({ product, compact = false }: { product: Product; compact?: boolean }) {
  const mode = useMode();
  const units = unitsFor(product);
  const [chosen, setChosen] = useState<Unit | null>(null);
  const unit: Unit = chosen ?? (mode === "business" ? "case" : units[0].unit);
  const info = unitInfo(product, unit);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const priced = priceFor(product, info, qty);
  const perUnit = priced.price / info.count;
  const lineTotal = qty * priced.price;
  const noun = product.categorySlug === "lids" ? "lid" : "cup";
  const nouns = product.categorySlug === "lids" ? "lids" : "cups";

  const submit = () => {
    addToCart({ sku: product.sku, unit, qty });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  };

  const volumeLine =
    mode === "business" || !compact ? (
      product.bulkUnitPrice != null ? (
        <p className="text-[13px] tnum text-stone">
          {count(bulkCasesFor(product))} cases or more in one order: {unitMoney(product.bulkUnitPrice)} per unit, applied in the cart.
        </p>
      ) : (
        <p className="text-[13px] text-stone">
          Buying {count(bulkCasesFor(product))}+ cases?{" "}
          <Link href={`/business?sku=${product.sku}#quote`} className="link text-ink">
            get a quote
          </Link>
        </p>
      )
    ) : null;

  if (compact) {
    return (
      <div className="space-y-2">
        <div className="grid grid-cols-[auto_1fr] gap-1.5 sm:flex sm:flex-wrap">
          <select aria-label="Pack or case" className="input col-span-2 min-w-0 sm:col-span-1 sm:min-w-[7.5rem] sm:flex-1" value={unit} onChange={(e) => setChosen(e.target.value as Unit)}>
            {units.map((u) => (
              <option key={u.unit} value={u.unit}>
                {u.label}
              </option>
            ))}
          </select>
          <input aria-label="Quantity" type="number" min={1} max={500} value={qty} onChange={(e) => setQty(Math.max(1, Math.min(500, Number(e.target.value) || 1)))} className="input tnum w-16 shrink-0" />
          <button type="button" onClick={submit} className="btn btn-outline min-w-0 sm:min-w-[7.5rem] sm:flex-1" disabled={added}>
            {added ? "added" : "add"}
          </button>
        </div>
        {volumeLine}
      </div>
    );
  }

  return (
    <div>
      <p className="t-label">pack or case</p>
      <div role="radiogroup" aria-label="Pack or case" className="mt-2 flex flex-wrap gap-2">
        {units.map((u) => {
          const on = u.unit === unit;
          return (
            <button key={u.unit} type="button" role="radio" aria-checked={on} onClick={() => setChosen(u.unit)} className={`chip ${on ? "!border-ink !bg-ink !text-bone" : "chip-fog"}`}>
              {u.kind === "case" ? `case of ${count(u.count)}` : `pack of ${count(u.count)}`}
            </button>
          );
        })}
      </div>

      <p className="t-label mt-6">quantity</p>
      <div className="stepper mt-2 flex items-stretch border border-ink">
        <button type="button" className="stepper-btn border-r border-ink" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="One fewer" disabled={qty <= 1}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="M5 12h14" />
          </svg>
        </button>
        <div className="flex min-w-0 flex-1 items-center justify-between gap-3 px-4 py-3">
          <div className="min-w-0">
            <p className="text-[15px] font-medium text-ink tnum">
              {qty} {info.kind === "case" ? (qty === 1 ? "case" : "cases") : qty === 1 ? "pack" : "packs"}
            </p>
            <p className="text-[13px] text-stone tnum">
              {count(qty * info.count)} {nouns} · {unitMoney(perUnit)} a {noun}
              {priced.bulk ? <span className="ml-2 font-medium text-ink">volume price</span> : null}
            </p>
          </div>
          <p className="shrink-0 text-[17px] font-medium text-ink tnum">{money(lineTotal)}</p>
        </div>
        <button type="button" className="stepper-btn border-l border-ink" onClick={() => setQty((q) => Math.min(500, q + 1))} aria-label="One more" disabled={qty >= 500}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </div>

      <button type="button" onClick={submit} className="btn btn-primary btn-lg mt-3 w-full" disabled={added}>
        {added ? "added to cart" : "add to cart"}
      </button>
      <div className="mt-3">{volumeLine}</div>
    </div>
  );
}
