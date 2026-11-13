import Link from "next/link";
import type { Cert, Product } from "@/lib/catalog/types";
import { CertChip } from "./CertChip";
import { HoverSwap } from "./HoverSwap";
import { Price } from "./Price";
import { AddToCart } from "./AddToCart";
import { restockNoteLower } from "@/lib/site";
import { taglines } from "@/lib/copy";

/**
 * Catalogue card (brand card): a paper tile with a hairline. The 4:5 photo
 * fills the top, then the name, what it is for, size, material and rim on
 * hairlines, the certification, the price that follows the Business/Consumer
 * toggle, the stock line and the add control. Hover fades the photo to the
 * standing shot. Two across on the catalogue page.
 */
export function ProductCard({
  product,
  cert,
  priority = false,
  categoryName,
}: {
  product: Product;
  cert?: Cert;
  categoryDrawing?: string;
  priority?: boolean;
  categoryName?: string;
}) {
  const href = `/products/${product.categorySlug}/${product.sku.toLowerCase()}`;
  const photo = product.photo ?? product.images[0] ?? null;
  const status = restockNoteLower(product.restockWhen) ?? "in stock";
  const tagline = taglines[product.sku];

  return (
    <article className="card flex h-full flex-col bg-card" data-sku={product.sku}>
      <Link href={href} className="block" aria-label={product.name}>
        {photo ? (
          <HoverSwap front={photo} hover={product.hover} alt={product.name} priority={priority} sizes="(min-width: 1024px) 24vw, (min-width: 768px) 40vw, 100vw" />
        ) : (
          <div className="aspect-[4/5] w-full bg-card" />
        )}
      </Link>
      <div className="flex flex-1 flex-col p-5 md:p-6">
        <div className="flex items-baseline justify-between gap-3">
          <p className="t-label">{categoryName ?? (product.categorySlug === "lids" ? "lids" : "hot cups")}</p>
          <span className="sku text-ash">{product.sku}</span>
        </div>
        <h3 className="t-page mt-2 text-ink">
          <Link href={href} className="hover:underline">
            {product.name.toLowerCase()}
          </Link>
        </h3>
        {tagline ? <p className="mt-1 text-[15px] text-stone">{tagline}</p> : null}
        <p className="mt-3 text-[14px] text-stone">
          {[product.specs.capacity ?? product.size, product.material, product.specs.rimDiameter ? `${product.specs.rimDiameter} rim` : null].filter(Boolean).join(" · ")}
        </p>
        <div className="mt-2">
          <CertChip cert={cert} sku={product.sku} compact />
        </div>
        <div className="mt-4">
          <Price product={product} size="md" detail={false} />
        </div>
        <p className="mt-1 text-[13px] text-stone">{status}</p>
        <div className="mt-auto pt-5">
          <AddToCart product={product} compact />
        </div>
      </div>
    </article>
  );
}
