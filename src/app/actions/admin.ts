"use server";
import { revalidatePath } from "next/cache";
import { updateTag } from "next/cache";
import { z } from "zod";
import { getAdminSession } from "@/lib/admin";
import { sendEmail } from "@/lib/email";
import { orderShipped } from "@/lib/email-templates";
import { reportError } from "@/lib/monitoring";
import type { OrderRow } from "@/lib/account/types";

export type AdminState = { ok: boolean; message: string } | null;

const shipSchema = z.object({
  orderId: z.string().uuid(),
  carrier: z.string().trim().max(60),
  trackingNumber: z.string().trim().max(80),
  trackingUrl: z.url().or(z.literal("")),
  notify: z.boolean(),
});

/** Marks an order shipped, stores the tracking details and emails the customer. */
export async function markShipped(_prev: AdminState, formData: FormData): Promise<AdminState> {
  const admin = await getAdminSession();
  if (!admin) return { ok: false, message: "Not signed in as the team." };
  const parsed = shipSchema.safeParse({
    orderId: String(formData.get("orderId") ?? ""),
    carrier: String(formData.get("carrier") ?? ""),
    trackingNumber: String(formData.get("trackingNumber") ?? ""),
    trackingUrl: String(formData.get("trackingUrl") ?? "").trim(),
    notify: formData.get("notify") !== "off",
  });
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Check the form." };
  const d = parsed.data;

  const { data: order, error } = await admin.db
    .from("orders")
    .update({
      shipped_at: new Date().toISOString(),
      carrier: d.carrier || null,
      tracking_number: d.trackingNumber || null,
      tracking_url: d.trackingUrl || null,
    })
    .eq("id", d.orderId)
    .select("*")
    .single();
  if (error || !order) {
    await reportError("admin.markShipped", error ?? new Error("no row"), { orderId: d.orderId });
    return { ok: false, message: "Could not update the order." };
  }

  const o = order as OrderRow & { email: string; user_id: string | null };
  let emailed = false;
  if (d.notify && o.email) {
    const mail = orderShipped({
      name: o.shipping?.name ?? null,
      orderLabel: o.number ? `#${o.number}` : o.id.slice(0, 8),
      items: o.items,
      carrier: o.carrier,
      trackingNumber: o.tracking_number,
      trackingUrl: o.tracking_url,
      orderUrl: o.user_id ? `https://www.madetodisappear.com/account/orders/${o.id}` : undefined,
    });
    emailed = await sendEmail({ to: o.email, ...mail });
  }
  revalidatePath("/admin", "layout");
  revalidatePath("/account", "layout");
  return { ok: true, message: emailed ? "Marked shipped and the customer has been emailed." : "Marked shipped." };
}

/** Undo: clears the shipped fields (no email). */
export async function unship(formData: FormData) {
  const admin = await getAdminSession();
  if (!admin) return;
  const id = String(formData.get("orderId") ?? "");
  if (!/^[0-9a-f-]{36}$/i.test(id)) return;
  await admin.db.from("orders").update({ shipped_at: null, carrier: null, tracking_number: null, tracking_url: null }).eq("id", id);
  revalidatePath("/admin", "layout");
  revalidatePath("/account", "layout");
}

const stockSchema = z.object({ slug: z.string().min(1).max(40), when: z.string().trim().max(60) });

/** Sets or clears a category's restock note; the catalogue cache refreshes at once. */
export async function setRestock(_prev: AdminState, formData: FormData): Promise<AdminState> {
  const admin = await getAdminSession();
  if (!admin) return { ok: false, message: "Not signed in as the team." };
  const parsed = stockSchema.safeParse({ slug: String(formData.get("slug") ?? ""), when: String(formData.get("when") ?? "") });
  if (!parsed.success) return { ok: false, message: "Check the form." };
  const { slug, when } = parsed.data;
  const { error } = await admin.db.from("categories").update({ restock_note: when || null, updated_at: new Date().toISOString() }).eq("slug", slug);
  if (error) {
    await reportError("admin.setRestock", error, { slug });
    return { ok: false, message: /restock_note/.test(error.message) ? "The database needs migration 0005_stock.sql first (npm run db:migrate)." : "Could not save." };
  }
  updateTag("catalog");
  revalidatePath("/", "layout");
  return { ok: true, message: when ? `${slug}: restocking ${when}.` : `${slug}: in stock.` };
}
