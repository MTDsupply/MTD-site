"use client";
import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import type { Catalog } from "@/lib/catalog/types";
import { ProductCard } from "./ProductCard";
import { ComingSoonTile } from "./ComingSoonTile";

/**
 * /products: filter rail (category, size, case/pack, in stock) on the left,
 * dense 4-across grid on the right. Filters live in the URL.
 */
export function CatalogGrid({ catalog, lockedCategory }: { catalog: Catalog; lockedCategory?: string }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const reduced = useReducedMotion();

  const q = (params.get("q") ?? "").trim().toLowerCase();
  const qs = q.replace(/[^a-z0-9]+/g, "");
  const has = (...parts: (string | undefined)[]) => !qs || parts.join(" ").toLowerCase().replace(/[^a-z0-9]+/g, "").includes(qs);
  const cat = lockedCategory ?? params.get("category") ?? "";

  const set = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
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

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[220px_1fr]">
      <aside aria-label="Filters" className="space-y-5 text-sm">
        <div>
          <label className="label" htmlFor="f-q">
            Search
          </label>
          <input
            id="f-q"
            type="search"
            className="input"
            defaultValue={params.get("q") ?? ""}
            placeholder="Name or SKU"
            onChange={(e) => set("q", e.target.value)}
          />
        </div>
        {!lockedCategory ? (
          <fieldset>
            <legend className="label">Category</legend>
            <ul className="space-y-1">
              <li>
                <button type="button" onClick={() => set("category", "")} className={`hover:underline ${!cat ? "font-medium text-ink" : ""}`}>
                  All
                </button>
              </li>
              {categories.map((c) => (
                <li key={c.slug}>
                  <button
                    type="button"
                    onClick={() => set("category", c.slug)}
                    className={`hover:underline ${cat === c.slug ? "font-medium text-ink" : c.status === "live" ? "" : "text-ink/45"}`}
                  >
                    {c.name}
                    {c.status !== "live" ? " · soon" : ""}
                  </button>
                </li>
              ))}
            </ul>
          </fieldset>
        ) : null}
      </aside>

      <div>
        <p className="mb-3 text-xs text-soil/60 tnum">
          {liveProducts.length} products
        </p>
        {empty ? (
          <p className="rounded-[20px] bg-white p-6 text-sm">Nothing matches. Try a different SKU or clear the filters.</p>
        ) : null}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {liveProducts.map((p, i) => (
            <motion.div
              key={p.sku}
              className="h-full"
              initial={reduced ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -8% 0px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: (i % 4) * 0.06 }}
            >
              <ProductCard
                product={p}
                cert={certById.get(p.certId ?? "")}
                categoryDrawing={catBySlug.get(p.categorySlug)?.lineDrawing ?? "/drawings/category-cups.svg"}
                priority={i < 4}
              />
            </motion.div>
          ))}
          {comingSoon.map((c, i) => (
            <motion.div
              key={c.slug}
              className="h-full"
              initial={reduced ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -8% 0px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: ((liveProducts.length + i) % 4) * 0.06 }}
            >
              <ComingSoonTile category={c} compact photo={catalog.products.find((p) => p.categorySlug === c.slug)?.photo ?? null} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
