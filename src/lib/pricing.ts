import type { Product } from "@/lib/catalog/types";
import type { CartLine, Unit } from "@/lib/store/cart";
import { unitInfo, type UnitInfo } from "./units";

/** Orders of this many units or more pay the volume price on every case. */
export const BULK_MIN_UNITS = 10_000;

const round2 = (n: number) => Math.round(n * 100) / 100;

/** How many cases of this product make up the volume threshold (10 for a case of 1,000). */
export function bulkCasesFor(product: Product): number {
  return Math.ceil(BULK_MIN_UNITS / product.caseCount);
}

/** The volume price for one case, or null when the SKU has no volume tier. */
export function bulkCasePrice(product: Product): number | null {
  return product.bulkUnitPrice == null ? null : round2(product.bulkUnitPrice * product.caseCount);
}

export type PricedLine = {
  line: CartLine;
  product: Product;
  info: UnitInfo;
  /** Price charged for one of `line.unit`, after any volume pricing. */
  price: number;
  /** True when the volume price replaced the list price on this line. */
  bulk: boolean;
};

export type PricedOrder = {
  rows: PricedLine[];
  /** Units in the order across every line, packs included. */
  units: number;
  /** True once the order reaches BULK_MIN_UNITS. */
  bulk: boolean;
  /** Units still needed to reach the volume price (0 once reached). */
  unitsToBulk: number;
  subtotal: number;
  /** What the same lines would cost at list price; equals subtotal when nothing is discounted. */
  listSubtotal: number;
};

/**
 * Prices a whole order. The threshold counts every unit in the order; the
 * volume price applies to case lines of products that have one. Packs keep
 * their pack price. Lines whose SKU is not in `products` are dropped, so the
 * caller validates SKUs first when that matters (checkout does).
 */
export function priceOrder(lines: CartLine[], products: Product[]): PricedOrder {
  const bySku = new Map(products.map((p) => [p.sku, p]));
  const rows = lines
    .map((line) => ({ line, product: bySku.get(line.sku) }))
    .filter((r): r is { line: CartLine; product: Product } => !!r.product)
    .map((r) => ({ ...r, info: unitInfo(r.product, r.line.unit as Unit) }));
  const units = rows.reduce((n, r) => n + r.line.qty * r.info.count, 0);
  const bulk = units >= BULK_MIN_UNITS;
  const priced: PricedLine[] = rows.map((r) => {
    const volume = bulk && r.info.kind === "case" ? bulkCasePrice(r.product) : null;
    return { ...r, price: volume ?? r.info.price, bulk: volume != null };
  });
  const subtotal = round2(priced.reduce((s, r) => s + r.price * r.line.qty, 0));
  const listSubtotal = round2(priced.reduce((s, r) => s + r.info.price * r.line.qty, 0));
  return { rows: priced, units, bulk, unitsToBulk: Math.max(0, BULK_MIN_UNITS - units), subtotal, listSubtotal };
}

/** Price for `qty` of a unit on its own, as the buy box shows it before the cart combines lines. */
export function priceFor(product: Product, info: UnitInfo, qty: number): { price: number; bulk: boolean } {
  const volume = info.kind === "case" && qty * info.count >= BULK_MIN_UNITS ? bulkCasePrice(product) : null;
  return { price: volume ?? info.price, bulk: volume != null };
}
