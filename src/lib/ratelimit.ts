import "server-only";
import { headers } from "next/headers";

/*
 * Small in-memory rate limiter for the public forms. Each server instance
 * keeps its own counters, so this blunts bursts from one address rather than
 * enforcing a global quota; the honeypot fields catch the dumb bots and this
 * catches the persistent ones.
 */
const buckets = new Map<string, number[]>();

export async function clientKey(): Promise<string> {
  const h = await headers();
  const fwd = h.get("x-forwarded-for") ?? h.get("x-real-ip") ?? "";
  return fwd.split(",")[0].trim() || "unknown";
}

/** True when `key` has made fewer than `limit` calls in the last `windowMs`. Records the call. */
export function allow(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= limit) {
    buckets.set(key, hits);
    return false;
  }
  hits.push(now);
  buckets.set(key, hits);
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) if (v.every((t) => now - t >= windowMs)) buckets.delete(k);
  }
  return true;
}

/** Convenience for server actions: one line, named by form. */
export async function rateLimited(form: string, limit = 5, windowMs = 10 * 60_000): Promise<boolean> {
  return !allow(`${form}:${await clientKey()}`, limit, windowMs);
}
