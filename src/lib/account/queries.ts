import "server-only";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { createServerSupabase } from "@/lib/supabase/server";
import type { Unit } from "@/lib/store/cart";

export * from "./types";
import type { AddressRow, OrderRow, ProfileRow, UsualRow } from "./types";

/* ---------- Session ---------- */

export type Session = { supabase: SupabaseClient; user: User };

/** The signed-in user, or null when accounts are off or nobody is signed in. */
export async function getSession(): Promise<Session | null> {
  const supabase = await createServerSupabase();
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user ? { supabase, user } : null;
}

/* ---------- Reads (all RLS-scoped to the signed-in user) ---------- */

export async function getOrders(s: Session, limit = 100): Promise<OrderRow[]> {
  const { data } = await s.supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(limit);
  return (data ?? []) as OrderRow[];
}

export async function getOrder(s: Session, id: string): Promise<OrderRow | null> {
  const { data } = await s.supabase.from("orders").select("*").eq("id", id).maybeSingle();
  return (data as OrderRow | null) ?? null;
}

export async function getAddresses(s: Session): Promise<AddressRow[]> {
  const { data } = await s.supabase
    .from("addresses")
    .select("*")
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false });
  return (data ?? []) as AddressRow[];
}

export async function getProfile(s: Session): Promise<ProfileRow | null> {
  const { data } = await s.supabase.from("profiles").select("*").eq("user_id", s.user.id).maybeSingle();
  return (data as ProfileRow | null) ?? null;
}

export async function getUsual(s: Session): Promise<UsualRow[]> {
  const { data } = await s.supabase.from("usual_items").select("sku, unit, qty").order("sku");
  return (data ?? []) as UsualRow[];
}

/* ---------- Helpers ---------- */

/** Older orders stored the unit as "pack"; everything since is "case" or "pack-<n>". */
export function toUnit(unit: string): Unit {
  if (unit === "case") return "case";
  if (/^pack-\d+$/.test(unit)) return unit as Unit;
  return "pack-100";
}

export function orderLabel(o: Pick<OrderRow, "number" | "id">): string {
  return o.number ? `#${o.number}` : `#${o.id.slice(0, 8).toUpperCase()}`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" });
}

export function unitLabel(unit: string): string {
  if (unit === "case") return "Case";
  const n = /^pack-(\d+)$/.exec(unit)?.[1];
  return n ? `Pack of ${Number(n).toLocaleString("en-CA")}` : "Pack";
}

/** Human status for an order: shipped beats paid, anything else shows as-is. */
export function orderStatus(o: Pick<OrderRow, "status" | "shipped_at">): { label: string; tone: "sage" | "clay" | "fog" } {
  if (o.shipped_at) return { label: "Shipped", tone: "sage" };
  if (o.status === "paid") return { label: "Paid", tone: "clay" };
  return { label: o.status.charAt(0).toUpperCase() + o.status.slice(1).replace(/_/g, " "), tone: "fog" };
}

/** Full one-line address, or null when the order has none. */
export function addressLine(o: OrderRow): string | null {
  const a = o.shipping?.address;
  if (!a?.line1) return null;
  return [o.shipping?.name, a.line1, a.line2, [a.city, a.state, a.postal_code].filter(Boolean).join(" "), a.country]
    .filter(Boolean)
    .join(", ");
}
