"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { addManyToCart, type CartLine } from "@/lib/store/cart";

/**
 * One-click reorder: puts every still-live line into the cart. With `goToCart`
 * it opens the cart straight away; otherwise the button turns into a cart link.
 */
export function ReorderButton({
  lines,
  label = "Reorder",
  className = "btn btn-outline btn-sm",
  goToCart = false,
}: {
  lines: CartLine[];
  label?: string;
  className?: string;
  goToCart?: boolean;
}) {
  const [done, setDone] = useState(false);
  const router = useRouter();
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
      className={className}
      onClick={() => {
        addManyToCart(lines);
        if (goToCart) router.push("/cart");
        else setDone(true);
      }}
    >
      {label}
    </button>
  );
}
