import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCatalog, getLiveProducts } from "@/lib/catalog/queries";
import { ProductGallery } from "@/components/ProductGallery";
import { CertChip } from "@/components/CertChip";
import { Price } from "@/components/Price";
import { AddToCart } from "@/components/AddToCart";
import { SpecTable } from "@/components/SpecTable";
import { ProductCard } from "@/components/ProductCard";
import { ComingSoonTile } from "@/components/ComingSoonTile";
import { PairedAdd } from "@/components/PairedAdd";
import { StickyBuyBar } from "@/components/StickyBuyBar";
import { photoFor } from "@/lib/catalog/assets";
import { restockNote } from "@/lib/site";
import { money, unitMoney, count } from "@/lib/format";
import { BULK_MIN_UNITS } from "@/lib/pricing";
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

export default async function ProductPage({ params }: PageProps<"/products/[category]/[sku]">) {
  const { category, sku } = await params;
  const catalog = await getCatalog();
  const product = catalog.products.find((x) => x.sku.toLowerCase() === sku.toLowerCase());
  const cat = catalog.categories.find((c) => c.slug === category);
  if (!product || !cat || product.categorySlug !== cat.slug) notFound();

  const cert = catalog.certs.find((c) => c.id === product.certId);
  const siblings = catalog.products
    .filter((p) => p.categorySlug === cat.slug && p.status === "live")
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const photo = product.photo ?? null;
  const angles: { key: string; label: string }[] = [
    { key: "3q", label: "In the open" },
    { key: "base", label: "Base, logo showing" },
    { key: "case", label: "Wrapper" },
  ];

  // "Goes with": paired SKUs (live) and their categories (coming soon tiles).
  const goesWithProducts = product.goesWith
    .map((s) => catalog.products.find((p) => p.sku === s))
    .filter((p): p is NonNullable<typeof p> => !!p && p.status === "live");
  const pairedLid = cat.slug === "cups" ? goesWithProducts.find((p) => p.categorySlug === "lids") ?? null : null;
  const pairedComingSoon = catalog.categories.filter((c) => c.status !== "live" && c.slug === "lids" && cat.slug === "cups");
  const faq = productFaq(product, catalog);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <nav aria-label="Breadcrumb" className="t-label text-soil/55">
        <Link href="/products" className="hover:underline">
          Products
        </Link>{" "}
        /{" "}
        <Link href={`/products/${cat.slug}`} className="hover:underline">
          {cat.name}
        </Link>{" "}
        / <span className="sku">{product.sku}</span>
      </nav>

      <div className="mt-4 grid gap-8 lg:grid-cols-[1.1fr_1fr]">
        {/* Gallery */}
        <div>
          <ProductGallery
            name={product.name}
            photos={[
              ...(photo ? [{ src: photo, alt: product.name }] : []),
              ...angles
                .map((a) => ({ src: photoFor(product.sku, a.key), alt: `${product.name}, ${a.label.toLowerCase()}` }))
                .filter((a): a is { src: string; alt: string } => !!a.src),
            ]}
          />
        </div>

        {/* Buy box */}
        <div>
          <p className="t-label text-sage-deep">{cat.name}</p>
          <h1 className="t-page mt-2">{product.name}</h1>
          <p className="mt-1 text-base text-soil/80">
            {product.material}. 100% certified home-compostable material. {product.caseCount.toLocaleString("en-CA")} per case.{" "}
            <span className="sku text-soil/60">{product.sku}</span>
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <CertChip cert={cert} sku={product.sku} compact />
            {restockNote(cat.slug) ? <span className="chip chip-clay">{restockNote(cat.slug)}</span> : null}
          </div>

          {siblings.length > 1 ? (
            <div className="mt-5">
              <p className="label">Size</p>
              <div className="flex flex-wrap gap-1.5">
                {siblings.map((s) => (
                  <Link
                    key={s.sku}
                    href={`/products/${cat.slug}/${s.sku.toLowerCase()}`}
                    aria-current={s.sku === product.sku ? "page" : undefined}
                    className={`border px-3.5 py-2 text-[12px] uppercase tracking-[0.12em] transition-colors ${
                      s.sku === product.sku ? "border-soil bg-soil text-paper" : "border-line text-soil hover:border-soil"
                    }`}
                  >
                    {s.size}
                  </Link>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-5">
            <Price product={product} size="lg" />
          </div>
          <div className="mt-4 border border-line bg-white p-4">
            <AddToCart product={product} />
            {restockNote(cat.slug) ? <p className="mt-3 text-xs text-soil/70">{restockNote(cat.slug)}. Orders placed now are filled from that stock.</p> : null}
          </div>
          {pairedLid ? (
            <div className="mt-3">
              <PairedAdd product={pairedLid} label="Add the matching lid" />
            </div>
          ) : null}
          {cat.slug === "lids" && goesWithProducts.length ? (
            <p className="mt-4 text-sm text-soil/75">
              Fits{" "}
              {goesWithProducts.map((p, i) => (
                <span key={p.sku}>
                  {i > 0 ? (i === goesWithProducts.length - 1 ? " and " : ", ") : ""}
                  <Link href={`/products/${p.categorySlug}/${p.sku.toLowerCase()}`} className="link font-medium">
                    the {p.size} cup
                  </Link>
                </span>
              ))}
              .
            </p>
          ) : null}
          <StickyBuyBar product={product} />
        </div>
      </div>

      <section className="mt-10 max-w-3xl">
        <div>
          <h2 className="t-heading">Specifications</h2>
          <div className="mt-3 border border-line bg-white p-2">
            <SpecTable product={product} cert={cert} />
          </div>
        </div>
      </section>

      <section className="mt-10 max-w-3xl">
        <h2 className="t-heading">Questions about the {product.name}</h2>
        <div className="mt-3 divide-y divide-line border-y border-line">
          {faq.map(([q, a]) => (
            <details key={q} className="group py-3">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-medium">
                <h3 className="text-[15px] font-medium">{q}</h3>
                <span aria-hidden="true" className="text-sage-deep transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-2 max-w-[62ch] text-sm leading-6 text-soil/80">{a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="t-heading">Goes with</h2>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {goesWithProducts.map((p) => (
            <ProductCard
              key={p.sku}
              product={p}
              cert={catalog.certs.find((c) => c.id === p.certId)}
              categoryDrawing={catalog.categories.find((c) => c.slug === p.categorySlug)?.lineDrawing ?? cat.lineDrawing}
            />
          ))}
          {pairedComingSoon.map((c) => (
            <ComingSoonTile key={c.slug} category={c} compact photo={catalog.products.find((p) => p.categorySlug === c.slug)?.photo ?? null} />
          ))}
        </div>
      </section>
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
