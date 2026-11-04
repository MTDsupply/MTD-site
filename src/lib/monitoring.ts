import "server-only";
import { notifyTeam } from "./email";

/*
 * Error alerts without a third-party service: log it, and email the team once
 * per context per 15 minutes (per server instance) so a broken webhook or a
 * failing insert is noticed the same hour, not when a customer writes in.
 */
const lastSent = new Map<string, number>();
const QUIET_MS = 15 * 60_000;

export async function reportError(context: string, err: unknown, extra: Record<string, unknown> = {}): Promise<void> {
  const message = err instanceof Error ? err.message : String(err);
  console.error(`[${context}]`, message, extra);
  const now = Date.now();
  if ((lastSent.get(context) ?? 0) > now - QUIET_MS) return;
  lastSent.set(context, now);
  try {
    await notifyTeam({
      subject: `Site error: ${context}`,
      text: [`Where: ${context}`, `What: ${message}`, "", ...Object.entries(extra).map(([k, v]) => `${k}: ${typeof v === "string" ? v : JSON.stringify(v)}`), "", `When: ${new Date().toISOString()}`].join("\n"),
    });
  } catch (e) {
    console.error("[monitoring] alert email failed:", (e as Error).message);
  }
}
