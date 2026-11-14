import Link from "next/link";
import type { Product } from "@/lib/catalog/types";
import { HoverSwap } from "./HoverSwap";
import { CardPrice } from "./Price";
import { taglines } from "@/lib/copy";

/**
 * Catalogue card: the photograph is the card. A 2:3 studio shot on the dark
 * green sweep fills the tile; the name and what it is for sit in white over the
 * back wall at the top, the from-price and one outlined "order" button sit
 * over the floor at the bottom; the button is raw bamboo with a 3 px base so it reads as the one thing to press. The stock line lives on the product page. Hover fades to the second shot.
 * The whole tile links to the product page. The card is a container: below
 * 240 px wide (phones two across) it drops the tagline
 * and the SKU and puts the price beside a small button, so the
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
  const tagline = taglines[product.sku];
  const label = categoryName ?? (product.categorySlug === "lids" ? "lids" : "hot cups");

  return (
    <article className="shot-card @container relative aspect-[2/3] h-full overflow-hidden" data-sku={product.sku}>
      {/* The photo well is 12% taller than the card and anchored above it, so the product sits in the middle band, clear of the text. */}
      <Link href={href} aria-label={product.name} className="absolute inset-0 block">
        {photo ? <HoverSwap front={photo} hover={product.hover} alt={product.name} priority={priority} aspect="" className="shot-well" sizes="(min-width: 1024px) 33vw, 50vw" /> : null}
      </Link>

      {/* top: name and use, over the back wall */}
      <div className="pointer-events-none absolute inset-x-0 top-0 p-3.5 @[15rem]:p-5 @[22rem]:p-6">
        <div className="flex items-baseline justify-between gap-3">
          <p className="t-label">{label}</p>
          <span className="sku hidden text-[11px] opacity-60 @[15rem]:inline">{product.sku}</span>
        </div>
        <h3 className="mt-1.5 text-[17px] font-medium leading-[1.15] tracking-[-0.015em] text-white @[15rem]:mt-2 @[15rem]:text-[22px] @[22rem]:text-[25px]">
          {product.name.toLowerCase()}
        </h3>
        {tagline ? <p className="mt-1.5 hidden max-w-[26ch] text-[14px] leading-[1.35] text-white/85 @[15rem]:block @[22rem]:text-[15px]">{tagline}</p> : null}
      </div>

      {/* bottom: price, stock, order */}
      <div className="absolute inset-x-0 bottom-0 p-3.5 @[15rem]:p-5 @[22rem]:p-6">
        <div className="flex items-center justify-between gap-3 @[15rem]:block">
          <div className="pointer-events-none min-w-0">
            <CardPrice product={product} />
          </div>
          <Link href={href} className="btn btn-order btn-sm shrink-0 @[15rem]:mt-4 @[15rem]:flex @[15rem]:w-full @[15rem]:justify-center @[15rem]:py-3">
            order
          </Link>
        </div>
      </div>
    </article>
  );
}
