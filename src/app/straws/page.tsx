import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCatalog } from "@/lib/catalog/queries";
import { photoFor } from "@/lib/catalog/assets";
import { Reveal, RevealGroup } from "@/components/Reveal";
import { TierPicker } from "@/components/landing/TierPicker";
import { StickyBuyBar } from "@/components/landing/StickyBuyBar";

export const metadata: Metadata = {
  title: "Straws that never go soggy",
  description:
    "200 mm PHA straws made from 100% certified home-compostable material. 10 cents each. Packs of 100, 200, 500 or a case of 1,000.",
};

const FAQ: [string, string][] = [
  ["Will it go soggy in my drink?", "No. The straw is PHA, not paper, so it keeps its shape from the first sip to the last, in iced coffee, smoothies and cocktails."],
  ["What is PHA?", "A material made by fermentation. Our straws are made from 100% certified home-compostable material, certified by TÜV Austria."],
  ["How do I dispose of it?", "Put it in your home compost pile with your coffee grounds and food scraps. It breaks down at ambient temperature."],
  ["Does it change the taste?", "No. It has no coating and no paper flavour, so the drink tastes like the drink."],
  ["Is each straw wrapped?", "Yes. Each straw comes in its own wrapper printed with our wordmark, so it is ready for service."],
  ["Where do you ship?", "Canada and the United States. Packs ship for $9.95 in Canada (free over $99) and $14.95 to the US (free over $149); cases ship by courier at a flat rate each. You see it in the cart before you pay."],
  ["I run a café. Can I get better terms?", "Yes. Switch to Business pricing, order by the case, and apply for net-30. For 10 or more cases, ask us for a quote."],
];

