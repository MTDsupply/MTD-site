"use client";
import { useSyncExternalStore } from "react";

export type Unit = "case" | `pack-${number}`;

export function packUnit(count: number): Unit {
  return `pack-${count}` as Unit;
}
export function packCountOf(unit: Unit): number | null {
  const m = /^pack-(\d+)$/.exec(unit);
  return m ? Number(m[1]) : null;
}
export type CartLine = { sku: string; unit: Unit; qty: number };

const KEY = "mtd_cart_v1";
const listeners = new Set<() => void>();
let cached: CartLine[] | null = null;
const EMPTY: CartLine[] = [];

function read(): CartLine[] {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as CartLine[];
    return Array.isArray(parsed) ? parsed : EMPTY;
  } catch {
    return EMPTY;
  }
}

function snapshot(): CartLine[] {
  if (cached === null) cached = read();
  return cached;
}

function write(lines: CartLine[]) {
  cached = lines;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(lines));
  } catch {
    // Storage unavailable: cart lives in memory for this page.
  }
  listeners.forEach((l) => l());
}

export function useCart(): CartLine[] {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      const onStorage = (e: StorageEvent) => {
        if (e.key === KEY) {
          cached = read();
          cb();
        }
      };
      window.addEventListener("storage", onStorage);
      return () => {
        listeners.delete(cb);
        window.removeEventListener("storage", onStorage);
      };
    },
    snapshot,
    () => EMPTY,
  );
}

export function addToCart(line: CartLine) {
  const lines = [...snapshot()];
  const i = lines.findIndex((l) => l.sku === line.sku && l.unit === line.unit);
  if (i >= 0) lines[i] = { ...lines[i], qty: lines[i].qty + line.qty };
  else lines.push(line);
  write(lines);
}

export function addManyToCart(items: CartLine[]) {
  items.forEach(addToCart);
}

export function setQty(sku: string, unit: Unit, qty: number) {
  const lines = snapshot()
    .map((l) => (l.sku === sku && l.unit === unit ? { ...l, qty } : l))
    .filter((l) => l.qty > 0);
  write(lines);
}

export function removeLine(sku: string, unit: Unit) {
  write(snapshot().filter((l) => !(l.sku === sku && l.unit === unit)));
}

export function clearCart() {
  write([]);
}

export function cartCount(lines: CartLine[]): number {
  return lines.reduce((n, l) => n + l.qty, 0);
}
