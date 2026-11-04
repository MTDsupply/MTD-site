import Link from "next/link";
import Image from "next/image";
import { existsSync } from "node:fs";
import path from "node:path";
import { getCatalog } from "@/lib/catalog/queries";
import { site, restockNote, restockNoteLower } from "@/lib/site";
import { claims } from "@/lib/copy";
import { ProductCard } from "@/components/ProductCard";
import { ComingSoonTile } from "@/components/ComingSoonTile";
import { Reveal, RevealGroup } from "@/components/Reveal";
import { HeroVideo } from "@/components/scene/HeroVideo";
import { NotifyForm } from "@/components/NotifyForm";
import { Marquee } from "@/components/Marquee";
import { PRESS } from "@/components/PressBand";
import { money, unitMoney, count } from "@/lib/format";
import { BULK_MIN_UNITS } from "@/lib/pricing";
import { pageMeta, faqLd, SITE_DESCRIPTION } from "@/lib/seo";
import { homeFaq } from "@/lib/faq";
import { JsonLd } from "@/components/JsonLd";

export const metadata = pageMeta({
  title: `${site.name} · Home-compostable coffee cups and lids`,
  description: SITE_DESCRIPTION,
  path: "/",
});

/** Drop `public/hero.mp4` (and optionally `public/film-poster.jpg`) and the film section picks them up. */
function filmMedia() {
  const pub = path.join(process.cwd(), "public");
  const video = existsSync(path.join(pub, "hero.mp4")) ? "/hero.mp4" : "/atmosphere/peaks.mp4";
  const poster = existsSync(path.join(pub, "film-poster.jpg"))
    ? "/film-poster.jpg"
    : existsSync(path.join(pub, "hero-poster.jpg"))
      ? "/hero-poster.jpg"
      : "/atmosphere/peaks.jpg";
  const mobileVideo = existsSync(path.join(pub, "hero-mobile.mp4")) ? "/hero-mobile.mp4" : undefined;
  return { video, poster, mobileVideo };
}

/** Outline icon in a forest circle, Bloom-style. */
function Circle({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-[2.5px] border-forest text-forest">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {children}
      </svg>
    </span>
  );
}

