"use client";
import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Catalog } from "@/lib/catalog/types";
import { ProductCard } from "./ProductCard";
import { ComingSoonTile } from "./ComingSoonTile";
import { RevealGroup } from "./Reveal";

/** A lifestyle photograph that takes one or two cells of the product grid. */
export type FeaturedTile = { src: string; alt: string; line: string; href: string; span?: 1 | 2 };

/** The five things that are true of every product, on a hairline strip under the filters. */
const FACTS = ["paper cups with a PHA lining, PHA lids", "100% certified home-compostable material", "certified by TÜV Austria", "one lid fits all three cups", "packs of 100 or cases of 1,000"];

function Tick() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" className="shrink-0">
      <circle cx="12" cy="12" r="9.25" />
      <path d="m8 12.5 2.6 2.5L16 9.5" />
    </svg>
  );
}

function LifestyleTile({ tile, priority = false }: { tile: FeaturedTile; priority?: boolean }) {
  return (
    <Link href={tile.href} aria-label={tile.line} className="featured-tile zoom-on-hover relative block h-full min-h-[240px] overflow-hidden">
      <Image src={tile.src} alt={tile.alt} fill sizes={tile.span === 2 ? "(min-width: 1024px) 66vw, 100vw" : "(min-width: 1024px) 33vw, 50vw"} className="object-cover" priority={priority} />
    </Link>
  );
}

/**
 * /products and the category pages: category pills with the search field at
 * the right, a hairline strip of facts, then the catalogue as photo cards,
 * three across (two on phones). `featured` is a lifestyle photograph that takes
 * two cells at the top of the grid; `closers` are more lifestyle tiles that
 * finish the last row. Filters live in the URL so a filtered view can be shared.
 */
export function CatalogGrid({ catalog, lockedCategory, featured, closers = [] }: { catalog: Catalog; lockedCategory?: string; featured?: FeaturedTile; closers?: FeaturedTile[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const q = (params.get("q") ?? "").trim().toLowerCase();
  const qs = q.replace(/[^a-z0-9]+/g, "");
  const has = (...parts: (string | undefined)[]) => !qs || parts.join(" ").toLowerCase().replace(/[^a-z0-9]+/g, "").includes(qs);
  const cat = lockedCategory ?? params.get("category") ?? "";

  const set = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    const qsOut = next.toString();
    router.replace(qsOut ? `${pathname}?${qsOut}` : pathname, { scroll: false });
  };

  const categories = useMemo(() => [...catalog.categories].sort((a, b) => a.sortOrder - b.sortOrder), [catalog]);
  const catBySlug = useMemo(() => new Map(categories.map((c) => [c.slug, c])), [categories]);

  const liveProducts = catalog.products
    .filter((p) => p.status === "live" && catBySlug.get(p.categorySlug)?.status === "live")
    .filter((p) => !cat || p.categorySlug === cat)
    .filter((p) => has(p.name, p.sku, p.size, p.material, catBySlug.get(p.categorySlug)?.name, p.categorySlug === "lids" ? "lid lids" : "cup cups"))
    .sort(
      (a, b) =>
        (catBySlug.get(a.categorySlug)?.sortOrder ?? 99) - (catBySlug.get(b.categorySlug)?.sortOrder ?? 99) ||
        a.sortOrder - b.sortOrder,
    );

  const comingSoon = categories
    .filter((c) => c.status !== "live")
    .filter((c) => !cat || c.slug === cat)
    .filter((c) => has(c.name, c.description, c.slug));

  const empty = liveProducts.length === 0 && comingSoon.length === 0;
  const total = liveProducts.length + comingSoon.length;
  // The lifestyle photographs only earn their cells on an unfiltered view.
  const unfiltered = !qs && !empty && (lockedCategory ? true : !cat);

  const tiles: { key: string; span: 1 | 2; node: React.ReactNode }[] = [
    ...(unfiltered && featured ? [{ key: "featured", span: 2 as const, node: <LifestyleTile tile={{ ...featured, span: 2 }} priority /> }] : []),
    ...liveProducts.map((p, i) => ({ key: p.sku, span: 1 as const, node: <ProductCard product={p} categoryName={catBySlug.get(p.categorySlug)?.name.toLowerCase()} priority={i < 3} /> })),
    ...comingSoon.map((c) => ({ key: c.slug, span: 1 as const, node: <ComingSoonTile category={c} compact photo={catalog.products.find((p) => p.categorySlug === c.slug)?.photo ?? null} /> })),
    ...(unfiltered ? closers.map((t, i) => ({ key: `closer-${i}`, span: t.span ?? (1 as const), node: <LifestyleTile tile={t} /> })) : []),
  ];

  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
        {!lockedCategory ? (
          <div role="group" aria-label="Category" className="flex flex-wrap gap-2">
            <button type="button" onClick={() => set("category", "")} aria-pressed={!cat} className={`chip ${!cat ? "!border-ink !bg-ink !text-bone" : "chip-fog"}`}>
              all
            </button>
            {categories.map((c) => (
              <button
                key={c.slug}
                type="button"
                onClick={() => set("category", c.slug)}
                aria-pressed={cat === c.slug}
                className={`chip ${cat === c.slug ? "!border-ink !bg-ink !text-bone" : "chip-fog"}`}
              >
                {c.name.toLowerCase()}
                {c.status !== "live" ? " · soon" : ""}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-[14px] text-stone tnum">
            {total} {total === 1 ? "product" : "products"}
          </p>
        )}
        <div className="flex items-center gap-4">
          {!lockedCategory ? (
            <p className="hidden text-[14px] text-stone tnum sm:block">
              {total} {total === 1 ? "product" : "products"}
            </p>
          ) : null}
          <label className="sr-only" htmlFor="f-q">
            Search
          </label>
          <input
            id="f-q"
            type="search"
            className="input w-44 py-2 text-sm sm:w-56"
            defaultValue={params.get("q") ?? ""}
            placeholder="Search or SKU"
            onChange={(e) => set("q", e.target.value)}
          />
        </div>
      </div>

      <ul className="facts-strip mt-5" aria-label="True of every product">
        {FACTS.map((f) => (
          <li key={f}>
            <Tick />
            {f}
          </li>
        ))}
      </ul>

      {empty ? <p className="mt-8 text-[15px] text-stone">Nothing matches. Try a different SKU or clear the filters.</p> : null}

      <RevealGroup className="mt-5 grid grid-cols-2 gap-3 md:gap-5 lg:grid-cols-3" itemClassName={(i) => `h-full ${tiles[i]?.span === 2 ? "col-span-2" : ""}`} step={0.06}>
        {tiles.map((t) => (
          <div key={t.key} className="h-full">
            {t.node}
          </div>
        ))}
      </RevealGroup>
    </div>
  );
}
