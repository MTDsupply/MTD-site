"use client";
import { useMemo, useState, useTransition } from "react";
import type { Product } from "@/lib/catalog/types";
import { type CartLine, type Unit } from "@/lib/store/cart";
import { unitInfo, unitsFor } from "@/lib/units";
import { money } from "@/lib/format";
import { saveUsual, type ActionState } from "@/app/actions/account";
import { ReorderButton } from "@/components/ReorderButton";

type Line = { sku: string; unit: Unit; qty: number };

/**
 * Editable standing list. Quantities and units change in place; "Save list"
 * stores it, "Add all to cart" puts every line in the cart and opens it.
 */
export function UsualEditor({ products, initial }: { products: Product[]; initial: Line[] }) {
  const [lines, setLines] = useState<Line[]>(initial);
  const [saved, setSaved] = useState<Line[]>(initial);
  const [state, setState] = useState<ActionState>(null);
  const [pending, start] = useTransition();
  const bySku = useMemo(() => new Map(products.map((p) => [p.sku, p])), [products]);

  const dirty = JSON.stringify(lines) !== JSON.stringify(saved);
  const rows = lines.map((l) => ({ line: l, product: bySku.get(l.sku) })).filter((r): r is { line: Line; product: Product } => !!r.product);
  const total = rows.reduce((s, r) => s + r.line.qty * unitInfo(r.product, r.line.unit).price, 0);
  const cartLines: CartLine[] = rows.map((r) => r.line);

  const update = (i: number, patch: Partial<Line>) => {
    setState(null);
    setLines((prev) => prev.map((l, idx) => (idx === i ? { ...l, ...patch } : l)));
  };
  const remove = (i: number) => {
    setState(null);
    setLines((prev) => prev.filter((_, idx) => idx !== i));
  };
  const add = (sku: string) => {
    const p = bySku.get(sku);
    if (!p) return;
    setState(null);
    setLines((prev) => [...prev, { sku: p.sku, unit: "case", qty: 1 }]);
  };
  const save = () => {
    start(async () => {
      const res = await saveUsual(lines);
      setState(res);
      if (res?.ok) setSaved(lines);
    });
  };

  return (
    <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_280px]">
      <div>
        <div className="overflow-x-auto border border-line bg-white">
          <table className="price-table w-full text-sm">
            <thead>
              <tr>
                <th>Item</th>
                <th>Unit</th>
                <th className="num">Qty</th>
                <th className="num">Each</th>
                <th className="num">Line</th>
                <th>
                  <span className="sr-only">Remove</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="wrap text-soil/60">
                    Nothing on the list yet. Add a product below.
                  </td>
                </tr>
              ) : null}
              {rows.map(({ line, product }, i) => {
                const info = unitInfo(product, line.unit);
                return (
                  <tr key={`${line.sku}-${i}`}>
                    <td>
                      <span className="font-medium">{product.name}</span>
                      <div className="sku text-soil/60">{product.sku}</div>
                    </td>
                    <td>
                      <select
                        aria-label={`Unit for ${product.name}`}
                        className="input py-1"
                        value={line.unit}
                        onChange={(e) => update(i, { unit: e.target.value as Unit })}
                      >
                        {unitsFor(product).map((u) => (
                          <option key={u.unit} value={u.unit}>
                            {u.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="num">
                      <input
                        aria-label={`Quantity for ${product.name}`}
                        type="number"
                        min={1}
                        max={500}
                        className="input tnum w-16 py-1 text-right"
                        value={line.qty}
                        onChange={(e) => update(i, { qty: Math.max(1, Math.min(500, Number(e.target.value) || 1)) })}
                      />
                    </td>
                    <td className="num tnum">{money(info.price)}</td>
                    <td className="num tnum">{money(info.price * line.qty)}</td>
                    <td>
                      <button type="button" onClick={() => remove(i)} className="text-xs text-soil/60 hover:text-clay-deep">
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            {rows.length ? (
              <tfoot>
                <tr>
                  <td colSpan={4} className="font-medium">
                    Subtotal before shipping and tax
                  </td>
                  <td className="num tnum font-medium">{money(total)}</td>
                  <td />
                </tr>
              </tfoot>
            ) : null}
          </table>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <label htmlFor="usual-add" className="label !mb-0">
            Add a product
          </label>
          <select
            id="usual-add"
            className="input w-auto py-1.5"
            value=""
            onChange={(e) => {
              add(e.target.value);
              e.target.value = "";
            }}
          >
            <option value="">Choose…</option>
            {products.map((p) => (
              <option key={p.sku} value={p.sku}>
                {p.name} · {p.sku}
              </option>
            ))}
          </select>
        </div>
      </div>

      <aside className="h-fit space-y-3 border border-line bg-white p-5 text-sm">
        <ReorderButton lines={cartLines} label="Add all to cart" className="btn btn-primary w-full" goToCart />
        <button type="button" className="btn btn-outline w-full" onClick={save} disabled={pending || !dirty}>
          {pending ? "Saving…" : dirty ? "Save list" : "List saved"}
        </button>
        {state ? (
          <p className={`text-xs ${state.ok ? "text-ink" : "text-clay-deep"}`} role="status">
            {state.message}
          </p>
        ) : null}
        <p className="text-xs text-soil/60">Saved lists sit here for every visit. Quantities can be changed in the cart before paying.</p>
      </aside>
    </div>
  );
}
