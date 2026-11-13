"use client";
import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/lib/catalog/types";
import { BULK_MIN_UNITS, hasVolumeTier } from "@/lib/pricing";
import { money, unitMoney, count } from "@/lib/format";

/*
 * A month's order, written out. Three plain inputs in a sentence (cups a day,
 * size, lids or not) and a receipt in the same price-table style as the
 * business page. The maths is the catalogue's: case price and count per SKU,
 * and the volume price on every case once one order reaches BULK_MIN_UNITS,
 * lids counted. Same rule the cart and checkout use.
 */
const PRESETS = [50, 100, 150, 250, 400];

export function CostCalculator({ cups, lid }: { cups: Product[]; lid: Product | null }) {
  const sizes = cups.filter((c) => c.status === "live").sort((a, b) => a.sortOrder - b.sortOrder);
  const [sku, setSku] = useState(sizes[1]?.sku ?? sizes[0]?.sku ?? "");
  const [perDay, setPerDay] = useState(150);
  const [withLids, setWithLids] = useState(true);
  const cup = sizes.find((c) => c.sku === sku) ?? sizes[0];
  const tiered = hasVolumeTier(cups) || (lid?.bulkUnitPrice != null);
  if (!cup) return null;

  const unitsMonth = perDay * 30;
  const cases = Math.max(1, Math.ceil(unitsMonth / cup.caseCount));
  const lidCases = withLids && lid ? Math.max(1, Math.ceil(unitsMonth / lid.caseCount)) : 0;
  const orderUnits = cases * cup.caseCount + lidCases * (lid?.caseCount ?? 0);
  const bulk = orderUnits >= BULK_MIN_UNITS;
  const cupEach = bulk && cup.bulkUnitPrice != null ? cup.bulkUnitPrice : cup.unitPrice;
  const lidEach = lid ? (bulk && lid.bulkUnitPrice != null ? lid.bulkUnitPrice : lid.unitPrice) : 0;
  const cupLine = cases * cup.caseCount * cupEach;
  const lidLine = lidCases * (lid?.caseCount ?? 0) * lidEach;
  const total = cupLine + lidLine;
  const perServe = cupEach + (withLids && lid ? lidEach : 0);
  const toGo = Math.max(0, BULK_MIN_UNITS - orderUnits);

  return (
    <div className="grid gap-8 md:grid-cols-[1fr_1.1fr] md:gap-12">
      {/* The order, as a sentence. */}
      <div className="text-[19px] leading-[1.9] text-ink md:text-[21px]">
        <p>
          We serve about{" "}
          <input
            aria-label="Cups a day"
            type="number"
            inputMode="numeric"
            min={1}
            max={5000}
            value={perDay}
            onChange={(e) => setPerDay(Math.max(1, Math.min(5000, Number(e.target.value) || 1)))}
            className="input inline-block w-[3.8em] px-2 py-0.5 text-center font-display text-[19px] font-medium text-forest tnum md:text-[21px]"
          />{" "}
          cups a day, mostly{" "}
          <select aria-label="Cup size" value={cup.sku} onChange={(e) => setSku(e.target.value)} className="input inline-block w-auto py-0.5 pl-3 font-display text-[19px] font-medium text-forest md:text-[21px]">
            {sizes.map((s) => (
              <option key={s.sku} value={s.sku}>
                {s.size}
              </option>
            ))}
          </select>
          {lid ? (
            <>
              ,{" "}
              <select aria-label="Lids" value={withLids ? "yes" : "no"} onChange={(e) => setWithLids(e.target.value === "yes")} className="input inline-block w-auto py-0.5 pl-3 font-display text-[19px] font-medium text-forest md:text-[21px]">
                <option value="yes">with lids</option>
                <option value="no">without lids</option>
              </select>
            </>
          ) : null}
          .
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {PRESETS.map((n) => (
            <button key={n} type="button" onClick={() => setPerDay(n)} className={`chip ${n === perDay ? "!border-ink !bg-ink !text-bone" : "chip-fog"}`} aria-pressed={n === perDay}>
              {n} a day
            </button>
          ))}
        </div>
        <p className="mt-6 text-[14px] leading-6 text-stone">
          A month is thirty days. Cases are {count(cup.caseCount)}.{tiered ? <> Every case in an order of {count(BULK_MIN_UNITS)} units or more is charged at the volume price, lids counted.</> : null} Prices in CAD before tax and shipping.
        </p>
      </div>

      {/* The receipt. */}
      <div className="border border-line bg-card">
        <div className="overflow-x-auto">
        <table className="price-table w-full text-[15px]">
          <thead>
            <tr>
              <th>A month</th>
              <th className="num hidden sm:table-cell">Cases</th>
              <th className="num hidden sm:table-cell">Each</th>
              <th className="num">Line</th>
            </tr>
          </thead>
          <tbody className="tnum">
            <tr>
              <td className="wrap">
                {cup.name} <span className="sku hidden text-soil/50 sm:inline">{cup.sku}</span>
                <span className="block text-[12px] text-soil/55 sm:hidden">
                  {cases} {cases === 1 ? "case" : "cases"} · {unitMoney(cupEach)} each
                </span>
              </td>
              <td className="num hidden sm:table-cell">{cases}</td>
              <td className="num hidden sm:table-cell">{unitMoney(cupEach)}</td>
              <td className="num">{money(cupLine)}</td>
            </tr>
            {lid && withLids ? (
              <tr>
                <td className="wrap">
                  {lid.name} <span className="sku hidden text-soil/50 sm:inline">{lid.sku}</span>
                  <span className="block text-[12px] text-soil/55 sm:hidden">
                    {lidCases} {lidCases === 1 ? "case" : "cases"} · {unitMoney(lidEach)} each
                  </span>
                </td>
                <td className="num hidden sm:table-cell">{lidCases}</td>
                <td className="num hidden sm:table-cell">{unitMoney(lidEach)}</td>
                <td className="num">{money(lidLine)}</td>
              </tr>
            ) : null}
            {tiered ? (
            <tr>
              <td colSpan={3} className="wrap text-soil/70">
                {bulk ? (
                  <>
                    Volume price applied: {count(orderUnits)} units in the order.
                  </>
                ) : (
                  <>
                    {count(orderUnits)} units. {count(toGo)} more in one order and every case drops to the volume price ({unitMoney(cup.bulkUnitPrice ?? cup.unitPrice)} for the {cup.size}).
                  </>
                )}
              </td>
              <td className="num text-soil/70">{bulk ? "Applied" : "Not yet"}</td>
            </tr>
            ) : null}
          </tbody>
          <tfoot className="tnum">
            <tr>
              <td colSpan={3} className="wrap font-medium">
                A month, before tax
              </td>
              <td className="num font-semibold text-forest">{money(total)}</td>
            </tr>
            <tr>
              <td colSpan={3} className="wrap text-soil/70">
                Per serve{withLids && lid ? ", cup and lid" : ""}
              </td>
              <td className="num text-soil/70">{unitMoney(perServe)}</td>
            </tr>
          </tfoot>
        </table>
        </div>
        <div className="flex flex-wrap gap-3 border-t border-line px-4 py-4">
          <Link href={`/products/${cup.categorySlug}/${cup.sku.toLowerCase()}`} className="btn btn-primary btn-sm">
            order the {cup.size}
          </Link>
          <Link href="/business#quote" className="btn btn-outline btn-sm">
            wholesale pricing
          </Link>
        </div>
      </div>
    </div>
  );
}
