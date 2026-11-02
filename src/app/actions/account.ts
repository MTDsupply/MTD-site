"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import { BUSINESS_TYPES, getSession, toUnit, type OrderItem } from "@/lib/account/queries";
import { getLiveProducts } from "@/lib/catalog/queries";

export type ActionState = { ok: boolean; message: string } | null;

type Line = { sku: string; unit: string; qty: number };

/** Sums duplicate SKU/unit pairs and drops SKUs that are no longer live. */
async function cleanLines(lines: Line[]): Promise<Line[]> {
  const products = await getLiveProducts();
  const live = new Set(products.map((p) => p.sku));
  const merged = new Map<string, Line>();
  for (const l of lines) {
    if (!live.has(l.sku)) continue;
    const key = `${l.sku}|${l.unit}`;
    const prev = merged.get(key);
    merged.set(key, prev ? { ...prev, qty: Math.min(500, prev.qty + l.qty) } : { ...l });
  }
  return [...merged.values()];
}

async function replaceUsual(userId: string, rows: Line[], supabase: SupabaseClient) {
  const del = await supabase.from("usual_items").delete().eq("user_id", userId);
  if (del.error) return del.error.message;
  if (rows.length) {
    const ins = await supabase.from("usual_items").insert(rows.map((r) => ({ user_id: userId, ...r })));
    if (ins.error) return ins.error.message;
  }
  return null;
}

/* ---------- Business details ---------- */

const profileSchema = z.object({
  company: z.string().trim().min(1, "Add your business name.").max(120),
  contactName: z.string().trim().max(120),
  phone: z.string().trim().max(40),
  businessType: z.enum(BUSINESS_TYPES).or(z.literal("")),
  deliveryNotes: z.string().trim().max(600),
});

export async function saveProfile(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = profileSchema.safeParse({
    company: String(formData.get("company") ?? ""),
    contactName: String(formData.get("contactName") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    businessType: String(formData.get("businessType") ?? ""),
    deliveryNotes: String(formData.get("deliveryNotes") ?? ""),
  });
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Check the form and try again." };

  const s = await getSession();
  if (!s) return { ok: false, message: "Sign in first." };
  const d = parsed.data;
  const { error } = await s.supabase.from("profiles").upsert({
    user_id: s.user.id,
    company: d.company,
    contact_name: d.contactName,
    phone: d.phone || null,
    business_type: d.businessType || null,
    delivery_notes: d.deliveryNotes || null,
    updated_at: new Date().toISOString(),
  });
  if (error) return { ok: false, message: error.message };
  revalidatePath("/account", "layout");
  return { ok: true, message: "Saved." };
}

/* ---------- Your usual ---------- */

const usualSchema = z
  .array(
    z.object({
      sku: z.string().min(1).max(40),
      unit: z.string().regex(/^(case|pack-\d{1,5})$/),
      qty: z.number().int().min(1).max(500),
    }),
  )
  .max(50);

/** Replaces the signed-in user's usual list with the given lines. */
export async function saveUsual(lines: unknown): Promise<ActionState> {
  const parsed = usualSchema.safeParse(lines);
  if (!parsed.success) return { ok: false, message: "The list could not be read. Refresh and try again." };
  const s = await getSession();
  if (!s) return { ok: false, message: "Sign in first." };
  const rows = await cleanLines(parsed.data);
  const err = await replaceUsual(s.user.id, rows, s.supabase);
  if (err) return { ok: false, message: err };
  revalidatePath("/account", "layout");
  return { ok: true, message: rows.length ? "Your usual is saved." : "List cleared." };
}

/** Copies a past order's lines into the usual list, then opens it. */
export async function usualFromOrder(formData: FormData) {
  const id = String(formData.get("orderId") ?? "");
  const s = await getSession();
  if (!s || !id) return;
  const { data } = await s.supabase.from("orders").select("items").eq("id", id).maybeSingle();
  if (!data) return;
  const rows = await cleanLines((data.items as OrderItem[]).map((i) => ({ sku: i.sku, unit: toUnit(i.unit), qty: i.qty })));
  await replaceUsual(s.user.id, rows, s.supabase);
  revalidatePath("/account", "layout");
  redirect("/account/usual");
}

/* ---------- Addresses ---------- */

export async function setDefaultAddress(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const s = await getSession();
  if (!s || !id) return;
  await s.supabase.from("addresses").update({ is_default: false }).eq("user_id", s.user.id);
  await s.supabase.from("addresses").update({ is_default: true }).eq("id", id);
  revalidatePath("/account", "layout");
}
