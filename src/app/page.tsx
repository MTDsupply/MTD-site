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

export const metadata = pageMeta({
  title: `${site.name} · Home-compostable coffee cups and lids`,
  description: SITE_DESCRIPTION,
  path: "/",
  image: "/hero-green.jpg",
  imageAlt: "A barista setting a lidded paper cup on a dark green café counter",
});

/*
 * Home page on the Nothing cup site's skeleton, in the brand card's palette
 * and type: a full-bleed photograph hero with the headline at the bottom left
 * and one button, a press row under a hairline, two photo category cards with
 * the text on the photograph, a full-width soil band with a centred
 * statement, the range as photo cards, the breakdown scrubber, the survey
 * columns on hairlines, the calculator and a hairline FAQ. Every section
 * heading sits left with one action at the right.
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
  const fromCup = cups.length ? Math.min(...cups.map((p) => p.unitPrice)) : null;
  const range = [...cups, ...(lid ? [lid] : [])];

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
    { title: "hot cups.", sub: "8, 12 and 16 oz. All three are the same paper and the same lining.", chips: ["home compostable", "no microplastics", "PHA lined"], img: "/products/shared-trio.jpg", alt: "The 8, 12 and 16 oz cups side by side", href: "/products/cups", cta: "shop cups" },
    { title: "lids.", sub: "One lid fits all three cups. Same material, same certificate.", chips: ["fits 8, 12 and 16 oz", "home compostable"], img: "/products/shared-lid-on.jpg", alt: "The 12 oz cup wearing the lid", href: "/products/lids", cta: "shop lids" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4">
      {/* hero: one full-bleed photograph, the headline at the bottom left, one button. */}
      <section className="bleed hero-photo on-photo relative overflow-hidden bg-[#0b1a14] md:min-h-[720px]">
        {/* Phones stack the photo over a dark green panel so the headline never crosses the cup; from md the text sits on the photograph. */}
        <div className="relative aspect-[4/5] md:absolute md:inset-0 md:aspect-auto">
          <Image src={v("/hero-green.jpg")} alt="A barista setting a lidded paper cup on a dark green café counter" fill priority fetchPriority="high" sizes="100vw" className="object-cover object-[76%_50%] md:object-[72%_50%]" />
        </div>
        <div className="hero-in relative px-4 pb-10 pt-7 md:absolute md:inset-x-0 md:bottom-0 md:pb-16 md:pl-[max(16px,calc((100vw-1120px)/2+28px))] md:pt-0">
          <h1 className="t-hero max-w-[13ch] text-bone">a hot cup you can compost at home.</h1>
          <p className="t-lead mt-5 max-w-[38ch] text-bone/85">Paper with a PHA lining. 100% certified home-compostable material, certified by TÜV Austria.</p>
          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link href="/products/cups" className="btn btn-bone btn-lg">
              order cups
            </Link>
            {fromCup != null ? <p className="text-[14px] text-bone/75 tnum">from {unitMoney(fromCup)} a cup by the case</p> : null}
          </div>
        </div>
      </section>

      {/* press row: a label on a hairline, then the one credit we have. */}
      <section className="mt-10 md:mt-14">
        <p className="t-label border-b border-line pb-3">as heard on</p>
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3 py-6 md:py-8">
          <p className="flex items-center gap-2.5 text-[17px] text-ink md:text-[19px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={press.logo} alt="" width="26" height="26" className="h-[26px] w-[26px] shrink-0" />
            <span className="font-medium">{press.outlet}</span>
          </p>
          <p className="text-[15px] text-stone md:text-[16px]">
            {press.show} with {press.host}
          </p>
        </div>
      </section>

      {/* two category cards: the photograph is the card, the text sits on it. */}
      <RevealGroup className="mt-2 grid gap-4 md:grid-cols-2" itemClassName="h-full" step={0.1}>
        {cards.map((c) => (
          <article key={c.title} className="on-photo relative aspect-[4/5] overflow-hidden bg-[#0b1a14] md:aspect-square">
            <Link href={c.href} aria-label={c.cta} className="zoom-on-hover absolute inset-0 block">
              <Image src={v(c.img)} alt={c.alt} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
            </Link>
            <div className="pointer-events-none absolute inset-x-0 top-0 p-6 md:p-8">
              <h2 className="t-page text-bone">{c.title}</h2>
              <p className="mt-2 max-w-[38ch] text-[15px] text-bone/85 md:text-[16px]">{c.sub}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {c.chips.map((ch) => (
                  <span key={ch} className="chip chip-shot">
                    {ch}
                  </span>
                ))}
              </div>
            </div>
            <div className="absolute bottom-0 left-0 p-6 md:p-8">
              <Link href={c.href} className="btn btn-bone">
                {c.cta}
              </Link>
            </div>
          </article>
        ))}
      </RevealGroup>

      {/* statement band: the compost, full width, one sentence in the middle. */}
      <Reveal as="section" className="on-photo relative mt-4 min-h-[480px] overflow-hidden bg-[#0b1a14] md:min-h-[620px]">
        <Image src={v("/breakdown/4.jpg")} alt="" fill sizes="(min-width: 1120px) 1120px, 100vw" className="object-cover" />
        <div className="photo-shade absolute inset-0" />
        <div className="relative flex min-h-[480px] flex-col items-center justify-center px-6 py-16 text-center md:min-h-[620px]">
          <p className="t-label !text-bone/70">the lining</p>
          <h2 className="t-section mt-3 max-w-[22ch] text-bone">why ours composts and most don&rsquo;t.</h2>
          <p className="t-lead mt-5 max-w-[52ch] text-bone/85">Every paper cup has a thin lining so it holds liquid. In most cups that lining is plastic, which is why they never really break down. Ours is PHA. Bacteria makes it, and bacteria eats it, so the cup goes in the compost pile with the grounds and disappears.</p>
          <p className="mt-7">
            <Link href="/whats-in-your-cup" className="btn btn-bone">
              what&rsquo;s in your cup
            </Link>
          </p>
        </div>
      </Reveal>

      {/* the range */}
      <section className="mt-16 md:mt-24">
        <Reveal>
          <SectionHead
            title="the range."
            action={
              <Link href="/products" className="btn btn-outline">
                shop all
              </Link>
            }
          />
        </Reveal>
        <RevealGroup className="mt-8 grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4" itemClassName="h-full" step={0.08}>
          {range.map((p) => (
            <ProductCard key={p.sku} product={p} />
          ))}
        </RevealGroup>
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

      {/* the survey, in hairline columns */}
      <section className="mt-16 md:mt-24">
        <Reveal>
          <SectionHead title="we asked 167 people first." intro="Before we ordered our first case, we stood on the Inner Harbour with a clipboard and asked one question: would you pay 15¢ more for your coffee if the cup had no microplastics and could go in your compost?" />
        </Reveal>
        <Reveal className="mt-8 grid border-y border-line md:grid-cols-3">
          {stats.map(([n, label], i) => (
            <div key={label} className={`py-8 ${i > 0 ? "border-t border-line md:border-t-0 md:border-l md:pl-8" : ""}`}>
              <p className="text-[64px] font-bold leading-none tracking-[-0.04em] text-ink tnum md:text-[72px]">
                <CountUp value={n} suffix="%" />
              </p>
              <p className="mt-3 max-w-[22ch] text-[15px] text-stone">{label}</p>
            </div>
          ))}
        </Reveal>
        <p className="mt-5 text-[15px] text-stone">
          <Link href="/about" className="link text-ink">
            our story
          </Link>
        </p>
      </section>

      {/* what it costs */}
      <section className="mt-16 md:mt-24">
        <Reveal>
          <SectionHead
            title="what it costs."
            intro="Case prices, with a lower price on every case of cups once an order reaches 10,000 cups. Put in roughly how many cups you go through a month and see what it costs."
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
                <span aria-hidden="true" className="text-[22px] leading-none text-stone transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 max-w-[70ch] text-[15px] leading-[1.55] text-stone">{a}</p>
            </details>
          ))}
        </Reveal>
        <p className="mt-6 text-[15px] text-stone">
          More questions?{" "}
          <Link href="/contact" className="link text-ink">
            write to us
          </Link>
          . More detail, with sources, in{" "}
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
