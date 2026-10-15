import Link from "next/link";
import { existsSync } from "node:fs";
import path from "node:path";
import { getCatalog } from "@/lib/catalog/queries";
import { site } from "@/lib/site";
import { claims } from "@/lib/copy";
import { ProductCard } from "@/components/ProductCard";
import { ComingSoonTile } from "@/components/ComingSoonTile";
import { Reveal, RevealGroup } from "@/components/Reveal";
import { HeroVideo } from "@/components/scene/HeroVideo";
import { Atmosphere } from "@/components/scene/Atmosphere";
import { FeatureBlock } from "@/components/FeatureBlock";
import { NotifyForm } from "@/components/NotifyForm";
import { money } from "@/lib/format";

/** Drop `public/hero.mp4` (and optionally `public/hero-poster.jpg`) and the hero picks them up. */
function heroMedia() {
  const pub = path.join(process.cwd(), "public");
  const video = existsSync(path.join(pub, "hero.mp4")) ? "/hero.mp4" : "/atmosphere/peaks.mp4";
  const poster = existsSync(path.join(pub, "hero-poster.jpg")) ? "/hero-poster.jpg" : "/atmosphere/peaks.jpg";
  const mobileVideo = existsSync(path.join(pub, "hero-mobile.mp4")) ? "/hero-mobile.mp4" : undefined;
  const mobilePoster = existsSync(path.join(pub, "hero-poster-mobile.jpg")) ? "/hero-poster-mobile.jpg" : undefined;
  return { video, poster, mobileVideo, mobilePoster };
}

const TAGLINES: Record<string, string> = {
  cups: "PHA-lined paper. Three sizes.",
  lids: "PHA. One lid fits all three.",
  straws: "PHA. Never goes soggy."
};

