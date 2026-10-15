"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { addToCart } from "@/lib/store/cart";
import { money, count } from "@/lib/format";
import { unitsFor, type UnitInfo } from "@/lib/units";
import { track } from "@/lib/analytics/pixel";
import type { Product } from "@/lib/catalog/types";

const LABELS: Record<string, { tag?: string; who: string }> = {
  "pack-100": { who: "Try them at home" },
  "pack-200": { who: "Busy household or small office" },
  "pack-500": { tag: "Most popular", who: "Small café, or a season of iced drinks" },
  case: { tag: "Best for business", who: "Cafés, bars and caterers" },
};

/**
 * Tier cards: pick a size, add to cart, go to checkout. The conversion point
 * of the landing page. `units` limits which tiers show; `cta` sets the button.
 */
export function TierPicker({
  product,
  id = "buy",
  units,
  cta = "Add to cart",
  onInk = true,
}: {
  product: Product;
  id?: string;
  units?: string[];
  cta?: string;
  onInk?: boolean;
}) {
  const all = unitsFor(product);
  const tiers = units ? all.filter((t) => units.includes(t.unit)) : all;
  const [selected, setSelected] = useState<UnitInfo>(tiers.find((t) => t.unit === "pack-500") ?? tiers[0]);
  const [added, setAdded] = useState(false);
  const reduced = useReducedMotion();

  const buy = () => {
    addToCart({ sku: product.sku, unit: selected.unit, qty: 1 });
    track("AddToCart", { content_ids: [product.sku], content_type: "product", value: selected.price, currency: "CAD" });
    setAdded(true);
  };

  const cols = tiers.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3";
  const text = onInk ? "text-white" : "text-soil";
  const sub = onInk ? "text-paper/85" : "text-soil/70";

  return (
    <div id={id} className="scroll-mt-24">
      <div className={`grid gap-3 sm:grid-cols-2 ${cols}`} role="radiogroup" aria-label="Choose a size">
        {tiers.map((t) => {
          const meta = LABELS[t.unit] ?? { who: "" };
          const on = selected.unit === t.unit;
          return (
            <button
              key={t.unit}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => {
                setSelected(t);
                setAdded(false);
              }}
              className={`relative flex flex-col items-start border bg-white p-5 text-left text-soil transition-all ${
                on ? "border-sage ring-2 ring-sage" : "border-line hover:border-sage"
              }`}
            >
              {meta.tag ? <span className="chip chip-clay absolute right-3 top-3">{meta.tag}</span> : null}
              <span className="t-label text-sage-deep">{t.kind === "case" ? "Case" : "Pack"}</span>
              <span className="t-heading mt-1 tnum">{count(t.count)}</span>
              <span className="text-sm text-soil/70">straws</span>
              <span className="mt-4 text-2xl font-medium tnum">{money(t.price)}</span>
              <span className="text-xs text-soil/60 tnum">{money(t.price / t.count)} each</span>
              <span className="mt-3 text-sm text-soil/75">{meta.who}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-4">
        {added ? (
          <motion.div initial={reduced ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-center gap-3">
            <span className={`text-sm font-medium ${text}`}>Added {count(selected.count)} straws to your cart.</span>
            <Link href="/cart" className={onInk ? "btn btn-paper" : "btn btn-primary"}>
              Go to checkout
            </Link>
            <button type="button" onClick={buy} className={onInk ? "btn border-paper/70 text-white hover:bg-white/10" : "btn btn-outline"}>
              Add another
            </button>
          </motion.div>
        ) : (
          <>
            <button type="button" onClick={buy} className={`${onInk ? "btn btn-paper" : "btn btn-primary"} px-8 py-3 text-base`}>
              {cta} · {money(selected.price)}
            </button>
            <span className={`text-sm ${sub}`}>10 cents a straw at every size.</span>
          </>
        )}
      </div>
    </div>
  );
}
