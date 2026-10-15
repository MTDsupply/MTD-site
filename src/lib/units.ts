import type { Product } from "@/lib/catalog/types";
import type { Unit } from "@/lib/store/cart";

/** Server-safe: "pack-100" -> 100, "case" -> null. */
export function packCountOf(unit: Unit | string): number | null {
  const m = /^pack-(\d+)$/.exec(unit);
  return m ? Number(m[1]) : null;
}

export type UnitInfo = { unit: Unit; count: number; price: number; label: string; kind: "pack" | "case" };

/** Every purchasable unit for a product: each pack tier, then the case. */
export function unitsFor(product: Product): UnitInfo[] {
  const packs = (product.packs?.length ? product.packs : [{ count: product.packCount, price: product.packPrice }])
    .slice()
    .sort((a, b) => a.count - b.count)
    .map<UnitInfo>((t) => ({
      unit: `pack-${t.count}` as Unit,
      count: t.count,
      price: t.price,
      label: `Pack of ${t.count.toLocaleString("en-CA")}`,
      kind: "pack",
    }));
  return [
    ...packs,
    {
      unit: "case",
      count: product.caseCount,
      price: product.casePrice,
      label: `Case of ${product.caseCount.toLocaleString("en-CA")}`,
      kind: "case",
    },
  ];
}

/** Resolves a cart unit against a product; falls back to the smallest pack. */
export function unitInfo(product: Product, unit: Unit): UnitInfo {
  const all = unitsFor(product);
  if (unit === "case") return all[all.length - 1];
  const n = packCountOf(unit);
  return all.find((u) => u.kind === "pack" && u.count === n) ?? all[0];
}

export function smallestPack(product: Product): UnitInfo {
  return unitsFor(product)[0];
}
