import "server-only";
import Stripe from "stripe";

/** Null until the Stripe integration is installed and STRIPE_SECRET_KEY is set. */
export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}
