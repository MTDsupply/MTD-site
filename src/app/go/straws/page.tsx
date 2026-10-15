import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCatalog } from "@/lib/catalog/queries";
import { photoFor } from "@/lib/catalog/assets";
import { site } from "@/lib/site";
import { Reveal, RevealGroup } from "@/components/Reveal";
import { TierPicker } from "@/components/landing/TierPicker";
import { StickyBuyBar } from "@/components/landing/StickyBuyBar";
import { LandingChrome, ViewContent } from "@/components/landing/LandingChrome";

export const metadata: Metadata = {
  title: "The straw that never goes soggy",
  description: "A straw that holds up to the last sip and still goes in your home compost. PHA, certified by TÜV Austria. 10 cents a straw, any quantity.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "The straw that never goes soggy",
    description: "Holds up to the last sip. Goes in the home compost after. 10 cents a straw.",
    images: [{ url: "/products/MTD-STR-200-3q.jpg", width: 1200, height: 1200, alt: "A straw in an iced drink" }],
  },
};

const SYMPTOMS = [
  "The straw softens before the drink is half gone.",
  "The last few sips taste like wet cardboard.",
  "Customers ask for a second straw. Then a third.",
  "The reusable one is in the dishwasher, or the car, or gone.",
  "You feel bad about plastic, but the alternatives keep failing.",
];

const FAQ: [string, string][] = [
  ["Will it really not go soggy?", "Yes. PHA does not absorb liquid the way paper does, so the straw keeps its shape from the first sip to the last, in iced coffee, smoothies and cocktails. If yours softens, send it back and we refund it."],
  ["Is it just plastic with a different name?", "No. PHA is a material made by fermentation, the same kind of process that makes yogurt and beer. It is certified home-compostable by TÜV Austria, which tests breakdown in a home compost pile at ambient temperature. Conventional plastic does not pass that test."],
  ["How is it different from the ones labelled compostable at the grocery store?", "Most of those are PLA, which only breaks down in an industrial facility at high heat. If you do not have access to one, it behaves like plastic. Ours is certified for a home compost pile, which is the kind of composting most people actually have."],
  ["Does it change the taste?", "No. It has no coating and no paper flavour. The drink tastes like the drink."],
  ["What do I do with it afterwards?", "Put it in your home compost with the coffee grounds and food scraps. No sorting, no drop-off."],
  ["Is each straw wrapped?", "Yes. Each one comes in its own wrapper printed with our wordmark, so it is clean and ready to hand across the counter or set on a table."],
  ["What is the catch on 10 cents?", "There is no catch. It is 10 cents a straw whether you buy 100 or 1,000. We would rather you try a small pack than wonder."],
  ["I run a café. Can I get better terms?", "Order the case of 1,000, switch to Business pricing, and apply for net-30 on your account page. For 10 or more cases, ask us for a quote."],
  ["Do you ship to the US?", "Yes. Canada and the United States, by courier. Shipping is calculated at checkout from your address and shown before you pay."],
  ["What if I do not like them?", "Return unopened packs within 30 days for a refund of the item price. If anything arrives damaged, we replace it free."],
];

