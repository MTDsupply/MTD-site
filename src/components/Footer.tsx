import Link from "next/link";
import { cacheLife } from "next/cache";
import { getCategories } from "@/lib/catalog/queries";
import { site } from "@/lib/site";
import { claims } from "@/lib/copy";
import { NotifyForm } from "./NotifyForm";
import { Wordmark } from "./Wordmark";
import { ARTICLES } from "@/lib/learn";

async function copyrightYear(): Promise<number> {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

export async function Footer() {
  const [categories, year] = await Promise.all([getCategories(), copyrightYear()]);
  return (
    <footer className="relative mt-16" data-tone="dark">
      <div className="band-forest">
      <div className="relative">
      <div className="mx-auto max-w-7xl px-4 pt-20 md:pt-28">
        <Wordmark className="h-8" variant="white" priority={false} />
        <p className="mt-4 max-w-md text-cream/80">Foodservice essentials. Made to disappear.</p>
      </div>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 pb-8 pt-10 md:grid-cols-3 lg:grid-cols-5">
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
              <Link href="/custom-printing" className="hover:underline">
                Custom printing
              </Link>
            </li>
            <li>
              <Link href="/certifications" className="hover:underline">
                Certifications
              </Link>
            </li>
            <li>
              <Link href="/whats-in-your-cup" className="hover:underline">
                What&rsquo;s in your cup
              </Link>
            </li>
            <li>
              <Link href="/compost" className="hover:underline">
                How to compost it
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
          <h2 className="t-label">Learn</h2>
          <ul className="mt-3 space-y-1.5 text-sm">
            {ARTICLES.map((a) => (
              <li key={a.slug}>
                <Link href={`/learn/${a.slug}`} className="hover:underline">
                  {a.slug === "home-compostable-vs-industrial-compostable" ? "Home vs industrial compostable" : a.slug === "pha-vs-water-based-coatings" ? "PHA vs water-based coatings" : a.slug === "pha-vs-pla" ? "PHA vs PLA" : a.slug === "what-is-pha" ? "What is PHA?" : a.slug === "what-is-pla" ? "What is PLA?" : "Water-based coatings"}
                </Link>
              </li>
            ))}
            <li className="pt-1">
              <Link href="/learn" className="hover:underline">
                All explainers
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
            {site.social.map((s) => (
              <p key={s.url}>
                <a href={s.url} className="hover:underline" rel="me noopener" target="_blank">
                  {s.name} {s.handle}
                </a>
              </p>
            ))}
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
      </div>
    </footer>
  );
}