export default async function HomePage() {
  const { categories, products, certs } = await getCatalog();
  const { video, poster, mobileVideo, mobilePoster } = heroMedia();
  const sorted = [...categories].sort((a, b) => a.sortOrder - b.sortOrder);
  const certById = new Map(certs.map((c) => [c.id, c]));
  const catBySlug = new Map(categories.map((c) => [c.slug, c]));
  const live = products
    .filter((p) => p.status === "live" && catBySlug.get(p.categorySlug)?.status === "live")
    .sort((a, b) => (catBySlug.get(a.categorySlug)?.sortOrder ?? 9) - (catBySlug.get(b.categorySlug)?.sortOrder ?? 9) || a.sortOrder - b.sortOrder);
  const leadFor = (slug: string) => products.filter((p) => p.categorySlug === slug).sort((a, b) => a.sortOrder - b.sortOrder)[0];
  const cup16 = products.find((p) => p.sku === "MTD-CUP-16H");
  const lid = leadFor("lids");
  const straw = leadFor("straws");

  return (
    <div>
      {/* 1. Hero: full viewport over the forest, light text. */}
      <section className="relative isolate flex min-h-[calc(100dvh-7rem)] items-center overflow-hidden text-paper" data-tone="dark">
        <div className="absolute inset-0">
          <Atmosphere src="/atmosphere/forest.jpg" alt="" fade="none" tone="soil" parallax={70} drift={1.06} priority className="h-full w-full" objectPosition="center 40%" />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(43,43,43,0.78)_0%,rgba(43,43,43,0.5)_55%,rgba(43,43,43,0.25)_100%),linear-gradient(to_top,rgba(43,43,43,0.55)_0%,rgba(43,43,43,0)_40%)]"
        />
        <div className="relative mx-auto w-full max-w-7xl px-4 py-20 md:py-28">
          <div className="max-w-[46rem]">
            <Reveal>
              <p className="t-label text-paper/75">Foodservice essentials</p>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="t-hero mt-4 max-w-[13ch] text-paper">Serve it. Then it disappears.</h1>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-6 max-w-[46ch] text-[17px] leading-7 text-paper/85">
                Cups, lids and straws made from 100% certified home-compostable material. By the case for the business, by the pack for the house.
              </p>
            </Reveal>
            <Reveal delay={0.24}>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/products" className="btn btn-paper">
                  Shop all
                </Link>
                {sorted
                  .filter((c) => c.status === "live")
                  .map((c) => (
                    <Link key={c.slug} href={`/products/${c.slug}`} className="btn border-paper/70 text-paper hover:bg-white/10">
                      {c.name}
                    </Link>
                  ))}
              </div>
            </Reveal>
            <Reveal delay={0.32}>
              <a href="#film" className="mt-14 inline-flex items-center gap-2 text-sm text-paper/70 hover:text-paper" aria-label="Scroll to the film">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <path d="M12 4v16m0 0-6-6m6 6 6-6" />
                </svg>
                Watch the film
              </a>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 2. The brand film, contained, beneath the hero. */}
      <section id="film" className="mx-auto max-w-5xl scroll-mt-24 px-4 pb-4 pt-16 md:pt-24">
        <Reveal>
          <div className="relative overflow-hidden shadow-[0_40px_80px_-48px_rgba(43,43,43,0.55)]" data-tone="dark">
            <HeroVideo poster={poster} video={video} mobilePoster={mobilePoster} mobileVideo={mobileVideo} />
          </div>
        </Reveal>
      </section>

      <div className="mx-auto max-w-7xl px-4">
        {/* 2. Category tiles with taglines. */}
        <section className="pt-12 md:pt-16">
          <RevealGroup className="grid gap-4 md:grid-cols-3" itemClassName="h-full" step={0.08}>
            {sorted.map((c) => {
              const lead = leadFor(c.slug);
              const isLive = c.status === "live";
              return (
                <Link key={c.slug} href={`/products/${c.slug}`} className="card glass group block h-full overflow-hidden">
                  <div className="relative aspect-[4/3] overflow-hidden bg-white">
                    {lead?.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={lead.photo} alt={c.name} className="h-full w-full object-contain transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]" />
                    ) : null}
                    {!isLive ? <span className="chip chip-clay absolute left-3 top-3">Coming soon</span> : null}
                  </div>
                  <div className="flex items-end justify-between gap-3 p-4">
                    <div>
                      <h2 className="t-card">{c.name}</h2>
                      <p className="mt-1 text-sm text-soil/70">{TAGLINES[c.slug] ?? c.description}</p>
                    </div>
                    <span className="t-label shrink-0 text-sage-deep">{isLive ? "Shop" : "Notify"}</span>
                  </div>
                </Link>
              );
            })}
          </RevealGroup>
        </section>

        {/* 3. Trust strip: quality meets certified material. */}
        <Reveal>
          <section className="mt-14 grid gap-6 border-y border-sage py-8 md:grid-cols-3 md:gap-10">
            <div className="flex items-center gap-4">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-sage text-sage-deep">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <path d="m5 12 5 5 9-10" />
                </svg>
              </span>
              <div>
                <p className="t-card text-[17px] leading-[22px]">Certified by TÜV Austria</p>
                <p className="mt-1 text-sm text-soil/70">100% certified home-compostable material, per SKU.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-sage text-sage-deep">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <path d="M4 7h16M4 12h10M4 17h7" />
                </svg>
              </span>
              <div>
                <p className="t-card text-[17px] leading-[22px]">No microplastics</p>
                <p className="mt-1 text-sm text-soil/70">PHA lining, made by fermentation. No plastic film.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-sage text-sage-deep">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <rect x="4" y="7" width="16" height="12" rx="1" />
                  <path d="M4 11h16M10 7v4" />
                </svg>
              </span>
              <div>
                <p className="t-card text-[17px] leading-[22px]">Case or pack</p>
                <p className="mt-1 text-sm text-soil/70">Packs of 100, 200 or 500, or cases of 1,000.</p>
              </div>
            </div>
          </section>
        </Reveal>

        {/* 4. Feature blocks, alternating. */}
        <section className="space-y-24 pt-20 md:space-y-36 md:pt-28">
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
                ["From", `${money(products.filter((p) => p.categorySlug === "cups").sort((a, b) => a.packPrice - b.packPrice)[0]?.packPrice ?? cup16.packPrice)} / 100`],
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
          {straw ? (
            <FeatureBlock
              image={straw.photo ?? "/atmosphere/meadow.jpg"}
              imageAlt="A straw in an iced drink"
              eyebrow="Straws"
              title="Never goes soggy."
              cta="Shop straws"
              href="/straws"
              facts={[
                ["Length", "200 mm"],
                ["Material", straw.material],
                ["Each", money(straw.unitPrice)],
              ]}
              secondary={{ label: "Why it never goes soggy", href: "/straws" }}
            >
              <p>200 mm PHA straws that hold their shape to the last sip. 10 cents each in any pack size, by the hundred or by the thousand.</p>
              <p>Made from the same 100% certified home-compostable material as everything else we sell.</p>
            </FeatureBlock>
          ) : null}
        </section>
      </div>

      {/* 5. Business band. */}
      <section className="mt-20 md:mt-28">
        <Reveal>
          <Atmosphere src="/atmosphere/forest.jpg" alt="" fade="none" tone="soil" parallax={60} drift={1.06} className="text-paper" dark>
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(43,43,43,0.78)_0%,rgba(43,43,43,0.55)_55%,rgba(43,43,43,0.25)_100%)]" />
            <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-24 md:grid-cols-[1.2fr_1fr] md:gap-12 md:py-32">
              <div>
                <p className="t-label text-paper/70">Business accounts</p>
                <h2 className="t-section mt-3">Order by the case.</h2>
                <p className="mt-4 max-w-[48ch] text-paper/80">
                  Cafés, restaurants, caterers and events. Case pricing on every SKU and net-30 on approval.
                </p>
                <Link href="/business" className="btn btn-paper mt-8">
                  Business accounts
                </Link>
              </div>
              <dl className="grid gap-5 border-t border-paper/30 pt-5 md:border-l md:border-t-0 md:pl-8 md:pt-0">
                <div>
                  <dt className="t-card text-[17px] leading-[22px]">Case pricing</dt>
                  <dd className="mt-1 text-sm text-paper/75">Flip the toggle to Business and every price shows per case. No account needed to see it.</dd>
                </div>
                <div>
                  <dt className="t-card text-[17px] leading-[22px]">Net-30 on approval</dt>
                  <dd className="mt-1 text-sm text-paper/75">Approved accounts order on terms and reorder from their account page in one click.</dd>
                </div>
                <div>
                  <dt className="t-card text-[17px] leading-[22px]">Custom printing</dt>
                  <dd className="mt-1 text-sm text-paper/75">Your artwork on the cup from 100 cases. Ask for a quote.</dd>
                </div>
              </dl>
            </div>
          </Atmosphere>
        </Reveal>
      </section>

      <div className="mx-auto max-w-7xl px-4">
        {/* 6. Top picks: every live SKU. */}
        <section className="pt-20 md:pt-28">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <Reveal>
              <p className="t-label text-sage-deep">In stock</p>
              <h2 className="t-page mt-2">Top picks.</h2>
            </Reveal>
            <Reveal delay={0.1}>
              <Link href="/products" className="link text-sm font-medium">
                Full catalogue
              </Link>
            </Reveal>
          </div>
          <RevealGroup className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5" itemClassName="h-full" step={0.05} base={0.1}>
            {[
              ...live.map((p) => (
                <ProductCard key={p.sku} product={p} cert={certById.get(p.certId ?? "")} categoryDrawing={catBySlug.get(p.categorySlug)?.lineDrawing ?? "/drawings/category-cups.svg"} />
              )),
              ...sorted
                .filter((c) => c.status !== "live")
                .map((c) => <ComingSoonTile key={c.slug} category={c} compact photo={leadFor(c.slug)?.photo ?? null} />),
            ]}
          </RevealGroup>
        </section>

        {/* 7. Founder quote. */}
        <Reveal>
          <section className="mx-auto max-w-3xl py-20 text-center md:py-28">
            <p className="t-label text-sage-deep">From the founders</p>
            <blockquote className="t-heading mt-5 text-soil">
              “Our own cafés could not buy a cup made from certified home-compostable material with the certificate to show for it. So we made one.”
            </blockquote>
            <p className="mt-5 text-sm text-soil/70">The team behind Cup Casa, {site.city}, {site.province}</p>
          </section>
        </Reveal>

        {/* 8. Why it disappears. */}
        <section className="pb-8">
          <div className="grid gap-8 md:grid-cols-2 md:items-center md:gap-16">
            <Reveal>
              <p className="t-label text-sage-deep">Proof</p>
              <h2 className="t-page mt-2">Why it disappears.</h2>
              <p className="mt-4 max-w-[52ch] text-soil/80">{claims.whyParagraph}</p>
              <Link href="/certifications" className="link-proof mt-5 inline-block text-sm font-medium">
                See every certificate
              </Link>
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

        {/* 9. Keep in touch. */}
        <Reveal>
          <section className="glass mt-16 grid gap-6 p-6 md:grid-cols-[1fr_auto] md:items-center md:p-10">
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
