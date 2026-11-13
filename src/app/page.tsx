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
import { HoverSwap } from "@/components/HoverSwap";
import { BreakdownScrubber } from "@/components/BreakdownScrubber";
import { CountUp } from "@/components/CountUp";
import { SectionRail } from "@/components/SectionRail";

export const metadata = pageMeta({
  title: `${site.name} · Home-compostable coffee cups and lids`,
  description: SITE_DESCRIPTION,
  path: "/",
  image: "/hero-bone.jpg",
  imageAlt: "The three cup sizes and the lid on a bone backdrop, a fourth cup on its side showing the made to disappear mark on its base",
});

/*
 * Home page built from the brand card (docs/brand/brand-card-2026-11-12.md):
 * bone ground, ink type in the system Helvetica stack, hairlines between
 * everything, square images, round buttons only, one primary action per
 * screen, no shadows, no gradients, nothing that slides. Every section opens
 * with a small number that pins while its section scrolls, a lowercase heading
 * and one line of intro; a fixed index of the numbers sits in the left gutter
 * on wide screens. The only dark band on the page is the footer.
 */

const SECTIONS = [
  { id: "range", n: "01", title: "the range." },
  { id: "material", n: "02", title: "paper outside. PHA inside." },
  { id: "after", n: "03", title: "after the coffee." },
  { id: "cost", n: "04", title: "what it costs." },
  { id: "harbour", n: "05", title: "98% said they’d pay 15¢ more." },
  { id: "faq", n: "06", title: "asked often." },
] as const;

