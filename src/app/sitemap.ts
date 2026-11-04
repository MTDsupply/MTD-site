import type { MetadataRoute } from "next";
import { getCatalog } from "@/lib/catalog/queries";
import { site } from "@/lib/site";

type Entry = MetadataRoute.Sitemap[number];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { categories, products } = await getCatalog();
  const base = site.url.replace(/\/$/, "");
  const now = new Date();
  const entry = (path: string, priority: number, changeFrequency: Entry["changeFrequency"]): Entry => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  });

  const fixed: Entry[] = [
    entry("", 1, "weekly"),
    entry("/products", 0.9, "weekly"),
    entry("/business", 0.9, "monthly"),
    entry("/custom-printing", 0.7, "monthly"),
    entry("/compost", 0.7, "monthly"),
    entry("/certifications", 0.8, "monthly"),
    entry("/about", 0.5, "yearly"),
    entry("/contact", 0.5, "yearly"),
    entry("/quick-order", 0.4, "yearly"),
    entry("/shipping-returns", 0.4, "yearly"),
    entry("/privacy", 0.2, "yearly"),
    entry("/terms", 0.2, "yearly"),
  ];
  const liveCats = new Set(categories.filter((c) => c.status === "live").map((c) => c.slug));
  const cats = categories.map((c) => entry(`/products/${c.slug}`, c.status === "live" ? 0.9 : 0.5, "weekly"));
  const prods = products
    .filter((p) => p.status === "live" && liveCats.has(p.categorySlug))
    .map((p) => entry(`/products/${p.categorySlug}/${p.sku.toLowerCase()}`, 0.8, "weekly"));
  return [...fixed, ...cats, ...prods];
}
