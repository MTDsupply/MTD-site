import Link from "next/link";
import type { Category, Cert, Product } from "@/lib/catalog/types";
import { ProductImage } from "./ProductImage";
import { CertChip } from "./CertChip";
import { PriceFrom } from "./Price";
import { AddToCart } from "./AddToCart";

/** Large in-stock card for the home page: price-from, size options, Add to cart. */
export function CategoryTile({ category, products, certs }: { category: Category; products: Product[]; certs: Cert[] }) {
  const lead = products[0];
  const cert = certs.find((c) => c.id === lead.certId);
  const cheapest = [...products].sort((a, b) => a.packPrice - b.packPrice)[0];

  return (
    <article className="card glass grid gap-4 p-4 sm:grid-cols-[200px_minmax(0,1fr)]">
      <Link href={`/products/${category.slug}`} aria-label={category.name}>
        <ProductImage
          src={lead.photo ?? lead.images[0] ?? null}
          drawing={lead.drawing ?? category.lineDrawing}
          name={lead.name}
          sku={lead.sku}
        />
      </Link>
      <div className="flex min-w-0 flex-col">
        <h3 className="t-card">
          <Link href={`/products/${category.slug}`} className="hover:underline">
            {category.name}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-soil/70">
          {lead.material} · {category.description}
        </p>
        <div className="mt-2">
          <CertChip cert={cert} sku={lead.sku} />
        </div>
        <p className="mt-3 text-base font-medium">
          <PriceFrom product={cheapest} />
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5" aria-label="Sizes">
          {products.map((p) => (
            <Link
              key={p.sku}
              href={`/products/${category.slug}/${p.sku.toLowerCase()}`}
              className="border border-line px-2.5 py-1 text-sm hover:border-sage hover:text-sage-deep"
            >
              {p.size}
            </Link>
          ))}
        </div>
        <div className="mt-4">
          <AddToCart product={lead} compact />
        </div>
      </div>
    </article>
  );
}
