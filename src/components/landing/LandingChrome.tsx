"use client";
import Link from "next/link";
import { useEffect } from "react";
import { Wordmark } from "@/components/Wordmark";
import { track } from "@/lib/analytics/pixel";

/** Minimal header for paid-traffic landing pages: logo and a secure-checkout note, nothing to click away to. */
export function LandingChrome() {
  return (
    <div className="border-b border-line bg-paper">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" aria-label="Made to Disappear">
          <Wordmark className="h-6" />
        </Link>
        <span className="flex items-center gap-1.5 text-xs text-soil/60">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <rect x="4" y="10" width="16" height="11" rx="1.5" />
            <path d="M8 10V7a4 4 0 0 1 8 0v3" />
          </svg>
          Secure checkout
        </span>
      </div>
    </div>
  );
}

/** Fires the Meta ViewContent event once for the product on this page. */
export function ViewContent({ sku, price }: { sku: string; price: number }) {
  useEffect(() => {
    track("ViewContent", { content_ids: [sku], content_type: "product", value: price, currency: "CAD" });
  }, [sku, price]);
  return null;
}
