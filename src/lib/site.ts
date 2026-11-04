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
};

/** "Restocking mid-December" for a category or product waiting on stock, or null when in stock. */
export function restockNote(when: string | null | undefined): string | null {
  return when ? `Restocking ${when}` : null;
}

/** The same note mid-sentence: "restocking mid-December". */
export function restockNoteLower(when: string | null | undefined): string | null {
  const n = restockNote(when);
  return n ? n[0].toLowerCase() + n.slice(1) : null;
}

type Stocked = { slug?: string; categorySlug?: string; restockWhen?: string | null };

/** Restock notes by category slug from a list of categories or products. */
export function restockMap(items: Stocked[]): Record<string, string | null> {
  const out: Record<string, string | null> = {};
  for (const it of items) {
    const slug = it.slug ?? it.categorySlug;
    if (slug && !(slug in out)) out[slug] = it.restockWhen ?? null;
  }
  return out;
}

/**
 * One sentence covering cups and lids for the places that mention both:
 * "Cups and lids restocking mid-December." / "Cups restocking X, lids in stock." /
 * "Cups and lids in stock." (the first form when both share a date).
 */
export function stockSentence(items: Stocked[]): string {
  const m = restockMap(items);
  const c = m.cups ?? null;
  const l = m.lids ?? null;
  if (c && l) return c === l ? `Cups and lids restocking ${c}.` : `Cups restocking ${c}, lids restocking ${l}.`;
  if (c) return `Cups restocking ${c}, lids in stock.`;
  if (l) return `Lids restocking ${l}, cups in stock.`;
  return "Cups and lids in stock.";
}
