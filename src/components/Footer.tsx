import Link from "next/link";
import { cacheLife } from "next/cache";
import { getCategories } from "@/lib/catalog/queries";
import { site } from "@/lib/site";
import { claims } from "@/lib/copy";
import { NotifyForm } from "./NotifyForm";
import { Wordmark } from "./Wordmark";
import { Atmosphere } from "./scene/Atmosphere";

async function copyrightYear(): Promise<number> {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

export async function Footer() {
  const [categories, year] = await Promise.all([getCategories(), copyrightYear()]);
  return (
    <footer className="relative mt-16" data-tone="dark">
      <Atmosphere src="/atmosphere/dusk.jpg" alt="" fade="none" tone="soil" parallax={70} drift={1.05} className="text-paper" objectPosition="center 40%">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(43,43,43,0.35)_0%,rgba(43,43,43,0.75)_40%,rgba(43,43,43,0.92)_100%)]" />
      <div className="relative">
      <div className="mx-auto max-w-7xl px-4 pt-20 md:pt-28">
        <Wordmark className="h-8" variant="white" priority={false} />
        <p className="mt-4 max-w-md text-paper/80">Foodservice essentials. Made to disappear.</p>
      </div>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 pb-8 pt-10 md:grid-cols-4">
        <div>
          <h2 className="t-label">Products</h2>
          <ul className="mt-3 space-y-1.5 text-sm">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/products/${c.slug}`}
                  className={c.status === "live" ? "hover:underline" : "text-paper/45 hover:underline"}
                >
                  {c.name}
                  {c.status !== "live" ? <span className="ml-1.5 text-[11px] uppercase tracking-wide">Soon</span> : null}
                </Link>
              </li>
            ))}
            <li className="pt-1">
              <Link href="/quick-order" className="hover:underline">
                Quick order
              </Link>
            </li>
            <li>
              <a href="/price-list.pdf" className="hover:underline">
                Price list (PDF)
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="t-label">Company</h2>
          <ul className="mt-3 space-y-1.5 text-sm">
            <li>
              <Link href="/business" className="hover:underline">
                Business accounts
              </Link>
            </li>
            <li>
              <Link href="/certifications" className="hover:underline">
                Certifications
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:underline">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:underline">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/account" className="hover:underline">
                Account
              </Link>
            </li>
            <li className="pt-2">
              <Link href="/shipping-returns" className="hover:underline">
                Shipping and returns
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:underline">
                Privacy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:underline">
                Terms of sale
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="t-label">Contact</h2>
          <address className="mt-3 space-y-1.5 text-sm not-italic">
            <p>{site.legalName}</p>
            <p>
              {site.city}, {site.province}
            </p>
            {site.phone && site.phoneHref ? (
              <p>
                <a href={site.phoneHref} className="tnum hover:underline">
                  {site.phone}
                </a>
              </p>
            ) : null}
            <p>
              <a href={`mailto:${site.email}`} className="hover:underline">
                {site.email}
              </a>
            </p>
          </address>
        </div>

        <div>
          <h2 className="t-label">New product alerts</h2>
          <p className="mt-1 text-xs text-paper/70">One email when a new category goes live. Nothing else.</p>
          <div className="mt-3">
            <NotifyForm categorySlug="all" compact buttonLabel="Sign up" onInk />
          </div>
        </div>
      </div>

      <div className="border-t border-paper/15">
        <div className="mx-auto max-w-7xl space-y-2 px-4 py-5 text-xs text-paper/60">
          <p>{claims.footerLine}</p>
          <p>
            © {year} {site.legalName}. {site.city}, {site.province}, {site.country}.
          </p>
        </div>
      </div>
      </div>
      </Atmosphere>
    </footer>
  );
}
