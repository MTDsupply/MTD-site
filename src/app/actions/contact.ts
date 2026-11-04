"use server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { notifyTeam } from "@/lib/email";

export type ContactState = { ok: boolean; message: string } | null;

const schema = z.object({
  name: z.string().min(1, "Your name is required.").max(120),
  email: z.email("Enter a valid email address."),
  phone: z.string().max(40).optional(),
  message: z.string().min(1, "Write a message.").max(4000),
});

export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  // Honeypot: real visitors never see or fill this field. Pretend it worked.
  if (String(formData.get("website") ?? "").trim()) return { ok: true, message: "Thanks." };
  const parsed = schema.safeParse({
    name: String(formData.get("name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim() || undefined,
    message: String(formData.get("message") ?? "").trim(),
  });
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Check the form." };
  const m = parsed.data;

  const db = createAdminClient();
  if (db) {
    const { error } = await db.from("contact_messages").insert({
      name: m.name,
      email: m.email,
      phone: m.phone ?? null,
      message: m.message,
    });
    if (error) {
      console.error("[contact] insert failed:", error.message);
      return { ok: false, message: "Something went wrong. Try again or email us directly." };
    }
  }

  await notifyTeam({
    subject: `Contact form: ${m.name}`,
    replyTo: m.email,
    text: `${m.name} <${m.email}> ${m.phone ?? ""}\n\n${m.message}`,
  });

  return { ok: true, message: "Thanks. We'll get back to you within one business day." };
}
