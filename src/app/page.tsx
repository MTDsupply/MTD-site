import Link from "next/link";
import Image from "next/image";
import { getCatalog } from "@/lib/catalog/queries";
import { site, stockSentence, restockNoteLower } from "@/lib/site";
import { CostCalculator } from "@/components/CostCalculator";
import { PRESS } from "@/components/PressBand";
import { money, unitMoney, count } from "@/lib/format";
import { pageMeta, faqLd, SITE_DESCRIPTION } from "@/lib/seo";
import { homeFaq } from "@/lib/faq";
import { JsonLd } from "@/components/JsonLd";

export const metadata = pageMeta({
  title: `${site.name} · Home-compostable coffee cups and lids`,
  description: SITE_DESCRIPTION,
  path: "/",
  image: "/hero-bone.jpg",
  imageAlt: "A paper hot cup and lid on a bone backdrop, a second cup on its side showing the made to disappear mark on its base",
});

/*
 * Home page built from the brand card (docs/brand/brand-card-2026-11-12.pdf):
 * bone ground, ink type in the system Helvetica stack, hairlines between
 * everything, square images, round buttons only, one primary action per
 * screen, no shadows, no gradients, nothing that slides. Every section opens
 * with a small number, a lowercase heading and one line of intro. The only
 * dark band on the page is the footer.
 */

function Section({ n, title, intro, children, className = "" }: { n: string; title: string; intro?: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`border-t border-line py-16 md:py-16 ${className}`}>
      <div className="grid gap-8 md:grid-cols-[160px_1fr] md:gap-12">
        <p className="t-label pt-2">{n}</p>
        <div>
          <h2 className="t-section text-ink">{title}</h2>
          {intro ? <p className="t-lead mt-4 max-w-[58ch] text-stone">{intro}</p> : null}
          <div className="mt-10">{children}</div>
        </div>
      </div>
    </section>
  );
}

