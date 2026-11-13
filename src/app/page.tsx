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
import { Reveal, RevealGroup } from "@/components/Reveal";
import { v } from "@/lib/asset-version";
import { taglines } from "@/lib/copy";

export const metadata = pageMeta({
  title: `${site.name} · Home-compostable coffee cups and lids`,
  description: SITE_DESCRIPTION,
  path: "/",
  image: "/hero-bone.jpg",
  imageAlt: "The three cup sizes and the lid on a bone backdrop, a fourth cup on its side showing the made to disappear mark on its base",
});

/*
 * Home page: the brand card's palette and type (bone, paper, ink, one soil
 * band, Helvetica, lowercase headings with a period) on the skeleton of
 * the Nothing cup site and Bloom Energy. Full-bleed hero with the headline at the
 * left and the lineup at the right, a trust strip, two big split cards, a
 * full-width statement band on the soil photo, a stat band, product tiles
 * with a from-price, the calculator and a hairline FAQ. Every section spans
 * the full content width; section headings sit left with one action at right.
 */

function SectionHead({ title, intro, action }: { title: string; intro?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
      <div>
        <h2 className="t-section text-ink">{title}</h2>
        {intro ? <p className="t-lead mt-3 max-w-[58ch] text-stone">{intro}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
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
  const fromCup = cups.length ? Math.min(...cups.map((p) => p.unitPrice)) : null;

  const range = [
    ...cups.map((p) => ({ p, use: taglines[p.sku] ?? "" })),
    ...(lid ? [{ p: lid, use: taglines[lid.sku] ?? "" }] : []),
  ];

  const stages = [
    { label: "served.", text: "A paper cup with a PHA lining. Holds a hot coffee like any other.", src: v("/breakdown/1.jpg"), alt: "A new paper cup standing on compost" },
    { label: "torn and buried.", text: "Into the pile with the grounds and the food scraps. Smaller pieces go faster.", src: v("/breakdown/2.jpg"), alt: "The cup slumped and stained in the pile" },
    { label: "softening.", text: "Moisture, warmth and the same microbes that made the lining take it apart.", src: v("/breakdown/3.jpg"), alt: "The cup collapsed to its marked base" },
    { label: "gone.", text: "Nothing left to pick out. No film, no flakes, no microplastics.", src: v("/breakdown/4.jpg"), alt: "Dark compost where the cup was" },
  ];

  const stats: [number, string][] = [
    [98, "would pay 15¢ more for a cup that does both"],
    [90, "would pay more for home compostable"],
    [87, "would pay more for no microplastics"],
  ];

  const trust: { k: string; v: string; logo?: string }[] = [
    { k: "heard on", v: `${press.outlet}, ${press.show}`, logo: press.logo },
    { k: "certified by", v: `${site.certifier}, home compostable` },
    { k: "lining", v: "PHA. No plastic film, no microplastics" },
    { k: "ships from", v: `${site.city}, ${site.province}` },
  ];

  const cards = [
    { title: "hot cups.", sub: "8, 12 and 16 oz. One lining, one certificate, three sizes.", chips: ["home compostable", "no microplastics", "PHA lined"], img: "/card-cups.jpg", alt: "The three cup sizes with one cup on its side showing the mark on its base", href: "/products/cups", cta: "shop cups", primary: true },
    { title: "lids.", sub: "One lid that fits all three cups, from the same certified material.", chips: ["fits 8, 12 and 16 oz", "home compostable"], img: "/card-lids.jpg", alt: "A cup wearing the lid, with a second lid lying in front", href: "/products/lids", cta: "shop lids", primary: false },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4">
      {/* hero: the lineup edge to edge, weighted right; the headline over the empty bone at the left. */}
      <section className="bleed relative">
        <div className="hero-photo relative aspect-[4/3] overflow-hidden sm:aspect-[16/10] md:absolute md:inset-0 md:aspect-auto">
          <Image src={v("/hero-wide.jpg")} alt="The three cup sizes and the lid on a bone backdrop, a fourth cup on its side showing the made to disappear mark on its base" fill priority fetchPriority="high" sizes="100vw" className="object-cover object-[72%_center] md:object-[68%_center]" />
        </div>
        <div className="relative mx-auto flex max-w-7xl flex-col justify-center px-4 py-10 md:min-h-[680px] md:py-20 lg:min-h-[760px]">
          <div className="hero-in max-w-[34rem]">
            <p className="t-label">{restock ? stockSentence(categories).replace(/\.$/, "").toLowerCase() : "hot cups and lids, in stock"}</p>
            <h1 className="t-hero mt-4 text-ink md:!text-[clamp(44px,4.6vw,68px)]">
              serve it.
              <br />
              then let it go.
            </h1>
            <p className="t-lead mt-6 max-w-[36ch] text-ink">Hot cups and lids made from 100% certified home-compostable material. The mark on the base is the whole promise: it goes in the garden pile with the grounds.</p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link href="/products/cups" className="btn btn-primary btn-lg">
                order cups
              </Link>
              <Link href="/business" className="link text-[15px] font-medium text-ink">
                wholesale pricing
              </Link>
            </div>
            {fromCup != null ? <p className="mt-8 text-[14px] text-stone tnum">from {unitMoney(fromCup)} a cup by the case · packs of 100 for the house</p> : null}
          </div>
        </div>
      </section>

      {/* trust strip */}
      <section className="grid border-y border-line sm:grid-cols-2 lg:grid-cols-4">
        {trust.map((t, i) => (
          <div key={t.k} className={`flex items-center gap-4 py-5 ${i % 2 === 1 ? "sm:border-l sm:border-line sm:pl-6" : ""} ${i >= 2 ? "border-t border-line lg:border-t-0" : ""} ${i === 1 || i === 2 || i === 3 ? "border-t border-line sm:border-t-0" : ""} ${i === 2 ? "sm:border-t sm:border-line" : ""} ${i === 3 ? "sm:border-t sm:border-line" : ""} ${i >= 2 ? "lg:border-l lg:border-line lg:pl-6" : ""}`}>
            {t.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={t.logo} alt="" width="28" height="28" className="h-7 w-7 shrink-0" />
            ) : null}
            <div>
              <p className="t-label">{t.k}</p>
              <p className="mt-0.5 text-[15px] text-ink">{t.v}</p>
            </div>
          </div>
        ))}
      </section>

      {/* two split cards */}
      <RevealGroup className="mt-6 grid gap-4 md:grid-cols-2" itemClassName="flex flex-col" step={0.1}>
        {cards.map((c) => (
          <article key={c.title} className="card flex flex-1 flex-col bg-card">
            <div className="p-6 pb-5 md:p-8 md:pb-6">
              <h2 className="t-page text-ink">{c.title}</h2>
              <p className="mt-2 max-w-[40ch] text-[15px] text-ink">{c.sub}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {c.chips.map((ch) => (
                  <span key={ch} className="chip chip-fog">
                    {ch}
                  </span>
                ))}
              </div>
            </div>
            <Link href={c.href} aria-label={c.cta} className="zoom-on-hover relative block aspect-square overflow-hidden">
              <Image src={v(c.img)} alt={c.alt} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
            </Link>
            <div className="p-6 pt-5 md:p-8 md:pt-6">
              <Link href={c.href} className={`btn ${c.primary ? "btn-primary" : "btn-outline"}`}>
                {c.cta}
              </Link>
            </div>
          </article>
        ))}
      </RevealGroup>

      {/* statement band: the one soil panel, beside the soil photo. */}
      <section className="bleed mt-16 grid md:mt-24 md:grid-cols-[1fr_1.3fr]">
        <Reveal className="flex flex-col justify-center bg-soil-band px-4 py-14 md:py-20 md:pl-[max(16px,calc((100vw-1120px)/2+28px))] md:pr-12">
          <p className="t-label !text-bone/60">the material</p>
          <h2 className="t-section mt-3 text-bone">paper outside. PHA inside.</h2>
          <p className="t-lead mt-4 max-w-[36ch] text-bone/85">Every paper cup has a lining. Ours is PHA, a material microbes make and microbes eat, so the whole cup is certified to break down in a home compost pile. Nothing left behind.</p>
          <p className="mt-6">
            <Link href="/whats-in-your-cup" className="link text-[15px] font-medium text-bone">
              what&rsquo;s in your cup
            </Link>
          </p>
        </Reveal>
        <div className="drift relative aspect-[4/3] overflow-hidden md:aspect-auto md:min-h-[560px]">
          <Image src={v("/soil-mark.jpg")} alt="A paper hot cup half-sunk in dark compost, softened and browning, the made to disappear mark still legible on its base" fill sizes="(min-width: 768px) 57vw, 100vw" className="object-cover" />
        </div>
      </section>

      {/* after the coffee */}
      <section className="mt-16 md:mt-24">
        <Reveal>
        <SectionHead
          title="after the coffee."
          intro="Serve it. Compost it. Done. Drag across the photo or pick a stage. An illustration of the sequence, not a timed photograph: how fast it goes depends on the pile."
          action={
            <Link href="/compost" className="btn btn-outline">
              how to compost it
            </Link>
          }
        />
        </Reveal>
        <div className="mt-10">
          <BreakdownScrubber stages={stages} />
        </div>
      </section>

      {/* stat band */}
      <Reveal as="section" className="mt-16 border-y border-line md:mt-24">
        <div className="grid md:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div className="py-8 md:pr-10">
            <p className="t-label">the Inner Harbour, {site.city}</p>
            <p className="mt-3 text-[17px] leading-[1.5] text-ink">Before we ordered a single case we asked 167 coffee drinkers one question: would you pay 15¢ more for a cup with no microplastics that composts at home?</p>
            <p className="mt-4">
              <Link href="/about" className="link text-[15px] font-medium text-ink">
                our story
              </Link>
            </p>
          </div>
          {stats.map(([n, label]) => (
            <div key={label} className="border-t border-line py-8 md:border-t-0 md:border-l md:pl-8">
              <p className="text-[64px] font-bold leading-none tracking-[-0.04em] text-ink tnum md:text-[72px]">
                <CountUp value={n} suffix="%" />
              </p>
              <p className="mt-3 max-w-[22ch] text-[15px] text-stone">{label}</p>
            </div>
          ))}
        </div>
      </Reveal>

      {/* the range */}
      <section className="mt-16 md:mt-24">
        <Reveal>
        <SectionHead
          title="the range."
          intro="Three hot cups and the one lid that fits all of them. Packs of 100 for the house, cases of 1,000 for the business."
          action={
            <Link href="/products" className="btn btn-outline">
              shop all
            </Link>
          }
        />
        </Reveal>
        <RevealGroup className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4" itemClassName="flex flex-col" step={0.08}>
          {range.map(({ p, use }) => (
            <article key={p.sku} className="card flex flex-1 flex-col">
              <Link href={`/products/${p.categorySlug}/${p.sku.toLowerCase()}`} aria-label={p.name} className="block">
                <HoverSwap front={p.photo ?? "/products/MTD-CUP-12H-front.jpg"} hover={p.hover} alt={p.name} sizes="(min-width: 1024px) 25vw, 50vw" />
              </Link>
              <div className="flex flex-1 flex-col p-4 md:p-5">
                <h3 className="t-card text-ink">{p.name.toLowerCase()}</h3>
                <p className="mt-1 text-[14px] text-stone">{use}</p>
                <p className="mt-4 text-[15px] text-ink tnum">
                  from {unitMoney(p.unitPrice)} each
                  <span className="block text-[13px] text-stone">
                    {money(p.packPrice)} per {p.packCount} · {money(p.casePrice)} per {count(p.caseCount)}
                  </span>
                </p>
                <p className="mt-1 text-[13px] text-stone">{restockNoteLower(p.restockWhen) ?? "in stock"}</p>
                <div className="mt-auto pt-5">
                  <Link href={`/products/${p.categorySlug}/${p.sku.toLowerCase()}`} className="btn btn-outline btn-sm">
                    order
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </RevealGroup>
      </section>

      {/* what it costs */}
      <section className="mt-16 md:mt-24">
        <Reveal>
        <SectionHead
          title="what it costs."
          intro="One case price for everyone, whether you order one case or fifty. Put in your numbers."
          action={
            <a href="/price-list.pdf" className="btn btn-outline">
              price list (<span className="keep-case">PDF</span>)
            </a>
          }
        />
        </Reveal>
        <div className="mt-10">
          <CostCalculator cups={cups} lid={lid} />
        </div>
      </section>

      {/* asked often */}
      <section className="mt-16 pb-8 md:mt-24">
        <Reveal>
        <SectionHead title="asked often." intro="The questions cafés ask before the first case, answered in a sentence or two." />
        </Reveal>
        <Reveal className="hairline mt-8 border-y border-line">
          {faq.map(([q, a]) => (
            <details key={q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[18px] font-medium text-ink">
                <h3 className="text-[18px] font-medium">{q}</h3>
                <span aria-hidden="true" className="text-[22px] leading-none text-stone transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 max-w-[70ch] text-[15px] leading-[1.55] text-stone">{a}</p>
            </details>
          ))}
        </Reveal>
        <p className="mt-6 text-[15px] text-stone">
          More questions?{" "}
          <Link href="/learn" className="link text-ink">
            the explainers
          </Link>{" "}
          have the sources.
        </p>
      </section>
      <JsonLd data={faqLd(faq)} />
    </div>
  );
}
