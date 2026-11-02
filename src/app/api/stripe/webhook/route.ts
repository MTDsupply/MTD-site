import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { getLiveProducts } from "@/lib/catalog/queries";
import { unitInfo } from "@/lib/units";
import type { Unit } from "@/lib/store/cart";
import { notifyTeam, sendEmail } from "@/lib/email";
import { orderConfirmation } from "@/lib/email-templates";
import { sendPurchaseToMeta } from "@/lib/analytics/capi";

/**
 * Stripe → orders table. Set STRIPE_WEBHOOK_SECRET from the Stripe dashboard
 * (endpoint: /api/stripe/webhook, event: checkout.session.completed).
 */
export async function POST(request: Request) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });

  const sig = request.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(await request.text(), sig, secret);
  } catch (err) {
    return NextResponse.json({ error: `Invalid signature: ${(err as Error).message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const db = createAdminClient();
    if (db) {
      // Rebuild the order lines from the compact metadata and the catalogue.
      const products = await getLiveProducts();
      const bySku = new Map(products.map((p) => [p.sku, p]));
      const items = (session.metadata?.items ?? "")
        .split("|")
        .filter(Boolean)
        .map((part) => {
          const [sku, unit, qty] = part.split(":");
          const p = bySku.get(sku);
          const info = p ? unitInfo(p, unit as Unit) : null;
          return { sku, name: p?.name ?? sku, unit, qty: Number(qty) || 1, price: info?.price ?? 0 };
        });
      const shipping = session.collected_information?.shipping_details ?? null;
      const { error } = await db.from("orders").upsert(
        {
          stripe_session_id: session.id,
          email: session.customer_details?.email ?? "",
          user_id: session.client_reference_id ?? null,
          status: session.payment_status === "paid" ? "paid" : session.payment_status,
          mode: session.metadata?.mode ?? "consumer",
          currency: session.currency ?? "cad",
          amount_total: session.amount_total ?? 0,
          items,
          shipping,
        },
        { onConflict: "stripe_session_id" },
      );
      if (error) {
        console.error("[webhook] order insert failed:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      const total = (session.amount_total ?? 0) / 100;
      const shippingAmount = (session.total_details?.amount_shipping ?? 0) / 100;
      const addr = shipping?.address;
      const addressText = addr
        ? [shipping?.name, addr.line1, addr.line2, `${addr.city ?? ""} ${addr.state ?? ""} ${addr.postal_code ?? ""}`.trim(), addr.country].filter(Boolean).join("\n")
        : null;
      if (session.customer_details?.email) {
        const mail = orderConfirmation({ name: session.customer_details.name ?? null, items, total, shipping: shippingAmount, address: addressText });
        await sendEmail({ to: session.customer_details.email, ...mail });
      }
      await sendPurchaseToMeta({
        eventId: session.id,
        email: session.customer_details?.email,
        value: total,
        currency: session.currency ?? "cad",
        contentIds: items.map((i) => i.sku),
        sourceUrl: "https://www.madetodisappear.com/checkout/success",
      });
      await notifyTeam({
        subject: `New order: ${((session.amount_total ?? 0) / 100).toFixed(2)} ${(session.currency ?? "cad").toUpperCase()}`,
        replyTo: session.customer_details?.email ?? undefined,
        text: [
          `Customer: ${session.customer_details?.name ?? ""} <${session.customer_details?.email ?? ""}>`,
          `Mode: ${session.metadata?.mode ?? "consumer"}`,
          ...items.map((i) => `${i.qty} × ${i.name} (${i.unit}) · ${i.sku}`),
        ].join("\n"),
      });
    }
  }

  return NextResponse.json({ received: true });
}