function Section({ id, children, intro, className = "" }: { id: (typeof SECTIONS)[number]["id"]; intro?: string; children: React.ReactNode; className?: string }) {
  const s = SECTIONS.find((x) => x.id === id)!;
  return (
    <section id={id} className={`scroll-mt-24 border-t border-line py-16 md:py-20 ${className}`}>
      <div className="grid gap-8 md:grid-cols-[160px_1fr] md:gap-12">
        <p className="section-num t-label pt-2">{s.n}</p>
        <div>
          <h2 className="t-section text-ink">{s.title}</h2>
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

  const stages = [
    { label: "served.", text: "A paper cup with a PHA lining. Holds a hot coffee like any other.", src: "/breakdown/1.jpg", alt: "A new paper cup standing on compost" },
    { label: "torn and buried.", text: "Into the pile with the grounds and the food scraps. Smaller pieces go faster.", src: "/breakdown/2.jpg", alt: "The cup slumped and stained in the pile" },
    { label: "softening.", text: "Moisture, warmth and the same microbes that made the lining take it apart.", src: "/breakdown/3.jpg", alt: "The cup collapsed to its marked base" },
    { label: "gone.", text: "Nothing left to pick out. No film, no flakes, no microplastics.", src: "/breakdown/4.jpg", alt: "Dark compost where the cup was" },
  ];

  const places: [string, string][] = [
    ["home compost pile.", "What the certificate tests. Turn the pile as usual."],
    ["worm bin or garden.", "Same material, same microbes."],
    ["industrial facility.", "Anything that composts cold composts hot."],
  ];

  const stats: [number, string][] = [
    [87, "would pay more for no microplastics"],
    [90, "would pay more for home compostable"],
    [98, "would pay more for both"],
  ];

  return (
    <div className="mx-auto max-w-7xl px-4">
      <SectionRail items={SECTIONS.map((s) => ({ ...s }))} />

      {/* hero: the headline, then the lineup full width, then three facts on a hairline. */}
      <section className="pt-10 md:pt-16">
        <div className="grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-end md:gap-16">
          <div>
            <p className="t-label">{restock ? stockSentence(categories).replace(/\.$/, "").toLowerCase() : "hot cups and lids, in stock"}</p>
            <h1 className="t-hero mt-4 text-ink">
              serve it.
              <br />
              then let it go.
            </h1>
          </div>
          <div className="md:pb-2">
            <p className="t-lead max-w-[40ch] text-ink">Hot cups and lids made from 100% certified home-compostable material. The mark on the base is the whole promise: it goes in the garden pile with the grounds.</p>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link href="/products/cups" className="btn btn-primary">
                order cups
              </Link>
              <Link href="/business" className="link text-[15px] font-medium text-ink">
                wholesale pricing
              </Link>
            </div>
          </div>
        </div>
        <div className="relative mt-10 aspect-[16/9] overflow-hidden bg-card md:mt-14">
          <Image src="/hero-bone.jpg" alt="The three cup sizes and the lid on a bone backdrop, a fourth cup on its side showing the made to disappear mark on its base" fill priority fetchPriority="high" sizes="(min-width: 1120px) 1064px, 100vw" className="object-cover" />
        </div>
        <dl className="mt-6 grid border-y border-line text-[14px] sm:grid-cols-3">
          {[
            ["certified", `${site.certifier}, home compostable`],
            ["lining", "PHA. No plastic film, no microplastics"],
            ["heard on", `${press.outlet}, ${press.show}`],
          ].map(([k, v], i) => (
            <div key={k} className={`py-3 ${i > 0 ? "border-t border-line sm:border-t-0 sm:border-l sm:pl-6" : ""}`}>
              <dt className="t-label">{k}</dt>
              <dd className="mt-1 text-ink">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* 01 the range */}
      <Section id="range" intro="Three hot cups and the one lid that fits all of them. Packs for the house, cases for the business." className="mt-16 md:mt-24">
        <div className="grid grid-cols-2 border-l border-t border-line md:grid-cols-4">
          {range.map(({ p, use }) => (
            <Link key={p.sku} href={`/products/${p.categorySlug}/${p.sku.toLowerCase()}`} className="group border-b border-r border-line bg-card transition-colors hover:bg-[#f9f6f0]">
              <HoverSwap front={p.photo ?? "/products/MTD-CUP-12H-front.jpg"} hover={p.hover} alt={p.name} sizes="(min-width: 768px) 25vw, 50vw" />
              <div className="p-4 md:p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1">
                  <h3 className="t-card text-ink">{p.name.toLowerCase()}</h3>
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
      <Section id="material" intro="Every paper cup has a lining. Ours is PHA, a material microbes make and microbes eat, so the whole cup is certified to break down in a home compost pile.">
        <div className="grid gap-10 md:grid-cols-[1.25fr_1fr] md:items-center md:gap-16">
          <div className="relative aspect-[16/10] overflow-hidden bg-card">
            <Image src="/soil-mark.jpg" alt="A paper hot cup half-sunk in dark compost, softened and browning, the made to disappear mark still legible on its base" fill sizes="(min-width: 768px) 55vw, 100vw" className="object-cover" />
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
      <Section id="after" intro="Serve it. Compost it. Done. Drag across the photo, or pick a stage. An illustration of the sequence, not a timed photograph: how fast it goes depends on the pile.">
        <BreakdownScrubber stages={stages} />
        <div className="mt-12 grid border-t border-line md:grid-cols-3">
          {places.map(([h, t]) => (
            <div key={h} className="border-b border-line py-4 md:border-b-0 md:border-r md:pr-6 md:last:border-r-0 md:[&:not(:first-child)]:pl-6">
              <h3 className="text-[16px] font-medium text-ink">{h}</h3>
              <p className="mt-1 text-[14px] text-stone">{t}</p>
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
      <Section id="cost" intro="One case price for everyone, whether you order one case or fifty. Put in your numbers.">
        <CostCalculator cups={cups} lid={lid} />
      </Section>

      {/* 05 the inner harbour */}
      <Section id="harbour" intro="Before we ordered a single case we spent a few days on the Inner Harbour with a clipboard and a cooler of freezies, asking 167 coffee drinkers one question.">
        <div className="grid gap-10 md:grid-cols-[1fr_1.1fr] md:items-center md:gap-16">
          <div>
            <p className="text-[17px] leading-[1.5] text-ink">Would you pay 15¢ more per coffee for a cup with no microplastics that composts at home? 163 said yes.</p>
            <dl className="hairline mt-6 border-y border-line">
              {stats.map(([n, label]) => (
                <div key={label} className="flex items-baseline gap-6 py-3">
                  <dd className="w-[4ch] text-[36px] font-bold leading-none tracking-[-0.03em] text-ink tnum">
                    <CountUp value={n} suffix="%" />
                  </dd>
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
          <figure>
            <div className="relative aspect-[4/3] overflow-hidden bg-card">
              <Image src="/inner-harbour.jpg" alt="The founders on the Inner Harbour causeway in Victoria, asking passers-by four questions with a cooler of freezies and a hand-drawn sign" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" style={{ filter: "grayscale(1) contrast(1.05)" }} />
            </div>
            <figcaption className="mt-3 text-[13px] text-stone">Inner Harbour, {site.city}. 167 coffee drinkers, summer 2026.</figcaption>
          </figure>
        </div>
      </Section>

      {/* 06 asked often */}
      <Section id="faq" intro="The questions cafés ask before the first case, answered in a sentence or two." className="pb-24">
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
