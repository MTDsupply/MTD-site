import type { Metadata } from "next";
import type { Category, Cert, Product } from "@/lib/catalog/types";
import { site, restockNote } from "@/lib/site";
import { SHIPPING } from "@/lib/shipping";
import { unitsFor } from "@/lib/units";
import { bulkCasePrice, bulkCasesFor, BULK_MIN_UNITS } from "@/lib/pricing";

/*
 * Search, answer-engine and AI-crawler plumbing in one place: canonical
 * metadata per page and schema.org JSON-LD builders. Every value here comes
 * from the catalogue or `site`, so prices and stock wording never go stale.
 */

const BASE = site.url.replace(/\/$/, "");

/** Absolute URL for a site path (JSON-LD and feeds need absolute URLs). */
export function abs(path: string): string {
  return path.startsWith("http") ? path : `${BASE}${path.startsWith("/") ? path : `/${path}`}`;
}

/** The default description used on the home page and as the site-wide fallback. */
export const SITE_DESCRIPTION =
  "Hot cups and lids made from 100% certified home-compostable material, certified by TÜV Austria per SKU. PHA-lined paper, no microplastics. Cases of 1,000 for cafés, packs of 100 to 500 for everyone. Ships from Victoria, BC across Canada and the US.";

/**
 * Per-page metadata with a canonical URL and a complete Open Graph block.
 * Next does not deep-merge `openGraph`, so each page passes its own title and
 * description through here rather than relying on the layout's.
 */
export function pageMeta({
  title,
  description,
  path,
  image,
  imageAlt,
  noindex = false,
}: {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  imageAlt?: string;
  noindex?: boolean;
}): Metadata {
  const img = image ?? "/og.png";
  const fullTitle = `${title} · ${site.name}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      type: "website",
      locale: "en_CA",
      siteName: site.name,
      url: path,
      title: fullTitle,
      description,
      images: [{ url: img, alt: imageAlt ?? fullTitle }],
    },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [img] },
  };
}

/** Public URL path for a product page. */
export function productPath(p: Product): string {
  return `/products/${p.categorySlug}/${p.sku.toLowerCase()}`;
}

const socialLinks = (process.env.NEXT_PUBLIC_SOCIAL_URLS ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

export const ORG_ID = `${BASE}/#organization`;

/** The company, once, referenced from every page. */
export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: site.name,
    alternateName: site.shortName,
    legalName: site.legalName,
    url: BASE,
    logo: { "@type": "ImageObject", url: abs("/logo-wordmark.png") },
    image: abs("/og.png"),
    description: SITE_DESCRIPTION,
    slogan: site.tagline,
    email: site.email,
    ...(site.phone ? { telephone: site.phone } : {}),
    address: { "@type": "PostalAddress", addressLocality: site.city, addressRegion: site.province, addressCountry: "CA" },
    areaServed: [
      { "@type": "Country", name: "Canada" },
      { "@type": "Country", name: "United States" },
    ],
    founder: [
      { "@type": "Person", name: "Sullivan Bryan", jobTitle: "Chief Executive Officer" },
      { "@type": "Person", name: "Jack Hill", jobTitle: "President and Chief Operating Officer" },
    ],
    brand: [
      { "@type": "Brand", name: site.name },
      { "@type": "Brand", name: "Cup Casa", url: "https://cupcasa.com" },
    ],
    knowsAbout: ["home-compostable packaging", "PHA-lined paper cups", "compostable hot cup lids", "TÜV Austria home-compostable certification", "foodservice disposables"],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        email: site.email,
        ...(site.phone ? { telephone: site.phone } : {}),
        areaServed: ["CA", "US"],
        availableLanguage: "en",
      },
    ],
    ...(socialLinks.length ? { sameAs: socialLinks } : {}),
  };
}

/** The site, with the sitelinks search box action pointing at the catalogue search. */
export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BASE}/#website`,
    url: BASE,
    name: site.name,
    description: SITE_DESCRIPTION,
    inLanguage: "en-CA",
    publisher: { "@id": ORG_ID },
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${BASE}/products?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: abs(it.path),
    })),
  };
}

