import "server-only";
import { createHash } from "node:crypto";

/**
 * Meta Conversions API: server-side Purchase event from the Stripe webhook,
 * deduplicated against the browser pixel by event_id. No-op until
 * META_CAPI_TOKEN is set.
 */
export async function sendPurchaseToMeta(o: { eventId: string; email?: string | null; value: number; currency: string; contentIds: string[]; sourceUrl: string }) {
  const token = process.env.META_CAPI_TOKEN;
  const pixel = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  if (!token || !pixel) return false;
  const em = o.email ? [createHash("sha256").update(o.email.trim().toLowerCase()).digest("hex")] : undefined;
  const body = {
    data: [
      {
        event_name: "Purchase",
        event_time: Math.floor(Date.now() / 1000),
        event_id: o.eventId,
        action_source: "website",
        event_source_url: o.sourceUrl,
        user_data: { em },
        custom_data: { value: o.value, currency: o.currency.toUpperCase(), content_ids: o.contentIds, content_type: "product" },
      },
    ],
  };
  try {
    const res = await fetch(`https://graph.facebook.com/v21.0/${pixel}/events?access_token=${token}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) console.error("[capi] purchase failed:", res.status, await res.text());
    return res.ok;
  } catch (err) {
    console.error("[capi] purchase error:", (err as Error).message);
    return false;
  }
}
