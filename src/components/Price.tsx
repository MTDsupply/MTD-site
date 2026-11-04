"use client";
import { useMode } from "@/lib/store/mode";
import { money, unitMoney, count } from "@/lib/format";
import { unitsFor } from "@/lib/units";
import { bulkCasesFor } from "@/lib/pricing";
import type { Product } from "@/lib/catalog/types";

/** Price block that follows the Business/Consumer toggle. */
export function Price({ product, size = "md", detail = true }: { product: Product; size?: "sm" | "md" | "lg"; detail?: boolean }) {
  const mode = useMode();
  const big = size === "lg" ? "text-2xl" : size === "sm" ? "text-base" : "text-lg";
  const units = unitsFor(product);
  const packs = units.filter((u) => u.kind === "pack");
  const smallest = packs[0];
  const largest = packs[packs.length - 1];
  const volume =
    product.bulkUnitPrice != null ? (
      <>
        {unitMoney(product.bulkUnitPrice)} per unit from {count(bulkCasesFor(product))} cases
      </>
    ) : null;

  if (mode === "business") {
    return (
      <div className="tnum">
        <div className={`${big} font-medium`}>
          {money(product.casePrice)} <span className="text-sm font-normal text-soil/70">per case of {count(product.caseCount)}</span>
        </div>
        <div className="text-sm text-soil/70">
          {unitMoney(product.unitPrice)} per unit
          {volume && detail ? <> · {volume}</> : null}
        </div>
      </div>
    );
  }
  return (
    <div className="tnum">
      <div className={`${big} font-medium`}>
        {money(smallest.price)} <span className="text-sm font-normal text-soil/70">per pack of {count(smallest.count)}</span>
      </div>
      {detail ? (
        <div className="text-sm text-soil/70">
          {unitMoney(smallest.price / smallest.count)} per unit
          {largest !== smallest ? <> · from {unitMoney(largest.price / largest.count)} in packs of {count(largest.count)}</> : null}
          {" · "}
          {money(product.casePrice)} per case of {count(product.caseCount)}
          {volume ? <> · {volume}</> : null}
        </div>
      ) : (
        <div className="text-sm text-soil/70">or {money(product.casePrice)} per case of {count(product.caseCount)}</div>
      )}
    </div>
  );
}

export function PriceFrom({ product }: { product: Product }) {
  const mode = useMode();
  const smallest = unitsFor(product)[0];
  const v = mode === "business" ? product.casePrice : smallest.price;
  const per = mode === "business" ? `case of ${count(product.caseCount)}` : `pack of ${count(smallest.count)}`;
  return (
    <span className="tnum">
      From {money(v)} <span className="text-soil/70">per {per}</span>
    </span>
  );
}
