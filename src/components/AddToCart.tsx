"use client";
import { useState } from "react";
import Link from "next/link";
import { addToCart, type Unit } from "@/lib/store/cart";
import { useMode } from "@/lib/store/mode";
import { money, count, unitMoney } from "@/lib/format";
import { unitsFor, unitInfo } from "@/lib/units";
import type { Product } from "@/lib/catalog/types";

/**
 * Pack size (100 / 200 / 500) or case, quantity, unit price updating,
 * Add to cart, and the business line "Buying 10+ cases? Get a quote."
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

  const perUnit = info.price / info.count;
  const lineTotal = qty * info.price;

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
      <p className="text-xs tnum text-soil/70">
        {count(qty * info.count)} units · {unitMoney(perUnit)} each · {money(lineTotal)}
      </p>
      {mode === "business" || !compact ? (
        <p className="text-xs text-soil/70">
          Buying 10+ cases?{" "}
          <Link href={`/business?sku=${product.sku}#quote`} className="link font-medium">
            Get a quote
          </Link>
        </p>
      ) : null}
    </div>
  );
}
