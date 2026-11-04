/**
 * Upserts the in-repo seed catalogue into Supabase.
 * Run with: npm run db:seed
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "node:fs";
import { seedCatalog } from "../src/lib/catalog/seed.ts";

function loadEnv() {
  if (!existsSync(".env.local")) return;
  for (const line of readFileSync(".env.local", "utf8").split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)="?(.*?)"?$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}
loadEnv();

const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing SUPABASE_URL / SUPABASE_SECRET_KEY. Run: vercel env pull --yes");
  process.exit(1);
}
const db = createClient(url, key, { auth: { persistSession: false } });

async function main() {
  const { categories, products, certs } = seedCatalog;

  const categoryRows = (withStock: boolean) =>
    categories.map((x) => ({
      slug: x.slug,
      name: x.name,
      short_name: x.shortName ?? null,
      description: x.description,
      status: x.status,
      line_drawing: x.lineDrawing,
      sort_order: x.sortOrder,
      ...(withStock ? { restock_note: x.restockWhen } : {}),
      updated_at: new Date().toISOString(),
    }));
  let c = await db.from("categories").upsert(categoryRows(true));
  if (c.error && /restock_note/.test(c.error.message)) {
    console.warn("categories.restock_note is missing: run `npm run db:migrate` (0005_stock.sql), then seed again. Seeding the other columns now.");
    c = await db.from("categories").upsert(categoryRows(false));
  }
  if (c.error) throw c.error;

  const k = await db.from("certs").upsert(
    certs.map((x) => ({
      id: x.id,
      name: x.name,
      certifier: x.certifier,
      number: x.number,
      pdf_url: x.pdfUrl,
      covered_skus: x.coveredSkus,
      updated_at: new Date().toISOString(),
    })),
  );
  if (k.error) throw k.error;

  const productRows = (withBulk: boolean) =>
    products.map((x) => ({
      sku: x.sku,
      ...(withBulk ? { bulk_unit_price: x.bulkUnitPrice } : {}),
      category_slug: x.categorySlug,
      name: x.name,
      size: x.size,
      material: x.material,
      unit_price: x.unitPrice,
      case_price: x.casePrice,
      case_count: x.caseCount,
      pack_price: x.packPrice,
      pack_count: x.packCount,
      packs: x.packs,
      cert_id: x.certId,
      images: x.images,
      status: x.status,
      specs: x.specs,
      goes_with: x.goesWith,
      sort_order: x.sortOrder,
      updated_at: new Date().toISOString(),
    }));
  let p = await db.from("products").upsert(productRows(true));
  if (p.error && /bulk_unit_price/.test(p.error.message)) {
    console.warn("products.bulk_unit_price is missing: run `npm run db:migrate` (0004_bulk.sql), then seed again. Seeding the other columns now.");
    p = await db.from("products").upsert(productRows(false));
  }
  if (p.error) throw p.error;

  console.log(
    `Seeded ${categories.length} categories, ${products.length} products, ${certs.length} certs.`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
