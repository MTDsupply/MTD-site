"use client";
import Link from "next/link";
import { useState } from "react";
import { addToCart, type Unit } from "@/lib/store/cart";
import { useMode } from "@/lib/store/mode";
import { money, count } from "@/lib/format";
import { unitsFor } from "@/lib/units";
import type { Product } from "@/lib/catalog/types";

/**
 * One-line add for the product that pairs with the one on the page: the lid
 * for a cup. Follows the Business/Consumer toggle (a case, or the smallest pack).
 */
export function PairedAdd({ product, label }: { product: Product; label: string }) {
  const mode = useMode();
  const units = unitsFor(product);
  const pick = mode === "business" ? units.find((u) => u.kind === "case") ?? units[0] : units[0];
  const [added, setAdded] = useState(false);
  const href = `/products/${product.categorySlug}/${product.sku.toLowerCase()}`;

  const submit = () => {
    addToCart({ sku: product.sku, unit: pick.unit as Unit, qty: 1 });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  };

  return (
    <div className="flex items-center gap-3 rounded-[20px] bg-white p-3">
      {product.photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={product.photo} alt="" className="h-14 w-14 shrink-0 rounded-[20px] bg-white object-contain" />
      ) : null}
      <div className="min-w-0 flex-1">
        <p className="t-label text-forest">{label}</p>
        <p className="truncate text-sm font-medium">
          <Link href={href} className="hover:underline">
            {product.name}
          </Link>
        </p>
        <p className="tnum text-xs text-soil/70">
          {money(pick.price)} per {pick.kind === "case" ? "case" : "pack"} of {count(pick.count)}
        </p>
      </div>
      <button type="button" onClick={submit} className="btn btn-outline btn-sm shrink-0" disabled={added}>
        {added ? "Added" : "Add"}
      </button>
    </div>
  );
}
