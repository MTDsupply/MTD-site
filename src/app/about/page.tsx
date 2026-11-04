import Link from "next/link";
import Image from "next/image";
import { site } from "@/lib/site";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: `About us · ${site.city}, ${site.province}`,
  description: `${site.name} is a foodservice disposables supplier in ${site.city}, ${site.province}, founded by Sullivan Bryan and Jack Hill. We make hot cups and lids from 100% certified home-compostable material, certified by TÜV Austria per SKU, and Cup Casa is our café cup brand.`,
  path: "/about",
});

const TEAM = [
  { name: "Sullivan Bryan", role: "Chief Executive Officer", photo: "/team/sullivan-bryan.jpg", alt: "Sullivan Bryan, in a dark suit, outdoors" },
  { name: "Jack Hill", role: "President and Chief Operating Officer", photo: "/team/jack-hill.jpg", alt: "Jack Hill, in a light blue shirt, under a garden pergola" },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-8">
      <PageHeader eyebrow="Our story" title="About" description="Who we are, where the stock sits, and why the name." image="/atmosphere/meadow.jpg" imageAlt="Meadow grasses in late light below a sage hillside" />

      <Reveal as="section" className="mt-10 space-y-4 text-base text-soil/85">
        <h2 className="t-heading">Who</h2>
        <p>
          Made to Disappear is a foodservice disposables supplier based in {site.city}, {site.province}. We make cups and lids from 100% certified home-compostable material, certified by TÜV Austria per SKU, and sell them by the case to businesses and in smaller packs to anyone else.
        </p>
        <p>
          Cup Casa, the café cup brand, is a product line of Made to Disappear. If you have seen a Cup Casa cup, you have seen one of ours.
        </p>
      </Reveal>

      <Reveal as="section" className="mt-10">
        <h2 className="t-heading">Our founders</h2>
        <ul className="mt-5 grid gap-6 sm:grid-cols-2">
          {TEAM.map((m) => (
            <li key={m.name} className="card bg-white p-3">
              <div className="relative aspect-[4/5] overflow-hidden bg-paper-deep">
                <Image src={m.photo} alt={m.alt} fill quality={90} sizes="(min-width: 640px) 360px, 100vw" className="object-cover" />
              </div>
              <p className="t-card mt-3">{m.name}</p>
              <p className="mt-0.5 text-sm text-soil/70">{m.role}</p>
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal as="section" className="mt-10 space-y-4 text-base text-soil/85">
        <h2 className="t-heading">Where the stock sits</h2>
        <p>
          Stock ships from Victoria, BC, by courier and by pallet across Canada and the United States.
        </p>
      </Reveal>

      <Reveal as="section" className="mt-10 space-y-4 text-base text-soil/85">
        <h2 className="t-heading">Why the name</h2>
        <p className="t-heading border-l-2 border-sage pl-5 text-soil">
          A cup is used for twenty minutes. It should not need two hundred years to go away.
        </p>
        <p>
          Every product we sell is designed and certified to break down in a home compost pile, which is the only kind of composting most people actually have.
        </p>
        <p>
          We say what each product is made of and what it is certified for, and nothing more. The{" "}
          <Link href="/certifications" className="link-proof font-medium">
            certifications page
          </Link>{" "}
          is the whole claim.
        </p>
      </Reveal>

      <section className="mt-10 border border-line bg-white p-5 text-sm">
        <p>
          {site.legalName} · {site.city}, {site.province}, {site.country} ·{" "}
          <a href={`mailto:${site.email}`} className="link">
            {site.email}
          </a>
          {site.phone && site.phoneHref ? (
            <>
              {" "}
              ·{" "}
              <a href={site.phoneHref} className="tnum link">
                {site.phone}
              </a>
            </>
          ) : null}
        </p>
      </section>
    </div>
  );
}
