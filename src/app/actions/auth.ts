"use server";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createServerSupabase } from "@/lib/supabase/server";
import { rateLimited } from "@/lib/ratelimit";

export type AuthState = { ok: boolean; message: string } | null;

export async function sendMagicLink(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = z.email().safeParse(String(formData.get("email") ?? "").trim());
  if (!email.success) return { ok: false, message: "Enter a valid email address." };
  if (await rateLimited("signin", 5)) return { ok: false, message: "Too many sign-in links requested. Try again in a few minutes." };

  const supabase = await createServerSupabase();
  if (!supabase) return { ok: false, message: "Accounts are not switched on yet." };

  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");

  const nextRaw = String(formData.get("next") ?? "/account");
  const next = /^\/(account|admin)(\/[a-z0-9/-]*)?$/i.test(nextRaw) ? nextRaw : "/account";
  const { error } = await supabase.auth.signInWithOtp({
    email: email.data,
    options: { emailRedirectTo: `${proto}://${host}/auth/confirm?next=${encodeURIComponent(next)}` },
  });
  if (error) return { ok: false, message: error.message };
  return { ok: true, message: "Check your email for a sign-in link." };
}

export async function signOut() {
  const supabase = await createServerSupabase();
  await supabase?.auth.signOut();
  redirect("/");
}

const addressSchema = z.object({
  label: z.string().max(40).optional(),
  name: z.string().min(1).max(120),
  line1: z.string().min(1).max(200),
  line2: z.string().max(200).optional(),
  city: z.string().min(1).max(80),
  province: z.string().min(1).max(40),
  postalCode: z.string().min(1).max(20),
  country: z.enum(["CA", "US"]),
  notes: z.string().max(300).optional(),
  isDefault: z.boolean(),
});

export async function addAddress(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = addressSchema.safeParse({
    label: String(formData.get("label") ?? "").trim() || undefined,
    name: String(formData.get("name") ?? "").trim(),
    line1: String(formData.get("line1") ?? "").trim(),
    line2: String(formData.get("line2") ?? "").trim() || undefined,
    city: String(formData.get("city") ?? "").trim(),
    province: String(formData.get("province") ?? "BC").trim(),
    postalCode: String(formData.get("postalCode") ?? "").trim(),
    country: String(formData.get("country") ?? "CA"),
    notes: String(formData.get("notes") ?? "").trim() || undefined,
    isDefault: formData.get("isDefault") === "on",
  });
  if (!parsed.success) return { ok: false, message: "Fill in every address field." };

  const supabase = await createServerSupabase();
  const { data } = (await supabase?.auth.getUser()) ?? { data: { user: null } };
  if (!supabase || !data.user) return { ok: false, message: "Sign in first." };

  const a = parsed.data;
  // The first saved address becomes the default automatically.
  const { count } = await supabase.from("addresses").select("id", { count: "exact", head: true });
  const makeDefault = a.isDefault || !count;
  if (makeDefault) await supabase.from("addresses").update({ is_default: false }).eq("user_id", data.user.id);

  const { error } = await supabase.from("addresses").insert({
    user_id: data.user.id,
    label: a.label ?? "Delivery",
    name: a.name,
    line1: a.line1,
    line2: a.line2 ?? null,
    city: a.city,
    province: a.province,
    postal_code: a.postalCode,
    country: a.country,
    notes: a.notes ?? null,
    is_default: makeDefault,
  });
  if (error) return { ok: false, message: error.message };
  revalidatePath("/account", "layout");
  return { ok: true, message: "Address saved." };
}

export async function deleteAddress(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const supabase = await createServerSupabase();
  if (!supabase || !id) return;
  await supabase.from("addresses").delete().eq("id", id);
  // Keep one default when the default was removed.
  const { data } = await supabase.from("addresses").select("id, is_default").order("created_at", { ascending: false });
  if (data?.length && !data.some((r) => r.is_default)) {
    await supabase.from("addresses").update({ is_default: true }).eq("id", data[0].id);
  }
  revalidatePath("/account", "layout");
}
