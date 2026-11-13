import { getCatalog } from "@/lib/catalog/queries";
import { ARTICLES } from "@/lib/learn";
import { site, restockNote } from "@/lib/site";
import { claims } from "@/lib/copy";
import { SHIPPING } from "@/lib/shipping";
import { money, unitMoney, count } from "@/lib/format";
import { hasVolumeTier, BULK_MIN_UNITS } from "@/lib/pricing";
import { homeFaq } from "@/lib/faq";

/**
 * /llms.txt: a plain-text summary of the company and catalogue for AI
 * assistants and crawlers (the llmstxt.org convention). Generated from the
 * same data as the pages, so it never drifts from the site.
 */
export async function GET() {
  const catalog = await getCatalog();
  const base = site.url.replace(/\/$/, "");
  const catOrder = new Map(catalog.categories.map((c) => [c.slug, c.sortOrder]));
  const live = catalog.products
    .filter((p) => p.status === "live")
    .sort((a, b) => (catOrder.get(a.categorySlug) ?? 99) - (catOrder.get(b.categorySlug) ?? 99) || a.sortOrder - b.sortOrder);

  const lines: string[] = [
    `# ${site.name}`,
    "",
    `> ${site.name} is a foodservice disposables supplier in ${site.city}, ${site.province}, ${site.country}. It sells hot cups and lids made from 100% certified home-compostable material, certified by ${site.certifier}, by the case to cafés and other businesses and in packs of 100 to 500 to anyone. Cup Casa, the café cup brand, is a product line of ${site.name}.`,
    "",
    claims.certLine,
    "",
    "## Products (CAD, before tax)",
    "",
  ];
  for (const p of live) {
    const cat = catalog.categories.find((c) => c.slug === p.categorySlug);
    const cert = catalog.certs.find((c) => c.id === p.certId);
    const packs = (p.packs?.length ? p.packs : [{ count: p.packCount, price: p.packPrice }]).map((t) => `${money(t.price)} per ${count(t.count)}`).join(", ");
    lines.push(
      `- [${p.name}](${base}/products/${p.categorySlug}/${p.sku.toLowerCase()}): SKU ${p.sku}. ${p.size}${p.specs.capacity ? ` (${p.specs.capacity})` : ""}. ${p.material}${
        p.specs.rimDiameter ? `, rim ${p.specs.rimDiameter}` : ""
      }. ${money(p.casePrice)} per case of ${count(p.caseCount)} (${unitMoney(p.unitPrice)} per unit)${
        p.bulkUnitPrice != null ? `; ${unitMoney(p.bulkUnitPrice)} per unit on orders of ${count(BULK_MIN_UNITS)}+ units` : ""
      }. Packs: ${packs}. ${cert ? `${cert.name}, ${cert.certifier}${cert.number ? `, certificate ${cert.number}` : ""}.` : ""}${
        restockNote(p.restockWhen) ? ` ${restockNote(p.restockWhen)}; orders are accepted now.` : " In stock."
      }${cat ? ` Category: ${cat.name}.` : ""}`,
    );
  }
  lines.push(
    "",
    "## Pricing and terms",
    "",
    hasVolumeTier(catalog.products)
      ? `- Case pricing applies to any number of cases. Orders of ${count(BULK_MIN_UNITS)} units or more are charged the volume per-unit price on every case, automatically.`
      : "- Case pricing applies to any number of cases; the per-unit price is the same for one case or fifty.",
    "- Business accounts: net-30 on approval, reorders from the account page, quotes for pallet quantities and custom printing (from 100 cases). Sample packs are free for verified cafés and other foodservice businesses.",
    `- Shipping: Canada and the United States by courier. Packs ${money(SHIPPING.CA.pack)} per order in Canada (free over ${money(SHIPPING.CA.packFreeOver)}), ${money(SHIPPING.US.pack)} to the US (free over ${money(SHIPPING.US.packFreeOver)}). Cases ${money(SHIPPING.CA.perCase)} each in Canada, ${money(SHIPPING.US.perCase)} each to the US. Tax at checkout.`,
    "- Returns: unopened packs and cases within 30 days of delivery; damaged or incorrect orders replaced or refunded.",
    "",
    "## Questions",
    "",
  );
  for (const [q, a] of homeFaq(catalog)) lines.push(`- ${q} ${a}`);
  lines.push(
    "",
    "## Pages",
    "",
    `- [Products](${base}/products): the full catalogue with search and filters.`,
    `- [Business accounts](${base}/business): case pricing table, net-30, quote and sample pack requests.`,
    `- [Custom printing](${base}/custom-printing): your logo on the same certified cup, from 100 cases.`,
    `- [Certifications](${base}/certifications): the certifier and the certificate for every product.`,
    `- [What's in your cup](${base}/whats-in-your-cup): paper outside, PHA inside; how PHA compares to PLA, water-based coatings and conventional plastic; the two questions to ask any cup supplier.`,
    `- [How to compost it](${base}/compost): the four steps and the questions we get asked.`,
    `- [Learn](${base}/learn): sourced explainers on cup linings.`,
    ...ARTICLES.map((a) => `  - [${a.title}](${base}/learn/${a.slug}): ${a.description}`),
    `- [Shipping and returns](${base}/shipping-returns)`,
    `- [About](${base}/about): founders Sullivan Bryan (Chief Executive Officer) and Jack Hill (President and Chief Operating Officer).`,
    `- [Contact](${base}/contact): ${site.email}${site.phone ? `, ${site.phone}` : ""}.`,
    ...site.social.map((s) => `- [${s.name}](${s.url}): ${s.handle}`),
    `- [Price list (PDF)](${base}/price-list.pdf)`,
    "",
  );
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/markdown; charset=utf-8", "Cache-Control": "public, max-age=300, s-maxage=300" },
  });
}
