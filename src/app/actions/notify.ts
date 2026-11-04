"use server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { notifyTeam } from "@/lib/email";
import { rateLimited } from "@/lib/ratelimit";
import { reportError } from "@/lib/monitoring";
import { getCategory } from "@/lib/catalog/queries";

export type NotifyState = { ok: boolean; message: string } | null;

const schema = z.object({
  email: z.email("Enter a valid email address."),
  categorySlug: z.string().min(1).max(40),
});

export async function subscribeNotify(_prev: NotifyState, formData: FormData): Promise<NotifyState> {
  // Honeypot: real visitors never see or fill this field. Pretend it worked.
  if (String(formData.get("website") ?? "").trim()) return { ok: true, message: "Thanks." };
  if (await rateLimited("notify", 8)) return { ok: false, message: "Too many sign-ups in a row. Try again in a few minutes." };
  const parsed = schema.safeParse({
    email: String(formData.get("email") ?? "").trim(),
    categorySlug: String(formData.get("categorySlug") ?? "all"),
  });
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Check the form." };
  const { email, categorySlug } = parsed.data;

  const category = categorySlug === "all" ? null : await getCategory(categorySlug);
  if (categorySlug !== "all" && !category) return { ok: false, message: "Unknown category." };

  const db = createAdminClient();
  if (db) {
    const { error } = await db
      .from("notify")
      .upsert({ email, category_slug: categorySlug }, { onConflict: "email,category_slug" });
    if (error) {
      await reportError("notify.insert", error, { email });
      return { ok: false, message: "Something went wrong. Try again or email us." };
    }
  } else {
    console.info(`[notify] (no database) ${email} → ${categorySlug}`);
  }

  await notifyTeam({
    subject: `New product alert signup: ${category?.name ?? "all products"}`,
    text: `${email} asked to be notified when ${category?.name ?? "new products"} go live.`,
    replyTo: email,
  });

  return {
    ok: true,
    message: category
      ? `We'll email you when ${category.name.toLowerCase()} are in stock.`
      : "We'll email you when new products go live.",
  };
}
