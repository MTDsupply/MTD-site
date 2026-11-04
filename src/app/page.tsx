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
import { Atmosphere } from "@/components/scene/Atmosphere";
import { FeatureBlock } from "@/components/FeatureBlock";
import { NotifyForm } from "@/components/NotifyForm";
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

  return (
    <div>
      {/* 1. Hero: a flat Sage banner, copy left, the café photograph hard-edged on the right. */}
      <section className="band-sage relative isolate overflow-hidden">
        <div className="grid md:min-h-[min(calc(100dvh-7rem),640px)] md:grid-cols-2">
          <div className="flex items-center px-4 pt-12 pb-12 md:py-20 md:pl-[max(1rem,calc(50vw_-_40rem_+_1rem))] md:pr-12">
            <div className="max-w-[36rem]">
              <Reveal>
                <p className="t-label flex items-center gap-4 text-paper/70">
                  <span aria-hidden="true" className="h-px w-8 bg-paper/50" />
                  Hot cups &amp; lids · {site.city}, {site.province}
                </p>
              </Reveal>
              <Reveal delay={0.08}>
                <h1 className="t-hero mt-7 max-w-[13ch] text-white">Serve it. Then it disappears.</h1>
              </Reveal>
              <Reveal delay={0.16}>
                <p className="mt-6 max-w-[42ch] text-[16px] leading-7 text-paper/80 md:text-[17px]">
                  Hot cups and lids made from 100% certified home-compostable material. Cases for the café, packs for the house.
                </p>
              </Reveal>
              <Reveal delay={0.24}>
                <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
                  <Link href="/products/cups" className="btn btn-paper">
                    Shop cups
                  </Link>
                  <Link href="/products/lids" className="text-[12px] font-medium uppercase tracking-[0.14em] text-paper underline decoration-paper/40 underline-offset-[6px] transition-colors hover:decoration-paper">
                    Shop lids
                  </Link>
                </div>
                {restockNote("cups") ? (
                  <p className="mt-5 text-[13px] text-paper/65">Cups {restockNoteLower("cups")}; orders placed now are filled from that stock. Lids in stock.</p>
                ) : null}
              </Reveal>
              <Reveal delay={0.32}>
                <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-2 border-t border-paper/20 pt-5 text-[11px] uppercase tracking-[0.14em] text-paper/70">
                  <li>Certified by {site.certifier}</li>
                  <li>No microplastics</li>
                  <li className="tnum">From {money(cheapestCupPack?.packPrice ?? 0)} per 100</li>
                </ul>
              </Reveal>
            </div>
          </div>
          <div className="relative aspect-[4/5] md:aspect-auto">
            <Image
              src="/hero-cafe.jpg"
              alt="A customer laughing over a paper hot cup at a café counter"
              fill
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
              style={{ objectPosition: "50% 38%" }}
            />
            {/* The round home-compostable mark on a white disc, set quietly in the photo's corner. */}
            <span className="absolute bottom-5 right-5 flex w-[88px] items-center justify-center rounded-full bg-white p-1 shadow-[0_8px_24px_rgba(0,0,0,0.18)] md:bottom-7 md:right-7 md:w-[112px]">
              <Image
                src="/badge-home-compostable.png"
                alt="Home compostable mark: TÜV Austria certified, no microplastics, PHA lined"
                width={892}
                height={881}
                className="h-auto w-full"
              />
            </span>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4">
        {/* 2. Shop: every live SKU, add to cart in one scroll. */}
        <section className="pt-14 md:pt-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <Reveal>
              <p className="t-label text-sage-deep">{restockNote("cups") ? `Cups ${restockNoteLower("cups")} · Lids in stock` : "In stock now"}</p>
              <h2 className="t-page mt-2">Shop best sellers.</h2>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="flex flex-wrap gap-5 text-sm font-medium">
                <Link href="/quick-order" className="link">
                  Quick order by SKU
                </Link>
                <Link href="/products" className="link">
                  Full catalogue
                </Link>
              </div>
            </Reveal>
          </div>
          <RevealGroup className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4" itemClassName="h-full" step={0.05} base={0.1}>
            {[
              ...live.map((p, i) => (
                <ProductCard key={p.sku} product={p} cert={certById.get(p.certId ?? "")} categoryDrawing={catBySlug.get(p.categorySlug)?.lineDrawing ?? "/drawings/category-cups.svg"} priority={i < 2} />
              )),
              ...sorted
                .filter((c) => c.status !== "live")
                .map((c) => <ComingSoonTile key={c.slug} category={c} compact photo={leadFor(c.slug)?.photo ?? null} />),
            ]}
          </RevealGroup>
        </section>
      </div>

      {/* 3. Trust band: certification, material, formats, press. */}
      <Reveal>
        <section className="mt-16 border-y border-line bg-white md:mt-24">
          <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:grid-cols-2 md:grid-cols-4 md:gap-0 md:divide-x md:divide-line md:py-0">
            {[
              ["Certification", `Certified by ${site.certifier}`, "100% certified home-compostable material, per SKU."],
              ["Material", "No microplastics", "PHA lining, made by fermentation. No plastic film."],
              ["Formats", "Case or pack", "Packs of 100, 200 or 500, or cases of 1,000."],
            ].map(([eyebrow, title, text]) => (
              <div key={title} className="md:px-8 md:py-9 md:first:pl-0 md:last:pr-0">
                <p className="t-label text-soil/50">{eyebrow}</p>
                <p className="mt-2 text-[15px] font-medium">{title}</p>
                <p className="mt-1 text-[13px] leading-5 text-soil/65">{text}</p>
              </div>
            ))}
            <div className="md:px-8 md:py-9 md:last:pr-0">
              <p className="t-label text-soil/50">Press</p>
              <p className="mt-2 flex items-center gap-2 text-[15px] font-medium">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={press.logo} alt="" width={18} height={18} className="h-[18px] w-[18px]" />
                As heard on CBC
              </p>
              <p className="mt-1 text-[13px] leading-5 text-soil/65">
                {press.href ? (
                  <Link href={press.href} className="link">
                    {press.show}
                  </Link>
                ) : (
                  press.show
                )}{" "}
                with {press.host}.
              </p>
            </div>
          </div>
        </section>
      </Reveal>

      <div className="mx-auto max-w-7xl px-4">
        {/* 4. Feature blocks, alternating. */}
        <section className="space-y-20 pt-16 md:space-y-28 md:pt-24">
          {cup16 ? (
            <FeatureBlock
              image={cup16.photo ?? "/atmosphere/moss.jpg"}
              imageAlt="Hot cups, base showing the certification mark"
              eyebrow="Hot cups"
              title="Three sizes. One compost pile."
              cta="Shop cups"
              href="/products/cups"
              facts={[
                ["Sizes", "8 · 12 · 16 oz"],
                ["Material", "PHA-lined paper"],
                ["From", `${money(cheapestCupPack?.packPrice ?? cup16.packPrice)} / 100`],
              ]}
              secondary={{ label: "See the 16 oz spec sheet", href: `/products/cups/${cup16.sku.toLowerCase()}` }}
            >
              <p>8, 12 and 16 oz hot cups in PHA-lined paper. The lining is made by fermentation, not from plastic, so the whole cup goes in the home compost.</p>
              <p>Every cup carries the certification mark on its base, so your customers can see it for themselves.</p>
            </FeatureBlock>
          ) : null}
          {lid ? (
            <FeatureBlock
              image={lid.photo ?? "/atmosphere/moss.jpg"}
              imageAlt="Hot cup lids"
              eyebrow="Lids"
              title="One lid. Every cup."
              cta="Shop lids"
              href="/products/lids"
              reverse
              facts={[
                ["Fits", "8 · 12 · 16 oz"],
                ["Material", lid.material],
                ["From", `${money(lid.packPrice)} / ${lid.packCount}`],
              ]}
              secondary={{ label: "Lid specifications", href: `/products/lids/${lid.sku.toLowerCase()}` }}
            >
              <p>A single PHA lid fits the 8, 12 and 16 oz cups, so there is one SKU to stock and one case to reorder.</p>
              <p>Same certified material as the cup, same compost pile at the end.</p>
            </FeatureBlock>
          ) : null}
        </section>

        {/* 5. How it disappears: three steps. */}
        <section className="pt-20 md:pt-28">
          <Reveal>
            <p className="t-label text-sage-deep">How it disappears</p>
            <h2 className="t-page mt-2">Serve it. Compost it. Done.</h2>
          </Reveal>
          <RevealGroup className="mt-10 grid border-t border-line md:grid-cols-3 md:gap-10" itemClassName="h-full" step={0.08}>
            {[
              ["Serve", "Same cup, same coffee. Hot cups in 8, 12 and 16 oz, and one lid that fits all three."],
              ["Drop it in the home compost", "The PHA lining is made by fermentation, not from plastic, so the whole cup goes in. No sorting, no special bin."],
              ["It breaks down", `Home-compostable material breaks down in a home compost pile at ambient temperature. Certified by ${site.certifier}, per SKU.`],
            ].map(([title, text], i) => (
              <div key={title} className="border-b border-line py-7 md:border-b-0 md:pt-8">
                <span className="t-serif-italic block text-[30px] leading-none text-sage-deep tnum">0{i + 1}</span>
                <h3 className="t-card mt-4">{title}</h3>
                <p className="mt-2 max-w-[38ch] text-sm leading-6 text-soil/70">{text}</p>
              </div>
            ))}
          </RevealGroup>
          <Reveal delay={0.2}>
            <p className="mt-6 text-sm font-medium">
              <Link href="/compost" className="link-proof">
                The full guide to composting it at home
              </Link>
            </p>
          </Reveal>
        </section>

        {/* 6. The brand film. */}
        <section id="film" className="mx-auto max-w-5xl scroll-mt-24 pt-20 md:pt-28">
          <Reveal>
            <p className="t-label text-sage-deep">The film</p>
            <h2 className="t-heading mt-2">Why we started.</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="relative mt-6 overflow-hidden shadow-[0_40px_80px_-48px_rgba(43,43,43,0.55)]" data-tone="dark">
              <HeroVideo poster={poster} video={video} mobileVideo={mobileVideo} />
            </div>
          </Reveal>
        </section>
      </div>

      {/* 7. Business band: light, with a café and case prices. */}
      <section className="mt-20 border-y border-line bg-white md:mt-28">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-[1.1fr_1fr] md:items-center md:gap-16 md:py-20">
          <Reveal>
            <p className="t-label text-sage-deep">Business accounts</p>
            <h2 className="t-page mt-2">Order by the case.</h2>
            <p className="mt-4 max-w-[48ch] text-soil/80">
              Cafés, restaurants, hotels, caterers and events. Case pricing on every SKU, net-30 on approval, and one-click reorders from your account.
            </p>
            <table className="price-table mt-6 w-full text-sm">
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Product</th>
                  <th>Case</th>
                  <th className="num">Per case</th>
                  <th className="num">Per unit</th>
                  <th className="num">{count(BULK_MIN_UNITS)}+ units</th>
                </tr>
              </thead>
              <tbody>
                {live.map((p) => (
                  <tr key={p.sku}>
                    <td className="sku">{p.sku}</td>
                    <td>{p.name}</td>
                    <td className="tnum">{p.caseCount.toLocaleString("en-CA")}</td>
                    <td className="num tnum">{money(p.casePrice)}</td>
                    <td className="num tnum">{unitMoney(p.unitPrice)}</td>
                    <td className="num tnum">{unitMoney(p.bulkUnitPrice ?? p.unitPrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-2 text-xs text-soil/60">Per unit, CAD before tax. The volume column applies automatically to every case once an order reaches {count(BULK_MIN_UNITS)} units.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/business#quote" className="btn btn-primary">
                Open a business account
              </Link>
              <Link href="/quick-order" className="btn btn-outline">
                Quick order by SKU
              </Link>
            </div>
            <p className="mt-4 text-sm text-soil/60">Custom printing from 100 cases. Ask for a quote.</p>
          </Reveal>
          <Reveal delay={0.12} y={30}>
            <Atmosphere
              src="/atmosphere/cafe.jpg"
              alt="A customer laughing over a hot cup at a café window"
              fade="none"
              parallax={30}
              drift={1.05}
              className="aspect-[4/5] max-h-[560px] border border-line md:aspect-[4/5]"
              sizes="(min-width: 768px) 45vw, 100vw"
              objectPosition="center 35%"
            />
          </Reveal>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4">
        {/* 8. Founder quote. */}
        <Reveal>
          <section className="mx-auto max-w-3xl py-20 text-center md:py-28">
            <p className="t-label text-sage-deep">From the founders</p>
            <blockquote className="t-heading mt-5 text-soil">
              “Our own cafés could not buy a cup made from certified home-compostable material with the certificate to show for it. So we made one.”
            </blockquote>
            <p className="mt-5 text-sm text-soil/70">The team behind Cup Casa, {site.city}, {site.province}</p>
          </section>
        </Reveal>

        {/* 9. Why it disappears: proof per SKU. */}
        <section className="pb-8">
          <div className="grid gap-8 md:grid-cols-2 md:items-center md:gap-16">
            <Reveal>
              <p className="t-label text-sage-deep">Proof</p>
              <h2 className="t-page mt-2">Why it disappears.</h2>
              <p className="mt-4 max-w-[52ch] text-soil/80">{claims.whyParagraph}</p>
              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium">
                <Link href="/certifications" className="link-proof">
                  See every certificate
                </Link>
                <Link href="/compost" className="link-proof">
                  How to compost it
                </Link>
              </div>
              <ul className="mt-8 divide-y divide-line border-y border-line">
                {live.map((p) => {
                  const cert = certById.get(p.certId ?? "");
                  return (
                    <li key={p.sku} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-3 text-sm">
                      <span className="min-w-0">
                        <span className="sku text-soil/60">{p.sku}</span>
                        <span className="ml-3">{p.name}</span>
                      </span>
                      <Link href={`/certifications#${p.sku}`} className="chip chip-sage">
                        {cert ? `${cert.name} · ${cert.certifier}${cert.number ? ` · No. ${cert.number}` : ""}` : "In testing"}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </Reveal>
            <Reveal delay={0.12} y={30}>
              <Atmosphere src="/atmosphere/moss.jpg" alt="Moss and fern on a forest floor" fade="none" parallax={30} drift={1.07} className="aspect-[4/3] border border-line" sizes="(min-width: 768px) 50vw, 100vw" />
            </Reveal>
          </div>
        </section>

        {/* 10. Questions: the answers search engines and assistants quote. */}
        <section className="mx-auto max-w-3xl pt-16 md:pt-20">
          <Reveal>
            <p className="t-label text-sage-deep">Questions</p>
            <h2 className="t-page mt-2">Asked often.</h2>
          </Reveal>
          <RevealGroup className="mt-6 divide-y divide-line border-y border-line" step={0.05}>
            {faq.map(([q, a]) => (
              <details key={q} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[17px] font-medium">
                  <h3 className="text-[17px] font-medium">{q}</h3>
                  <span aria-hidden="true" className="text-sage-deep transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-[62ch] text-sm leading-6 text-soil/80">{a}</p>
              </details>
            ))}
          </RevealGroup>
          <Reveal delay={0.1}>
            <p className="mt-5 text-sm text-soil/70">
              More on the method on the{" "}
              <Link href="/compost" className="link-proof font-medium">
                composting guide
              </Link>
              , and every certificate on the{" "}
              <Link href="/certifications" className="link-proof font-medium">
                certifications page
              </Link>
              .
            </p>
          </Reveal>
        </section>
        <JsonLd data={faqLd(faq)} />

        {/* 11. Keep in touch. */}
        <Reveal>
          <section className="mt-16 grid gap-6 border-y border-line py-10 md:grid-cols-[1fr_auto] md:items-center md:py-12">
            <div>
              <p className="t-label text-sage-deep">Keep in touch</p>
              <h2 className="t-heading mt-2">New products, the day they land.</h2>
              <p className="mt-2 text-sm text-soil/70">One email when something new goes live. Nothing else.</p>
            </div>
            <div className="w-full md:w-80">
              <NotifyForm categorySlug="all" compact buttonLabel="Sign up" />
            </div>
          </section>
        </Reveal>
      </div>
    </div>
  );
}
