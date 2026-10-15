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

const lineSchema = z.object({
  sku: z.string().min(1).max(40),
  unit: z.string().regex(/^(case|pack-\d{1,5})$/),
  qty: z.number().int().min(1).max(500),
});
const schema = z.object({
  lines: z.array(lineSchema).min(1).max(50),
  mode: z.enum(["consumer", "business"]).default("consumer"),
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
  }

  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = `${proto}://${host}`;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items,
    success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/cart`,
    shipping_address_collection: { allowed_countries: ["CA", "US"] },
    phone_number_collection: { enabled: true },
    metadata: {
      mode: parsed.data.mode,
      // Compact "SKU:unit:qty" list (max 50 lines, well under Stripe's 500-char limit).
      items: summary.map((s) => `${s.sku}:${s.unit}:${s.qty}`).join("|"),
    },
  });

  if (!session.url) return { error: "Stripe did not return a checkout URL." };
  redirect(session.url);
}