export default async function HomePage() {
  const catalog = await getCatalog();
  const { categories, products, certs } = catalog;
  const faq = homeFaq(catalog);
  const { video, poster, mobileVideo } = filmMedia();
  const sorted = [...categories].sort((a, b) => a.sortOrder - b.sortOrder);
  const certById = new Map(certs.map((c) => [c.id, c]));
  const catBySlug = new Map(categories.map((c) => [c.slug, c]));
  const live = products
    .filter((p) => p.status === "live" && catBySlug.get(p.categorySlug)?.status === "live")
    .sort((a, b) => (catBySlug.get(a.categorySlug)?.sortOrder ?? 9) - (catBySlug.get(b.categorySlug)?.sortOrder ?? 9) || a.sortOrder - b.sortOrder);
  const leadFor = (slug: string) => products.filter((p) => p.categorySlug === slug).sort((a, b) => a.sortOrder - b.sortOrder)[0];
  const cup16 = products.find((p) => p.sku === "MTD-CUP-16H");
  const lid = leadFor("lids");
  const cheapestCupPack = products.filter((p) => p.categorySlug === "cups").sort((a, b) => a.packPrice - b.packPrice)[0];
  const press = PRESS[0];
  const restock = restockNote("cups");

  const tiles = [
    { name: "Hot cups", sub: "8, 12 and 16 oz", href: "/products/cups", photo: cup16?.photo ?? null, bg: "bg-mint", cover: false },
    { name: "Lids", sub: "One lid fits all three", href: "/products/lids", photo: lid?.photo ?? null, bg: "bg-peach", cover: false },
    { name: "For the café", sub: "Cases, net-30, volume pricing", href: "/business", photo: "/hero-banner-peach.jpg", bg: "bg-peach-light", cover: true },
    { name: "Custom printing", sub: "Your logo, from 100 cases", href: "/custom-printing", photo: cup16?.photo ?? null, bg: "bg-butter", cover: false },
  ];

  const facts: [React.ReactNode, string, string][] = [
    [<path key="a" d="m5 12 5 5 9-10" />, `Certified by ${site.certifier}`, "Per SKU, not per range"],
    [<path key="b" d="M12 3c4 4 6 7 6 10a6 6 0 0 1-12 0c0-3 2-6 6-10z" />, "No microplastics", "PHA lining made by fermentation"],
    [
      <g key="c">
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M3 11h18M9 7v4" />
      </g>,
      "Packs or cases",
      "100, 200, 500 or 1,000",
    ],
    [
      <g key="d">
        <path d="M3 13h13l3-5h2v9H3z" />
        <circle cx="7" cy="18" r="1.5" />
        <circle cx="17" cy="18" r="1.5" />
      </g>,
      "Canada and the US",
      "By courier, shown before you pay",
    ],
  ];

  const heroAlt = "Three sizes of white paper hot cup and a lid on a mint backdrop, with a latte splash, coffee beans and a fern";

  return (
    <div>
      {/* 1. Hero: the cups on a mint backdrop, copy in the clear right half. */}
      <section className="relative isolate overflow-hidden bg-[#b9e2b4] text-forest">
        <div className="relative aspect-[4/3] w-full sm:aspect-[16/10] md:hidden">
          <Image src="/hero-banner.jpg" alt={heroAlt} fill priority sizes="100vw" className="object-cover object-left" />
        </div>
        <div className="relative md:aspect-[2688/1520] md:max-h-[720px] md:min-h-[540px] md:w-full">
          <Image src="/hero-banner.jpg" alt={heroAlt} fill priority sizes="100vw" className="hidden object-cover object-left md:block" />
          <div className="relative mx-auto flex h-full max-w-7xl px-4 md:justify-end">
            <div className="w-full py-10 md:flex md:w-[46%] md:flex-col md:justify-center md:py-12 md:pl-6 lg:pl-10">
              <Reveal>
                <span className="sticker -rotate-3 shadow-[0_8px_20px_-10px_rgba(46,77,52,0.5)]">{restock ? `Cups ${restockNoteLower("cups")}` : "In stock now"}</span>
              </Reveal>
              <Reveal delay={0.08}>
                <h1 className="t-hero mt-5 max-w-[11ch] text-forest">Serve it. Then it disappears.</h1>
              </Reveal>
              <Reveal delay={0.16}>
                <p className="mt-5 max-w-[40ch] text-[17px] leading-7 text-forest/85 md:text-[18px]">
                  Hot cups and lids made from 100% certified home-compostable material. Cases for the café, packs for the house.
                </p>
              </Reveal>
              <Reveal delay={0.24}>
                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <Link href="/products/cups" className="btn btn-primary btn-lg">
                    Shop cups
                  </Link>
                  <Link href="/products/lids" className="btn btn-outline btn-lg">
                    Shop lids
                  </Link>
                </div>
              </Reveal>
              <Reveal delay={0.32}>
                <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2 font-display text-[13px] font-semibold text-forest/80">
                  <li>Certified by {site.certifier}</li>
                  <li>No microplastics</li>
                  <li className="tnum">From {money(cheapestCupPack?.packPrice ?? 0)} per 100</li>
                </ul>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Claims marquee. */}
      <div className="band-forest">
        <Marquee items={["100% certified home-compostable material", `Certified by ${site.certifier}, per SKU`, "No microplastics", "PHA lined, not plastic", "Packs of 100 · cases of 1,000", "Ships across Canada and the US"]} />
      </div>

      {/* 3. Shop: every live SKU. */}
      <section className="mx-auto max-w-7xl px-4 pt-16 md:pt-20">
        <Reveal>
          <h2 className="t-section text-center text-forest">Shop our best sellers</h2>
          <p className="mt-3 text-center text-soil/70">
            {restock ? `Cups ${restockNoteLower("cups")}, lids in stock.` : "Cups and lids in stock."}{" "}
            <Link href="/products" className="link font-medium">
              See the full catalogue
            </Link>
          </p>
        </Reveal>
        <RevealGroup className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5" itemClassName="h-full" step={0.05} base={0.1}>
          {[
            ...live.map((p, i) => <ProductCard key={p.sku} product={p} cert={certById.get(p.certId ?? "")} priority={i < 2} />),
            ...sorted.filter((c) => c.status !== "live").map((c) => <ComingSoonTile key={c.slug} category={c} compact photo={leadFor(c.slug)?.photo ?? null} />),
          ]}
        </RevealGroup>
      </section>

      {/* 4. Why it disappears: mint block with circled facts and the toast photo. */}
      <section className="band-mint mt-16 md:mt-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-[1.05fr_1fr] md:items-center md:gap-14 md:py-20">
          <Reveal>
            <h2 className="t-section text-forest">Certified to disappear.</h2>
            <p className="mt-4 max-w-[48ch] text-[17px] leading-7 text-forest/85">{claims.whyParagraph}</p>
            <ul className="mt-9 grid grid-cols-2 gap-x-6 gap-y-8">
              {facts.map(([icon, title, text]) => (
                <li key={title} className="flex items-center gap-4">
                  <Circle>{icon}</Circle>
                  <div>
                    <p className="font-display text-[16px] font-semibold leading-5 text-forest">{title}</p>
                    <p className="mt-0.5 text-sm text-forest/70">{text}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/compost" className="btn btn-primary">
                How it disappears
              </Link>
              <Link href="/certifications" className="btn btn-outline">
                See every certificate
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.12} y={30}>
            <div className="relative aspect-[4/5] max-h-[640px] overflow-hidden rounded-[24px]">
              <Image src="/lifestyle-toast.jpg" alt="Two hands toasting with lidded paper hot cups, a third cup on a cream block showing the certification mark on its base" fill sizes="(min-width: 768px) 45vw, 100vw" className="object-cover" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* 5. Category tiles. */}
      <section className="mx-auto max-w-7xl px-4 pt-16 md:pt-24">
        <Reveal>
          <h2 className="t-section text-center text-forest">Find your cup.</h2>
        </Reveal>
        <RevealGroup className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5" itemClassName="h-full" step={0.06}>
          {tiles.map((t) => (
            <Link key={t.name} href={t.href} className="card group flex h-full flex-col overflow-hidden">
              <div className={`relative aspect-square overflow-hidden ${t.bg} ${t.cover ? "" : "on-cream"}`}>
                {t.photo ? (
                  <Image
                    src={t.photo}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 25vw, 50vw"
                    className={`${t.cover ? "object-cover object-left" : "object-contain p-4"} transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]`}
                  />
                ) : null}
              </div>
              <div className="px-4 py-4 text-center">
                <p className="font-display text-[18px] font-semibold text-forest">{t.name}</p>
                <p className="mt-0.5 text-sm text-soil/65">{t.sub}</p>
              </div>
            </Link>
          ))}
        </RevealGroup>
      </section>

      {/* 6. The Inner Harbour study: the photo and a peach block. */}
      <section className="mt-16 grid md:mt-24 md:grid-cols-2">
        <div className="relative aspect-[4/3]">
          <Image src="/inner-harbour.jpg" alt="The founders on the Inner Harbour causeway in Victoria, asking passers-by four questions with a cooler of freezies and a hand-drawn sign" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
          <div className="absolute bottom-6 left-6 rounded-[14px] bg-white px-4 py-3 shadow-[0_12px_30px_-16px_rgba(46,77,52,0.4)]">
            <p className="font-display text-[16px] font-semibold text-forest">
              Inner Harbour, <span className="t-serif-italic font-normal">{site.city}</span>
            </p>
            <p className="text-sm text-soil/65">Answer four questions, get a freezie.</p>
          </div>
        </div>
        <div className="band-peach flex items-center">
          <div className="mx-auto max-w-[56ch] px-6 py-14 text-center md:px-12 md:py-20">
            <h2 className="t-section text-forest">We asked {site.city} four questions.</h2>
            <p className="mt-6 text-[17px] leading-7 text-forest/85">
              Before we ordered a single case, we stood on the Inner Harbour causeway with a cooler of freezies and a clipboard. Four quick questions about takeout cups, a freezie as thanks, and a lot of honest answers from locals and visitors.
            </p>
            <p className="mt-4 text-[17px] leading-7 text-forest/85">
              What people told us shaped the cup we make: paper, a lining that is not plastic, and a certificate you can check for yourself.
            </p>
            <Link href="/about" className="btn btn-primary btn-lg mt-8">
              Our story
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Press band. */}
      <section className="band-forest">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-4 px-4 py-7">
          <p className="t-label text-cream/70">As heard on</p>
          <p className="flex flex-wrap items-center gap-3 font-display text-[20px] font-semibold text-cream">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={press.logo} alt="" width={30} height={30} className="h-[30px] w-[30px]" />
            {press.outlet}
            <span className="font-normal text-cream/80">
              ·{" "}
              {press.href ? (
                <Link href={press.href} className="underline">
                  {press.show}
                </Link>
              ) : (
                press.show
              )}{" "}
              with {press.host}
            </span>
          </p>
        </div>
      </section>

      {/* 8. How it disappears + the film. */}
      <section className="bg-cream">
        <div className="mx-auto max-w-7xl px-4 py-16 md:py-24">
          <Reveal>
            <h2 className="t-section text-center text-forest">Serve it. Compost it. Done.</h2>
          </Reveal>
          <RevealGroup className="mx-auto mt-10 grid max-w-5xl gap-6 md:grid-cols-3 md:gap-8" itemClassName="h-full" step={0.08}>
            {[
              ["Serve", "Same cup, same coffee. Hot cups in 8, 12 and 16 oz, and one lid that fits all three."],
              ["Drop it in the home compost", "The PHA lining is made by fermentation, not from plastic, so the whole cup goes in. No sorting, no special bin."],
              ["It breaks down", `Home-compostable material breaks down in a home compost pile at ambient temperature. Certified by ${site.certifier}, per SKU.`],
            ].map(([title, text], i) => (
              <div key={title} className="flex flex-col items-center text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-forest font-display text-[22px] font-bold text-cream tnum">{i + 1}</span>
                <h3 className="t-card mt-5 text-forest">{title}</h3>
                <p className="mt-2 max-w-[34ch] text-sm leading-6 text-soil/70">{text}</p>
              </div>
            ))}
          </RevealGroup>
          <Reveal delay={0.1}>
            <div id="film" className="mx-auto mt-12 max-w-5xl scroll-mt-24 overflow-hidden rounded-[24px] shadow-[0_40px_80px_-48px_rgba(46,77,52,0.55)]" data-tone="dark">
              <HeroVideo poster={poster} video={video} mobileVideo={mobileVideo} />
            </div>
            <p className="mt-6 text-center">
              <Link href="/compost" className="btn btn-outline">
                The full composting guide
              </Link>
            </p>
          </Reveal>
        </div>
      </section>

      {/* 9. Business: forest band with the price table. */}
      <section className="band-forest">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-[1.1fr_1fr] md:items-center md:gap-16 md:py-20">
          <Reveal>
            <p className="t-label text-cream/70">Business accounts</p>
            <h2 className="t-section mt-3 text-cream">Order by the case.</h2>
            <p className="mt-4 max-w-[48ch] text-[17px] leading-7 text-cream/80">
              Cafés, restaurants, hotels, caterers and events. Case pricing on every SKU, a lower volume price from {count(BULK_MIN_UNITS)} units, net-30 on approval and one-click reorders from your account.
            </p>
            <div className="mt-7 overflow-hidden rounded-[18px] bg-white/10">
              <table className="w-full text-sm text-cream">
                <thead>
                  <tr className="font-display text-[12px] font-semibold uppercase tracking-[0.08em] text-cream/70">
                    <th className="px-4 py-3 text-left">Product</th>
                    <th className="px-4 py-3 text-right">Per case</th>
                    <th className="px-4 py-3 text-right">Per unit</th>
                    <th className="px-4 py-3 text-right">{count(BULK_MIN_UNITS)}+ units</th>
                  </tr>
                </thead>
                <tbody className="tnum">
                  {live.map((p) => (
                    <tr key={p.sku} className="border-t border-cream/15">
                      <td className="px-4 py-3">
                        {p.name} <span className="sku text-cream/50">{p.sku}</span>
                      </td>
                      <td className="px-4 py-3 text-right">{money(p.casePrice)}</td>
                      <td className="px-4 py-3 text-right">{unitMoney(p.unitPrice)}</td>
                      <td className="px-4 py-3 text-right font-semibold text-butter">{unitMoney(p.bulkUnitPrice ?? p.unitPrice)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-cream/60">Per unit, CAD before tax. The volume column applies automatically to every case once an order reaches {count(BULK_MIN_UNITS)} units.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/business#quote" className="btn btn-paper btn-lg">
                Open a business account
              </Link>
              <Link href="/quick-order" className="btn btn-lg border-cream/60 text-cream hover:bg-white/10">
                Quick order by SKU
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.12} y={30}>
            <div className="relative aspect-[4/5] max-h-[620px] overflow-hidden rounded-[24px]">
              <Image src="/hero-banner-peach.jpg" alt="Hot cups and a lid on a peach backdrop with a latte pour, a croissant and coffee beans" fill sizes="(min-width: 768px) 45vw, 100vw" className="object-cover object-left" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* 10. Questions. */}
      <section className="mx-auto max-w-3xl px-4 pt-16 md:pt-24">
        <Reveal>
          <h2 className="t-section text-center text-forest">Asked often.</h2>
        </Reveal>
        <RevealGroup className="mt-8 space-y-3" step={0.05}>
          {faq.map(([q, a]) => (
            <details key={q} className="group rounded-[18px] bg-cream px-6 py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-[17px] font-semibold text-forest">
                <h3 className="font-display text-[17px] font-semibold">{q}</h3>
                <span aria-hidden="true" className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-forest text-cream transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 max-w-[62ch] text-[15px] leading-6 text-soil/80">{a}</p>
            </details>
          ))}
        </RevealGroup>
      </section>
      <JsonLd data={faqLd(faq)} />

      {/* 11. Keep in touch. */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:py-24">
        <Reveal>
          <div className="band-mint grid gap-6 rounded-[24px] px-6 py-10 md:grid-cols-[1fr_auto] md:items-center md:px-12 md:py-14">
            <div>
              <h2 className="t-page text-forest">New products, the day they land.</h2>
              <p className="mt-2 text-forest/75">One email when something new goes live. Nothing else.</p>
            </div>
            <div className="w-full md:w-96">
              <NotifyForm categorySlug="all" compact buttonLabel="Sign up" />
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
