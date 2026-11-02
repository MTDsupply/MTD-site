"use server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getStripe } from "@/lib/stripe";
import { getLiveProducts } from "@/lib/catalog/queries";
import { cents } from "@/lib/format";
import { site } from "@/lib/site";
import { unitInfo } from "@/lib/units";
import type { Unit } from "@/lib/store/cart";
import { quoteShipping, type Country } from "@/lib/shipping";
import { getSession } from "@/lib/account/queries";
import Stripe from "stripe";

const lineSchema = z.object({
  sku: z.string().min(1).max(40),
  unit: z.string().regex(/^(case|pack-\d{1,5})$/),
  qty: z.number().int().min(1).max(500),
});
const schema = z.object({
  lines: z.array(lineSchema).min(1).max(50),
  mode: z.enum(["consumer", "business"]).default("consumer"),
  country: z.enum(["CA", "US"]).default("CA"),
});

export type CheckoutInput = z.infer<typeof schema>;

export async function startCheckout(input: CheckoutInput): Promise<{ error: string } | void> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { error: "Your cart could not be read. Refresh and try again." };

  const stripe = getStripe();
  if (!stripe) {
    return {
      error:
        "Online payment is not switched on yet. Call us or use the quote form and we'll invoice you.",
    };
  }

  const products = await getLiveProducts();
  const bySku = new Map(products.map((p) => [p.sku, p]));

  const line_items = [];
  const summary = [];
  let subtotal = 0;
  for (const line of parsed.data.lines) {
    const p = bySku.get(line.sku);
    if (!p) return { error: `${line.sku} is no longer available.` };
    const info = unitInfo(p, line.unit as Unit);
    const price = info.price;
    line_items.push({
      quantity: line.qty,
      price_data: {
        currency: site.currency.toLowerCase(),
        unit_amount: cents(price),
        product_data: {
          name: `${p.name} · ${info.label.toLowerCase()}`,
          description: `${p.sku} · ${p.material} · 100% certified home-compostable material`,
        },
      },
    });
    summary.push({ sku: p.sku, name: p.name, unit: line.unit, qty: line.qty, price });
    subtotal += price * line.qty;
  }
  const country = parsed.data.country as Country;
  const ship = quoteShipping(parsed.data.lines as { sku: string; unit: Unit; qty: number }[], subtotal, country);

  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = `${proto}://${host}`;

  // Signed-in customers: lock the email so the order lands in their account,
  // and carry the user id for the webhook.
  const session_user = await getSession();

  const params: Stripe.Checkout.SessionCreateParams = {
    mode: "payment",
    ...(session_user?.user.email ? { customer_email: session_user.user.email, client_reference_id: session_user.user.id } : {}),
    line_items,
    success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/cart`,
    shipping_address_collection: { allowed_countries: [country] },
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          display_name: ship.label,
          fixed_amount: { amount: cents(ship.amount), currency: site.currency.toLowerCase() },
          tax_behavior: "exclusive",
        },
      },
    ],
    phone_number_collection: { enabled: true },
    metadata: {
      mode: parsed.data.mode,
      // Compact "SKU:unit:qty" list (max 50 lines, well under Stripe's 500-char limit).
      items: summary.map((s) => `${s.sku}:${s.unit}:${s.qty}`).join("|"),
      country,
    },
  };

  // Stripe Tax calculates GST/HST/PST and US sales tax once registrations are
  // configured in the Stripe dashboard. Until then, fall back to no tax rather
  // than blocking checkout.
  let session: Stripe.Checkout.Session;
  try {
    session = await stripe.checkout.sessions.create({ ...params, automatic_tax: { enabled: true } });
  } catch (err) {
    if ((err as Stripe.errors.StripeError)?.type !== "StripeInvalidRequestError") throw err;
    console.warn("[checkout] Stripe Tax not configured, creating session without tax:", (err as Error).message);
    session = await stripe.checkout.sessions.create(params);
  }

  if (!session.url) return { error: "Stripe did not return a checkout URL." };
  redirect(session.url);
}
