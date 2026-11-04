import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import { claims } from "@/lib/copy";
import { PageHeader } from "@/components/PageHeader";
import { Reveal, RevealGroup } from "@/components/Reveal";
import { pageMeta, breadcrumbLd, faqLd, howToLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";

export const metadata = pageMeta({
  title: "How to compost a PHA-lined paper cup at home",
  description:
    "Four steps to compost our hot cups and lids in a home pile: finish the drink, lid and cup go in together, mix it in, turn the pile as usual. Plus the questions we get asked: the lining, how long it takes, worm bins and tumblers.",
  path: "/compost",
  image: "/compost-cups.jpg",
  imageAlt: "Two paper hot cups softening and breaking down on a mossy forest floor",
});

const STEPS: [string, string][] = [
  ["Finish the drink", "Tip out any leftover coffee. A rinse is not needed; a little milk or sugar is fine in a compost pile."],
  ["Lid and cup go in together", "Both are made from the same certified material, so there is nothing to separate. Tearing the cup into a few pieces helps it break down sooner."],
  ["Mix it into the pile", "Bury it in the pile with food scraps and garden waste rather than leaving it on top. Air and moisture do the work."],
  ["Turn the pile as usual", "Treat it like the rest of the pile: turn it now and then and keep it damp. Warm, active piles break material down faster than cold ones."],
];

const FAQ: [string, string][] = [
  ["Does the lining come out?", "No. The lining is PHA, a material made by fermentation, and it is part of what the certificate covers. The whole cup, lining included, goes in the pile."],
  ["How long does it take?", `The ${site.certifier} home-compost certification tests breakdown in a home compost pile at ambient temperature, over months rather than weeks. How long it takes in your pile depends on its heat, moisture and how often it is turned.`],
  ["What about a worm bin or a tumbler?", "Both work. Tear the cup up first so the pieces are small, and feed a worm bin a few pieces at a time rather than a whole stack."],
  ["What if I have no compost pile?", "Many cafés and apartment buildings run a shared pile, and some cities collect food scraps at the curb. We only make claims about home composting, which is what the certificate covers, so check what your local collection accepts before putting the cup in it."],
  ["Is it the same for every size?", "Yes. The 8, 12 and 16 oz cups and the lid are each certified separately, and every one of them is made from 100% certified home-compostable material."],
];

export default function CompostPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-8">
      <PageHeader eyebrow="After the coffee" title="How to compost it" description="Into the home compost pile, with the food scraps. Here is the whole method, and the questions we get asked." />

      <div className="mt-10 grid gap-8 md:grid-cols-[1fr_1.1fr] md:items-start md:gap-12">
        <Reveal>
          <figure>
            <div className="relative aspect-[4/3] overflow-hidden border border-line bg-paper-deep">
              <Image src="/compost-cups.jpg" alt="Two paper hot cups softening and breaking down on a mossy forest floor, the certification mark still showing on one base" fill priority sizes="(min-width: 768px) 45vw, 100vw" className="object-cover" />
            </div>
            <figcaption className="mt-2 text-xs text-soil/60">From our film: an illustration of the breakdown. How long it takes depends on the pile.</figcaption>
          </figure>
        </Reveal>
        <div>
          <Reveal>
            <p className="t-label text-sage-deep">Four steps</p>
            <h2 className="t-page mt-2">Serve it. Compost it. Done.</h2>
          </Reveal>
          <RevealGroup className="mt-6 space-y-3" step={0.07}>
            {STEPS.map(([title, text], i) => (
              <div key={title} className="card flex gap-4 bg-white p-5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sage font-display text-[15px] font-bold text-white tnum">{i + 1}</span>
                <div>
                  <h3 className="t-card">{title}</h3>
                  <p className="mt-1 text-sm text-soil/75">{text}</p>
                </div>
              </div>
            ))}
          </RevealGroup>
        </div>
      </div>

      <Reveal as="section" className="mt-14 border-y border-sage bg-white">
        <div className="relative left-1/2 w-screen -translate-x-1/2 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-10 md:py-12">
            <p className="t-label text-sage-deep">What the certificate covers</p>
            <p className="t-heading mt-3 max-w-[40ch] text-soil">{claims.certLine}</p>
            <p className="mt-4 max-w-[62ch] text-soil/80">{claims.whyParagraph}</p>
            <Link href="/certifications" className="link-proof mt-5 inline-block text-sm font-medium">
              See every certificate
            </Link>
          </div>
        </div>
      </Reveal>

      <section className="mt-14 max-w-3xl">
        <Reveal>
          <p className="t-label text-sage-deep">Questions</p>
          <h2 className="t-page mt-2">Asked often.</h2>
        </Reveal>
        <RevealGroup className="mt-6 divide-y divide-line border-y border-line" step={0.05}>
          {FAQ.map(([q, a]) => (
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
      </section>
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "How to compost it", path: "/compost" },
          ]),
          howToLd({
            name: "How to compost a Made to Disappear cup and lid at home",
            description: "Into the home compost pile, with the food scraps, in four steps.",
            steps: STEPS,
            image: "/compost-cups.jpg",
          }),
          faqLd(FAQ),
        ]}
      />

      <Reveal className="mt-14">
        <div className="flex flex-wrap items-center justify-between gap-4 border border-line bg-white p-6">
          <div>
            <p className="t-card">Ready to switch the café over?</p>
            <p className="mt-1 text-sm text-soil/70">Cases for the business, packs for the house.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/products/cups" className="btn btn-primary">
              Shop cups
            </Link>
            <Link href="/business" className="btn btn-outline">
              Business pricing
            </Link>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