export function faqLd(pairs: [string, string][]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: pairs.map(([q, a]) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

export function howToLd({ name, description, steps, image }: { name: string; description: string; steps: [string, string][]; image?: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    ...(image ? { image: abs(image) } : {}),
    step: steps.map(([n, text], i) => ({ "@type": "HowToStep", position: i + 1, name: n, text })),
  };
}

export function itemListLd(name: string, products: Product[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: products.length,
    itemListElement: products.map((p, i) => ({ "@type": "ListItem", position: i + 1, name: p.name, url: abs(productPath(p)) })),
  };
}

const returnPolicy = {
  "@type": "MerchantReturnPolicy",
  applicableCountry: ["CA", "US"],
  returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
  merchantReturnDays: 30,
  returnMethod: "https://schema.org/ReturnByMail",
  returnFees: "https://schema.org/ReturnShippingFees",
  refundType: "https://schema.org/FullRefund",
  merchantReturnLink: abs("/shipping-returns"),
};

function shippingLd(kind: "pack" | "case") {
  return (["CA", "US"] as const).map((c) => ({
    "@type": "OfferShippingDetails",
    shippingDestination: { "@type": "DefinedRegion", addressCountry: c },
    shippingRate: {
      "@type": "MonetaryAmount",
      value: kind === "case" ? SHIPPING[c].perCase : SHIPPING[c].pack,
      currency: site.currency,
    },
  }));
}

/**
 * schema.org Product with one Offer per purchasable unit (each pack size, the
 * case, and the case at the volume price), the certification, specs and the
 * shipping and return terms the shipping page states.
 */
export function productLd(p: Product, cert: Cert | undefined, category: Category | undefined) {
  const url = abs(productPath(p));
  const availability = restockNote(p.categorySlug) ? "https://schema.org/BackOrder" : "https://schema.org/InStock";
  const units = unitsFor(p);
  const offers = units.map((u) => ({
    "@type": "Offer",
    name: u.label,
    url,
    price: u.price.toFixed(2),
    priceCurrency: site.currency,
    availability,
    itemCondition: "https://schema.org/NewCondition",
    eligibleQuantity: { "@type": "QuantitativeValue", value: u.count, unitText: "units" },
    priceSpecification: {
      "@type": "UnitPriceSpecification",
      price: u.price.toFixed(2),
      priceCurrency: site.currency,
      referenceQuantity: { "@type": "QuantitativeValue", value: u.count, unitText: "units" },
    },
    shippingDetails: shippingLd(u.kind),
    hasMerchantReturnPolicy: returnPolicy,
    seller: { "@id": ORG_ID },
  }));
  const volume = bulkCasePrice(p);
  if (volume != null) {
    offers.push({
      "@type": "Offer",
      name: `Case of ${p.caseCount.toLocaleString("en-CA")}, orders of ${BULK_MIN_UNITS.toLocaleString("en-CA")}+ units`,
      url,
      price: volume.toFixed(2),
      priceCurrency: site.currency,
      availability,
      itemCondition: "https://schema.org/NewCondition",
      eligibleQuantity: { "@type": "QuantitativeValue", minValue: bulkCasesFor(p), unitText: "cases" } as unknown as { "@type": "QuantitativeValue"; value: number; unitText: string },
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: volume.toFixed(2),
        priceCurrency: site.currency,
        referenceQuantity: { "@type": "QuantitativeValue", value: p.caseCount, unitText: "units" },
      },
      shippingDetails: shippingLd("case"),
      hasMerchantReturnPolicy: returnPolicy,
      seller: { "@id": ORG_ID },
    });
  }
  const specs: [string, string | undefined][] = [
    ["Capacity", p.specs.capacity],
    ["Rim diameter", p.specs.rimDiameter],
    ["Lining", p.specs.lining],
    ["Case count", `${p.caseCount.toLocaleString("en-CA")} units`],
    ["Case dimensions", p.specs.caseDimensions],
    ["Case weight", p.specs.caseWeight],
  ];
  const images = [p.photo, ...p.images].filter((x): x is string => !!x).map(abs);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#product`,
    name: p.name,
    sku: p.sku,
    mpn: p.sku,
    url,
    ...(images.length ? { image: images } : {}),
    description: `${p.name}, ${p.material}. ${p.size}. Made from 100% certified home-compostable material, certified by ${site.certifier} for this SKU. Sold in packs of ${units
      .filter((u) => u.kind === "pack")
      .map((u) => u.count)
      .join(", ")} and cases of ${p.caseCount.toLocaleString("en-CA")}.`,
    brand: { "@type": "Brand", name: site.name },
    manufacturer: { "@id": ORG_ID },
    material: p.material,
    category: category?.name ?? p.categorySlug,
    ...(p.specs.capacity ? { size: p.size } : {}),
    color: "White",
    ...(cert
      ? {
          hasCertification: {
            "@type": "Certification",
            name: cert.name,
            issuedBy: { "@type": "Organization", name: cert.certifier },
            ...(cert.number ? { certificationIdentification: cert.number } : {}),
            url: abs(`/certifications#${p.sku}`),
          },
        }
      : {}),
    additionalProperty: specs.filter(([, v]) => !!v).map(([name, value]) => ({ "@type": "PropertyValue", name, value })),
    ...(p.goesWith.length
      ? {
          isRelatedTo: p.goesWith.map((s) => ({ "@type": "Product", sku: s, url: abs(`/products/${s.startsWith("MTD-LID") ? "lids" : "cups"}/${s.toLowerCase()}`) })),
        }
      : {}),
    offers,
  };
}
