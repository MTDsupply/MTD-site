import Link from "next/link";
import type { Product } from "@/lib/catalog/types";
import { HoverSwap } from "./HoverSwap";
import { CardPrice } from "./Price";
import { restockNoteLower } from "@/lib/site";
import { taglines } from "@/lib/copy";

/**
 * Catalogue card: the photograph is the card. A 2:3 studio shot on the warm
 * sweep fills the tile; the name and what it is for sit in bone over the dark
 * back wall at the top, the from-price, stock line and one outlined "order"
 * button sit over the floor at the bottom. Hover fades to the second shot.
 * The whole tile links to the product page. The card is a container: below
 * 320 px wide (phones two across, the home row of four) it drops the tagline,
 * the stock line and the SKU and puts the price beside a small button, so the
 * text never runs over the cup.
 */
export function ProductCard({
  product,
  priority = false,
  categoryName,
}: {
  product: Product;
  priority?: boolean;
  categoryName?: string;
}) {
  const href = `/products/${product.categorySlug}/${product.sku.toLowerCase()}`;
  const photo = product.photo ?? product.images[0] ?? null;
  const status = restockNoteLower(product.restockWhen) ?? "in stock";
  const tagline = taglines[product.sku];
  const label = categoryName ?? (product.categorySlug === "lids" ? "lids" : "hot cups");

  return (
    <article className="shot-card @container relative flex h-full flex-col overflow-hidden bg-soil-band" data-sku={product.sku}>
      <Link href={href} aria-label={product.name} className="block">
        {photo ? (
          <HoverSwap front={photo} hover={product.hover} alt={product.name} priority={priority} aspect="aspect-[2/3]" sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 50vw" />
        ) : (
          <div className="aspect-[2/3] w-full bg-soil-band" />
        )}
      </Link>

      {/* top: name and use, over the back wall */}
      <div className="pointer-events-none absolute inset-x-0 top-0 p-3.5 @xs:p-5 @md:p-6">
        <div className="flex items-baseline justify-between gap-3">
          <p className="t-label !text-bone/70">{label}</p>
          <span className="sku hidden text-[11px] text-bone/55 @xs:inline">{product.sku}</span>
        </div>
        <h3 className="mt-1.5 text-[17px] font-medium leading-[1.15] tracking-[-0.015em] text-bone @xs:mt-2 @xs:text-[22px] @md:text-[25px]">
          {product.name.toLowerCase()}
        </h3>
        {tagline ? <p className="mt-1.5 hidden max-w-[26ch] text-[14px] leading-[1.35] text-bone/80 @xs:block @md:text-[15px]">{tagline}</p> : null}
      </div>

      {/* bottom: price, stock, order */}
      <div className="absolute inset-x-0 bottom-0 p-3.5 @xs:p-5 @md:p-6">
        <div className="flex items-center justify-between gap-3 @xs:block">
          <div className="pointer-events-none min-w-0">
            <CardPrice product={product} />
            <p className="mt-0.5 hidden text-[13px] text-bone/65 @xs:block">{status}</p>
          </div>
          <Link href={href} className="btn btn-shot btn-sm shrink-0 @xs:mt-4 @xs:flex @xs:w-full @xs:justify-center @xs:py-3">
            order
          </Link>
        </div>
      </div>
    </article>
  );
}
