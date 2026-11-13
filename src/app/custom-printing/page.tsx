import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { getCatalog } from "@/lib/catalog/queries";
import { site } from "@/lib/site";
import { PageHeader } from "@/components/PageHeader";
import { QuoteForm } from "@/components/QuoteForm";
import { Reveal, RevealGroup } from "@/components/Reveal";
import { pageMeta } from "@/lib/seo";
import { v } from "@/lib/asset-version";

export const metadata = pageMeta({
  title: "Custom printed compostable cups · your logo, from 100 cases",
  description:
    "Your logo on the same 8, 12 or 16 oz PHA-lined paper hot cup, 100% certified home-compostable material (TÜV Austria). From 100 cases. Send the artwork, get options and pricing within one business day, approve a proof before anything runs.",
  path: "/custom-printing",
  image: "/products/MTD-CUP-16H-front.jpg",
  imageAlt: "A 16 oz hot cup, plain white, ready for printing",
});

export default async function CustomPrintingPage() {
  const { categories } = await getCatalog();
  const sorted = [...categories].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-8">
      <PageHeader eyebrow="Your mark on the cup" title="custom printing." description="The same cup, the same certified material, with your logo on the side. From 100 cases." />

      <div className="mt-10 grid gap-8 md:grid-cols-[1.1fr_1fr] md:items-center md:gap-12">
        <Reveal>
          <div className="relative aspect-[4/5] overflow-hidden bg-card">
            <Image src={v("/products/MTD-CUP-16H-front.jpg")} alt="A 16 oz hot cup, plain white, ready for printing" fill priority sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
          </div>
        </Reveal>
        <div>
          <Reveal>
            <p className="t-label">three steps</p>
            <h2 className="t-page mt-2">how it works.</h2>
          </Reveal>
          <RevealGroup className="mt-6 divide-y divide-line border-y border-line" step={0.07}>
            {[
              ["tell us what you need", "Cup sizes, roughly how many cases a year, and what the artwork is: a logo, a wordmark, a pattern."],
              ["we reply with options and pricing", "Within one business day. Pricing depends on the sizes, the artwork and the run, so we quote each job rather than publish one number."],
              ["approve the proof", "You see the print on the cup before anything is made. Nothing runs until you sign it off."],
            ].map(([title, text], i) => (
              <div key={title} className="grid grid-cols-[48px_1fr] py-4">
                <p className="t-label pt-1 tnum">0{i + 1}</p>
                <div>
                  <h3 className="t-card">{title}.</h3>
                  <p className="mt-1 text-[15px] text-ink">{text}</p>
                </div>
              </div>
            ))}
          </RevealGroup>
          <p className="note mt-6 text-[15px]">Printed cups are the same cup: made from the same 100% certified home-compostable material, certified by {site.certifier}.</p>
        </div>
      </div>

      <section id="quote" className="mt-14 scroll-mt-24">
        <Reveal>
          <p className="t-label">start a job</p>
          <h2 className="t-heading mt-2">request custom printing.</h2>
          <p className="mt-1 max-w-[62ch] text-sm text-soil/70">
            Put the artwork details and the sizes you want in the notes. If you would rather see the plain cups first,{" "}
            <Link href="/business?kind=sample#quote" className="link font-medium">
              ask for a sample pack
            </Link>
            .
          </p>
        </Reveal>
        <div className="mt-4">
          <Suspense fallback={null}>
            <QuoteForm categories={sorted} presetKind="printing" />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
