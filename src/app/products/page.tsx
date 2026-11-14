import { Suspense } from "react";
import Link from "next/link";
import { getCatalog } from "@/lib/catalog/queries";
import { CatalogGrid } from "@/components/CatalogGrid";
import { sharedPhoto } from "@/lib/catalog/assets";
import { Reveal } from "@/components/Reveal";
import { money, unitMoney, count } from "@/lib/format";
import { pageMeta, breadcrumbLd, itemListLd } from "@/lib/seo";
import { homeFaq } from "@/lib/faq";
import { JsonLd } from "@/components/JsonLd";

export const metadata = pageMeta({
  title: "Compostable hot cups and lids · the catalogue",
  description:
    "Every hot cup and lid we make: 8, 12 and 16 oz PHA-lined paper cups and the one lid that fits all three, all 100% certified home-compostable material (TÜV Austria). Packs of 100 to 500 or cases of 1,000, CAD pricing shown.",
  path: "/products",
});

export default async function ProductsPage() {
  const catalog = await getCatalog();
  const live = catalog.products.filter((p) => p.status === "live");
  const cups = live.filter((p) => p.categorySlug === "cups").sort((a, b) => a.sortOrder - b.sortOrder);
  const lid = live.find((p) => p.categorySlug === "lids") ?? null;
  const faq = homeFaq(catalog).slice(0, 6);

  const rows: [string, (p: (typeof cups)[number]) => string][] = [
    ["capacity", (p) => p.specs.capacity ?? p.size],
    ["rim", (p) => p.specs.rimDiameter ?? ""],
    ["lid", () => (lid ? lid.name.toLowerCase() : "")],
    ["pack", (p) => `${count(p.packCount)} · ${money(p.packPrice)}`],
    ["case", (p) => `${count(p.caseCount)} · ${money(p.casePrice)}`],
    ["per cup by the case", (p) => unitMoney(p.unitPrice)],
    ["case size", (p) => p.specs.caseDimensions ?? ""],
    ["case weight", (p) => p.specs.caseWeight ?? ""],
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 pb-8">
      <div className="pt-8">
        <nav aria-label="Breadcrumb" className="t-label">
          <Link href="/" className="hover:underline">
            home
          </Link>{" "}
          / products
        </nav>
        <h1 className="t-section mt-3 text-ink">products.</h1>
        <p className="t-lead mt-3 max-w-[48ch] text-stone">Three cups and one lid. Packs of 100 for home, cases of 1,000 for cafés.</p>
      </div>
      <Suspense fallback={<p className="mt-8 text-sm text-stone">Loading catalogue…</p>}>
        <CatalogGrid
          catalog={catalog}
          featured={
            sharedPhoto("life-counter")
              ? { src: sharedPhoto("life-counter")!, alt: "A lidded cup on a café counter beside a croissant", line: "Paper with a PHA lining. When the coffee is done, the cup and lid go in the compost with the grounds.", href: "/whats-in-your-cup" }
              : undefined
          }
          closers={
            sharedPhoto("life-hand")
              ? [{ src: sharedPhoto("life-hand")!, alt: "A barista holding a lidded cup", line: "One lid for all three cups. Same material as the cup, so the whole thing goes in the compost together.", href: "/compost", span: 2 }]
              : []
          }
        />
      </Suspense>

      {cups.length > 1 ? (
        <Reveal as="section" className="mt-16 md:mt-24">
          <h2 className="t-section text-ink">compare the sizes.</h2>
          <p className="t-lead mt-3 max-w-[58ch] text-stone">All three are the same paper and the same lining. The only differences are the size and the price.</p>
          <div className="mt-8 overflow-x-auto">
            <table className="spec-table table-fixed w-full text-[15px]">
              <colgroup>
                <col style={{ width: "28%" }} />
                {cups.map((p) => (
                  <col key={p.sku} style={{ width: `${72 / cups.length}%` }} />
                ))}
              </colgroup>
              <thead>
                <tr>
                  <th />
                  {cups.map((p) => (
                    <th key={p.sku}>
                      <Link href={`/products/${p.categorySlug}/${p.sku.toLowerCase()}`} className="hover:underline">
                        {p.size}
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map(([label, get]) => (
                  <tr key={label}>
                    <th scope="row" className="text-left font-normal text-stone">
                      {label}
                    </th>
                    {cups.map((p) => (
                      <td key={p.sku} className="text-ink tnum">
                        {get(p)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      ) : null}

      <Reveal as="section" className="mt-16 md:mt-24">
        <h2 className="t-section text-ink">asked often.</h2>
        <div className="mt-6 divide-y divide-line border-y border-line">
          {faq.map(([q, a]) => (
            <details key={q} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[17px] font-medium text-ink">
                <h3 className="text-[17px] font-medium">{q}</h3>
                <span aria-hidden="true" className="text-[22px] font-light leading-none transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 max-w-[62ch] text-[15px] leading-6 text-stone">{a}</p>
            </details>
          ))}
        </div>
        <p className="mt-5 text-[15px] text-stone">
          More questions?{" "}
          <Link href="/contact" className="link text-ink">
            write to us
          </Link>
        </p>
      </Reveal>

      <Reveal as="section" className="mt-16 grid gap-4 md:mt-24 md:grid-cols-2">
        <div className="note">
          <h2 className="t-heading text-ink">want to try them first?</h2>
          <p className="mt-2 text-stone">
            We send free sample packs to cafés and food businesses once we have verified them.{" "}
            <Link href="/business?kind=sample#quote" className="link text-ink">
              request a sample pack
            </Link>
          </p>
        </div>
        <div className="note">
          <h2 className="t-heading text-ink">ordering again?</h2>
          <p className="mt-2 text-stone">
            Type in the SKUs and quantities and add them all at once.{" "}
            <Link href="/quick-order" className="link text-ink">
              quick order by <span className="keep-case">SKU</span>
            </Link>
          </p>
        </div>
      </Reveal>

      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Products", path: "/products" },
          ]),
          itemListLd("Hot cups and lids", live),
        ]}
      />
    </div>
  );
}
