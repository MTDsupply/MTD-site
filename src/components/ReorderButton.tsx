"use client";
import { useState } from "react";
import Link from "next/link";
import { addManyToCart, type CartLine } from "@/lib/store/cart";

/** One-click reorder: puts every still-live line from a past order into the cart. */
export function ReorderButton({ lines }: { lines: CartLine[] }) {
  const [done, setDone] = useState(false);
  if (lines.length === 0) return null;
  if (done) {
    return (
      <Link href="/cart" className="btn btn-primary btn-sm">
        View cart
      </Link>
    );
  }
  return (
    <button
      type="button"
      className="btn btn-outline btn-sm"
      onClick={() => {
        addManyToCart(lines);
        setDone(true);
      }}
    >
      Reorder
    </button>
  );
}
