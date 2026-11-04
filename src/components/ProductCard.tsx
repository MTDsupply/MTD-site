import Link from "next/link";
import type { Cert, Product } from "@/lib/catalog/types";
import { CertChip } from "./CertChip";
import { ProductImage } from "./ProductImage";
import { Price } from "./Price";
import { AddToCart } from "./AddToCart";
import { restockNote } from "@/lib/site";

/**
 * Catalogue tile: cream rounded card, product photo multiplied onto the cream,
 * a sticker in the corner, name, size, certification link, price and a pill
 * Add to cart. Four across on desktop.
 */
export function ProductCard({
  product,
  cert,
  priority = false,
}: {
  product: Product;
  cert?: Cert;
  categoryDrawing?: string;
  priority?: boolean;
}) {
  const href = `/products/${product.categorySlug}/${product.sku.toLowerCase()}`;
  const photo = product.photo ?? product.images[0] ?? null;
  const restock = restockNote(product.categorySlug);
  const sticker = restock ? { label: restock, cls: "chip chip-clay" } : product.categorySlug === "lids" ? { label: "Fits every cup", cls: "sticker" } : { label: "In stock", cls: "sticker" };

  return (
    <article className="card flex h-full flex-col p-3 md:p-4" data-sku={product.sku}>
      <div className="relative">
        <Link href={href} className="block" aria-label={product.name}>
          <ProductImage src={photo} name={product.name} sku={product.sku} priority={priority} tone="cream" />
        </Link>
        <span className={`absolute left-2 top-2 ${sticker.cls}`}>{sticker.label}</span>
      </div>
      <div className="mt-4 flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
        <h3 className="t-card text-forest">
          <Link href={href} className="hover:underline">
            {product.name}
          </Link>
        </h3>
        <span className="sku text-soil/50">{product.sku}</span>
      </div>
      <p className="mt-0.5 text-sm text-soil/70">
        {product.size} · {product.material}
      </p>
      <div className="mt-1.5">
        <CertChip cert={cert} sku={product.sku} compact />
      </div>
      <div className="mt-3">
        <Price product={product} size="sm" detail={false} />
      </div>
      <div className="mt-3 mt-auto pt-3">
        <AddToCart product={product} compact />
      </div>
    </article>
  );
}