export default async function StrawsAdLanding() {
  const { products, certs } = await getCatalog();
  const straw = products.find((p) => p.categorySlug === "straws" && p.status === "live");
  if (!straw) notFound();
  const cert = certs.find((c) => c.id === straw.certId);
  const inUse = photoFor(straw.sku, "3q") ?? straw.photo ?? "/products/MTD-STR-200-front.jpg";
  const wrapped = straw.photo ?? "/products/MTD-STR-200-front.jpg";
  const loose = photoFor(straw.sku, "base");

  return (
    <div className="bg-paper">
      <LandingChrome />
      <ViewContent sku={straw.sku} price={straw.packPrice} />

      {/* 1. Above the fold: outcome, mechanism, in-use visual, one CTA, trust strip. */}
      <section className="mx-auto grid max-w-7xl items-center gap-8 px-4 pb-12 pt-6 md:grid-cols-2 md:gap-12 md:pb-20 md:pt-12">
        <div>
          <Reveal>
            <p className="t-label text-sage-deep">For iced coffee, smoothies and cocktails</p>
          </Reveal>
          <Reveal delay={0.06}>
            <h1 className="t-hero mt-3">A straw that never goes soggy. And still composts at home.</h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-5 max-w-[46ch] text-[17px] leading-7 text-soil/80">
              Made from PHA, a material grown by fermentation, not paper and not plastic. It holds its shape to the last sip, then goes in the compost with your coffee grounds.
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <a href="#buy" className="btn btn-primary px-8 py-3.5 text-base">
                Get my straws · from $10
              </a>
              <span className="text-sm text-soil/70">10 cents a straw, any quantity</span>
            </div>
          </Reveal>
          <Reveal delay={0.24}>
            <ul className="mt-7 grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-soil/80 sm:grid-cols-4">
              {["Certified by TÜV Austria", "Individually wrapped", "Ships Canada and US", "30-day returns"].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4F6F52" strokeWidth="2.4" aria-hidden="true">
                    <path d="m5 12 5 5 9-10" />
                  </svg>
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
        <Reveal delay={0.1} y={24}>
          <div className="relative aspect-[4/3] overflow-hidden bg-white shadow-[0_32px_64px_-44px_rgba(43,43,43,0.5)] sm:aspect-square">
            <Image src={inUse} alt="A straw in an iced matcha, still straight at the bottom of the glass" fill priority sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
          </div>
        </Reveal>
      </section>

      {/* 2. Problem, as a scene. */}
      <section className="border-y border-sage bg-white/60">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-2 md:py-20">
          <Reveal>
            <p className="t-label text-sage-deep">You know this one</p>
            <h2 className="t-page mt-3">It is an iced latte. Ten minutes in, the straw folds.</h2>
            <p className="mt-4 max-w-[48ch] text-soil/80">
              You pinch it flat trying to get the last third. It tastes like the cup it came in. At home that is annoying. Behind a counter it is a customer who remembers where it happened.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <ul className="divide-y divide-line border-y border-line">
              {SYMPTOMS.map((s) => (
                <li key={s} className="flex items-start gap-3 py-3 text-[15px]">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-clay" aria-hidden="true" />
                  {s}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* 3. Why the alternatives failed, then the mechanism. */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:py-24">
        <div className="grid gap-12 md:grid-cols-[1fr_1.2fr] md:gap-16">
          <Reveal>
            <p className="t-label text-sage-deep">It is not you</p>
            <h2 className="t-page mt-3">Every straw so far asked you to give something up.</h2>
            <dl className="mt-6 space-y-5 text-[15px] leading-6">
              <div>
                <dt className="font-medium">Paper</dt>
                <dd className="text-soil/75">Absorbs the drink it is sitting in. Softening is not a defect, it is what paper does.</dd>
              </div>
              <div>
                <dt className="font-medium">Plastic</dt>
                <dd className="text-soil/75">Works in the glass. Banned for sale in Canada since 2023, and it never goes away.</dd>
              </div>
              <div>
                <dt className="font-medium">“Compostable” PLA</dt>
                <dd className="text-soil/75">Only breaks down in an industrial facility at high heat. In a backyard pile it behaves like plastic.</dd>
              </div>
              <div>
                <dt className="font-medium">Metal and glass</dt>
                <dd className="text-soil/75">Fine for one person. Not for a counter serving two hundred drinks a day.</dd>
              </div>
            </dl>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="band-sage p-6 md:p-10">
              <p className="t-label text-paper/75">The material is the difference</p>
              <h2 className="t-page mt-3 text-white">PHA. Grown, not drilled.</h2>
              <p className="mt-4 max-w-[52ch] text-paper/85">
                PHA is a polymer that microbes build when they ferment plant sugars. In your drink it behaves like a straw: firm, smooth, tasteless. In a compost pile it behaves like food scraps, because to the microbes there, that is what it is.
              </p>
              <p className="mt-3 max-w-[52ch] text-paper/85">
                The whole straw is made from it. No paper core, no coating, no plastic film. That is why it can be certified for a home compost pile and still not go soggy.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-paper/30 pt-5 text-sm text-paper/85">
                <span className="font-medium text-white">Certified by {cert?.certifier ?? "TÜV Austria"}</span>
                <span>100% certified home-compostable material</span>
                <Link href={`/certifications#${straw.sku}`} className="underline underline-offset-2">
                  See the certificate
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 4. Benefits as lived consequences. */}
      <section className="mx-auto max-w-7xl px-4 pb-16 md:pb-24">
        <RevealGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" step={0.06}>
          {[
            ["Firm to the last sip", "A frozen smoothie, a slow iced coffee, a cocktail that sits. It is still a straw at the end."],
            ["Tastes like nothing", "No coating and no paper flavour. Your drink is the only thing you taste."],
            ["Wrapped, counter-ready", "Each straw in its own printed wrapper. Hand it over, no hygiene question."],
            ["Compost it at home", "Into the pile with the coffee grounds. No sorting, no special bin, no drop-off."],
          ].map(([h, b]) => (
            <div key={h} className="border-t-2 border-sage pt-4">
              <h3 className="t-card">{h}</h3>
              <p className="mt-2 text-sm leading-6 text-soil/75">{b}</p>
            </div>
          ))}
        </RevealGroup>
      </section>

      {/* 5. Proof: the product, plainly, with the certification beside it. */}
      <section className="mx-auto max-w-7xl px-4 pb-16 md:pb-24">
        <div className="grid gap-4 md:grid-cols-3">
          <Reveal>
            <div className="aspect-[4/3] overflow-hidden bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={wrapped} alt="A wrapped straw printed with the Made to Disappear wordmark" className="h-full w-full object-cover" loading="lazy" />
            </div>
          </Reveal>
          {loose ? (
            <Reveal delay={0.08}>
              <div className="aspect-[4/3] overflow-hidden bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={loose} alt="Three straws on linen" className="h-full w-full object-cover" loading="lazy" />
              </div>
            </Reveal>
          ) : null}
          <Reveal delay={0.16}>
            <div className="glass flex h-full flex-col justify-center p-6">
              <p className="t-label text-sage-deep">Says who</p>
              <p className="t-card mt-3">Certified by TÜV Austria, for this exact product.</p>
              <p className="mt-3 text-sm leading-6 text-soil/75">
                We are a new brand, so we will not show you reviews we do not have yet. What we can show you is the certificate. The material is tested for breakdown in a home compost pile, and the certificate is listed on our certifications page for this SKU.
              </p>
              <Link href={`/certifications#${straw.sku}`} className="link-proof mt-4 text-sm font-medium">
                See the certificate
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 6. Comparison. */}
      <section className="mx-auto max-w-7xl px-4 pb-16 md:pb-24">
        <Reveal>
          <div className="overflow-x-auto border border-line bg-white">
            <table className="price-table w-full text-sm">
              <thead>
                <tr>
                  <th />
                  <th>Made to Disappear</th>
                  <th>Paper</th>
                  <th>PLA “compostable”</th>
                  <th>Plastic</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Holds up in an iced drink", "Yes, to the last sip", "Softens in minutes", "Yes", "Yes"],
                  ["Taste", "None", "Papery", "None", "None"],
                  ["Breaks down in a home compost", "Yes, certified", "Varies by brand", "No, industrial only", "No"],
                  ["Certification", "TÜV Austria, per SKU", "Varies", "Industrial, if any", "None"],
                  ["Legal to sell in Canada", "Yes", "Yes", "Yes", "Banned since 2023"],
                  ["Individually wrapped", "Yes", "Varies", "Varies", "Varies"],
                ].map(([k, ...cells]) => (
                  <tr key={k}>
                    <th scope="row" className="!normal-case !tracking-normal text-soil">{k}</th>
                    {cells.map((c, i) => (
                      <td key={i} className={i === 0 ? "font-medium text-sage-deep" : "text-soil/60"}>
                        {c}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </section>

      {/* 7. The offer. */}
      <section className="band-sage">
        <div className="mx-auto max-w-7xl px-4 py-16 md:py-20">
          <Reveal>
            <p className="t-label text-paper/75">Pick your size</p>
            <h2 className="t-page mt-3 text-white">10 cents a straw. Same price at every size.</h2>
            <p className="mt-3 max-w-[52ch] text-paper/85">Start with 100 to try them. Most people come back for the 500.</p>
          </Reveal>
          <div className="mt-8">
            <TierPicker product={straw} units={["pack-100", "pack-500", "case"]} cta="Get my straws" />
          </div>
          <p className="mt-5 text-sm text-paper/75">Shipping and tax are shown at checkout before you pay. Secure checkout by Stripe.</p>
        </div>
      </section>

      {/* 8. Risk reversal. */}
      <section className="mx-auto max-w-3xl px-4 py-14 text-center md:py-20">
        <Reveal>
          <p className="t-label text-sage-deep">If they let you down</p>
          <p className="t-page mt-3">Not what you expected? Send the unopened packs back within 30 days and we refund them.</p>
          <p className="mx-auto mt-4 max-w-[60ch] text-sm leading-6 text-soil/70">
            Email {site.email} with your order number and we send a return reference. Return shipping is on you unless we got the order wrong, in which case it is on us. Anything damaged in transit is replaced free, no return needed. Opened packs cannot be returned, for hygiene.
          </p>
        </Reveal>
      </section>

      {/* 9. FAQ as objections. */}
      <section className="mx-auto max-w-3xl px-4 pb-16 md:pb-24">
        <Reveal>
          <p className="t-label text-sage-deep">Before you order</p>
          <h2 className="t-page mt-3">The questions people ask.</h2>
        </Reveal>
        <div className="mt-8 divide-y divide-line border-y border-line">
          {FAQ.map(([q, a]) => (
            <details key={q} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
                {q}
                <span className="text-sage-deep transition-transform group-open:rotate-45" aria-hidden="true">
                  +
                </span>
              </summary>
              <p className="mt-2 text-sm leading-6 text-soil/75">{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* 10. Final CTA with what happens next. */}
      <section className="mx-auto max-w-7xl px-4 pb-24">
        <Reveal>
          <div className="band-ink grid gap-8 p-8 md:grid-cols-[1.2fr_1fr] md:items-center md:p-12">
            <div>
              <h2 className="t-page text-paper">Never serve a soggy straw again.</h2>
              <p className="mt-3 text-paper/80">From $10 for 100. Unopened packs returnable for 30 days.</p>
              <a href="#buy" className="btn btn-paper mt-6 px-8 py-3.5 text-base">
                Get my straws
              </a>
            </div>
            <ol className="space-y-3 border-t border-paper/20 pt-5 text-sm text-paper/80 md:border-l md:border-t-0 md:pl-8 md:pt-0">
              <li className="flex gap-3">
                <span className="sku text-paper/50">01</span> Pick a size and check out with Stripe.
              </li>
              <li className="flex gap-3">
                <span className="sku text-paper/50">02</span> Confirmation lands in your inbox, then a tracking link when it ships.
              </li>
              <li className="flex gap-3">
                <span className="sku text-paper/50">03</span> Serve. When the drink is done, the straw goes in the compost.
              </li>
            </ol>
          </div>
        </Reveal>
      </section>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-5 text-xs text-soil/60">
          <p>© {site.legalName}. {site.city}, {site.province}, {site.country}.</p>
          <p className="flex gap-4">
            <Link href="/shipping-returns" className="hover:underline">
              Shipping and returns
            </Link>
            <Link href="/privacy" className="hover:underline">
              Privacy
            </Link>
            <Link href="/terms" className="hover:underline">
              Terms
            </Link>
          </p>
        </div>
      </footer>

      <StickyBuyBar target="buy" label="Straws that never go soggy" price="10 cents each · from $10" />
    </div>
  );
}
