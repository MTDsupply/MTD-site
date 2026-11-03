"use client";
import { useEffect, useRef, useState } from "react";
import { addToCart, type Unit } from "@/lib/store/cart";
import { useMode } from "@/lib/store/mode";
import { money, count } from "@/lib/format";
import { unitsFor } from "@/lib/units";
import type { Product } from "@/lib/catalog/types";

/**
 * On phones, a bar pinned to the bottom of the screen once the buy box has
 * scrolled away: name, the price for the default unit, Add to cart. Hidden on
 * wider screens, where the buy box stays in view.
 */
export function StickyBuyBar({ product }: { product: Product }) {
  const mode = useMode();
  const units = unitsFor(product);
  const pick = mode === "business" ? units.find((u) => u.kind === "case") ?? units[0] : units[0];
  const [show, setShow] = useState(false);
  const [added, setAdded] = useState(false);
  const sentinel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setShow(!e.isIntersecting && e.boundingClientRect.top < 0), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const submit = () => {
    addToCart({ sku: product.sku, unit: pick.unit as Unit, qty: 1 });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  };

  return (
    <>
      <div ref={sentinel} aria-hidden="true" />
      <div
        className={`fixed inset-x-0 bottom-0 z-20 border-t border-line bg-white/95 px-4 py-3 shadow-[0_-12px_32px_-16px_rgba(43,43,43,0.35)] backdrop-blur transition-transform duration-300 md:hidden ${
          show ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
        aria-hidden={!show}
      >
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{product.name}</p>
            <p className="tnum text-xs text-soil/70">
              {money(pick.price)} per {pick.kind === "case" ? "case" : "pack"} of {count(pick.count)}
            </p>
          </div>
          <button type="button" onClick={submit} className="btn btn-primary shrink-0" disabled={added} tabIndex={show ? 0 : -1}>
            {added ? "Added" : "Add to cart"}
          </button>
        </div>
      </div>
    </>
  );
}
