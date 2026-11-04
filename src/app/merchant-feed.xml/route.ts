import { getCatalog } from "@/lib/catalog/queries";
import { site, restockNote } from "@/lib/site";
import { SHIPPING } from "@/lib/shipping";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/**
 * Google Merchant Center product feed (RSS 2.0 with the g: namespace). One
 * item per live SKU at the smallest pack price, which is the price a shopper
 * sees first on the product page. Register the feed URL in Merchant Center.
 */
export async function GET() {
  const { categories, products, certs } = await getCatalog();
  const base = site.url.replace(/\/$/, "");
  const liveCats = new Set(categories.filter((c) => c.status === "live").map((c) => c.slug));
  const items = products
    .filter((p) => p.status === "live" && liveCats.has(p.categorySlug))
    .map((p) => {
      const cat = categories.find((c) => c.slug === p.categorySlug);
      const cert = certs.find((c) => c.id === p.certId);
      const link = `${base}/products/${p.categorySlug}/${p.sku.toLowerCase()}`;
      const image = p.photo ? `${base}${p.photo}` : `${base}/og.png`;
      const availability = restockNote(p.restockWhen) ? "backorder" : "in_stock";
      const title = `${p.name}, pack of ${p.packCount.toLocaleString("en-CA")} · ${p.material}`;
      const description = `${p.name}, ${p.material}. ${p.size}. 100% certified home-compostable material${cert ? `, certified by ${cert.certifier}` : ""}. Pack of ${p.packCount.toLocaleString("en-CA")}; cases of ${p.caseCount.toLocaleString("en-CA")} also available.`;
      return `  <item>
    <g:id>${esc(p.sku)}</g:id>
    <g:title>${esc(title)}</g:title>
    <g:description>${esc(description)}</g:description>
    <g:link>${esc(link)}</g:link>
    <g:image_link>${esc(image)}</g:image_link>
    <g:availability>${availability}</g:availability>
    <g:price>${p.packPrice.toFixed(2)} ${site.currency}</g:price>
    <g:brand>${esc(site.name)}</g:brand>
    <g:condition>new</g:condition>
    <g:mpn>${esc(p.sku)}</g:mpn>
    <g:identifier_exists>no</g:identifier_exists>
    <g:product_type>${esc(cat?.name ?? p.categorySlug)}</g:product_type>
    <g:google_product_category>Business &amp; Industrial &gt; Food Service &gt; Disposable Tableware</g:google_product_category>
    <g:material>${esc(p.material)}</g:material>
    <g:unit_pricing_measure>${p.packCount}ct</g:unit_pricing_measure>
    <g:unit_pricing_base_measure>1ct</g:unit_pricing_base_measure>
    <g:shipping><g:country>CA</g:country><g:price>${SHIPPING.CA.pack.toFixed(2)} CAD</g:price></g:shipping>
    <g:shipping><g:country>US</g:country><g:price>${SHIPPING.US.pack.toFixed(2)} CAD</g:price></g:shipping>
  </item>`;
    });
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
<channel>
  <title>${esc(site.name)}</title>
  <link>${base}</link>
  <description>Hot cups and lids made from 100% certified home-compostable material.</description>
${items.join("\n")}
</channel>
</rss>
`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=300, s-maxage=300" } });
}
