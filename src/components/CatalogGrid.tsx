"use client";
import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Catalog } from "@/lib/catalog/types";
import { ProductCard } from "./ProductCard";
import { ComingSoonTile } from "./ComingSoonTile";
import { RevealGroup } from "./Reveal";

/**
 * /products and the category pages: a toolbar of category pills with the
 * search field at the right, then the catalogue two across as wide paper
 * cards. Filters live in the URL so a filtered view can be shared.
 */
export function CatalogGrid({ catalog, lockedCategory, columns = 2 }: { catalog: Catalog; lockedCategory?: string; columns?: 2 | 3 }) {
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
  const certById = useMemo(() => new Map(catalog.certs.map((c) => [c.id, c])), [catalog]);

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

  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 border-b border-line pb-5">
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
            className="input w-56 py-2 text-sm"
            defaultValue={params.get("q") ?? ""}
            placeholder="Search by name or SKU"
            onChange={(e) => set("q", e.target.value)}
          />
        </div>
      </div>

      {empty ? <p className="mt-8 text-[15px] text-stone">Nothing matches. Try a different SKU or clear the filters.</p> : null}

      <RevealGroup className={`mt-6 grid gap-4 md:grid-cols-2 ${columns === 3 ? "lg:grid-cols-3" : ""}`} itemClassName="h-full" step={0.08}>
        {[
          ...liveProducts.map((p, i) => (
            <ProductCard key={p.sku} product={p} cert={certById.get(p.certId ?? "")} categoryName={catBySlug.get(p.categorySlug)?.name.toLowerCase()} priority={i < 2} />
          )),
          ...comingSoon.map((c) => <ComingSoonTile key={c.slug} category={c} compact photo={catalog.products.find((p) => p.categorySlug === c.slug)?.photo ?? null} />),
        ]}
      </RevealGroup>
    </div>
  );
}
