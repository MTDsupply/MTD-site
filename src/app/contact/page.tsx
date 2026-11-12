import { site } from "@/lib/site";
import { pageMeta } from "@/lib/seo";
import { ContactForm } from "@/components/ContactForm";
import { PageHeader } from "@/components/PageHeader";

export const metadata = pageMeta({
  title: "Contact",
  description: `Questions about compostable cups, case pricing or an order: email ${site.email} or use the form. Monday to Friday, 8 am to 8 pm Pacific. We reply within one business day.`,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-8">
      <PageHeader eyebrow="Get in touch" title="Contact" description="Email, or use the form. We reply within one business day." image="/atmosphere/peaks-alt.jpg" imageAlt="Morning light on a mountain range" objectPosition="center 35%" />
      <div className="mt-8 grid gap-8 md:grid-cols-[1fr_320px]">
        <ContactForm />
        <aside className="space-y-4 text-sm">
          <div className="band-sage p-5">
            <h2 className="t-label text-paper/70">{site.phone ? "Order by phone" : "Hours"}</h2>
            {site.phone && site.phoneHref ? (
              <a href={site.phoneHref} className="mt-2 block font-display text-2xl font-bold tnum text-white">
                {site.phone}
              </a>
            ) : (
              <p className="mt-2 font-display text-2xl font-bold text-white">8 am to 8 pm</p>
            )}
            <p className="mt-1 text-paper/75">Monday to Friday, Pacific time.</p>
          </div>
          <div className="rounded-[20px] bg-white p-5">
            <h2 className="t-card text-[17px] leading-[22px]">Email</h2>
            <a href={`mailto:${site.email}`} className="mt-1 block link">
              {site.email}
            </a>
          </div>
          <div className="rounded-[20px] bg-white p-5">
            <h2 className="t-card text-[17px] leading-[22px]">Where</h2>
            <p className="mt-1">
              {site.legalName}
              <br />
              {site.city}, {site.province}, {site.country}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
