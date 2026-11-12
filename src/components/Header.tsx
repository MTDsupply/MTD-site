import Link from "next/link";
import { getCatalog } from "@/lib/catalog/queries";
import { money } from "@/lib/format";
import { restockNote, stockSentence } from "@/lib/site";
import { site } from "@/lib/site";
import { BULK_MIN_UNITS } from "@/lib/pricing";
import { count } from "@/lib/format";
import { Wordmark } from "./Wordmark";
import { Nav } from "./Nav";
import { ModeToggle } from "./ModeToggle";
import { CartButton } from "./CartButton";
import { SearchForm, type SearchEntry } from "./SearchForm";

export async function Header() {
  const catalog = await getCatalog();
  const categories = catalog.categories;
  const catBySlug = new Map(categories.map((c) => [c.slug, c]));
  const entries: SearchEntry[] = [
    ...catalog.products
      .filter((p) => p.status === "live" && catBySlug.get(p.categorySlug)?.status === "live")
      .sort((a, b) => (catBySlug.get(a.categorySlug)?.sortOrder ?? 9) - (catBySlug.get(b.categorySlug)?.sortOrder ?? 9) || a.sortOrder - b.sortOrder)
      .map((p) => ({
        kind: "product" as const,
        title: p.name,
        detail: `${p.size} · ${p.material} · from ${money(p.packPrice)} per ${p.packCount}${restockNote(p.restockWhen) ? ` · ${restockNote(p.restockWhen)}` : ""}`,
        href: `/products/${p.categorySlug}/${p.sku.toLowerCase()}`,
        sku: p.sku,
        photo: p.photo ?? null,
        keywords: `${catBySlug.get(p.categorySlug)?.name ?? ""} ${p.size.replace(/\s/g, "")} ${p.specs.capacity ?? ""} ${p.specs.lining ?? ""} ${p.categorySlug === "lids" ? "lid lids cap" : "cup cups coffee hot"}`,
      })),
    ...categories.map((c) => ({
      kind: "category" as const,
      title: c.name,
      detail: c.status === "live" ? c.description : `Coming soon. ${c.description}`,
      href: `/products/${c.slug}`,
      keywords: `${c.slug} ${c.shortName ?? ""}`,
    })),
    { kind: "page" as const, title: "Business pricing", detail: "Case prices, net-30 on approval, bulk quotes.", href: "/business", keywords: "wholesale case prices quote net 30 bulk cafe restaurant" },
    { kind: "page" as const, title: "Sample pack", detail: "Free for verified cafés. Try each size before you order a case.", href: "/business?kind=sample#quote", keywords: "samples trial try free" },
    { kind: "page" as const, title: "Custom printing", detail: "Your logo on the cup, from 100 cases.", href: "/custom-printing", keywords: "branded logo print printed" },
    { kind: "page" as const, title: "Certifications", detail: "Every certificate, per SKU.", href: "/certifications", keywords: "tuv austria certified certificate compostable proof" },
    { kind: "page" as const, title: "What's in your cup", detail: "Paper outside, PHA inside. How the linings compare.", href: "/whats-in-your-cup", keywords: "pha pla lining material water-based plastic polymer" },
    { kind: "page" as const, title: "PHA vs PLA", detail: "Which lining composts at home, and the microplastics studies.", href: "/learn/pha-vs-pla", keywords: "pla pha compare lining compostable microplastics learn" },
    { kind: "page" as const, title: "PHA vs water-based coatings", detail: "Why plastic-free is not what it sounds like.", href: "/learn/pha-vs-water-based-coatings", keywords: "water-based aqueous dispersion coating plastic-free acrylic learn" },
    { kind: "page" as const, title: "Home vs industrial compostable", detail: "The two logos are not the same claim.", href: "/learn/home-compostable-vs-industrial-compostable", keywords: "home compostable industrial compostable en 13432 ok compost learn" },
    { kind: "page" as const, title: "How to compost it", detail: "Into the home compost pile, with the food scraps.", href: "/compost", keywords: "composting compost guide disposal" },
    { kind: "page" as const, title: "Quick order by SKU", detail: "Type SKUs and quantities, add them all at once.", href: "/quick-order", keywords: "reorder bulk fast" },
    { kind: "page" as const, title: "Your account", detail: "Orders, reorders, your usual, addresses.", href: "/account", keywords: "sign in login orders reorder" },
  ];
  return (
    <>
    <header className="site-header sticky -top-10 z-30 bg-white">
      {/* Top band: the offer line, quick order, price list, account. Scrolls away; the main bar stays. */}
      <div className="band-forest h-10">
        <div className="mx-auto flex h-10 max-w-7xl items-center justify-between gap-4 overflow-hidden px-4 font-display text-xs font-semibold whitespace-nowrap">
          <div className="flex min-w-0 items-center gap-4">
            {site.phone && site.phoneHref ? (
              <span className="truncate">
                <span className="hidden sm:inline">Order by phone </span>
                <a href={site.phoneHref} className="tnum hover:underline">
                  {site.phone}
                </a>
              </span>
            ) : (
              <span className="truncate">
                {categories.some((c) => c.restockWhen) ? (
                  <>
                    {stockSentence(categories).replace(/\.$/, "")}
                    <span className="hidden sm:inline"> · </span>
                  </>
                ) : null}
                <span className={categories.some((c) => c.restockWhen) ? "hidden sm:inline" : ""}>Volume pricing from {count(BULK_MIN_UNITS)} units, applied in the cart</span>
              </span>
            )}
            <Link href="/quick-order" className="hidden hover:underline sm:inline">
              Quick order by SKU
            </Link>
            <a href="/price-list.pdf" className="hidden hover:underline sm:inline">
              Price list (PDF)
            </a>
          </div>
          <div className="flex shrink-0 items-center gap-4">
            <Link href="/account" className="hidden hover:underline sm:inline">
              Account
            </Link>
            <ModeToggle onInk />
          </div>
        </div>
      </div>

      {/* Main bar: logo, nav, search, cart. Sticks as you climb. */}
      <div className="header-surface">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-4 md:gap-8">
        <Link href="/" className="shrink-0" aria-label="Made to Disappear home">
          <Wordmark className="wm-dark h-6 md:h-7" />
          <Wordmark className="wm-light h-6 md:h-7" variant="white" priority={false} />
        </Link>
        <Nav categories={categories} />
        <div className="ml-auto flex items-center gap-3">
          <SearchForm entries={entries} className="hidden w-56 xl:block" />
          <Link href="/products/cups" className="btn btn-primary btn-sm hidden md:inline-flex">
            Shop cups
          </Link>
          <CartButton />
        </div>
      </div>
      <div className="px-4 pb-3 lg:hidden">
        <SearchForm entries={entries} />
      </div>
      </div>
      <div className="soil-line" aria-hidden="true" />
    </header>
    </>
  );
}