export default async function StrawsLandingPage() {
  const { products, certs } = await getCatalog();
  const straw = products.find((p) => p.categorySlug === "straws" && p.status === "live");
  if (!straw) notFound();
  const cert = certs.find((c) => c.id === straw.certId);

  const wrapped = straw.photo ?? photoFor(straw.sku) ?? "/products/MTD-STR-200-front.jpg";
  const loose = photoFor(straw.sku, "base");
  const inUse = photoFor(straw.sku, "3q");

  return (
    <div>
      {/* 1. Hero: promise, price, one action. */}
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 pt-10 md:grid-cols-[1.05fr_1fr] md:pt-16">
        <div>
          <Reveal>
            <p className="t-label text-sage-deep">Straws · 200 mm · PHA</p>
          </Reveal>
          <Reveal delay={0.06}>
            <h1 className="t-hero mt-3">The straw that never goes soggy.</h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-5 max-w-[46ch] text-[17px] leading-7 text-soil/80">
              Holds its shape to the last sip, tastes like nothing, and goes in the home compost when you are done. Made from 100% certified home-compostable material.
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <ul className="mt-6 space-y-2 text-[15px]">
              {["Never goes soggy, even in iced drinks", "Certified by TÜV Austria", "Individually wrapped, ready for service", "10 cents each, any quantity"].map((t) => (
                <li key={t} className="flex items-center gap-3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4F6F52" strokeWidth="2.2" aria-hidden="true">
                    <path d="m5 12 5 5 9-10" />
                  </svg>
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.24}>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a href="#buy" className="btn btn-primary px-8 py-3 text-base">
                Shop straws · from $10
              </a>
              <span className="flex items-center gap-2 text-sm text-soil/70">
                Certified by TÜV Austria
              </span>
            </div>
          </Reveal>
        </div>
        <Reveal delay={0.1} y={30}>
          <div className="relative">
            <div className="aspect-square overflow-hidden border border-line bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={wrapped} alt="A wrapped Made to Disappear straw" className="h-full w-full object-contain" />
            </div>
            {loose ? (
              <div className="absolute -bottom-6 -left-6 hidden aspect-square w-40 overflow-hidden border-4 border-paper bg-white shadow-[0_24px_48px_-24px_rgba(43,43,43,0.4)] md:block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={loose} alt="Three straws on linen" className="h-full w-full object-cover" />
              </div>
            ) : null}
          </div>
        </Reveal>
      </section>

      {/* 2. Proof strip. */}
      <section className="border-y border-sage bg-white/60">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 text-sm sm:grid-cols-2 md:grid-cols-4">
          {[
            ["100%", "certified home-compostable material"],
            ["TÜV Austria", "certification, per SKU"],
            ["0", "soggy straws"],
            ["10¢", "per straw, any quantity"],
          ].map(([big, small]) => (
            <div key={small}>
              <p className="t-heading text-sage-deep">{big}</p>
              <p className="text-soil/70">{small}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. The problem, then the fix. */}
      <section className="mx-auto max-w-7xl px-4 py-20 md:py-28">
        <div className="grid gap-12 md:grid-cols-2 md:gap-16">
          <Reveal>
            <p className="t-label text-sage-deep">The problem</p>
            <h2 className="t-page mt-3">Your customers hate soggy straws.</h2>
            <p className="mt-4 max-w-[48ch] text-soil/80">
              Ten minutes into an iced latte, a paper straw collapses and starts to taste like cardboard. People notice, and they remember where it happened.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="t-label text-sage-deep">The fix</p>
            <h2 className="t-page mt-3">A straw that lasts the drink.</h2>
            <p className="mt-4 max-w-[48ch] text-soil/80">
              Ours is PHA. It stays firm through a whole drink, has no taste of its own, and still goes in the home compost afterwards, because it is made from 100% certified home-compostable material.
            </p>
          </Reveal>
        </div>

        <Reveal>
          <div className="mt-14 overflow-x-auto border border-line bg-white">
            <table className="price-table w-full text-sm">
              <thead>
                <tr>
                  <th />
                  <th>Made to Disappear straw</th>
                  <th>Typical paper straw</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Holds its shape in an iced drink", "Yes, to the last sip", "Softens within minutes"],
                  ["Taste", "None", "Papery"],
                  ["Home compost", "Yes, certified material", "Varies by brand"],
                  ["Certification", "TÜV Austria", "Varies by brand"],
                  ["Individually wrapped", "Yes", "Varies"],
                ].map(([k, a, b]) => (
                  <tr key={k}>
                    <th scope="row" className="!normal-case !tracking-normal text-soil">{k}</th>
                    <td className="font-medium text-sage-deep">{a}</td>
                    <td className="text-soil/60">{b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </section>

      {/* 4. Buy box. */}
      <section className="band-sage">
        <div className="mx-auto max-w-7xl px-4 py-16 md:py-20">
          <Reveal>
            <p className="t-label text-paper/75">Pick your size</p>
            <h2 className="t-section mt-3 text-white">10 cents a straw. Any quantity.</h2>
            <p className="mt-3 max-w-[52ch] text-paper/85">Same price from 100 to 1,000. Business accounts can order by the case on net-30.</p>
          </Reveal>
          <div className="mt-8 text-soil">
            <TierPicker product={straw} />
          </div>
        </div>
      </section>

      {/* 5. Three reasons with photos. */}
      <section className="mx-auto max-w-7xl px-4 py-20 md:py-28">
        <RevealGroup className="grid gap-8 md:grid-cols-3" step={0.08}>
          {[
            { img: inUse, title: "Made for iced drinks", body: "Matcha, cold brew, smoothies, cocktails. It stays firm the whole way down." },
            { img: wrapped, title: "Wrapped for service", body: "Each straw in its own wordmarked wrapper, ready to hand over the counter." },
            { img: loose, title: "Back to the earth", body: "Made from 100% certified home-compostable material. Into the compost with the coffee grounds." },
          ].map((r) => (
            <div key={r.title}>
              <div className="aspect-[4/3] overflow-hidden border border-line bg-white">
                {r.img ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={r.img} alt={r.title} className="h-full w-full object-contain" />
                ) : null}
              </div>
              <h3 className="t-card mt-4">{r.title}</h3>
              <p className="mt-1 text-sm text-soil/75">{r.body}</p>
            </div>
          ))}
        </RevealGroup>
      </section>

      {/* 6. Certification. */}
      <section className="mx-auto max-w-7xl px-4">
        <Reveal>
          <div className="glass grid items-center gap-6 p-6 md:grid-cols-[1fr_auto] md:p-10">
            <div>
              <h2 className="t-heading">Certified, not just claimed.</h2>
              <p className="mt-2 max-w-[60ch] text-sm text-soil/75">
                The straw is made from 100% certified home-compostable material, certified by {cert?.certifier ?? "TÜV Austria"} for this specific SKU. The certificate is listed on our certifications page.
              </p>
            </div>
            <Link href={`/certifications#${straw.sku}`} className="link-proof text-sm font-medium">
              See the certificate
            </Link>
          </div>
        </Reveal>
      </section>

      {/* 7. FAQ. */}
      <section className="mx-auto max-w-3xl px-4 py-20 md:py-28">
        <Reveal>
          <p className="t-label text-sage-deep">Questions</p>
          <h2 className="t-page mt-3">Before you order.</h2>
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
              <p className="mt-2 text-sm text-soil/75">{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* 8. Final call. */}
      <section className="mx-auto max-w-7xl px-4 pb-24">
        <Reveal>
          <div className="band-ink flex flex-col items-start gap-6 p-8 md:flex-row md:items-center md:justify-between md:p-12">
            <div>
              <h2 className="t-page text-paper">Never serve a soggy straw again.</h2>
              <p className="mt-2 text-paper/80">From $10 for 100. 10 cents a straw at every size.</p>
            </div>
            <a href="#buy" className="btn btn-paper px-8 py-3 text-base">
              Choose a size
            </a>
          </div>
        </Reveal>
      </section>

      <StickyBuyBar target="buy" label="Straw, 200 mm · never goes soggy" price="10 cents each · from $10" />
    </div>
  );
}
