import { getCatalog } from "@/lib/catalog/queries";
import { claims } from "@/lib/copy";
import { site } from "@/lib/site";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { Atmosphere } from "@/components/scene/Atmosphere";
import { pageMeta, breadcrumbLd, faqLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";

export const metadata = pageMeta({
  title: "Certifications · TÜV Austria home-compostable, per SKU",
  description:
    "Every certificate behind the claim: the certifier, the SKU it covers and the certificate itself, for each hot cup and lid. What home-compostable certification tests, and why we certify per product rather than per range.",
  path: "/certifications",
});

const FAQ: [string, string][] = [
  [
    "What does home-compostable certification test?",
    `${site.certifier} tests the material for disintegration and breakdown in a home compost pile at ambient temperature, and checks for harmful residues. The certificate covers the material a specific product is made from, lining included.`,
  ],
  [
    "Is home-compostable the same as compostable?",
    "No. Most compostable certifications assume an industrial facility running hot. Home-compostable certification tests at the lower temperatures of a backyard pile, which is the only kind of composting most people have. Our products are certified home-compostable.",
  ],
  [
    "Why certify per SKU?",
    "A certificate for the 16 oz cup covers the 16 oz cup. Certifying each product separately means every claim on this site points to a specific row on this page, not to a range or a material in general.",
  ],
];

export default async function CertificationsPage() {
  const { categories, products, certs } = await getCatalog();
  const catOrder = new Map(categories.map((c) => [c.slug, c.sortOrder]));
  const sorted = [...products].sort(
    (a, b) => (catOrder.get(a.categorySlug) ?? 99) - (catOrder.get(b.categorySlug) ?? 99) || a.sortOrder - b.sortOrder,
  );
  const comingSoon = categories.filter((c) => c.status !== "live").sort((a, b) => a.sortOrder - b.sortOrder);
  const hasNumbers = certs.some((c) => c.number);
  const hasPdfs = certs.some((c) => c.pdfUrl);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-8">
      <PageHeader
        eyebrow="Proof"
        title="Certifications"
        description={`${claims.certLine} Every claim on this site points to a row on this page.`}
        image="/atmosphere/moss.jpg"
        imageAlt="Moss and fern on a forest floor"
        objectPosition="center 60%"
      />

      <div className="mt-8 overflow-x-auto border border-line bg-white">
        <table className="price-table w-full text-sm">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Product</th>
              <th>Certification</th>
              <th>Certifier</th>
              {hasNumbers ? <th>Certificate number</th> : null}
              {hasPdfs ? <th>PDF</th> : null}
            </tr>
          </thead>
          <tbody>
            {sorted.map((p) => {
              const cert = certs.find((c) => c.id === p.certId && c.coveredSkus.includes(p.sku));
              const live = p.status === "live";
              return (
                <tr key={p.sku} id={p.sku} className="target:bg-sage-tint">
                  <td className="sku">{p.sku}</td>
                  <td>{p.name}</td>
                  <td>{cert && live ? cert.name : "In testing"}</td>
                  <td>{cert && live ? cert.certifier : "TÜV Austria"}</td>
                  {hasNumbers ? <td className="tnum">{cert && live ? (cert.number ?? "") : ""}</td> : null}
                  {hasPdfs ? (
                    <td>
                      {cert?.pdfUrl && live ? (
                        <a href={cert.pdfUrl} className="link-proof" target="_blank" rel="noreferrer">
                          Download
                        </a>
                      ) : null}
                    </td>
                  ) : null}
                </tr>
              );
            })}
            {comingSoon.map((c) => (
              <tr key={c.slug} id={c.slug} className="text-soil/50">
                <td></td>
                <td>{c.name}</td>
                <td>In testing</td>
                <td>TÜV Austria</td>
                {hasNumbers ? <td></td> : null}
                {hasPdfs ? <td></td> : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-10 grid gap-8 md:grid-cols-[1fr_minmax(0,1.2fr)] md:items-start">
      <Reveal>
        <Atmosphere src="/atmosphere/moss.jpg" alt="Moss and fern on a forest floor" fade="none" parallax={30} className="aspect-[4/3] border border-line" sizes="(min-width: 768px) 40vw, 100vw" />
      </Reveal>
      <Reveal as="section" className="max-w-2xl space-y-3 border-l-2 border-sage pl-5 text-sm text-soil/80">
        <h2 className="t-heading">What the certificate means</h2>
        <p>
          Home-compostable certification from {site.certifier} covers the material each product is made from: disintegration and breakdown in a home compost pile at ambient temperature, plus checks for harmful residues. We certify per SKU, so a certificate for the 16 oz cup covers the 16 oz cup.
        </p>
        <p>
          Our cups have no plastic lining. The lining is PHA, a material made by fermentation, and the certified material includes that lining.
        </p>
        <p>
          Products marked “In testing” are in development and go through the same certification before they are sold.
        </p>
      </Reveal>
      </div>

      <section className="mt-12 max-w-3xl">
        <h2 className="t-heading">Questions about the certification</h2>
        <div className="mt-3 divide-y divide-line border-y border-line">
          {FAQ.map(([q, a]) => (
            <details key={q} className="group py-3">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-medium">
                <h3 className="text-[15px] font-medium">{q}</h3>
                <span aria-hidden="true" className="text-sage-deep transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-2 max-w-[62ch] text-sm leading-6 text-soil/80">{a}</p>
            </details>
          ))}
        </div>
      </section>
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Certifications", path: "/certifications" },
          ]),
          faqLd(FAQ),
        ]}
      />
    </div>
  );
}
