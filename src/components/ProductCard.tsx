import Link from "next/link";
import type { Cert, Product } from "@/lib/catalog/types";
import { CertChip } from "./CertChip";
import { ProductImage } from "./ProductImage";
import { Price } from "./Price";
import { AddToCart } from "./AddToCart";
import { restockNote } from "@/lib/site";

/**
 * Catalogue card: image, name, size, material, cert chip, price per unit and
 * per case, Add to cart. Dense; four across on desktop.
 */
export function ProductCard({
  product,
  cert,
  categoryDrawing,
  priority = false,
}: {
  product: Product;
  cert?: Cert;
  categoryDrawing: string;
  priority?: boolean;
}) {
  const href = `/products/${product.categorySlug}/${product.sku.toLowerCase()}`;
  const drawing = product.drawing ?? categoryDrawing;
  const photo = product.photo ?? product.images[0] ?? null;

  return (
    <article className="card glass flex h-full flex-col p-3" data-sku={product.sku}>
      <Link href={href} className="block" aria-label={product.name}>
        <ProductImage src={photo} drawing={drawing} name={product.name} sku={product.sku} priority={priority} />
      </Link>
      <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
        <h3 className="t-card text-[17px] leading-[22px]">
          <Link href={href} className="hover:underline">
            {product.name}
          </Link>
        </h3>
        <span className="sku text-soil/60">{product.sku}</span>
      </div>
      <p className="mt-0.5 text-sm text-soil/70">
        {product.size} · {product.material}
      </p>
      <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
        <CertChip cert={cert} sku={product.sku} compact />
        {restockNote(product.categorySlug) ? <span className="chip chip-clay">{restockNote(product.categorySlug)}</span> : null}
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
