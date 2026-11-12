import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Fragment, type ReactNode } from "react";
import { ARTICLES, SOURCES, articleBySlug } from "@/lib/learn";
import { site } from "@/lib/site";
import { PageHeader } from "@/components/PageHeader";
import { Reveal, RevealGroup } from "@/components/Reveal";
import { pageMeta, breadcrumbLd, faqLd, articleLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = articleBySlug(slug);
  if (!a) return {};
  return pageMeta({ title: a.title, description: a.description, path: `/learn/${a.slug}`, image: "/products/MTD-CUP-12H-front.jpg", imageAlt: "A paper hot cup lying on its side, showing the mark on its base" });
}

/** Renders [text](href) links and **bold** inside a paragraph string. */
function Inline({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*)/g).filter(Boolean);
  return (
    <>
      {parts.map((part, i) => {
        const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
        if (link) {
          const [, label, href] = link;
          return href.startsWith("/") ? (
            <Link key={i} href={href} className="link font-medium text-forest">
              {label}
            </Link>
          ) : (
            <a key={i} href={href} className="link font-medium text-forest" rel="noopener" target="_blank">
              {label}
            </a>
          );
        }
        const bold = /^\*\*([^*]+)\*\*$/.exec(part);
        if (bold) return <strong key={i} className="font-semibold text-forest">{bold[1]}</strong>;
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}

function Prose({ children }: { children: ReactNode }) {
  return <div className="space-y-4 text-[16px] leading-7 text-soil/85 md:text-[17px] md:leading-8">{children}</div>;
}

export default async function LearnArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = articleBySlug(slug);
  if (!a) notFound();
  const related = a.related.map((s) => articleBySlug(s)).filter((x): x is NonNullable<typeof x> => !!x);
  const sources = a.sources.map((id) => SOURCES[id]).filter(Boolean);
  const updated = new Date(a.updated + "T12:00:00Z").toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="mx-auto max-w-7xl px-4 pb-8">
      <PageHeader eyebrow={a.eyebrow} title={a.title} description={a.description} />

      <article className="mx-auto mt-10 max-w-3xl md:mt-14">
        <Reveal>
          <p className="t-label text-soil/55">
            Updated {updated} · By {site.name}
          </p>
          <section aria-labelledby="in-short" className="mt-6 rounded-[20px] bg-cream p-6 md:p-8">
            <h2 id="in-short" className="t-card text-forest">
              In short
            </h2>
            <ul className="mt-4 space-y-3 text-[15px] leading-6 text-soil/85">
              {a.summary.map((s) => (
                <li key={s} className="flex gap-3">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-forest" />
                  <span>
                    <Inline text={s} />
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </Reveal>

        {a.sections.map((s) => (
          <Reveal key={s.h} as="section" className="mt-12 md:mt-14">
            <h2 className="t-heading text-forest">{s.h}</h2>
            {s.p && !s.list ? (
              <div className="mt-4">
                <Prose>
                  {s.p.map((para) => (
                    <p key={para.slice(0, 40)}>
                      <Inline text={para} />
                    </p>
                  ))}
                </Prose>
              </div>
            ) : null}
            {s.list ? (
              <ol className="mt-5 space-y-4">
                {s.list.map((item, i) => (
                  <li key={item.slice(0, 40)} className="flex gap-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-forest font-display text-[15px] font-bold text-cream tnum">{i + 1}</span>
                    <p className="pt-1.5 text-[16px] leading-7 text-soil/85">
                      <Inline text={item} />
                    </p>
                  </li>
                ))}
              </ol>
            ) : null}
            {s.list && s.p ? (
              <div className="mt-5">
                <Prose>
                  {s.p.map((para) => (
                    <p key={para.slice(0, 40)}>
                      <Inline text={para} />
                    </p>
                  ))}
                </Prose>
              </div>
            ) : null}
            {s.table ? (
              <div className="mt-6 overflow-x-auto rounded-[20px] bg-white">
                <table className="spec-table w-full text-sm">
                  <thead>
                    <tr className="bg-mint-light">
                      {s.table.head.map((h, i) => (
                        <th key={i} className="font-display text-[12px] font-semibold uppercase tracking-[0.08em] text-forest">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {s.table.rows.map((r) => (
                      <tr key={r[0]}>
                        {r.map((c, i) => (
                          <td key={i} className={i === 0 ? "font-medium text-forest" : "text-soil/85"}>
                            {c}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
          </Reveal>
        ))}

        <Reveal as="section" className="mt-14">
          <h2 className="t-heading text-forest">Questions</h2>
          <RevealGroup className="mt-6 space-y-3" step={0.05}>
            {a.faq.map(([q, ans]) => (
              <details key={q} className="group rounded-[18px] bg-cream px-6 py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-[17px] font-semibold text-forest">
                  <h3 className="font-display text-[17px] font-semibold">{q}</h3>
                  <span aria-hidden="true" className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-forest text-cream transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-[62ch] text-[15px] leading-6 text-soil/80">{ans}</p>
              </details>
            ))}
          </RevealGroup>
        </Reveal>

        <Reveal as="section" className="mt-14">
          <h2 className="t-heading text-forest">Sources</h2>
          <ol className="mt-5 list-decimal space-y-3 pl-5 text-[14px] leading-6 text-soil/80">
            {sources.map((s) => (
              <li key={s.id}>
                {s.cite}{" "}
                <a href={s.href} className="link break-all font-medium text-forest" rel="noopener" target="_blank">
                  {s.href.replace(/^https?:\/\//, "")}
                </a>
              </li>
            ))}
          </ol>
          <p className="mt-5 text-[14px] leading-6 text-soil/60">
            We cite standards, regulators, certifiers, peer-reviewed journals and manufacturers&rsquo; own technical pages. If you think we have something wrong, write to{" "}
            <a href={`mailto:${site.email}`} className="link">
              {site.email}
            </a>{" "}
            and we will check it.
          </p>
        </Reveal>

        <Reveal>
          <div className="band-mint mt-14 grid gap-6 rounded-[24px] px-6 py-8 md:grid-cols-[1fr_auto] md:items-center md:px-10">
            <div>
              <h2 className="t-page text-forest">See the certificate, not the logo.</h2>
              <p className="mt-2 text-forest/80">Every SKU we sell is PHA lined and certified home compostable by {site.certifier}, as the finished cup.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/certifications" className="btn btn-primary">
                Certifications
              </Link>
              <Link href="/business?kind=sample#quote" className="btn btn-outline">
                Get free samples
              </Link>
            </div>
          </div>
        </Reveal>
      </article>

      {related.length ? (
        <section className="mx-auto mt-16 max-w-5xl md:mt-20">
          <h2 className="t-page text-center text-forest">Keep reading</h2>
          <RevealGroup className="mt-8 grid gap-4 md:grid-cols-3" itemClassName="h-full" step={0.06}>
            {related.map((r) => (
              <Link key={r.slug} href={`/learn/${r.slug}`} className="card flex h-full flex-col p-6">
                <p className="t-label text-soil/55">{r.eyebrow}</p>
                <h3 className="t-card mt-2 text-forest">{r.title}</h3>
                <p className="mt-2 line-clamp-3 text-sm leading-6 text-soil/70">{r.description}</p>
                <span className="link mt-4 text-sm font-medium text-forest">Read</span>
              </Link>
            ))}
          </RevealGroup>
        </section>
      ) : null}

      <JsonLd
        data={[
          articleLd({ title: a.title, description: a.description, path: `/learn/${a.slug}`, updated: a.updated, image: "/products/MTD-CUP-12H-front.jpg" }),
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Learn", path: "/learn" },
            { name: a.title, path: `/learn/${a.slug}` },
          ]),
          faqLd(a.faq),
        ]}
      />
    </div>
  );
}
