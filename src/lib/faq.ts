import type { Catalog, Product } from "@/lib/catalog/types";
import { site, stockSentence } from "@/lib/site";
import { SHIPPING } from "@/lib/shipping";
import { money, unitMoney, count } from "@/lib/format";
import { bulkCasesFor, BULK_MIN_UNITS } from "@/lib/pricing";

/*
 * Question-and-answer copy for the pages that answer engines quote from. Every
 * number is read from the catalogue and shipping tables so the answers stay
 * true when prices change. Keep answers to two or three plain sentences: that
 * is what gets lifted into a featured snippet or an AI answer.
 */

const list = (xs: string[]) => (xs.length <= 1 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`);

export function homeFaq(catalog: Catalog): [string, string][] {
  const live = catalog.products.filter((p) => p.status === "live");
  const cups = live.filter((p) => p.categorySlug === "cups").sort((a, b) => a.sortOrder - b.sortOrder);
  const lid = live.find((p) => p.categorySlug === "lids");
  const cheapestPack = [...cups].sort((a, b) => a.packPrice - b.packPrice)[0];
  const bulk = cups.filter((p) => p.bulkUnitPrice != null);
  const cupPrices = list(cups.map((p) => `${money(p.casePrice)} for the ${p.size}`));
  const unitRange = cups.length ? `${unitMoney(cups[0].unitPrice)} to ${unitMoney(cups[cups.length - 1].unitPrice)} per cup` : "";
  const bulkRange = bulk.length ? `${unitMoney(bulk[0].bulkUnitPrice!)} to ${unitMoney(bulk[bulk.length - 1].bulkUnitPrice!)} per cup` : "";
  const restock = catalog.categories.some((c) => c.restockWhen);

  return [
    [
      "Are these cups compostable at home?",
      `Yes. The cups and the lid are made from 100% certified home-compostable material, certified by ${site.certifier} for each SKU. Home-compostable material breaks down in a home compost pile at ambient temperature, so the whole cup, lining included, goes in with the food scraps.`,
    ],
    [
      "What is the cup lined with?",
      "PHA, a material made by fermentation rather than from petroleum plastic. It is what keeps hot coffee in a paper cup, and it is covered by the same certificate as the paper, so there is no plastic film and no microplastics left behind.",
    ],
    [
      "How much do compostable coffee cups cost?",
      `Cases of ${count(cups[0]?.caseCount ?? 1000)}: ${cupPrices}, which is ${unitRange}.${
        bulk.length ? ` Orders of ${count(BULK_MIN_UNITS)} units or more drop to ${bulkRange}, applied automatically in the cart.` : ""
      }${lid ? ` The lid is ${money(lid.casePrice)} per ${count(lid.caseCount)} (${unitMoney(lid.unitPrice)} each).` : ""}${
        cheapestPack ? ` Packs of ${count(cheapestPack.packCount)} start at ${money(cheapestPack.packPrice)}.` : ""
      } All prices in Canadian dollars before tax.`,
    ],
    [
      "Do you ship to the United States?",
      `Yes. We ship from ${site.city}, ${site.province} to addresses in Canada and the United States by courier. Packs ship for ${money(SHIPPING.CA.pack)} in Canada (free over ${money(SHIPPING.CA.packFreeOver)}) and ${money(SHIPPING.US.pack)} to the US (free over ${money(SHIPPING.US.packFreeOver)}); cases ship for ${money(SHIPPING.CA.perCase)} each in Canada and ${money(SHIPPING.US.perCase)} each to the US. Shipping is shown in the cart before you pay.`,
    ],
    [
      "Is there a minimum order?",
      `No. Anyone can buy a pack of ${count(cheapestPack?.packCount ?? 100)}; cafés usually buy by the case of ${count(cups[0]?.caseCount ?? 1000)}. Verified cafés can ask for a free sample pack first. Business accounts get net-30 on approval, and custom printing starts at 100 cases.`,
    ],
    ...(lid
      ? ([["Does one lid fit every cup size?", `Yes. One PHA lid fits the ${list(cups.map((p) => p.size))} cups, so there is one lid SKU to stock.`]] as [string, string][])
      : []),
    ...(restock
      ? ([["Are the cups and lids in stock?", `${stockSentence(catalog.categories)} You can order now and the order is filled from that stock.`]] as [string, string][])
      : []),
  ];
}

export function productFaq(p: Product, catalog: Catalog): [string, string][] {
  const cat = catalog.categories.find((c) => c.slug === p.categorySlug);
  const partners = p.goesWith
    .map((s) => catalog.products.find((x) => x.sku === s))
    .filter((x): x is Product => !!x && x.status === "live");
  const packs = (p.packs?.length ? p.packs : [{ count: p.packCount, price: p.packPrice }]).slice().sort((a, b) => a.count - b.count);
  const price = `${money(p.casePrice)} per case of ${count(p.caseCount)} (${unitMoney(p.unitPrice)} each)${
    p.bulkUnitPrice != null ? `, or ${unitMoney(p.bulkUnitPrice)} each on orders of ${count(BULK_MIN_UNITS)} units or more (${count(bulkCasesFor(p))} cases)` : ""
  }. Packs: ${list(packs.map((t) => `${money(t.price)} for ${count(t.count)}`))}. Prices in CAD before tax.`;
  const out: [string, string][] = [];
  if (p.categorySlug === "cups") {
    out.push([
      `What size is the ${p.name}?`,
      `${p.specs.capacity ?? p.size}${p.specs.rimDiameter ? `, with a ${p.specs.rimDiameter} rim` : ""}. It is a paper hot cup in ${p.material}.`,
    ]);
    if (partners.length) {
      const lid = partners.find((x) => x.categorySlug === "lids");
      if (lid) out.push([`Which lid fits the ${p.name}?`, `The ${lid.name} (${lid.sku}). One lid fits the 8, 12 and 16 oz cups, and it is made from the same certified material.`]);
    }
  } else if (partners.length) {
    out.push([`Which cups does the ${p.name} fit?`, `The ${list(partners.map((x) => x.size))} hot cups. ${p.specs.rimDiameter ? `Rim: ${p.specs.rimDiameter}.` : ""}`.trim()]);
  }
  out.push([`How much does the ${p.name} cost?`, price]);
  out.push([
    `Can the ${p.name} go in a home compost pile?`,
    `Yes. It is made from 100% certified home-compostable material, certified by ${site.certifier} for ${p.sku}. Tear it up, bury it in the pile with food scraps and turn the pile as usual.`,
  ]);
  if (cat) out.push([`What is the ${p.name} made of?`, `${p.material}.${p.specs.lining ? ` The lining is ${p.specs.lining}, made by fermentation, not a plastic film.` : ""} No microplastics.`]);
  return out;
}
