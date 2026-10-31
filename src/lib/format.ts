const cad = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const cadUnit = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 3,
});
const int = new Intl.NumberFormat("en-CA");

export function money(n: number): string {
  return cad.format(n);
}
/** Per-unit prices can need three decimals for small items. */
export function unitMoney(n: number): string {
  return cadUnit.format(n);
}
export function count(n: number): string {
  return int.format(n);
}
export function cents(n: number): number {
  return Math.round(n * 100);
}
