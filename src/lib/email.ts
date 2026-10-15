import "server-only";
import { Resend } from "resend";
import { site } from "./site";

type Mail = { subject: string; text: string; replyTo?: string };

/**
 * Sends an internal notification to hello@. Silently no-ops (with a log line)
 * until the Resend integration is installed and RESEND_API_KEY is set.
 */
export async function notifyTeam(mail: Mail): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM ?? `Made to Disappear <onboarding@resend.dev>`;
  if (!key) {
    console.info(`[email skipped: RESEND_API_KEY not set] ${mail.subject}\n${mail.text}`);
    return false;
  }
  const resend = new Resend(key);
  const { error } = await resend.emails.send({
    from,
    to: site.email,
    subject: mail.subject,
    text: mail.text,
    replyTo: mail.replyTo,
  });
  if (error) {
    console.error("[email] send failed:", error);
    return false;
  }
  return true;
}
