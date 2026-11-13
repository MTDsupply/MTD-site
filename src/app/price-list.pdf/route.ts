import { readFile } from "node:fs/promises";
import path from "node:path";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { getCatalog } from "@/lib/catalog/queries";
import { site } from "@/lib/site";
import { claims } from "@/lib/copy";

const SOIL = rgb(0x2b / 255, 0x2b / 255, 0x2b / 255);
const FOG = rgb(0x8a / 255, 0x8a / 255, 0x84 / 255);
const FOREST = rgb(0x2e / 255, 0x4d / 255, 0x34 / 255);
const CREAM = rgb(0xfb / 255, 0xf4 / 255, 0xe8 / 255);
const MINT = rgb(0xe4 / 255, 0xf0 / 255, 0xdc / 255);

const cad = (n: number, d = 2) => `$${n.toFixed(d)}`;

/** One-page price list, generated from the catalogue. */
export async function GET() {
  const { categories, products, certs } = await getCatalog();
  const catOrder = new Map(categories.map((c) => [c.slug, c.sortOrder]));
  const live = products
    .filter((p) => p.status === "live")
    .sort((a, b) => (catOrder.get(a.categorySlug) ?? 99) - (catOrder.get(b.categorySlug) ?? 99) || a.sortOrder - b.sortOrder);
  const liveCats = new Set(categories.filter((c) => c.status === "live").map((c) => c.slug));
  const soonProducts = products
    .filter((p) => p.status !== "live" || !liveCats.has(p.categorySlug))
    .sort((a, b) => (catOrder.get(a.categorySlug) ?? 99) - (catOrder.get(b.categorySlug) ?? 99) || a.sortOrder - b.sortOrder);
  const soonOnly = categories
    .filter((c) => c.status !== "live" && !soonProducts.some((p) => p.categorySlug === c.slug))
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const pdf = await PDFDocument.create();
  const page = pdf.addPage([612, 792]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const { width } = page.getSize();
  const margin = 48;
  let y = 792 - margin;
  // Cream page with a forest band across the top, like the site.
  page.drawRectangle({ x: 0, y: 0, width, height: 792, color: CREAM });
  page.drawRectangle({ x: 0, y: 792 - 96, width, height: 96, color: FOREST });

  const text = (s: string, x: number, size = 9, f = font, color = SOIL) =>
    page.drawText(s.normalize("NFKD").replace(/[^\x20-\x7E]/g, ""), { x, y, size, font: f, color });

  // Logo top-left (falls back to text if the file is missing).
  try {
    const png = await pdf.embedPng(await readFile(path.join(process.cwd(), "public", "logo-wordmark-white.png")));
    const logoH = 30;
    const logoW = (png.width / png.height) * logoH;
    page.drawImage(png, { x: margin, y: 792 - 48 - logoH / 2, width: logoW, height: logoH });
  } catch {
    page.drawText("made to disappear.", { x: margin, y: 792 - 56, size: 20, font: bold, color: CREAM });
  }
  const date = new Date().toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" });
  page.drawText(`Price list · ${date}`, { x: width - margin - font.widthOfTextAtSize(`Price list · ${date}`, 9), y: 792 - 52, size: 9, font, color: CREAM });
  y = 792 - 96 - 30;
  page.drawText("Hot cups and lids, 100% certified home-compostable material.", { x: margin, y, size: 13, font: bold, color: FOREST });
  y -= 28;

  const volume = products.some((p) => p.bulkUnitPrice != null);
  const cols = volume
    ? [margin, margin + 64, margin + 158, margin + 234, margin + 270, margin + 316, margin + 364, margin + 418]
    : [margin, margin + 64, margin + 166, margin + 250, margin + 294, margin + 348, margin + 410];
  const head = volume
    ? ["SKU", "Product", "Material", "Case", "Per case", "Per unit", "10k+ units", "Packs 100 / 200 / 500"]
    : ["SKU", "Product", "Material", "Case", "Per case", "Per unit", "Packs 100 / 200 / 500"];
  const clip = (v: string, n: number) => (v.length > n ? `${v.slice(0, n - 1).trimEnd()}…` : v);
  const packCol = (p: (typeof products)[number]) =>
    (p.packs?.length ? p.packs : [{ count: p.packCount, price: p.packPrice }]).map((t) => cad(t.price, 0)).join(" / ");
  page.drawRectangle({ x: margin - 6, y: y - 7, width: width - 2 * margin + 12, height: 22, color: MINT });
  head.forEach((h, i) => text(h, cols[i], 8.5, bold, FOREST));
  y -= 20;

  for (const p of live.filter((p) => liveCats.has(p.categorySlug))) {
    const row = [
      p.sku,
      clip(p.name, 22),
      clip(p.material, 17),
      p.caseCount.toLocaleString("en-CA"),
      cad(p.casePrice),
      cad(p.unitPrice, 3),
      ...(volume ? [p.bulkUnitPrice != null ? cad(p.bulkUnitPrice, 3) : cad(p.unitPrice, 3)] : []),
      packCol(p),
    ];
    row.forEach((v, i) => text(v, cols[i], 8.5));
    y -= 4;
    page.drawLine({ start: { x: margin, y }, end: { x: width - margin, y }, thickness: 0.4, color: rgb(0xd6 / 255, 0xd4 / 255, 0xcb / 255) });
    y -= 11;
  }

  if (soonProducts.length || soonOnly.length) {
    y -= 6;
    text("Coming soon (planned pricing)", margin, 9, bold, FOREST);
    y -= 13;
  }
  for (const p of soonProducts) {
    const row = [
      p.sku,
      clip(p.name, 22),
      clip(p.material, 17),
      p.caseCount.toLocaleString("en-CA"),
      cad(p.casePrice),
      cad(p.unitPrice, 3),
      ...(volume ? [p.bulkUnitPrice != null ? cad(p.bulkUnitPrice, 3) : cad(p.unitPrice, 3)] : []),
      packCol(p),
    ];
    row.forEach((v, i) => text(v, cols[i], 8.5, font, FOG));
    y -= 15;
  }
  if (soonOnly.length) {
    text(soonOnly.map((c) => c.name).join("  ·  "), margin, 9, font, FOG);
    y -= 15;
  }
  y -= 8;

  text("Certification", margin, 9, bold, FOREST);
  y -= 13;
  const certLines = certs.map(
    (c) => `${c.coveredSkus.join(", ")}: ${c.name}, ${c.certifier}${c.number ? `, No. ${c.number}` : ""}`,
  );
  for (const l of certLines) {
    text(l, margin, 8.5);
    y -= 12;
  }
  text(claims.certLine, margin, 8.5);
  y -= 24;

  text("Terms", margin, 9, bold, FOREST);
  y -= 13;
  for (const l of [
    "Prices in CAD before tax. Orders of 10,000 units or more pay the 10,000+ per-unit price on every case, automatically. Net-30 on approval.",
    `${site.phone ? `Order by phone ${site.phone}, ` : "Order "}online at ${site.url.replace(/^https?:\/\//, "")}, or by email ${site.email}.`,
    `Quick order: paste SKUs and quantities at ${site.url.replace(/^https?:\/\//, "")}/quick-order.`,
  ]) {
    text(l, margin, 8.5);
    y -= 12;
  }

  const footer = `${site.legalName} · ${site.city}, ${site.province}`;
  page.drawText(footer, { x: margin, y: margin - 10, size: 8, font, color: FOG });

  const bytes = await pdf.save();
  return new Response(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'inline; filename="made-to-disappear-price-list.pdf"',
      "Cache-Control": "public, max-age=300, s-maxage=300",
    },
  });
}
