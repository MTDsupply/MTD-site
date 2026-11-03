import type { CartLine } from "@/lib/store/cart";

export type Country = "CA" | "US";

/**
 * Proposed shipping rates in CAD, benchmarked October 2026 against Canadian
 * compostable-packaging suppliers (free over $250, or $500 in BC) and US ones
 * (World Centric: free ground over $75), and carrier estimates of $15–30 for a
 * 1–2 kg parcel and $35–55 for a 10–14 kg case. Edit here; the cart, checkout
 * and the shipping page all read from this file.
 */
export const SHIPPING: Record<Country, { label: string; pack: number; packFreeOver: number; perCase: number }> = {
  // Per-case rates set by the user on 2026-11-02: a case of 1,000 ships for $49.99 in Canada,
  // and the US case rate is 1.42× the Canadian one ($70.99).
  CA: { label: "Canada", pack: 9.95, packFreeOver: 99, perCase: 49.99 },
  US: { label: "United States", pack: 14.95, packFreeOver: 149, perCase: 70.99 },
};

export const COUNTRIES: Country[] = ["CA", "US"];

/**
 * Shipping for a cart: one flat pack rate per order (waived over the threshold
 * or when a case is in the cart), plus a per-case rate. Pure, client-safe.
 */
export function quoteShipping(lines: CartLine[], subtotal: number, country: Country): { amount: number; label: string } {
  const r = SHIPPING[country];
  const cases = lines.filter((l) => l.unit === "case").reduce((n, l) => n + l.qty, 0);
  const hasPacks = lines.some((l) => l.unit !== "case");
  const caseAmount = cases * r.perCase;
  let packAmount = 0;
  if (hasPacks && cases === 0 && subtotal < r.packFreeOver) packAmount = r.pack;
  const amount = Math.round((caseAmount + packAmount) * 100) / 100;
  if (amount === 0) return { amount: 0, label: `Free shipping to ${r.label}` };
  if (cases > 0) return { amount, label: `Courier to ${r.label} · ${cases} case${cases > 1 ? "s" : ""}` };
  return { amount, label: `Courier to ${r.label}` };
}
