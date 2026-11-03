import type { Metadata } from "next";
import { Suspense } from "react";
import { getCatalog } from "@/lib/catalog/queries";
import { money, unitMoney, count } from "@/lib/format";
import { QuoteForm } from "@/components/QuoteForm";
import { Reveal } from "@/components/Reveal";
import Link from "next/link";
import { QUOTE_KINDS } from "@/lib/quote-kinds";
import { restockNote } from "@/lib/site";

export const metadata: Metadata = {
  title: "Business accounts",
  description: "Case pricing, net-30 on approval and bulk quotes.",
};

export default async function BusinessPage({ searchParams }: PageProps<"/business">) {
  const catalog = await getCatalog();
  const catOrder = new Map(catalog.categories.map((c) => [c.slug, c.sortOrder]));
  const liveCats = new Set(catalog.categories.filter((c) => c.status === "live").map((c) => c.slug));
  const rows = [...catalog.products].sort(
    (a, b) => (catOrder.get(a.categorySlug) ?? 99) - (catOrder.get(b.categorySlug) ?? 99) || a.sortOrder - b.sortOrder,
  );
  const isLive = (p: (typeof rows)[number]) => p.status === "live" && liveCats.has(p.categorySlug);
  const categories = [...catalog.categories].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="band-sage relative left-1/2 -mt-8 w-screen -translate-x-1/2">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-[1.2fr_1fr] md:gap-12 md:py-16">
          <Reveal>
            <p className="t-label text-paper/75">Business accounts</p>
            <h1 className="t-section mt-3 text-white">Supply for cafés, restaurants, caterers and events.</h1>
            <p className="mt-4 max-w-[52ch] text-[17px] leading-7 text-paper/85">
              One supplier for the whole range, certified per SKU, shipping across North America. Case pricing below. Approved accounts get net-30 and a quote on anything over ten cases.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#quote" className="btn btn-paper px-6 py-3 font-semibold">
                Request a quote
              </a>
              <Link href="/business?kind=sample#quote" className="btn border-paper/70 px-6 py-3 font-semibold text-paper hover:bg-white/10">
                Request a sample pack
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <dl className="grid gap-5 border-t border-paper/30 pt-5 md:border-l md:border-t-0 md:pl-8 md:pt-0">
              {[
                ["Case pricing", "Every price below is per case. Switch the header toggle to Business and the whole site shows case prices."],
                ["Net-30 on approval", "Send a quote request with your company details. Approved accounts order on terms and reorder from their account page."],
                ["Bulk quotes", "Ten cases or more, or custom printing from 100 cases: send a quote request and we reply within one business day."],
              ].map(([h, t]) => (
                <div key={h}>
                  <dt className="t-card text-[17px] leading-[22px] text-white">{h}</dt>
                  <dd className="mt-1 text-sm text-paper/75">{t}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>

      <section className="mt-12 grid gap-4 md:grid-cols-2">
        <Reveal>
          <div className="card flex h-full flex-col bg-white p-6">
            <p className="t-label text-sage-deep">Try it first</p>
            <h2 className="t-heading mt-2">Sample pack</h2>
            <p className="mt-3 text-sm text-soil/80">
              A small pack of each cup size and the lid, so your team can run them on the machines before committing to a case. Ask for one with the form below and we confirm the cost with your reply.
            </p>
            <Link href="/business?kind=sample#quote" className="btn btn-outline mt-5 self-start">
              Request a sample pack
            </Link>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <div className="card flex h-full flex-col bg-white p-6">
            <p className="t-label text-sage-deep">Your mark on the cup</p>
            <h2 className="t-heading mt-2">Custom printing</h2>
            <p className="mt-3 text-sm text-soil/80">
              Your logo on the same certified cup, from 100 cases. Send your artwork details and we reply with options, pricing and a proof.
            </p>
            <Link href="/custom-printing" className="btn btn-outline mt-5 self-start">
              About custom printing
            </Link>
          </div>
        </Reveal>
      </section>

      <section className="mt-12">
        <p className="t-label text-sage-deep">Pricing</p>
        <h2 className="t-heading mt-2">Case prices</h2>
        <div className="mt-3 overflow-x-auto border border-line bg-white">
          <table className="price-table w-full text-sm">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Product</th>
                <th>Material</th>
                <th className="num">Case count</th>
                <th className="num">Per case</th>
                <th className="num">Per unit</th>
                <th className="num">Packs 100 / 200 / 500</th>
                <th>Certification</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => {
                const cert = catalog.certs.find((c) => c.id === p.certId);
                const live = isLive(p);
                return (
                  <tr key={p.sku} className={live ? "" : "text-soil/50"}>
                    <td className="sku">{p.sku}</td>
                    <td>{p.name}</td>
                    <td>{p.material}</td>
                    <td className="num">{count(p.caseCount)}</td>
                    <td className="num">{money(p.casePrice)}</td>
                    <td className="num">{unitMoney(p.unitPrice)}</td>
                    <td className="num text-soil/80">{(p.packs?.length ? p.packs : [{ count: p.packCount, price: p.packPrice }]).map((t) => money(t.price).replace(".00", "")).join(" / ")}</td>
                    <td className="wrap">{cert && live ? cert.certifier : "In testing"}</td>
                    <td>{live ? <span className="chip chip-clay">{restockNote(p.categorySlug) ?? "In stock"}</span> : <span className="chip chip-fog">Coming soon</span>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-soil/60">
          Prices in CAD before tax. Coming-soon rows show planned pricing; add them to a quote and we will confirm availability. Download the{" "}
          <a href="/price-list.pdf" className="link">
            one-page price list (PDF)
          </a>
          .
        </p>
      </section>

      <section id="quote" className="mt-12">
        <p className="t-label text-sage-deep">Quote</p>
        <h2 className="t-heading mt-2">Request a quote, a sample pack or custom printing</h2>
        <p className="mt-1 text-sm text-soil/70">Tell us your monthly volume and the categories you want, including ones not yet in stock.</p>
        <div className="mt-4">
          <Suspense fallback={<QuoteForm categories={categories} />}>
            <QuoteWithPreset categories={categories} searchParams={searchParams} />
          </Suspense>
        </div>
      </section>

      <section className="mt-12">
        <div className="max-w-2xl border-l-2 border-sage pl-5 text-sm text-soil/80">
          <h2 className="t-card">Cup Casa accounts</h2>
          <p className="mt-2">
            Cafés running Cup Casa OS can turn on auto-replenishment: we track your cup usage and deliver before you run out, on the same net-30 terms. Mention it in the notes above.
          </p>
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
