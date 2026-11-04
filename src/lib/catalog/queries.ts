import { cacheLife, cacheTag } from "next/cache";
import { seedCatalog } from "./seed";
import type { Catalog, Category, Cert, Product } from "./types";
import { createAnonClient } from "@/lib/supabase/anon";
import { withAssets } from "./assets";

type CategoryRow = {
  slug: string;
  name: string;
  short_name: string | null;
  description: string;
  status: "live" | "coming_soon";
  line_drawing: string;
  sort_order: number;
  /** Added in 0005_stock.sql; absent until that migration runs. */
  restock_note?: string | null;
};
type ProductRow = {
  sku: string;
  category_slug: string;
  name: string;
  size: string;
  material: string;
  unit_price: number | string;
  case_price: number | string;
  case_count: number;
  /** Added in 0004_bulk.sql; absent until that migration runs. */
  bulk_unit_price?: number | string | null;
  pack_price: number | string;
  pack_count: number;
  packs: { count: number; price: number | string }[] | null;
  cert_id: string | null;
  images: string[] | null;
  status: "live" | "coming_soon";
  specs: Product["specs"] | null;
  goes_with: string[] | null;
  sort_order: number;
};
type CertRow = {
  id: string;
  name: string;
  certifier: string;
  number: string | null;
  pdf_url: string | null;
  covered_skus: string[] | null;
};

/**
 * Loads the catalogue from Supabase, falling back to the in-repo seed if the
 * database is not configured or not yet migrated. Cached for a few minutes so
 * flipping a category to `live` in the database shows up everywhere without
 * a redeploy.
 */
export async function getCatalog(): Promise<Catalog> {
  "use cache";
  cacheLife("minutes");
  cacheTag("catalog");

  const supabase = createAnonClient();
  if (!supabase) return withAssets(seedCatalog);

  try {
    const [c, p, k] = await Promise.all([
      supabase.from("categories").select("*").order("sort_order"),
      supabase.from("products").select("*").order("sort_order"),
      supabase.from("certs").select("*"),
    ]);
    if (c.error || p.error || k.error) throw c.error ?? p.error ?? k.error;
    if (!c.data?.length) return withAssets(seedCatalog);

    const seedWhen = new Map(seedCatalog.categories.map((x) => [x.slug, x.restockWhen]));
    const categories: Category[] = (c.data as CategoryRow[]).map((r) => ({
      slug: r.slug,
      name: r.name,
      shortName: r.short_name ?? undefined,
      description: r.description,
      status: r.status,
      lineDrawing: r.line_drawing,
      sortOrder: r.sort_order,
      // Until 0005_stock.sql runs the column is missing: fall back to the seed's note.
      restockWhen: r.restock_note === undefined ? (seedWhen.get(r.slug) ?? null) : r.restock_note || null,
    }));
    // Until 0004_bulk.sql is applied the column is missing: fall back to the seed's volume price per SKU.
    const seedBulk = new Map(seedCatalog.products.map((x) => [x.sku, x.bulkUnitPrice]));
    const products: Product[] = (p.data as ProductRow[]).map((r) => ({
      sku: r.sku,
      categorySlug: r.category_slug,
      name: r.name,
      size: r.size,
      material: r.material,
      unitPrice: Number(r.unit_price),
      casePrice: Number(r.case_price),
      caseCount: r.case_count,
      bulkUnitPrice: r.bulk_unit_price === undefined ? (seedBulk.get(r.sku) ?? null) : r.bulk_unit_price === null ? null : Number(r.bulk_unit_price),
      packs: r.packs?.length
        ? r.packs.map((t) => ({ count: Number(t.count), price: Number(t.price) })).sort((a, b) => a.count - b.count)
        : [{ count: r.pack_count, price: Number(r.pack_price) }],
      packPrice: Number(r.pack_price),
      packCount: r.pack_count,
      certId: r.cert_id,
      images: r.images ?? [],
      status: r.status,
      specs: r.specs ?? {},
      goesWith: r.goes_with ?? [],
      sortOrder: r.sort_order,
    }));
    const certs: Cert[] = (k.data as CertRow[]).map((r) => ({
      id: r.id,
      name: r.name,
      certifier: r.certifier,
      number: r.number,
      pdfUrl: r.pdf_url,
      coveredSkus: r.covered_skus ?? [],
    }));
    return withAssets({ categories, products, certs });
  } catch (err) {
    console.warn("[catalog] falling back to seed:", (err as Error).message);
    return withAssets(seedCatalog);
  }
}

export async function getCategories(): Promise<Category[]> {
  const { categories } = await getCatalog();
  return [...categories].sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getCategory(slug: string): Promise<Category | undefined> {
  const { categories } = await getCatalog();
  return categories.find((c) => c.slug === slug);
}

export async function getProducts(): Promise<Product[]> {
  const { products } = await getCatalog();
  return products;
}

/** Live products only, in category then product order. */
export async function getLiveProducts(): Promise<Product[]> {
  const { categories, products } = await getCatalog();
  const order = new Map(categories.map((c) => [c.slug, c.sortOrder]));
  const liveCats = new Set(categories.filter((c) => c.status === "live").map((c) => c.slug));
  return products
    .filter((p) => p.status === "live" && liveCats.has(p.categorySlug))
    .sort(
      (a, b) =>
        (order.get(a.categorySlug) ?? 99) - (order.get(b.categorySlug) ?? 99) ||
        a.sortOrder - b.sortOrder,
    );
}

export async function getProductsInCategory(slug: string): Promise<Product[]> {
  const { products } = await getCatalog();
  return products.filter((p) => p.categorySlug === slug).sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getProduct(sku: string): Promise<Product | undefined> {
  const { products } = await getCatalog();
  return products.find((p) => p.sku.toLowerCase() === sku.toLowerCase());
}

export async function getCerts(): Promise<Cert[]> {
  const { certs } = await getCatalog();
  return certs;
}

export async function getCert(id: string | null): Promise<Cert | undefined> {
  if (!id) return undefined;
  const { certs } = await getCatalog();
  return certs.find((c) => c.id === id);
}
