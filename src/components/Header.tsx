import Link from "next/link";
import { getCategories } from "@/lib/catalog/queries";
import { site } from "@/lib/site";
import { Wordmark } from "./Wordmark";
import { Nav } from "./Nav";
import { ModeToggle } from "./ModeToggle";
import { CartButton } from "./CartButton";
import { SearchForm } from "./SearchForm";

export async function Header() {
  const categories = await getCategories();
  return (
    <>
    <header className="site-header sticky -top-10 z-30 bg-paper">
      {/* Top band: phone, quick order, price list, sign in. Scrolls away; the main bar stays. */}
      <div className="band-sage h-10">
        <div className="mx-auto flex h-10 max-w-7xl items-center justify-between gap-4 overflow-hidden px-4 text-xs whitespace-nowrap">
          <div className="flex min-w-0 items-center gap-4">
            {site.phone && site.phoneHref ? (
              <span className="truncate">
                <span className="hidden sm:inline">Order by phone </span>
                <a href={site.phoneHref} className="font-medium tnum hover:underline">
                  {site.phone}
                </a>
              </span>
            ) : (
              <span className="truncate">Foodservice supplies made from 100% certified home-compostable material</span>
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
          <SearchForm className="hidden w-64 lg:flex" />
          <CartButton />
        </div>
      </div>
      <div className="px-4 pb-3 lg:hidden">
        <SearchForm />
      </div>
      </div>
      <div className="soil-line" aria-hidden="true" />
    </header>
    </>
  );
}
