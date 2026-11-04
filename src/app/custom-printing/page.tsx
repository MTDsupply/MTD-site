import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { getCatalog } from "@/lib/catalog/queries";
import { site } from "@/lib/site";
import { PageHeader } from "@/components/PageHeader";
import { QuoteForm } from "@/components/QuoteForm";
import { Reveal, RevealGroup } from "@/components/Reveal";
import { pageMeta } from "@/lib/seo";

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
      <PageHeader eyebrow="Your mark on the cup" title="Custom printing" description="The same cup, the same certified material, with your logo on the side. From 100 cases." />

      <div className="mt-10 grid gap-8 md:grid-cols-[1.1fr_1fr] md:items-center md:gap-12">
        <Reveal>
          <div className="relative aspect-[4/3] overflow-hidden border border-line bg-white">
            <Image src="/products/MTD-CUP-16H-front.jpg" alt="A 16 oz hot cup, plain white, ready for printing" fill priority sizes="(min-width: 768px) 50vw, 100vw" className="object-contain" />
          </div>
        </Reveal>
        <div>
          <Reveal>
            <p className="t-label text-sage-deep">How it works</p>
            <h2 className="t-page mt-2">Send the artwork. We send a proof.</h2>
          </Reveal>
          <RevealGroup className="mt-6 space-y-3" step={0.07}>
            {[
              ["Tell us what you need", "Cup sizes, roughly how many cases a year, and what the artwork is: a logo, a wordmark, a pattern."],
              ["We reply with options and pricing", "Within one business day. Pricing depends on the sizes, the artwork and the run, so we quote each job rather than publish one number."],
              ["Approve the proof", "You see the print on the cup before anything is made. Nothing runs until you sign it off."],
              ["Same material, same certificate", `Printed cups are made from the same 100% certified home-compostable material, certified by ${site.certifier}, as the plain ones.`],
            ].map(([title, text], i) => (
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

      <section id="quote" className="mt-14 scroll-mt-24">
        <Reveal>
          <p className="t-label text-sage-deep">Start a job</p>
          <h2 className="t-heading mt-2">Request custom printing</h2>
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
