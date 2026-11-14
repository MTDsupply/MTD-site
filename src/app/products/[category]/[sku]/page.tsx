import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getCatalog, getLiveProducts } from "@/lib/catalog/queries";
import { ProductGallery } from "@/components/ProductGallery";
import { CertChip } from "@/components/CertChip";
import { AddToCart } from "@/components/AddToCart";
import { SpecTable } from "@/components/SpecTable";
import { PairedAdd } from "@/components/PairedAdd";
import { StickyBuyBar } from "@/components/StickyBuyBar";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { photoFor, sharedPhoto } from "@/lib/catalog/assets";
import { restockNote } from "@/lib/site";
import { money, unitMoney, count } from "@/lib/format";
import { BULK_MIN_UNITS, PRINT_MIN_UNITS } from "@/lib/pricing";
import { taglines } from "@/lib/copy";
import { pageMeta, productLd, breadcrumbLd, faqLd, productPath } from "@/lib/seo";
import { productFaq } from "@/lib/faq";
import { JsonLd } from "@/components/JsonLd";

export async function generateStaticParams() {
  const products = await getLiveProducts();
  return products.map((p) => ({ category: p.categorySlug, sku: p.sku.toLowerCase() }));
}

export async function generateMetadata({ params }: PageProps<"/products/[category]/[sku]">): Promise<Metadata> {
  const { sku } = await params;
  const { products } = await getCatalog();
  const p = products.find((x) => x.sku.toLowerCase() === sku.toLowerCase());
  if (!p) return {};
  const volume = p.bulkUnitPrice != null ? ` ${unitMoney(p.bulkUnitPrice)} each from ${count(BULK_MIN_UNITS)} units.` : "";
  return pageMeta({
    title: `${p.name}, certified home-compostable (${p.sku})`,
    description: `${p.name} in ${p.material}${p.specs.capacity ? `, ${p.specs.capacity}` : ""}. 100% certified home-compostable material, TÜV Austria. ${money(
      p.casePrice,
    )} per case of ${count(p.caseCount)} (${unitMoney(p.unitPrice)} each).${volume} Packs of ${count(p.packCount)} from ${money(p.packPrice)}. Ships to Canada and the US.`,
    path: productPath(p),
    image: p.photo ?? null,
    imageAlt: p.name,
  });
}

/** True of every product; the row under the description. */
const CUP_FACTS = ["paper with a PHA lining", "100% certified home-compostable material", "certified by TÜV Austria"];
const LID_FACTS = ["PHA, the same material as the lining", "100% certified home-compostable material", "certified by TÜV Austria"];

