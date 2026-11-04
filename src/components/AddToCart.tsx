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
 * Pack size (100 / 200 / 500) or case, quantity, unit price updating,
 * Add to cart, and the volume line: the per-unit price once an order reaches
 * ten cases (applied automatically), or a quote link for SKUs without a tier.
 */
export function AddToCart({ product, compact = false }: { product: Product; compact?: boolean }) {
  const mode = useMode();
  const units = unitsFor(product);
  // Follow the toggle unless the buyer has picked a unit themselves.
  const [chosen, setChosen] = useState<Unit | null>(null);
  const unit: Unit = chosen ?? (mode === "business" ? "case" : units[0].unit);
  const info = unitInfo(product, unit);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const priced = priceFor(product, info, qty);
  const perUnit = priced.price / info.count;
  const lineTotal = qty * priced.price;

  const submit = () => {
    addToCart({ sku: product.sku, unit, qty });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  };

  return (
    <div className="space-y-2">
      <div className={`flex flex-wrap ${compact ? "gap-1.5" : "gap-2"}`}>
        <select
          aria-label="Pack or case"
          className="input min-w-[7.5rem] flex-1"
          value={unit}
          onChange={(e) => setChosen(e.target.value as Unit)}
        >
          {units.map((u) => (
            <option key={u.unit} value={u.unit}>
              {u.label} · {money(u.price)}
            </option>
          ))}
        </select>
        <input
          aria-label="Quantity"
          type="number"
          min={1}
          max={500}
          value={qty}
          onChange={(e) => setQty(Math.max(1, Math.min(500, Number(e.target.value) || 1)))}
          className="input tnum w-16 shrink-0"
        />
        <button type="button" onClick={submit} className="btn btn-primary min-w-[7.5rem] flex-1" disabled={added}>
          {added ? "Added" : "Add to cart"}
        </button>
      </div>
      {!compact ? (
        <p className="text-xs tnum text-soil/70">
          {count(qty * info.count)} units · {unitMoney(perUnit)} each · {money(lineTotal)}
          {priced.bulk ? <span className="ml-2 font-medium text-sage-deep">Volume price</span> : null}
        </p>
      ) : null}
      {mode === "business" || !compact ? (
        product.bulkUnitPrice != null ? (
          <p className="text-xs tnum text-soil/70">
            {count(bulkCasesFor(product))} cases or more in one order: {unitMoney(product.bulkUnitPrice)} per unit, applied in the cart.
          </p>
        ) : (
          <p className="text-xs text-soil/70">
            Buying {count(bulkCasesFor(product))}+ cases?{" "}
            <Link href={`/business?sku=${product.sku}#quote`} className="link font-medium">
              Get a quote
            </Link>
          </p>
        )
      ) : null}
    </div>
  );
}
