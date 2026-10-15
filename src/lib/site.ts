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
};
