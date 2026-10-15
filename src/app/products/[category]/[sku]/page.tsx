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
import { photoFor } from "@/lib/catalog/assets";

export async function generateStaticParams() {
  const products = await getLiveProducts();
  return products.map((p) => ({ category: p.categorySlug, sku: p.sku.toLowerCase() }));
}

export async function generateMetadata({ params }: PageProps<"/products/[category]/[sku]">): Promise<Metadata> {
  const { sku } = await params;
  const { products } = await getCatalog();
  const p = products.find((x) => x.sku.toLowerCase() === sku.toLowerCase());
  if (!p) return {};
  return {
    title: `${p.name} (${p.sku})`,
    description: `${p.name}. ${p.material}. 100% certified home-compostable material. ${p.caseCount.toLocaleString("en-CA")} per case.`,
  };
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
  const pairedComingSoon = catalog.categories.filter((c) => c.status !== "live" && c.slug === "lids" && cat.slug === "cups");

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
          <div className="mt-3 flex items-center gap-3">
            <CertChip cert={cert} sku={product.sku} />
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
                    className={`rounded-[4px] border px-3 py-1.5 text-sm ${
                      s.sku === product.sku ? "border-sage bg-sage text-white" : "border-line hover:border-sage"
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
          </div>
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
    </div>
  );
}
