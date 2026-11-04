import "server-only";
import { existsSync } from "node:fs";
import path from "node:path";
import type { Catalog, Product } from "./types";

const PUBLIC = path.join(process.cwd(), "public");

/** /public/drawings/[sku].svg, falling back to the category's generic drawing. */
export function drawingFor(sku: string, categoryDrawing: string): string {
  if (existsSync(path.join(PUBLIC, "drawings", `${sku}.svg`))) return `/drawings/${sku}.svg`;
  return categoryDrawing;
}

/** /public/products/[sku]-[angle].(jpg|jpeg|png|webp) if a photo exists. */
export function photoFor(sku: string, angle = "front"): string | null {
  for (const ext of ["jpg", "jpeg", "png", "webp"]) {
    const f = `${sku}-${angle}.${ext}`;
    if (existsSync(path.join(PUBLIC, "products", f))) return `/products/${f}`;
  }
  return null;
}

/** Resolves drawing and photo paths for every product so client components get plain data. */
export function withAssets(catalog: Catalog): Catalog {
  const drawingByCat = new Map(catalog.categories.map((c) => [c.slug, c.lineDrawing]));
  const whenByCat = new Map(catalog.categories.map((c) => [c.slug, c.restockWhen]));
  const products: Product[] = catalog.products.map((p) => ({
    ...p,
    drawing: drawingFor(p.sku, drawingByCat.get(p.categorySlug) ?? "/drawings/category-cups.svg"),
    photo: p.images[0] ?? photoFor(p.sku),
    restockWhen: whenByCat.get(p.categorySlug) ?? null,
  }));
  return { ...catalog, products };
}
