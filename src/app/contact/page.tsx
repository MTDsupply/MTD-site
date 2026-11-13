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
      <PageHeader eyebrow="Get in touch" title="contact." description="Email, or use the form. We reply within one business day." image="/atmosphere/peaks-alt.jpg" imageAlt="Morning light on a mountain range" objectPosition="center 35%" />
      <div className="mt-8 grid gap-8 md:grid-cols-[1fr_320px]">
        <ContactForm />
        <aside className="hairline self-start border-y border-line text-sm">
          <div className="py-5">
            <h2 className="t-label">{site.phone ? "order by phone" : "hours"}</h2>
            {site.phone && site.phoneHref ? (
              <a href={site.phoneHref} className="mt-2 block text-2xl font-bold tnum text-ink">
                {site.phone}
              </a>
            ) : (
              <p className="mt-2 text-2xl font-bold text-ink">8 am to 8 pm</p>
            )}
            <p className="mt-1 text-stone">Monday to Friday, Pacific time.</p>
          </div>
          <div className="py-5">
            <h2 className="t-label">email</h2>
            <a href={`mailto:${site.email}`} className="link mt-2 inline-block text-ink">
              {site.email}
            </a>
          </div>
          <div className="py-5">
            <h2 className="t-label">where</h2>
            <p className="mt-2 text-ink">
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
