import Link from "next/link";
import Image from "next/image";
import { site } from "@/lib/site";
import { PageHeader } from "@/components/PageHeader";
import { Reveal, RevealGroup } from "@/components/Reveal";
import { pageMeta, breadcrumbLd, faqLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";

export const metadata = pageMeta({
  title: "What's in your cup · paper outside, PHA inside",
  description: `Every Made to Disappear cup is paper with a PHA lining, certified home-compostable by ${site.certifier}. What PHA is, how it compares to PLA, water-based coatings and conventional plastic, and the two questions to ask any cup supplier.`,
  path: "/whats-in-your-cup",
  image: "/products/MTD-CUP-16H-front.jpg",
  imageAlt: "A 16 oz paper hot cup",
});

const LININGS: [string, string, string, string][] = [
  ["PHA (Made to Disappear)", "Made by microorganisms from renewable feedstocks", "Home compost (certified)", `Our cup is certified home-compostable by ${site.certifier}`],
  ["PLA", "Plant sugars (often corn or sugarcane), fermented and processed into plastic", "Industrial compost facilities", "Needs the high heat of a commercial facility, and many facilities don&rsquo;t accept cups"],
  ["Water-based coating", "Varies. “Water-based” describes how it&rsquo;s applied, not what it&rsquo;s made of", "Depends on the polymer", "Some are certified compostable, others are plastics designed for recycling. Ask what the polymer is"],
  ["Conventional plastic (PE)", "Petroleum", "Doesn&rsquo;t compost", "Recyclable only where facilities accept cups"],
];

const FAQ: [string, string][] = [
  ["Is PHA a plastic?", "PHA is a biopolymer. It does the job of a plastic in the cup, holding hot liquid and sealing the seam, but it&rsquo;s made by microbes and broken down by them."],
  ["Will it hold up to hot coffee?", "Yes. These are hot cups, built for coffee and tea."],
  ["How long does it take to compost?", "Home-compost certification requires the material to break down within 12 months in home-compost conditions. A warm, active pile works fastest."],
  ["Is it the same as a PLA cup?", "No. PLA is designed for industrial composting. Our PHA-lined cup is certified for home composting. See the comparison above."],
  ["Can I see the certificate?", "Yes. Please email us and we&rsquo;ll send them over."],
];

export default function WhatsInYourCupPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-8">
      <PageHeader eyebrow="What's actually in your cup" title="Paper on the outside. PHA on the inside. Nothing to hide." description={`Every Made to Disappear cup is a paper cup with a PHA lining, certified home-compostable by ${site.certifier}. Here's what that means, and how it compares to the other cups on the market.`} />

      <div className="mx-auto mt-12 grid max-w-6xl gap-10 md:grid-cols-[1fr_1.1fr] md:items-start md:gap-14">
        <Reveal>
          <div className="relative aspect-square overflow-hidden rounded-[24px] bg-mint on-cream">
            <Image src="/products/MTD-CUP-16H-front.jpg" alt="A 16 oz paper hot cup, one on its side showing the certification mark on its base" fill priority sizes="(min-width: 768px) 45vw, 100vw" className="object-contain p-6" />
          </div>
        </Reveal>
        <div className="space-y-10 text-[16px] leading-7 text-soil/85">
          <Reveal as="section">
            <h2 className="t-page text-forest">Every paper cup has a lining</h2>
            <p className="mt-4">Paper on its own soaks up liquid, so every hot cup needs a thin barrier on the inside to hold your coffee. That lining decides what the cup is really made of, and what happens to it after.</p>
            <p className="mt-3">Most cups use conventional plastic. Some use PLA. Some use a water-based coating. Ours uses PHA.</p>
          </Reveal>
          <Reveal as="section">
            <h2 className="t-page text-forest">What is PHA?</h2>
            <p className="mt-4">PHA (polyhydroxyalkanoate) is a material made by microorganisms. They produce it naturally, as a way to store energy, when they&rsquo;re fed renewable feedstocks.</p>
            <p className="mt-3">The same kinds of microbes that make PHA can break it down. That&rsquo;s why it works as a cup lining: it holds hot coffee like a plastic does, then goes back to nature when you&rsquo;re done with it.</p>
            <p className="mt-3">
              In short: made by nature, unmade by nature. <strong className="font-semibold text-forest">Made to disappear.</strong>
            </p>
          </Reveal>
          <Reveal as="section" className="rounded-[20px] bg-cream p-6">
            <h2 className="t-heading text-forest">What you&rsquo;re getting</h2>
            <ul className="mt-4 space-y-3">
              {[
                ["Paper cup with a PHA lining.", "That's the full material list for the cup."],
                ["Certified home-compostable.", `Certified by ${site.certifier} to break down in a backyard compost, not just in an industrial facility.`],
                ["No petroleum plastic in the lining.", ""],
                ["Built for hot drinks.", "Single-wall hot cups in 8, 12 and 16 oz."],
              ].map(([h, t]) => (
                <li key={h} className="flex gap-3">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-forest" aria-hidden="true" />
                  <span>
                    <strong className="font-semibold text-forest">{h}</strong> {t}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>

      <section className="mx-auto mt-16 max-w-6xl md:mt-24">
        <Reveal>
          <h2 className="t-section text-forest">How PHA compares</h2>
          <p className="mt-3 text-soil/75">The four linings you&rsquo;ll see on paper cups today:</p>
        </Reveal>
        <div className="mt-6 overflow-x-auto rounded-[20px] bg-cream">
          <table className="price-table w-full text-sm">
            <thead>
              <tr>
                <th>Lining</th>
                <th>Made from</th>
                <th>Where it breaks down</th>
                <th>Good to know</th>
              </tr>
            </thead>
            <tbody>
              {LININGS.map(([lining, from, where, note], i) => (
                <tr key={lining} className={i === 0 ? "bg-mint-light font-medium text-forest" : ""}>
                  <td className="wrap font-semibold">{lining}</td>
                  <td className="wrap">{from}</td>
                  <td className="wrap">{where}</td>
                  <td className="wrap">{note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-2 md:gap-12">
          <Reveal as="section" className="text-[16px] leading-7 text-soil/85">
            <h3 className="t-heading text-forest">PHA vs PLA</h3>
            <p className="mt-4">Both are made from renewable sources, and both get called &ldquo;compostable.&rdquo; The difference is where.</p>
            <p className="mt-3">PLA is made by fermenting plant sugars into lactic acid, then turning that into a plastic. It&rsquo;s designed to break down in industrial composting, where piles run hot for weeks. In a backyard bin, or anywhere cooler, it breaks down very slowly. If your local facility doesn&rsquo;t take compostable cups, a PLA cup usually isn&rsquo;t composted at all.</p>
            <p className="mt-3">PHA is made directly by microbes, and microbes break it down. Our cups are certified to compost at home, so they don&rsquo;t depend on a facility accepting them.</p>
          </Reveal>
          <Reveal as="section" className="text-[16px] leading-7 text-soil/85">
            <h3 className="t-heading text-forest">PHA vs water-based coatings</h3>
            <p className="mt-4">&ldquo;Water-based&rdquo; sounds like it should mean natural, but it only describes the method. The polymer is dispersed in water, painted onto the paper, and dried. That polymer could be a compostable material or a conventional plastic.</p>
            <p className="mt-3">Some water-based cups are certified compostable, and some aren&rsquo;t. The only way to know is to ask what the lining is made of and check the certificate. With us, the answer is simple: PHA, certified home-compostable.</p>
          </Reveal>
        </div>
      </section>

      <section className="band-mint relative left-1/2 mt-16 w-screen -translate-x-1/2 md:mt-24">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-2 md:gap-14 md:py-20">
          <Reveal>
            <h2 className="t-page text-forest">After your coffee</h2>
            <ol className="mt-6 space-y-4">
              {[
                ["Home compost", "Tear the cup into pieces and add it to your backyard compost with your food scraps. Smaller pieces break down faster."],
                ["Curbside food-scraps collection", "Programs vary by city. Check what yours accepts before putting cups in."],
                ["Lids and sleeves", "These are separate items. Check their own labels for disposal."],
              ].map(([h, t], i) => (
                <li key={h} className="flex gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-forest font-display text-[15px] font-bold text-cream tnum">{i + 1}</span>
                  <div>
                    <p className="font-display text-[17px] font-semibold text-forest">{h}</p>
                    <p className="mt-1 text-[15px] leading-6 text-forest/80">{t}</p>
                  </div>
                </li>
              ))}
            </ol>
            <Link href="/compost" className="btn btn-outline mt-7">
              The full composting guide
            </Link>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="rounded-[24px] bg-forest p-7 text-cream md:p-9">
              <h2 className="t-page text-cream">Two questions to ask any cup supplier</h2>
              <p className="mt-4 text-cream/80">
                Words like <em>compostable</em>, <em>plant-based</em> and <em>water-based</em> get used loosely. Two questions cut through it:
              </p>
              <ol className="mt-5 space-y-4">
                {[
                  ["What polymer is the lining made of?", ""],
                  ["What does the certificate actually cover?", "Home or industrial composting, and the finished cup or just the material?"],
                ].map(([h, t], i) => (
                  <li key={h} className="flex gap-4">
                    <span className="t-serif-italic shrink-0 text-[30px] leading-none text-butter tnum">{i + 1}</span>
                    <div>
                      <p className="font-display text-[17px] font-semibold">{h}</p>
                      {t ? <p className="mt-1 text-[15px] leading-6 text-cream/75">{t}</p> : null}
                    </div>
                  </li>
                ))}
              </ol>
              <p className="mt-6 font-display font-semibold">We&rsquo;ll answer both for you, every time.</p>
              <Link href="/certifications" className="btn btn-paper mt-5">
                See every certificate
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-3xl md:mt-24">
        <Reveal>
          <h2 className="t-section text-center text-forest">Questions</h2>
        </Reveal>
        <RevealGroup className="mt-8 space-y-3" step={0.05}>
          {FAQ.map(([q, a]) => (
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

      <Reveal className="mt-16 md:mt-24">
        <div className="band-peach grid gap-6 rounded-[24px] px-6 py-10 md:grid-cols-[1fr_auto] md:items-center md:px-12 md:py-14">
          <div>
            <h2 className="t-page text-forest">Try them in your café.</h2>
            <p className="mt-2 text-forest/80">We&rsquo;ll send you sample cups so you can test them on your own bar.</p>
          </div>
          <Link href="/business?kind=sample#quote" className="btn btn-primary btn-lg">
            Get samples
          </Link>
        </div>
      </Reveal>
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "What's in your cup", path: "/whats-in-your-cup" },
          ]),
          faqLd(FAQ),
        ]}
      />
    </div>
  );
}
