"use client";
import Link from "next/link";
import { useCart, cartCount } from "@/lib/store/cart";

export function CartButton() {
  const n = cartCount(useCart());
  return (
    <Link href="/cart" className="btn btn-ghost btn-sm gap-1.5" aria-label={`Cart, ${n} items`}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <path d="M3 4h2l2.4 11.2a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.8L20 8H6.2" />
        <circle cx="9.5" cy="19.5" r="1.2" />
        <circle cx="17" cy="19.5" r="1.2" />
      </svg>
      <span>Cart</span>
      {/* Keyed on the count so the badge pops (CSS) each time it changes. */}
      <span key={n} className={`cart-badge cart-pop tnum px-1.5 py-0.5 text-[11px] leading-none ${n > 0 ? "bg-sage text-white" : "bg-soil text-paper"}`}>
        {n}
      </span>
    </Link>
  );
}
