"use server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { notifyTeam } from "@/lib/email";
import { rateLimited } from "@/lib/ratelimit";
import { reportError } from "@/lib/monitoring";

export type QuoteState = { ok: boolean; message: string } | null;

const schema = z.object({
  kind: z.enum(["bulk", "sample", "printing"]).default("bulk"),
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
  // Honeypot: real visitors never see or fill this field. Pretend it worked.
  if (String(formData.get("website") ?? "").trim()) return { ok: true, message: "Thanks." };
  if (await rateLimited("quote", 5)) return { ok: false, message: "Too many requests in a row. Try again in a few minutes, or email us directly." };
  const parsed = schema.safeParse({
    kind: String(formData.get("kind") ?? "bulk"),
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
  const kindLabel = { bulk: "Bulk order", sample: "Sample pack", printing: "Custom printing" }[q.kind];
  const notes = [q.kind !== "bulk" ? `Request type: ${kindLabel}.` : "", q.notes ?? ""].filter(Boolean).join(" ");

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
      notes: notes || null,
    });
    if (error) {
      await reportError("quote.insert", error, { email: q.email, company: q.company });
      return { ok: false, message: "Something went wrong. Try again or email us." };
    }
  }

  await notifyTeam({
    subject: `${kindLabel} request: ${q.company}`,
    replyTo: q.email,
    text: [
      `Company: ${q.company}`,
      `Contact: ${q.contactName} <${q.email}> ${q.phone ?? ""}`,
      `Volume per month: ${q.volumePerMonth}`,
      `Categories: ${q.categories.join(", ") || "(none selected)"}`,
      `Delivery address: ${q.deliveryAddress}`,
      notes ? `Notes: ${notes}` : "",
    ]
      .filter(Boolean)
      .join("\n"),
  });

  const reply = {
    bulk: "Thanks. We'll reply with case pricing within one business day.",
    sample: "Thanks. We'll confirm your café details and send your free sample pack within one business day.",
    printing: "Thanks. We'll reply with printing options, pricing and next steps within one business day.",
  }[q.kind];
  return { ok: true, message: reply };
}
