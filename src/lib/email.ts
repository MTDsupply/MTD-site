import "server-only";
import { Resend } from "resend";
import { site } from "./site";

type Mail = { subject: string; text: string; html?: string; replyTo?: string };

/** Sends an email to one recipient. No-ops (with a log line) until RESEND_API_KEY is set. */
export async function sendEmail(mail: Mail & { to: string }): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM ?? `Made to Disappear <hello@madetodisappear.com>`;
  if (!key) {
    console.info(`[email skipped: RESEND_API_KEY not set] to ${mail.to}: ${mail.subject}`);
    return false;
  }
  const resend = new Resend(key);
  const { error } = await resend.emails.send({ from, to: mail.to, subject: mail.subject, text: mail.text, ...(mail.html ? { html: mail.html } : {}), replyTo: mail.replyTo ?? site.email });
  if (error) {
    console.error("[email] send failed:", error);
    // Tell the team directly (not via reportError, which would email through this same path).
    void notifyTeam({ subject: `Site error: customer email failed`, text: `To: ${mail.to}\nSubject: ${mail.subject}\nError: ${JSON.stringify(error)}` });
    return false;
  }
  return true;
}

/**
 * Sends an internal notification to hello@. Silently no-ops (with a log line)
 * until the Resend integration is installed and RESEND_API_KEY is set.
 */
export async function notifyTeam(mail: Mail): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM ?? `Made to Disappear <hello@madetodisappear.com>`;
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
