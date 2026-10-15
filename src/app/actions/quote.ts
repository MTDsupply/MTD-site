"use server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { notifyTeam } from "@/lib/email";

export type QuoteState = { ok: boolean; message: string } | null;

const schema = z.object({
  company: z.string().min(1, "Company is required.").max(120),
  contactName: z.string().min(1, "Your name is required.").max(120),
  email: z.email("Enter a valid email address."),
  phone: z.string().max(40).optional(),
  volumePerMonth: z.string().min(1, "Tell us roughly how much you use per month.").max(200),
  categories: z.array(z.string().max(40)).max(20),
  deliveryAddress: z.string().min(1, "Delivery address is required.").max(400),
  notes: z.string().max(2000).optional(),
});

export async function submitQuote(_prev: QuoteState, formData: FormData): Promise<QuoteState> {
  const parsed = schema.safeParse({
    company: String(formData.get("company") ?? "").trim(),
    contactName: String(formData.get("contactName") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim() || undefined,
    volumePerMonth: String(formData.get("volumePerMonth") ?? "").trim(),
    categories: formData.getAll("categories").map(String),
    deliveryAddress: String(formData.get("deliveryAddress") ?? "").trim(),
    notes: String(formData.get("notes") ?? "").trim() || undefined,
  });
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Check the form." };
  const q = parsed.data;

  const db = createAdminClient();
  if (db) {
    const { error } = await db.from("quotes").insert({
      company: q.company,
      contact_name: q.contactName,
      email: q.email,
      phone: q.phone ?? null,
      volume_per_month: q.volumePerMonth,
      categories: q.categories,
      delivery_address: q.deliveryAddress,
      notes: q.notes ?? null,
    });
    if (error) {
      console.error("[quote] insert failed:", error.message);
      return { ok: false, message: "Something went wrong. Try again or email us." };
    }
  }

  await notifyTeam({
    subject: `Bulk quote request: ${q.company}`,
    replyTo: q.email,
    text: [
      `Company: ${q.company}`,
      `Contact: ${q.contactName} <${q.email}> ${q.phone ?? ""}`,
      `Volume per month: ${q.volumePerMonth}`,
      `Categories: ${q.categories.join(", ") || "(none selected)"}`,
      `Delivery address: ${q.deliveryAddress}`,
      q.notes ? `Notes: ${q.notes}` : "",
    ]
      .filter(Boolean)
      .join("\n"),
  });

  return { ok: true, message: "Thanks. We'll reply with case pricing within one business day." };
}
