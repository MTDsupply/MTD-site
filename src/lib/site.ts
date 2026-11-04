/** Site-wide constants. Replace the placeholders before launch. */
export const site = {
  name: "Made to Disappear",
  shortName: "MTD",
  tagline: "Made to disappear.",
  legalName: "Made to Disappear",
  city: "Victoria",
  province: "BC",
  country: "Canada",
  /** Order line. Set NEXT_PUBLIC_PHONE (display) and NEXT_PUBLIC_PHONE_HREF (tel: link); hidden until set. */
  phone: process.env.NEXT_PUBLIC_PHONE ?? null,
  phoneHref: process.env.NEXT_PUBLIC_PHONE_HREF ?? null,
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@madetodisappear.com",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.madetodisappear.com",
  currency: "CAD",
  /** Locations line in the footer: same coming-soon logic applied to geography. */
  locations: [
    { city: "Victoria", status: "live" as const },
    { city: "Vancouver", status: "coming_soon" as const, when: "2027" },
    { city: "Calgary", status: "coming_soon" as const, when: "2027" },
  ],
  certifier: "TÜV Austria",
  /** Public profiles, linked from the footer and listed as sameAs in the Organization schema. */
  social: [{ name: "Instagram", handle: "@madetodisappearltd", url: "https://www.instagram.com/madetodisappearltd/" }],
  /**
   * Categories waiting on a restock, by slug, with the wording to show.
   * Remove the entry when the stock lands and every "in stock" line comes back.
   */
  restock: { cups: "mid-December", lids: "mid-December" } as Record<string, string>,
};

/** "Restocking mid-December" for a category that is waiting on stock, or null. */
export function restockNote(categorySlug: string): string | null {
  const when = site.restock[categorySlug];
  return when ? `Restocking ${when}` : null;
}

/**
 * One sentence covering cups and lids for the places that mention both:
 * "Cups and lids restocking mid-December." / "Cups restocking mid-December, lids in stock." /
 * "Cups and lids in stock." (the first form when both share a date).
 */
export function stockSentence(): string {
  const c = site.restock.cups;
  const l = site.restock.lids;
  if (c && l) return c === l ? `Cups and lids restocking ${c}.` : `Cups restocking ${c}, lids restocking ${l}.`;
  if (c) return `Cups restocking ${c}, lids in stock.`;
  if (l) return `Lids restocking ${l}, cups in stock.`;
  return "Cups and lids in stock.";
}

/** The same note mid-sentence: "restocking mid-December". */
export function restockNoteLower(categorySlug: string): string | null {
  const n = restockNote(categorySlug);
  return n ? n[0].toLowerCase() + n.slice(1) : null;
}
