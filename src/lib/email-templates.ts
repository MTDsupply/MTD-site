import "server-only";
import { site } from "./site";

type Item = { name: string; unit: string; qty: number; price: number };

const cad = (n: number) => `$${n.toFixed(2)} CAD`;
const unitLabel = (u: string) => (u === "case" ? "case of 1,000" : `pack of ${u.replace("pack-", "")}`);

/** Plain-text order confirmation for the customer. */
export function orderConfirmation(o: { name: string | null; items: Item[]; total: number; shipping: number; address?: string | null }) {
  const lines = o.items.map((i) => `  ${i.qty} × ${i.name} (${unitLabel(i.unit)}) · ${cad(i.price * i.qty)}`).join("\n");
  return {
    subject: "Your Made to Disappear order",
    text: [
      `Hi${o.name ? ` ${o.name.split(" ")[0]}` : ""},`,
      "",
      "Thanks for your order. Here is what is on its way:",
      "",
      lines,
      "",
      `Shipping: ${o.shipping === 0 ? "free" : cad(o.shipping)}`,
      `Total charged: ${cad(o.total)}`,
      o.address ? `\nShipping to:\n${o.address}` : "",
      "",
      "You will get a tracking link by email when it ships.",
      "",
      "Everything in the box is made from 100% certified home-compostable material. When you are done with it, it goes in the compost with the coffee grounds.",
      "",
      `Questions? Reply to this email or write to ${site.email}.`,
      "",
      site.legalName,
      `${site.city}, ${site.province}, ${site.country}`,
    ]
      .filter((l) => l !== null)
      .join("\n"),
  };
}
