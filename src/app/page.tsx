import Link from "next/link";
import Image from "next/image";
import { getCatalog } from "@/lib/catalog/queries";
import { site } from "@/lib/site";
import { CostCalculator } from "@/components/CostCalculator";
import { PRESS } from "@/components/PressBand";
import { unitMoney } from "@/lib/format";
import { pageMeta, faqLd, SITE_DESCRIPTION } from "@/lib/seo";
import { homeFaq } from "@/lib/faq";
import { JsonLd } from "@/components/JsonLd";
import { ProductCard } from "@/components/ProductCard";
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
    { label: "new.", text: "A paper cup with a PHA lining. It works like any other hot cup.", src: v("/breakdown/1.jpg"), alt: "A new paper cup standing on compost" },
    { label: "in the pile.", text: "Tear it up and bury it with the food scraps. Smaller pieces go faster.", src: v("/breakdown/2.jpg"), alt: "The cup slumped and stained in the pile" },
    { label: "breaking down.", text: "Heat, moisture and the same bacteria that made the lining take it apart.", src: v("/breakdown/3.jpg"), alt: "The cup collapsed to its marked base" },
    { label: "gone.", text: "Nothing to pick out afterwards. No film, no flakes, no microplastics.", src: v("/breakdown/4.jpg"), alt: "Dark compost where the cup was" },
  ];

  const stats: [number, string][] = [
    [98, "said yes when the cup did both"],
    [90, "said yes for a cup that composts at home"],
    [87, "said yes for a cup with no microplastics"],
  ];

  const cards = [
    { title: "hot cups.", sub: "8, 12 and 16 oz. All three are the same paper and the same lining.", chips: ["home compostable", "no microplastics", "PHA lined"], img: "/products/shared-trio.jpg", alt: "The 8, 12 and 16 oz cups side by side", href: "/products/cups", cta: "shop cups", primary: true },
    { title: "lids.", sub: "One lid fits all three cups. Same material, same certificate.", chips: ["fits 8, 12 and 16 oz", "home compostable"], img: "/products/MTD-LID-HOT-alt.jpg", alt: "The 12 oz cup wearing the lid", href: "/products/lids", cta: "shop lids", primary: false },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4">
      {/* hero: the headline in its own column, the lineup in the other. The lineup is a cut-out (PNG with alpha, shadows kept), so the cups stand on the page itself with no photo plate. */}
      <section className="bleed grid md:min-h-[680px] md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:min-h-[760px]">
        <div className="hero-in order-2 flex flex-col justify-center px-4 py-10 md:order-1 md:py-16 md:pl-[max(16px,calc((100vw-1120px)/2+28px))] md:pr-10">
          <p className="t-label">hot cups and lids · {site.city}, {site.province}</p>
          <h1 className="t-hero mt-4 text-ink md:!text-[clamp(40px,4.1vw,60px)]">
            a hot cup you can
            <br />
            compost at home.
          </h1>
          <p className="t-lead mt-6 max-w-[36ch] text-ink">Our cups and lids are paper with a PHA lining, made from 100% certified home-compostable material, certified by TÜV Austria. When you are done, the whole thing goes in the compost with the grounds.</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link href="/products/cups" className="btn btn-primary btn-lg">
              order cups
            </Link>
            <Link href="/business" className="link text-[15px] font-medium text-ink">
              wholesale pricing
            </Link>
          </div>
          {fromCup != null ? <p className="mt-8 text-[14px] text-stone tnum">from {unitMoney(fromCup)} a cup by the case · packs of 100 for home</p> : null}
        </div>
        <div className="hero-photo relative order-1 aspect-[8/5] overflow-hidden md:order-2 md:aspect-auto md:min-h-[680px] lg:min-h-[760px] md:pr-[max(16px,calc((100vw-1120px)/2))]">
          <Image src={v("/hero-lineup.png")} alt="The three cup sizes and the lid, with a fourth cup on its side showing the made to disappear mark on its base" fill priority fetchPriority="high" sizes="(min-width: 768px) 50vw, 100vw" className="object-contain" />
        </div>
      </section>

      {/* press band: the CBC segment, on its own. */}
      <section className="border-y border-line py-5 md:py-6">
        <div className="flex flex-col items-center gap-y-2 text-center sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-4">
          <p className="t-label">as heard on</p>
          <p className="flex flex-col items-center gap-1 text-[16px] text-ink sm:flex-row sm:gap-2.5 md:text-[17px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={press.logo} alt="" width="22" height="22" className="h-[22px] w-[22px] shrink-0" />
            <span className="font-medium">{press.outlet}</span>
            <span className="hidden text-stone sm:inline">·</span>
            <span className="text-stone sm:text-ink">
              {press.show} with {press.host}
            </span>
          </p>
        </div>
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
          <p className="t-label !text-bone/60">the lining</p>
          <h2 className="t-section mt-3 text-bone">why ours composts and most don&rsquo;t.</h2>
          <p className="t-lead mt-4 max-w-[36ch] text-bone/85">Every paper cup has a thin lining so it holds liquid. In most cups that lining is plastic, which is why they never really break down. Ours is PHA. Bacteria make it, and bacteria eat it, so the cup goes in the compost pile and disappears.</p>
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
          title="what happens after."
          intro="Drag across the photo to see the sequence. It is an illustration, not a timed test. How fast a cup breaks down depends on your pile."
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
            <p className="mt-3 text-[17px] leading-[1.5] text-ink">Before we ordered our first case, we stood on the Inner Harbour with a clipboard and asked 167 people one question: would you pay 15¢ more for your coffee if the cup had no microplastics and could go in your compost?</p>
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
          intro="Three cups and one lid. Packs of 100 if you are buying for home, cases of 1,000 if you are buying for a café."
          action={
            <Link href="/products" className="btn btn-outline">
              shop all
            </Link>
          }
        />
        </Reveal>
        <RevealGroup className="mt-10 grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4" itemClassName="h-full" step={0.08}>
          {range.map(({ p }) => (
            <ProductCard key={p.sku} product={p} />
          ))}
        </RevealGroup>
      </section>

      {/* what it costs */}
      <section className="mt-16 md:mt-24">
        <Reveal>
        <SectionHead
          title="what it costs."
          intro="One price whether you buy one case or fifty. Put in roughly how many cups you go through and see what a month costs."
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
        <SectionHead title="questions we get asked." intro="Mostly from café owners before their first order." />
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
          More detail, with sources, in{" "}
          <Link href="/learn" className="link text-ink">
            the explainers
          </Link>
          .
        </p>
      </section>
      <JsonLd data={faqLd(faq)} />
    </div>
  );
}
