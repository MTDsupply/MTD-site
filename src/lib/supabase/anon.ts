import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Cookie-less client for public catalogue reads. Safe to call from cached
 * functions because it never touches request data. Returns null when the
 * project is not configured so callers can fall back to seed data.
 */
export function createAnonClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}
