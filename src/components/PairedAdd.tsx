"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { addToCart, type Unit } from "@/lib/store/cart";
import { useMode } from "@/lib/store/mode";
import { money, unitMoney, count } from "@/lib/format";
import { unitsFor } from "@/lib/units";
import type { Product } from "@/lib/catalog/types";

/**
 * "Pair it with" row: the product that goes with the one on the page (the lid
 * for a cup, each cup for the lid). A hairline card with the photo, the name,
 * the from-price for the unit the Business/Consumer toggle implies, and one
 * square "+" that adds that unit.
 */
export function PairedAdd({ product }: { product: Product; label?: string }) {
  const mode = useMode();
  const units = unitsFor(product);
  const pick = mode === "business" ? units.find((u) => u.kind === "case") ?? units[0] : units[0];
  const [added, setAdded] = useState(false);
  const href = `/products/${product.categorySlug}/${product.sku.toLowerCase()}`;
  const noun = product.categorySlug === "lids" ? "lid" : "cup";

  const submit = () => {
    addToCart({ sku: product.sku, unit: pick.unit as Unit, qty: 1 });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  };

  return (
    <div className="flex items-center gap-4 border border-line bg-card p-3">
      {product.photo ? (
        <Link href={href} className="relative block h-[72px] w-[72px] shrink-0 overflow-hidden bg-card" aria-hidden="true" tabIndex={-1}>
          <Image src={product.photo} alt="" fill sizes="72px" className="object-cover" />
        </Link>
      ) : null}
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-medium text-ink">
          <Link href={href} className="hover:underline">
            {product.name.toLowerCase()}
          </Link>
        </p>
        <p className="tnum mt-0.5 text-[13px] text-stone">
          {mode === "business" ? (
            <>
              from {unitMoney(product.unitPrice)} a {noun} · {money(pick.price)} a case of {count(pick.count)}
            </>
          ) : (
            <>
              {money(pick.price)} a pack of {count(pick.count)}
            </>
          )}
        </p>
      </div>
      <button type="button" onClick={submit} className="plus-btn shrink-0" disabled={added} aria-label={`Add ${product.name}`}>
        {added ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="m5 12 5 5 9-10" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="M12 5v14M5 12h14" />
          </svg>
        )}
      </button>
    </div>
  );
}
