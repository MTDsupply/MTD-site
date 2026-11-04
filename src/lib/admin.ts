import "server-only";
import { getSession, type Session } from "@/lib/account/queries";
import { createAdminClient } from "@/lib/supabase/admin";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * The team's view. A signed-in user whose email is listed in ADMIN_EMAILS
 * (comma-separated) gets the service-role client; everyone else gets null.
 */
export type AdminSession = { session: Session; db: SupabaseClient };

export function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const session = await getSession();
  if (!session?.user.email) return null;
  if (!adminEmails().includes(session.user.email.toLowerCase())) return null;
  const db = createAdminClient();
  return db ? { session, db } : null;
}

export type QuoteRow = {
  id: string;
  company: string;
  contact_name: string;
  email: string;
  phone: string | null;
  volume_per_month: string;
  categories: string[];
  delivery_address: string;
  notes: string | null;
  created_at: string;
};
export type MessageRow = { id: string; name: string; email: string; phone: string | null; message: string; created_at: string };
export type SignupRow = { id: string; email: string; category_slug: string; created_at: string };
