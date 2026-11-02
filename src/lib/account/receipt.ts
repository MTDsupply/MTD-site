import "server-only";
import { getStripe } from "@/lib/stripe";

/** Stripe's hosted receipt for a checkout session, or null when unavailable. */
export async function receiptUrl(sessionId: string): Promise<string | null> {
  const stripe = getStripe();
  if (!stripe || !sessionId) return null;
  try {
    const s = await stripe.checkout.sessions.retrieve(sessionId, { expand: ["payment_intent.latest_charge"] });
    const pi = s.payment_intent;
    if (!pi || typeof pi === "string") return null;
    const charge = pi.latest_charge;
    if (!charge || typeof charge === "string") return null;
    return charge.receipt_url ?? null;
  } catch {
    return null;
  }
}