export default async function ProductPage({ params }: PageProps<"/products/[category]/[sku]">) {
  const { category, sku } = await params;
  const catalog = await getCatalog();
  const product = catalog.products.find((x) => x.sku.toLowerCase() === sku.toLowerCase());
  const cat = catalog.categories.find((c) => c.slug === category);
  if (!product || !cat || product.categorySlug !== cat.slug) notFound();

  const cert = catalog.certs.find((c) => c.id === product.certId);
  const isLid = cat.slug === "lids";
  const siblings = catalog.products.filter((p) => p.categorySlug === cat.slug && p.status === "live").sort((a, b) => a.sortOrder - b.sortOrder);
  const name = product.name.toLowerCase();
  const tagline = taglines[product.sku];

  // The gallery: the product alone, then the base mark, then the shared shots.
  const own = [
    { src: product.photo ?? null, alt: name },
    { src: photoFor(product.sku, "alt"), alt: isLid ? `${name} on a 12 oz cup` : `${name} on its side, the mark on its base showing` },
  ];
  const shared = isLid
    ? [
        { src: sharedPhoto("life-hand"), alt: "A barista holding a lidded cup" },
        { src: sharedPhoto("case"), alt: "A shipping case of cups, flaps open" },
      ]
    : [
        { src: sharedPhoto("lid-on"), alt: "The 12 oz cup wearing the lid" },
        { src: sharedPhoto("trio"), alt: "The 8, 12 and 16 oz cups side by side" },
        { src: sharedPhoto("life-hand"), alt: "A barista holding a lidded cup" },
        { src: sharedPhoto("case"), alt: "A shipping case of cups, flaps open" },
      ];
  const photos = [...own, ...shared].filter((p): p is { src: string; alt: string } => !!p.src);

  const goesWith = product.goesWith
    .map((s) => catalog.products.find((p) => p.sku === s))
    .filter((p): p is NonNullable<typeof p> => !!p && p.status === "live");
  const faq = productFaq(product, catalog);
  const counter = sharedPhoto("life-counter");
  // The rest of the range, the paired product first.
  const related = catalog.products
    .filter((p) => p.status === "live" && p.sku !== product.sku)
    .sort((a, b) => Number(product.goesWith.includes(b.sku)) - Number(product.goesWith.includes(a.sku)) || a.sortOrder - b.sortOrder)
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <nav aria-label="Breadcrumb" className="t-label">
        <Link href="/products" className="hover:underline">
          products
        </Link>{" "}
        /{" "}
        <Link href={`/products/${cat.slug}`} className="hover:underline">
          {cat.name.toLowerCase()}
        </Link>{" "}
        / <span className="sku">{product.sku}</span>
      </nav>

      <div className="mt-5 grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:gap-14">
        {/* the photographs */}
        <div>
          <ProductGallery name={product.name} photos={photos} />
          <div className="mt-6 hidden items-center gap-5 border border-line bg-card p-4 lg:flex">
            <div className="relative h-[88px] w-[88px] shrink-0 overflow-hidden bg-card">
              {sharedPhoto("case") ? <Image src={sharedPhoto("case")!} alt="" fill sizes="88px" className="object-cover" /> : null}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[17px] font-medium text-ink">need your logo on the cup?</p>
              <p className="mt-1 text-[14px] text-stone">{`We print on orders of ${count(PRINT_MIN_UNITS)} cups or more. Tell us the sizes and the quantity and we reply with a price.`}</p>
            </div>
            <Link href="/custom-printing" className="btn btn-outline btn-sm shrink-0">
              get a quote
            </Link>
          </div>
        </div>

        {/* the buy box */}
        <div>
          <p className="t-label">
            {cat.name.toLowerCase()} · <span className="sku">{product.sku}</span>
          </p>
          <h1 className="t-section mt-3 text-ink">{name}.</h1>
          <p className="t-lead mt-4 max-w-[40ch] text-ink">
            {tagline ? `${tagline.charAt(0).toUpperCase()}${tagline.slice(1)} ` : ""}
            {product.material}, {count(product.caseCount)} to a case.
          </p>
          <div className="mt-3">
            <CertChip cert={cert} sku={product.sku} compact />
          </div>

          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-y border-line py-3" aria-label="About this product">
            {(isLid ? LID_FACTS : CUP_FACTS).map((f) => (
              <li key={f} className="t-label flex items-center gap-2 !text-stone">
                <span aria-hidden="true" className="inline-block h-1.5 w-1.5 rounded-full bg-ink" />
                {f}
              </li>
            ))}
          </ul>

          {siblings.length > 1 ? (
            <div className="mt-6">
              <p className="t-label">size</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {siblings.map((s) => (
                  <Link
                    key={s.sku}
                    href={`/products/${cat.slug}/${s.sku.toLowerCase()}`}
                    aria-current={s.sku === product.sku ? "page" : undefined}
                    className="size-pill"
                  >
                    {s.size}
                  </Link>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-6">
            <AddToCart product={product} />
            {restockNote(cat.restockWhen) ? <p className="mt-3 text-[13px] text-stone">{restockNote(cat.restockWhen)}. Orders placed now are filled from that stock.</p> : null}
          </div>

          {goesWith.length ? (
            <div className="mt-8">
              <p className="t-label">{isLid ? "fits these cups" : "pair it with"}</p>
              <div className="mt-2 grid gap-2">
                {goesWith.map((p) => (
                  <PairedAdd key={p.sku} product={p} />
                ))}
              </div>
            </div>
          ) : null}

          <details className="group mt-8 border-y border-line">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-[17px] font-medium text-ink">
              details and specs.
              <span aria-hidden="true" className="text-[22px] font-light leading-none transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <div className="spec-wrap pb-4">
              <SpecTable product={product} cert={cert} />
            </div>
          </details>

          <StickyBuyBar product={product} />
        </div>
      </div>

      <Reveal as="section" className="mt-16 md:mt-24">
        <h2 className="t-section text-ink">questions about the {name}.</h2>
        <div className="mt-6 divide-y divide-line border-y border-line">
          {faq.map(([q, a]) => (
            <details key={q} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[17px] font-medium text-ink">
                <h3 className="text-[17px] font-medium">{q}</h3>
                <span aria-hidden="true" className="text-[22px] font-light leading-none transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 max-w-[62ch] text-[15px] leading-6 text-stone">{a}</p>
            </details>
          ))}
        </div>
      </Reveal>

      {counter ? (
        <Reveal as="section" className="mt-16 grid md:mt-24 md:grid-cols-2">
          <div className="relative aspect-[3/2] overflow-hidden bg-soil-band md:aspect-auto md:min-h-[460px]">
            <Image src={counter} alt="A lidded cup on a café counter beside a croissant" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
          </div>
          <div className="flex flex-col justify-center border border-line bg-card p-8 md:border-l-0 md:p-12">
            <p className="t-label">after the coffee</p>
            <h2 className="t-page mt-3 text-ink">the whole thing goes in the compost.</h2>
            <p className="mt-4 max-w-[36ch] text-[16px] leading-[1.6] text-stone">
              Cup, lid and grounds together. The paper and the PHA lining break down in a home pile at ordinary temperatures, which is what the TÜV Austria home-compostable certification tests for.
            </p>
            <p className="mt-6">
              <Link href="/compost" className="btn btn-outline">
                how to compost it
              </Link>
            </p>
          </div>
        </Reveal>
      ) : null}

      {related.length ? (
        <Reveal as="section" className="mt-16 md:mt-24">
          <h2 className="t-section text-ink">goes with it.</h2>
          <div className={`mt-8 grid grid-cols-2 gap-3 md:gap-4 ${related.length >= 3 ? "lg:grid-cols-3" : "lg:grid-cols-2"}`}>
            {related.map((p) => (
              <ProductCard key={p.sku} product={p} categoryName={catalog.categories.find((c) => c.slug === p.categorySlug)?.name.toLowerCase()} />
            ))}
          </div>
        </Reveal>
      ) : null}

      <JsonLd
        data={[
          productLd(product, cert, cat),
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Products", path: "/products" },
            { name: cat.name, path: `/products/${cat.slug}` },
            { name: product.name, path: productPath(product) },
          ]),
          faqLd(faq),
        ]}
      />
    </div>
  );
}
