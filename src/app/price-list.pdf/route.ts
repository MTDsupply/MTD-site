import { readFile } from "node:fs/promises";
import path from "node:path";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { getCatalog } from "@/lib/catalog/queries";
import { site } from "@/lib/site";
import { claims } from "@/lib/copy";

const SOIL = rgb(0x19 / 255, 0x19 / 255, 0x19 / 255);
const FOG = rgb(0xb8 / 255, 0xb8 / 255, 0xb2 / 255);

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

  const text = (s: string, x: number, size = 9, f = font, color = SOIL) =>
    page.drawText(s.normalize("NFKD").replace(/[^\x20-\x7E]/g, ""), { x, y, size, font: f, color });

  // Logo top-left (falls back to text if the file is missing).
  try {
    const png = await pdf.embedPng(await readFile(path.join(process.cwd(), "public", "logo-wordmark.png")));
    const logoH = 40;
    const logoW = (png.width / png.height) * logoH;
    page.drawImage(png, { x: margin - 4, y: y - logoH + 8, width: logoW, height: logoH });
    y -= logoH + 2;
  } catch {
    text("made to disappear", margin, 22, bold, SOIL);
    y -= 16;
  }
  text("Price list. Compostable foodservice supplies.", margin, 10);
  const date = new Date().toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" });
  page.drawText(date, { x: width - margin - font.widthOfTextAtSize(date, 9), y, size: 9, font, color: SOIL });
  y -= 10;
  page.drawLine({ start: { x: margin, y }, end: { x: width - margin, y }, thickness: 2, color: SOIL });
  y -= 24;

  const cols = [margin, margin + 64, margin + 158, margin + 234, margin + 270, margin + 316, margin + 364, margin + 418];
  const head = ["SKU", "Product", "Material", "Case", "Per case", "Per unit", "10,000+ units", "Packs 100 / 200 / 500"];
  const clip = (v: string, n: number) => (v.length > n ? `${v.slice(0, n - 1).trimEnd()}…` : v);
  const packCol = (p: (typeof products)[number]) =>
    (p.packs?.length ? p.packs : [{ count: p.packCount, price: p.packPrice }]).map((t) => cad(t.price, 0)).join(" / ");
  head.forEach((h, i) => text(h, cols[i], 8.5, bold));
  y -= 6;
  page.drawLine({ start: { x: margin, y }, end: { x: width - margin, y }, thickness: 0.5, color: FOG });
  y -= 14;

  for (const p of live.filter((p) => liveCats.has(p.categorySlug))) {
    const row = [
      p.sku,
      clip(p.name, 22),
      clip(p.material, 17),
      p.caseCount.toLocaleString("en-CA"),
      cad(p.casePrice),
      cad(p.unitPrice, 3),
      p.bulkUnitPrice != null ? cad(p.bulkUnitPrice, 3) : cad(p.unitPrice, 3),
      packCol(p),
    ];
    row.forEach((v, i) => text(v, cols[i], 8.5));
    y -= 15;
  }

  y -= 6;
  text("Coming soon (planned pricing)", margin, 9, bold);
  y -= 13;
  for (const p of soonProducts) {
    const row = [
      p.sku,
      clip(p.name, 22),
      clip(p.material, 17),
      p.caseCount.toLocaleString("en-CA"),
      cad(p.casePrice),
      cad(p.unitPrice, 3),
      p.bulkUnitPrice != null ? cad(p.bulkUnitPrice, 3) : cad(p.unitPrice, 3),
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

  text("Certification", margin, 9, bold);
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

  text("Terms", margin, 9, bold);
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
