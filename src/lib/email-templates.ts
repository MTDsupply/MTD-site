import "server-only";
import { site } from "./site";

type Item = { name: string; unit: string; qty: number; price: number; volume?: boolean };

const cad = (n: number) => `$${n.toFixed(2)} CAD`;
const unitLabel = (u: string) => (u === "case" ? "case of 1,000" : `pack of ${u.replace("pack-", "")}`);
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/*
 * Branded HTML wrapper that matches the site: a forest band with the wordmark,
 * a cream body card, pill button, small print. Inline styles only, table
 * layout, so it renders the same in Gmail, Outlook and Apple Mail. Every email
 * also carries a plain-text twin.
 */
const FOREST = "#2e4d34";
const CREAM = "#fbf4e8";
const MINT = "#e4f0dc";
const SOIL = "#2b2b2b";
const base = site.url.replace(/\/$/, "");

export function emailLayout({ title, bodyHtml, cta }: { title: string; bodyHtml: string; cta?: { label: string; href: string } }): string {
  return `<!doctype html>
<html lang="en-CA"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${esc(title)}</title></head>
<body style="margin:0;padding:0;background:${MINT};font-family:Inter,-apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:${SOIL};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${MINT};padding:24px 12px;">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
  <tr><td style="background:${FOREST};border-radius:20px 20px 0 0;padding:22px 28px;">
    <img src="${base}/logo-wordmark-white.png" alt="${esc(site.name)}" height="26" style="height:26px;display:block;border:0;">
  </td></tr>
  <tr><td style="background:${CREAM};padding:30px 28px 8px;">
    <h1 style="margin:0 0 14px;font-family:Georgia,'Iowan Old Style',serif;font-size:28px;line-height:1.1;color:${FOREST};font-weight:700;">${esc(title)}</h1>
    <div style="font-size:15px;line-height:24px;">${bodyHtml}</div>
    ${cta ? `<p style="margin:22px 0 6px;"><a href="${cta.href}" style="display:inline-block;background:${FOREST};color:${CREAM};text-decoration:none;font-weight:600;font-size:15px;padding:13px 24px;border-radius:999px;">${esc(cta.label)}</a></p>` : ""}
  </td></tr>
  <tr><td style="background:${CREAM};border-radius:0 0 20px 20px;padding:16px 28px 26px;font-size:12px;line-height:18px;color:#6b6b66;">
    Every product we sell is made from 100% certified home-compostable material, certified by ${esc(site.certifier)}.<br>
    ${esc(site.legalName)} · ${esc(site.city)}, ${esc(site.province)}, ${esc(site.country)} · <a href="mailto:${site.email}" style="color:${FOREST};">${site.email}</a>
  </td></tr>
</table>
</td></tr></table>
</body></html>`;
}

