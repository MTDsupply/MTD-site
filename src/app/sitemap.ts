import type { MetadataRoute } from "next";
import { getCatalog } from "@/lib/catalog/queries";
import { site } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { categories, products } = await getCatalog();
  const base = site.url.replace(/\/$/, "");
  const fixed = ["", "/products", "/business", "/certifications", "/about", "/contact", "/quick-order", "/shipping-returns", "/privacy", "/terms"].map((p) => ({
    url: `${base}${p}`,
  }));
  const cats = categories.map((c) => ({ url: `${base}/products/${c.slug}` }));
  const prods = products
    .filter((p) => p.status === "live")
    .map((p) => ({ url: `${base}/products/${p.categorySlug}/${p.sku.toLowerCase()}` }));
  return [...fixed, ...cats, ...prods];
}
