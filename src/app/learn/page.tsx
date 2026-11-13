import Link from "next/link";
import { ARTICLES } from "@/lib/learn";
import { site } from "@/lib/site";
import { PageHeader } from "@/components/PageHeader";
import { Reveal, RevealGroup } from "@/components/Reveal";
import { pageMeta, breadcrumbLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";

export const metadata = pageMeta({
  title: "Learn · cup linings, compostability and the words on the sleeve",
  description:
    "Plain-language, sourced explainers on what paper cups are lined with: PHA vs PLA, PHA vs water-based coatings, what each material is, and the difference between home and industrial compostable. Every claim cites a standard, regulator, certifier or peer-reviewed study.",
  path: "/learn",
});

export default function LearnIndexPage() {
  const compare = ARTICLES.filter((a) => a.slug.includes("-vs-"));
  const deep = ARTICLES.filter((a) => !a.slug.includes("-vs-"));
  return (
    <div className="mx-auto max-w-7xl px-4 pb-8">
      <PageHeader
        eyebrow="Learn"
        title="what the words on a cup mean."
        description={`Short, sourced explainers for café owners and anyone who has wondered what compostable, plant-based and water-based mean on a cup. Written by ${site.name}; every number is cited.`}
      />

      <section className="mt-12 md:mt-16">
        <Reveal>
          <h2 className="t-page text-forest">comparisons.</h2>
        </Reveal>
        <RevealGroup className="mt-6 grid gap-4 md:grid-cols-3" itemClassName="h-full" step={0.06}>
          {compare.map((a) => (
            <Link key={a.slug} href={`/learn/${a.slug}`} className="card flex h-full flex-col p-6">
              <p className="t-label text-soil/55">{a.eyebrow}</p>
              <h3 className="t-card mt-2 text-ink">{a.heading}</h3>
              <p className="mt-2 text-sm leading-6 text-soil/70">{a.description}</p>
              <span className="link mt-auto self-start pt-5 text-sm font-medium text-ink">read the comparison</span>
            </Link>
          ))}
        </RevealGroup>
      </section>

      <section className="mt-12 md:mt-16">
        <Reveal>
          <h2 className="t-page text-forest">deep dives.</h2>
        </Reveal>
        <RevealGroup className="mt-6 grid gap-4 md:grid-cols-3" itemClassName="h-full" step={0.06}>
          {deep.map((a) => (
            <Link key={a.slug} href={`/learn/${a.slug}`} className="card flex h-full flex-col p-6">
              <p className="t-label text-soil/55">{a.eyebrow}</p>
              <h3 className="t-card mt-2 text-ink">{a.heading}</h3>
              <p className="mt-2 text-sm leading-6 text-soil/70">{a.description}</p>
              <span className="link mt-auto self-start pt-4 text-sm font-medium text-ink">read</span>
            </Link>
          ))}
        </RevealGroup>
      </section>

      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Learn", path: "/learn" },
          ]),
        ]}
      />
    </div>
  );
}
