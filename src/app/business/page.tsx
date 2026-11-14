import { Suspense } from "react";
import { pageMeta } from "@/lib/seo";
import { getCatalog } from "@/lib/catalog/queries";
import { money, unitMoney, count } from "@/lib/format";
import { QuoteForm } from "@/components/QuoteForm";
import { Reveal } from "@/components/Reveal";
import Link from "next/link";
import { QUOTE_KINDS } from "@/lib/quote-kinds";
import { stockSentence } from "@/lib/site";
import { bulkCasePrice, hasVolumeTier, BULK_MIN_UNITS, PRINT_MIN_UNITS } from "@/lib/pricing";

export const metadata = pageMeta({
  title: "Wholesale compostable cups for cafés · case pricing and net-30",
  description:
    "Case pricing on every hot cup and lid, net-30 on approval, free sample packs for verified cafés and custom printing. 100% certified home-compostable material (TÜV Austria), shipped from Victoria, BC across Canada and the US.",
  path: "/business",
});

export default async function BusinessPage({ searchParams }: PageProps<"/business">) {
  const catalog = await getCatalog();
  const volume = hasVolumeTier(catalog.products);
  const catOrder = new Map(catalog.categories.map((c) => [c.slug, c.sortOrder]));
  const liveCats = new Set(catalog.categories.filter((c) => c.status === "live").map((c) => c.slug));
  const rows = [...catalog.products].sort(
    (a, b) => (catOrder.get(a.categorySlug) ?? 99) - (catOrder.get(b.categorySlug) ?? 99) || a.sortOrder - b.sortOrder,
  );
  const isLive = (p: (typeof rows)[number]) => p.status === "live" && liveCats.has(p.categorySlug);
  const categories = [...catalog.categories].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="-mt-8 border-b border-line">
        <div className="py-12 md:py-16">
          <Reveal>
            <p className="t-label">Business accounts</p>
            <h1 className="t-section mt-3 text-ink">for cafés, restaurants, caterers and events.</h1>
            <p className="mt-4 max-w-[52ch] t-lead text-stone">
              Case prices below{volume ? <>, with a lower price on every case of cups once an order reaches {count(BULK_MIN_UNITS)} cups</> : null}. Approved accounts get net-30. Ask for a free sample pack first if you want to run them on your machines.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href="#quote" className="btn btn-primary">
                request a quote
              </a>
              <Link href="/business?kind=sample#quote" className="link self-center text-[15px] font-medium text-ink">
                request a sample pack
              </Link>
            </div>
          </Reveal>

        </div>
      </div>

      <section className="mt-12">
        <p className="t-label">01</p>
        <h2 className="t-heading mt-2">how it works.</h2>
        <div className="mt-6 grid border-t border-line md:grid-cols-3">
          {[
            ["sample pack.", "A small pack of each cup size and the lid, so your team can run them on the machines before committing to a case. Free for cafés and other foodservice businesses; ask with the form below.", "/business?kind=sample#quote", "request a sample pack"],
            ["net-30 on approval.", "Send a quote request with your company details. Approved accounts order on terms and reorder from their account page. Cafés on Cup Casa can have us reorder before they run out; say so in the notes.", "#quote", "request a quote"],
            ["custom printing.", `Your logo on the same certified cup, on orders of ${count(PRINT_MIN_UNITS)} cups or more. Send your artwork details and we reply with options, pricing and a proof.`, "/custom-printing", "about custom printing"],
          ].map(([h, t, href, label]) => (
            <div key={h} className="border-b border-line py-5 md:border-b-0 md:border-r md:pr-6 md:last:border-r-0 md:[&:not(:first-child)]:pl-6">
              <h3 className="t-card">{h}</h3>
              <p className="mt-2 text-[15px] text-ink">{t}</p>
              <Link href={href} className="link mt-3 inline-block text-[14px] text-ink">
                {label}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <p className="t-label">02</p>
        <h2 className="t-heading mt-2">case prices.</h2>
        <div className="mt-3 overflow-x-auto rounded-[20px] bg-white">
          <table className="price-table w-full text-sm">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Product</th>
                <th className="hidden md:table-cell">Material</th>
                <th className="num">Case count</th>
                <th className="num">Per case</th>
                <th className="num">Per unit</th>
                {volume ? <th className="num">Per unit, {count(BULK_MIN_UNITS)}+ cups</th> : null}
                <th className="num">Packs 100 / 200 / 500</th>
                <th className="hidden md:table-cell">Certification</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => {
                const cert = catalog.certs.find((c) => c.id === p.certId);
                const live = isLive(p);
                return (
                  <tr key={p.sku} className={live ? "" : "text-soil/50"}>
                    <td className="sku">{p.sku}</td>
                    <td>
                      {p.name}
                      {live ? null : <span className="block text-[12px] text-stone">coming soon</span>}
                    </td>
                    <td className="hidden md:table-cell">{p.material}</td>
                    <td className="num">{count(p.caseCount)}</td>
                    <td className="num">{money(p.casePrice)}</td>
                    <td className="num">{unitMoney(p.unitPrice)}</td>
                    {volume ? <td className="num">{p.bulkUnitPrice != null ? <>{unitMoney(p.bulkUnitPrice)} <span className="text-soil/60">({money(bulkCasePrice(p) ?? 0)} per case)</span></> : unitMoney(p.unitPrice)}</td> : null}
                    <td className="num text-soil/80">{(p.packs?.length ? p.packs : [{ count: p.packCount, price: p.packPrice }]).map((t) => money(t.price).replace(".00", "")).join(" / ")}</td>
                    <td className="wrap hidden md:table-cell">{cert && live ? cert.certifier : ""}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-soil/60">
          {stockSentence(categories)} Prices in CAD before tax.{rows.some((p) => p.status !== "live") ? " Coming-soon rows show planned pricing; add them to a quote and we will confirm availability." : ""} Download the{" "}
          <a href="/price-list.pdf" className="link">
            one-page price list (PDF)
          </a>
          .
        </p>
      </section>

      <section id="quote" className="mt-12">
        <p className="t-label">03</p>
        <h2 className="t-heading mt-2">request a quote, a sample pack or custom printing.</h2>
        <p className="mt-1 text-sm text-soil/70">Tell us roughly how many cups you use a month and the categories you want, including ones not yet in stock.</p>
        <div className="mt-4">
          <Suspense fallback={<QuoteForm categories={categories} />}>
            <QuoteWithPreset categories={categories} searchParams={searchParams} />
          </Suspense>
        </div>
      </section>

    </div>
  );
}

async function QuoteWithPreset({
  categories,
  searchParams,
}: {
  categories: Awaited<ReturnType<typeof getCatalog>>["categories"];
  searchParams: PageProps<"/business">["searchParams"];
}) {
  const sp = await searchParams;
  const sku = typeof sp.sku === "string" ? sp.sku : undefined;
  const kind = QUOTE_KINDS.find(([k]) => k === sp.kind)?.[0];
  return <QuoteForm categories={categories} presetSku={sku} presetKind={kind} />;
}