export default async function HomePage() {
  const catalog = await getCatalog();
  const { categories, products } = catalog;
  const faq = homeFaq(catalog);
  const catBySlug = new Map(categories.map((c) => [c.slug, c]));
  const live = products.filter((p) => p.status === "live" && catBySlug.get(p.categorySlug)?.status === "live");
  const cups = live.filter((p) => p.categorySlug === "cups").sort((a, b) => a.sortOrder - b.sortOrder);
  const lid = live.find((p) => p.categorySlug === "lids") ?? null;
  const press = PRESS[0];
  const restock = categories.some((c) => c.restockWhen);

  const range = [
    ...cups.map((p) => ({ p, use: { "MTD-CUP-8H": "cortado, flat white, a short americano.", "MTD-CUP-12H": "the everyday latte and the house drip.", "MTD-CUP-16H": "large lattes, chai, tea with room." }[p.sku] ?? "" })),
    ...(lid ? [{ p: lid, use: "one lid for all three sizes." }] : []),
  ];

  const places: [string, string][] = [
    ["home compost pile.", "Tear it, bury it with the food scraps, turn the pile as usual. This is what the certificate tests."],
    ["worm bin or community garden.", "Same material, same microbes. Smaller pieces go faster."],
    ["industrial facility.", "Anything that composts cold composts hot. Where cups are collected, it goes in the same stream."],
  ];

  return (
    <div className="mx-auto max-w-7xl px-4">
      {/* hero: one object, hard light, the headline beside it. */}
      <section className="grid items-center gap-10 py-12 md:grid-cols-[1.15fr_1fr] md:gap-16 md:py-24">
        <div className="relative aspect-[16/10] overflow-hidden bg-card">
          <Image src="/hero-bone.jpg" alt="A paper hot cup and lid on a bone backdrop, a second cup on its side showing the made to disappear mark on its base" fill priority fetchPriority="high" sizes="(min-width: 768px) 60vw, 100vw" className="object-cover object-left" />
        </div>
        <div>
          <p className="t-label">{restock ? stockSentence(categories).replace(/\.$/, "").toLowerCase() : "hot cups and lids, in stock"}</p>
          <h1 className="t-hero mt-4 text-ink">serve it. then let it go.</h1>
          <p className="t-lead mt-6 max-w-[40ch] text-ink">Hot cups and lids made from 100% certified home-compostable material. The mark on the base is the whole promise: it goes in the garden pile with the grounds.</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link href="/products/cups" className="btn btn-primary">
              order cups
            </Link>
            <Link href="/business" className="link text-[15px] font-medium text-ink">
              wholesale pricing
            </Link>
          </div>
          <dl className="hairline mt-10 max-w-sm border-y border-line text-[14px]">
            {[
              ["certified", `${site.certifier}, home compostable`],
              ["lining", "PHA. No plastic film, no microplastics"],
              ["heard on", `${press.outlet}, ${press.show}`],
            ].map(([k, v]) => (
              <div key={k} className="flex gap-6 py-2.5">
                <dt className="w-20 shrink-0 text-stone">{k}</dt>
                <dd className="text-ink">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 01 the range */}
      <Section n="01" title="the range." intro="Three hot cups and the one lid that fits all of them. Packs for the house, cases for the business.">
        <div className="grid grid-cols-2 border-l border-t border-line md:grid-cols-4">
          {range.map(({ p, use }) => (
            <Link key={p.sku} href={`/products/${p.categorySlug}/${p.sku.toLowerCase()}`} className="group border-b border-r border-line bg-card transition-colors hover:bg-[#f9f6f0]">
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image src={p.photo ?? "/products/MTD-CUP-12H-front.jpg"} alt={p.name} fill sizes="(min-width: 768px) 25vw, 50vw" className="object-cover" />
              </div>
              <div className="p-4 md:p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1">
                  <h3 className="t-card text-ink">{p.name.toLowerCase()}.</h3>
                  <span className="sku whitespace-nowrap text-ash">{p.sku}</span>
                </div>
                <p className="mt-1 text-[14px] text-stone">{use}</p>
                <p className="mt-3 text-[14px] text-ink tnum">
                  {money(p.casePrice)} per {count(p.caseCount)} · {unitMoney(p.unitPrice)} each
                </p>
                <span className="chip chip-fog mt-3">{restockNoteLower(p.restockWhen) ?? "in stock"}</span>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* 02 what it is made of */}
      <Section n="02" title="paper outside. PHA inside." intro="Every paper cup has a lining. Ours is PHA, a material microbes make and microbes eat, so the whole cup is certified to break down in a home compost pile.">
        <div className="grid gap-10 md:grid-cols-[1fr_1fr] md:gap-16">
          <div className="relative aspect-[16/10] overflow-hidden bg-card">
            <Image src="/soil-mark.jpg" alt="A paper hot cup half-sunk in dark compost, softened and browning, the made to disappear mark still legible on its base" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover object-right" />
          </div>
          <dl className="hairline border-y border-line text-[15px]">
            {[
              ["material", "100% certified home-compostable material"],
              ["certifier", site.certifier],
              ["lining", "PHA, made by fermentation. Not PLA, not a water-based plastic coating"],
              ["left behind", "Nothing. No film, no flakes, no microplastics"],
              ["read more", <Link key="l" href="/whats-in-your-cup" className="link">what&rsquo;s in your cup</Link>],
            ].map(([k, v]) => (
              <div key={String(k)} className="flex gap-6 py-3">
                <dt className="w-28 shrink-0 text-stone">{k}</dt>
                <dd className="text-ink">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      {/* 03 after the coffee */}
      <Section n="03" title="after the coffee." intro="Serve it. Compost it. Done. An illustration of the sequence, not a timed photograph: how fast it goes depends on the pile.">
        <figure>
          <div className="relative aspect-[21/9] overflow-hidden bg-card">
            <Image src="/breakdown-strip-upright.jpg" alt="Four panels of the same paper cup in a compost pile: standing new, slumped and stained, collapsed to its marked base, and almost gone" fill sizes="(min-width: 1120px) 960px, 100vw" className="object-cover" />
          </div>
        </figure>
        <div className="mt-8 grid border-t border-line md:grid-cols-3">
          {places.map(([h, t], i) => (
            <div key={h} className="border-b border-line py-5 md:border-b-0 md:border-r md:pr-6 md:last:border-r-0 md:[&:not(:first-child)]:pl-6">
              <p className="t-label">0{i + 1}</p>
              <h3 className="t-card mt-2 text-ink">{h}</h3>
              <p className="mt-2 text-[15px] text-stone">{t}</p>
            </div>
          ))}
        </div>
        <p className="mt-6">
          <Link href="/compost" className="link text-[15px] font-medium text-ink">
            how to compost it
          </Link>
        </p>
      </Section>

      {/* 04 what it costs */}
      <Section n="04" title="what it costs." intro="One case price for everyone, whether you order one case or fifty. Put in your numbers.">
        <CostCalculator cups={cups} lid={lid} />
      </Section>

      {/* 05 the inner harbour */}
      <Section n="05" title="98% said they'd pay 15¢ more." intro="Before we ordered a single case we spent a few days on the Inner Harbour with a clipboard and a cooler of freezies, asking 167 coffee drinkers one question.">
        <div className="grid gap-10 md:grid-cols-[1fr_1fr] md:gap-16">
          <figure>
            <div className="relative aspect-[4/3] overflow-hidden bg-card">
              <Image src="/inner-harbour.jpg" alt="The founders on the Inner Harbour causeway in Victoria, asking passers-by four questions with a cooler of freezies and a hand-drawn sign" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" style={{ filter: "saturate(0.7) contrast(1.02)" }} />
            </div>
            <figcaption className="mt-3 text-[13px] text-stone">Inner Harbour, {site.city}. 167 coffee drinkers, summer 2026.</figcaption>
          </figure>
          <div>
            <p className="text-[16px] leading-[1.55] text-ink">Would you pay 15¢ more per coffee for a cup with no microplastics that composts at home? 163 said yes.</p>
            <dl className="hairline mt-6 border-y border-line">
              {[
                ["87%", "would pay more for no microplastics"],
                ["90%", "would pay more for home compostable"],
                ["98%", "would pay more for both"],
              ].map(([n, label]) => (
                <div key={label} className="flex items-baseline gap-6 py-3">
                  <dd className="w-[4ch] text-[32px] font-bold leading-none tracking-[-0.02em] text-ink tnum">{n}</dd>
                  <dt className="text-[15px] text-stone">{label}</dt>
                </div>
              ))}
            </dl>
            <p className="mt-6">
              <Link href="/about" className="link text-[15px] font-medium text-ink">
                our story
              </Link>
            </p>
          </div>
        </div>
      </Section>

      {/* 06 asked often */}
      <Section n="06" title="asked often." className="pb-24">
        <div className="hairline max-w-3xl border-y border-line">
          {faq.map(([q, a]) => (
            <details key={q} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[17px] font-medium text-ink">
                <h3 className="text-[17px] font-medium">{q}</h3>
                <span aria-hidden="true" className="text-[20px] leading-none text-stone transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 max-w-[62ch] text-[15px] leading-[1.55] text-stone">{a}</p>
            </details>
          ))}
        </div>
        <p className="mt-6 text-[15px] text-stone">
          More on the material in{" "}
          <Link href="/learn" className="link text-ink">
            learn
          </Link>
          , with sources.
        </p>
      </Section>
      <JsonLd data={faqLd(faq)} />
    </div>
  );
}