/** Order confirmation for the customer: plain text plus the branded HTML. */
export function orderConfirmation(o: { name: string | null; items: Item[]; total: number; shipping: number; address?: string | null; orderUrl?: string }) {
  const first = o.name ? ` ${o.name.split(" ")[0]}` : "";
  const lines = o.items.map((i) => `  ${i.qty} × ${i.name} (${unitLabel(i.unit)}) · ${cad(i.price * i.qty)}${i.volume ? " · volume price" : ""}`).join("\n");
  const text = [
    `Hi${first},`,
    "",
    "Thanks for your order. Here is what is on its way:",
    "",
    lines,
    "",
    `Shipping: ${o.shipping === 0 ? "free" : cad(o.shipping)}`,
    `Total charged: ${cad(o.total)}`,
    o.address ? `\nShipping to:\n${o.address}` : "",
    "",
    "You will get a tracking link by email when it ships.",
    "",
    "Everything in the box is made from 100% certified home-compostable material. When you are done with it, it goes in the compost with the coffee grounds.",
    "",
    `Questions? Reply to this email or write to ${site.email}.`,
    "",
    site.legalName,
    `${site.city}, ${site.province}, ${site.country}`,
  ].join("\n");

  const rows = o.items
    .map(
      (i) =>
        `<tr><td style="padding:8px 0;border-bottom:1px solid #e3e2dc;">${i.qty} × ${esc(i.name)}<br><span style="color:#6b6b66;font-size:13px;">${unitLabel(i.unit)}${i.volume ? " · volume price" : ""}</span></td><td align="right" style="padding:8px 0;border-bottom:1px solid #e3e2dc;white-space:nowrap;">${cad(i.price * i.qty)}</td></tr>`,
    )
    .join("");
  const bodyHtml = `
    <p style="margin:0 0 14px;">Hi${esc(first)}, thanks for your order. Here is what is on its way:</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:15px;">${rows}
      <tr><td style="padding:10px 0 2px;color:#6b6b66;">Shipping</td><td align="right" style="padding:10px 0 2px;">${o.shipping === 0 ? "Free" : cad(o.shipping)}</td></tr>
      <tr><td style="padding:2px 0 8px;font-weight:600;">Total charged</td><td align="right" style="padding:2px 0 8px;font-weight:600;">${cad(o.total)}</td></tr>
    </table>
    ${o.address ? `<p style="margin:16px 0 0;"><strong>Shipping to</strong><br>${esc(o.address).replace(/\n/g, "<br>")}</p>` : ""}
    <p style="margin:16px 0 0;">You will get a tracking link by email when it ships.</p>
    <p style="margin:12px 0 0;">Everything in the box is made from 100% certified home-compostable material. When you are done with it, it goes in the compost with the coffee grounds.</p>
    <p style="margin:12px 0 0;">Questions? Reply to this email or write to <a href="mailto:${site.email}" style="color:${FOREST};">${site.email}</a>.</p>`;
  return {
    subject: "Your Made to Disappear order",
    text,
    html: emailLayout({ title: "Thanks for your order.", bodyHtml, cta: o.orderUrl ? { label: "View your order", href: o.orderUrl } : { label: "How to compost it", href: `${base}/compost` } }),
  };
}

/** "It's on its way": sent from /admin when an order is marked shipped. */
export function orderShipped(o: {
  name: string | null;
  orderLabel: string;
  items: Item[];
  carrier: string | null;
  trackingNumber: string | null;
  trackingUrl: string | null;
  orderUrl?: string;
}) {
  const first = o.name ? ` ${o.name.split(" ")[0]}` : "";
  const tracking = [o.carrier, o.trackingNumber].filter(Boolean).join(" · ");
  const lines = o.items.map((i) => `  ${i.qty} × ${i.name} (${unitLabel(i.unit)})`).join("\n");
  const text = [
    `Hi${first},`,
    "",
    `Your order ${o.orderLabel} is on its way.`,
    "",
    lines,
    "",
    tracking ? `Tracking: ${tracking}${o.trackingUrl ? `\n${o.trackingUrl}` : ""}` : "",
    "",
    "When you are done with the cups, they go in the compost with the coffee grounds.",
    "",
    `Questions? Reply to this email or write to ${site.email}.`,
    "",
    site.legalName,
    `${site.city}, ${site.province}, ${site.country}`,
  ]
    .filter((l) => l !== "")
    .join("\n");
  const rows = o.items.map((i) => `<li style="margin:0 0 4px;">${i.qty} × ${esc(i.name)} <span style="color:#6b6b66;">(${unitLabel(i.unit)})</span></li>`).join("");
  const bodyHtml = `
    <p style="margin:0 0 14px;">Hi${esc(first)}, your order <strong>${esc(o.orderLabel)}</strong> is on its way.</p>
    <ul style="margin:0 0 14px;padding-left:18px;">${rows}</ul>
    ${tracking ? `<p style="margin:0 0 14px;"><strong>Tracking</strong><br>${esc(tracking)}${o.trackingUrl ? `<br><a href="${o.trackingUrl}" style="color:${FOREST};">${esc(o.trackingUrl)}</a>` : ""}</p>` : ""}
    <p style="margin:0;">When you are done with the cups, they go in the compost with the coffee grounds.</p>`;
  const cta = o.trackingUrl ? { label: "Track the parcel", href: o.trackingUrl } : o.orderUrl ? { label: "View your order", href: o.orderUrl } : { label: "How to compost it", href: `${base}/compost` };
  return { subject: `Your order ${o.orderLabel} is on its way`, text, html: emailLayout({ title: "It's on its way.", bodyHtml, cta }) };
}
