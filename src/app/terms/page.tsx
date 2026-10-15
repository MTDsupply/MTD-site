import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Terms of sale", description: "The terms that apply when you buy from Made to Disappear." };

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-16">
      <PageHeader eyebrow="Legal" title="Terms of sale" description="Last updated October 2026." />
      <div className="mt-8 space-y-6 text-[15px] leading-6 text-soil/85">
        <section>
          <h2 className="t-card">Orders and pricing</h2>
          <p>All prices are in Canadian dollars and exclude applicable taxes and delivery, which are shown before you pay. An order is accepted when we send your confirmation email. We may cancel and refund an order if an item is unavailable or a price was shown in error.</p>
        </section>
        <section>
          <h2 className="t-card">Business accounts</h2>
          <p>Case pricing is available to anyone. Net-30 terms are offered to approved business accounts at our discretion and may be withdrawn if invoices are not paid on time. Quotes are valid for 30 days unless stated otherwise.</p>
        </section>
        <section>
          <h2 className="t-card">Delivery, returns and damage</h2>
          <p>Our <Link className="link" href="/shipping-returns">shipping and returns policy</Link> forms part of these terms.</p>
        </section>
        <section>
          <h2 className="t-card">Product claims</h2>
          <p>Our products are made from 100% certified home-compostable material, certified by TÜV Austria for each specific SKU. Certificates are listed on our <Link className="link" href="/certifications">certifications page</Link>. Composting times depend on your compost conditions.</p>
        </section>
        <section>
          <h2 className="t-card">Liability</h2>
          <p>Our liability for any order is limited to the price you paid for it. Nothing in these terms limits rights you have under consumer protection law.</p>
        </section>
        <section>
          <h2 className="t-card">Governing law</h2>
          <p>These terms are governed by the laws of British Columbia and Canada. Questions: <a className="link" href={`mailto:${site.email}`}>{site.email}</a>.</p>
        </section>
      </div>
    </div>
  );
}
