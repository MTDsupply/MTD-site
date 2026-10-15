"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import type { Product } from "@/lib/catalog/types";
import { addManyToCart, packUnit, type CartLine, type Unit } from "@/lib/store/cart";
import { unitInfo, unitsFor } from "@/lib/units";
import { useMode } from "@/lib/store/mode";
import { money } from "@/lib/format";

type Parsed = { raw: string; sku: string; qty: number; unit: Unit; product?: Product };

export function QuickOrder({ products }: { products: Product[] }) {
  const mode = useMode();
  const [text, setText] = useState("");
  const [added, setAdded] = useState(false);
  const bySku = useMemo(() => new Map(products.map((p) => [p.sku.toUpperCase(), p])), [products]);

  const rows: Parsed[] = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((raw) => {
      const parts = raw.split(/[\s,;\t]+/).filter(Boolean);
      const sku = (parts[0] ?? "").toUpperCase();
      const qty = Math.max(1, parseInt(parts[1] ?? "1", 10) || 1);
      const product = bySku.get(sku);
      const unitWord = (parts[2] ?? "").toLowerCase();
      const packN = /^pack-?(\d+)$/.exec(unitWord)?.[1];
      let unit: Unit;
      if (unitWord.startsWith("case")) unit = "case";
      else if (packN) unit = packUnit(Number(packN));
      else if (unitWord.startsWith("pack") || mode !== "business") unit = product ? unitsFor(product)[0].unit : packUnit(100);
      else unit = "case";
      return { raw, sku, qty, unit, product };
    });

  const valid = rows.filter((r): r is Parsed & { product: Product } => !!r.product);
  const total = valid.reduce((s, r) => s + r.qty * unitInfo(r.product, r.unit).price, 0);

  const addAll = () => {
    const lines: CartLine[] = valid.map((r) => ({ sku: r.product.sku, unit: r.unit, qty: r.qty }));
    addManyToCart(lines);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
      <div>
        <label htmlFor="qo" className="label">
          SKUs and quantities
        </label>
        <textarea
          id="qo"
          rows={10}
          className="input font-mono text-sm"
          placeholder={"MTD-CUP-16H 4 case\nMTD-STR-200 1 pack500"}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="mt-3 flex items-center gap-3">
          <button type="button" className="btn btn-primary" onClick={addAll} disabled={valid.length === 0 || added}>
            {added ? "Added to cart" : `Add all (${valid.length})`}
          </button>
          {added ? (
            <Link href="/cart" className="text-sm link font-medium">
              Go to cart
            </Link>
          ) : null}
        </div>
      </div>

      <div>
        <h2 className="label">Preview</h2>
        <div className="overflow-x-auto border border-line bg-white">
          <table className="price-table w-full text-sm">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Product</th>
                <th>Unit</th>
                <th className="num">Qty</th>
                <th className="num">Line</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-soil/60">
                    Nothing yet. SKUs look like <span className="tnum">MTD-CUP-16H</span>.
                  </td>
                </tr>
              ) : null}
              {rows.map((r, i) =>
                r.product ? (
                  <tr key={i}>
                    <td className="sku">{r.product.sku}</td>
                    <td>{r.product.name}</td>
                    <td>{unitInfo(r.product, r.unit).label}</td>
                    <td className="num">{r.qty}</td>
                    <td className="num">{money(r.qty * unitInfo(r.product, r.unit).price)}</td>
                  </tr>
                ) : (
                  <tr key={i} className="text-clay-deep">
                    <td className="sku">{r.sku || "?"}</td>
                    <td colSpan={4}>Unknown SKU</td>
                  </tr>
                ),
              )}
            </tbody>
            {valid.length ? (
              <tfoot>
                <tr>
                  <td colSpan={4} className="font-medium">
                    Subtotal
                  </td>
                  <td className="num font-medium">{money(total)}</td>
                </tr>
              </tfoot>
            ) : null}
          </table>
        </div>
        <p className="mt-3 text-xs text-soil/60">
          Live SKUs: {products.map((p) => p.sku).join(", ")}.
        </p>
      </div>
    </div>
  );
}
