import { PageHeader } from "@/components/PageHeader";
import { site } from "@/lib/site";

import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({ title: "Privacy policy", description: "What we collect when you shop with us, and what we do with it.", path: "/privacy" });

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-16">
      <PageHeader eyebrow="Legal" title="Privacy policy" description="Last updated October 2026." />
      <div className="prose-mtd mt-8 space-y-6 text-[15px] leading-6 text-soil/85">
        <section>
          <h2 className="t-card">What we collect</h2>
          <p>When you place an order we collect your name, email address, delivery address, phone number and the items you bought. Payment is handled by Stripe; we never see or store your card number. When you request a quote, send a message or sign up for product alerts, we keep the details you enter in that form.</p>
        </section>
        <section>
          <h2 className="t-card">How we use it</h2>
          <p>To fulfil and deliver your order, send receipts and order updates, answer your enquiry, and, if you asked for alerts, email you when a new product goes live. We do not sell or rent your details, and we do not send marketing you did not ask for.</p>
        </section>
        <section>
          <h2 className="t-card">Who else sees it</h2>
          <p>Stripe processes payments. Supabase hosts our database. Vercel hosts the site. Our email provider sends order and enquiry notifications. Couriers receive your name, address and phone number to deliver your order. Each of these providers only receives what they need to do their part.</p>
        </section>
        <section>
          <h2 className="t-card">Cookies</h2>
          <p>The site uses one cookie to remember whether you prefer consumer or business pricing, and a session cookie if you sign in to your account. Your cart is stored in your browser. We do not use advertising or tracking cookies.</p>
        </section>
        <section>
          <h2 className="t-card">Your choices</h2>
          <p>You can ask us to show, correct or delete the information we hold about you, or to stop product alerts, by emailing <a className="link" href={`mailto:${site.email}`}>{site.email}</a>. We keep order records for as long as tax law requires, then delete them.</p>
        </section>
        <section>
          <h2 className="t-card">Contact</h2>
          <p>{site.legalName}, {site.city}, {site.province}, {site.country}. <a className="link" href={`mailto:${site.email}`}>{site.email}</a></p>
        </section>
      </div>
    </div>
  );
}
