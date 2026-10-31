import type { Catalog, Category, Cert, Product } from "./types";

/**
 * Seed catalogue. Range: cups and lids only. This is the source of truth for `scripts/seed.ts`, which
 * upserts it into Supabase, and the fallback the site renders if the database
 * is unreachable. A category's `status` drives every surface: home grid,
 * /products grid, mega-menu, footer and /certifications.
 */

export const categories: Category[] = [
  {
    slug: "cups",
    name: "Hot cups",
    shortName: "Cups",
    description: "8, 12 and 16 oz hot cups. PHA-lined paper, 100% certified home-compostable material.",
    status: "live",
    lineDrawing: "/drawings/category-cups.svg",
    sortOrder: 1,
  },
  {
    slug: "lids",
    name: "Lids",
    description: "Hot cup lids to fit the 8, 12 and 16 oz cups. PHA, 100% certified home-compostable material.",
    status: "live",
    lineDrawing: "/drawings/category-lids.svg",
    sortOrder: 2,
  },
];

const CUP_CERT = "tuv-home-cups";

/*
 * Pricing source: cupcasa.com/wholesale (café pricing, cases of 1,000):
 *   cups 18¢ / 20¢ / 22¢ → $180 / $200 / $220 per case
 *   lids 9¢ (one lid fits all three sizes) → $90 per case
 * Consumer packs follow Cup Casa's bundle sizes (100 / 200 / 500) and its
 * markup: the 100-pack is about 2× the café unit price, the 500-pack about
 * 18% less per unit than the 100-pack. `packPrice`/`packCount` mirror the
 * smallest tier.
 */

export const products: Product[] = [
  {
    sku: "MTD-CUP-8H",
    categorySlug: "cups",
    name: "8 oz hot cup",
    size: "8 oz",
    material: "PHA-lined paper",
    unitPrice: 0.18,
    casePrice: 180,
    caseCount: 1000,
    packs: [{ count: 100, price: 36 }, { count: 200, price: 66 }, { count: 500, price: 150 }],
    packPrice: 36,
    packCount: 100,
    certId: CUP_CERT,
    images: [],
    status: "live",
    specs: {
      lining: "PHA",
      capacity: "8 oz / 237 ml",
      rimDiameter: "80 mm",
      caseDimensions: "41 × 41 × 46 cm",
      caseWeight: "9.5 kg",
    },
    goesWith: ["MTD-LID-HOT", "MTD-STR-200"],
    sortOrder: 1,
  },
  {
    sku: "MTD-CUP-12H",
    categorySlug: "cups",
    name: "12 oz hot cup",
    size: "12 oz",
    material: "PHA-lined paper",
    unitPrice: 0.2,
    casePrice: 200,
    caseCount: 1000,
    packs: [{ count: 100, price: 40 }, { count: 200, price: 72 }, { count: 500, price: 165 }],
    packPrice: 40,
    packCount: 100,
    certId: CUP_CERT,
    images: [],
    status: "live",
    specs: {
      lining: "PHA",
      capacity: "12 oz / 355 ml",
      rimDiameter: "90 mm",
      caseDimensions: "46 × 46 × 48 cm",
      caseWeight: "12 kg",
    },
    goesWith: ["MTD-LID-HOT", "MTD-STR-200"],
    sortOrder: 2,
  },
  {
    sku: "MTD-CUP-16H",
    categorySlug: "cups",
    name: "16 oz hot cup",
    size: "16 oz",
    material: "PHA-lined paper",
    unitPrice: 0.22,
    casePrice: 220,
    caseCount: 1000,
    packs: [{ count: 100, price: 44 }, { count: 200, price: 80 }, { count: 500, price: 180 }],
    packPrice: 44,
    packCount: 100,
    certId: CUP_CERT,
    images: [],
    status: "live",
    specs: {
      lining: "PHA",
      capacity: "16 oz / 473 ml",
      rimDiameter: "90 mm",
      caseDimensions: "46 × 46 × 56 cm",
      caseWeight: "14 kg",
    },
    goesWith: ["MTD-LID-HOT", "MTD-STR-200"],
    sortOrder: 3,
  },
  {
    sku: "MTD-LID-HOT",
    categorySlug: "lids",
    name: "Hot cup lid",
    size: "Fits 8, 12 and 16 oz",
    material: "PHA",
    unitPrice: 0.09,
    casePrice: 90,
    caseCount: 1000,
    packs: [{ count: 100, price: 18 }, { count: 200, price: 33 }, { count: 500, price: 75 }],
    packPrice: 18,
    packCount: 100,
    certId: CUP_CERT,
    images: [],
    status: "live",
    specs: { rimDiameter: "90 mm (80 mm adapter ring for 8 oz)" },
    goesWith: ["MTD-CUP-8H", "MTD-CUP-12H", "MTD-CUP-16H"],
    sortOrder: 1,
  },
];

export const certs: Cert[] = [
  {
    id: CUP_CERT,
    name: "100% certified home-compostable material",
    certifier: "TÜV Austria",
    // TODO: enter the certificate number and drop the PDF into /public/certs.
    number: null,
    pdfUrl: null,
    coveredSkus: ["MTD-CUP-8H", "MTD-CUP-12H", "MTD-CUP-16H", "MTD-LID-HOT"],
  },
];

export const seedCatalog: Catalog = { categories, products, certs };
