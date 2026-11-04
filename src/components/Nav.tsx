"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { Category } from "@/lib/catalog/types";
import { restockNote } from "@/lib/site";

const EASE = [0.16, 1, 0.3, 1] as const;

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link href={href} aria-current={active ? "page" : undefined} className="group relative block px-3 py-2 font-display font-semibold text-forest">
      {children}
      <span
        aria-hidden="true"
        className={`absolute inset-x-3 -bottom-0.5 h-0.5 origin-left bg-sage transition-transform duration-300 ${
          active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
        }`}
        style={{ transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }}
      />
    </Link>
  );
}

/**
 * Primary nav with the Products mega-menu (every category listed, coming-soon
 * ones in fog with a tag), active-route underline and a mobile drawer.
 */
export function Nav({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState(false);
  const megaRef = useRef<HTMLLIElement>(null);
  const pathname = usePathname();
  const reduced = useReducedMotion();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMega(false);
        setOpen(false);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (megaRef.current && !megaRef.current.contains(e.target as Node)) setMega(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, []);

  // Close menus on navigation (state keyed to the route, no effect needed).
  const [seenPath, setSeenPath] = useState(pathname);
  if (seenPath !== pathname) {
    setSeenPath(pathname);
    setMega(false);
    setOpen(false);
  }

  const isActive = (href: string) => (href === "/products" ? pathname.startsWith("/products") : pathname.startsWith(href));

  const items = (
    <>
      <li>
        <NavLink href="/business" active={isActive("/business")}>
          Business
        </NavLink>
      </li>
      <li>
        <NavLink href="/certifications" active={isActive("/certifications")}>
          Certifications
        </NavLink>
      </li>
      <li>
        <NavLink href="/about" active={isActive("/about")}>
          About
        </NavLink>
      </li>
      <li>
        <NavLink href="/contact" active={isActive("/contact")}>
          Help
        </NavLink>
      </li>
    </>
  );

  return (
    <>
      {/* Desktop */}
      <nav aria-label="Primary" className="hidden md:block">
        <ul className="flex items-center text-[16px]">
          <li ref={megaRef} className="relative" onMouseEnter={() => setMega(true)} onMouseLeave={() => setMega(false)}>
            <button
              type="button"
              className="group relative flex items-center gap-1 px-3 py-2 font-display font-semibold text-forest"
              aria-expanded={mega}
              aria-controls="mega-products"
              onClick={() => setMega((v) => !v)}
            >
              Products
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
                className={`transition-transform duration-300 ${mega ? "rotate-180" : ""}`}
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
              <span
                aria-hidden="true"
                className={`absolute inset-x-3 -bottom-0.5 h-0.5 origin-left bg-sage transition-transform duration-300 ${
                  isActive("/products") || mega ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                }`}
              />
            </button>
            <AnimatePresence>
              {mega ? (
                <motion.div
                  id="mega-products"
                  initial={reduced ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6, transition: { duration: 0.15 } }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="absolute left-0 top-full z-40 w-[600px] rounded-[20px] bg-white p-5 text-soil shadow-[0_28px_48px_-24px_rgba(46,77,52,0.45)]"
                >
                  <div className="grid grid-cols-2 gap-x-6 gap-y-0.5">
                    {categories.map((c) => {
                      const live = c.status === "live";
                      return (
                        <Link
                          key={c.slug}
                          href={`/products/${c.slug}`}
                          className={`flex items-center justify-between gap-3 px-2 py-1.5 text-sm transition-colors hover:bg-sage-tint ${
                            live ? "text-soil" : "text-soil/45"
                          }`}
                        >
                          <span className="flex items-center gap-2.5">
                            {c.name}
                          </span>
                          {live ? (
                            <span className="t-label text-clay-deep">{restockNote(c.restockWhen) ?? "In stock"}</span>
                          ) : (
                            <span className="chip chip-fog text-[11px]">Coming soon</span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-line pt-3 text-sm">
                    <Link href="/products" className="link font-medium">
                      View the full catalogue
                    </Link>
                    <Link href="/quick-order" className="link">
                      Quick order by SKU
                    </Link>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </li>
          {items}
        </ul>
      </nav>

      {/* Mobile */}
      <button
        type="button"
        className="btn btn-ghost btn-sm md:hidden"
        aria-expanded={open}
        aria-controls="mobile-nav"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? "Close" : "Menu"}
      </button>
      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-nav"
            initial={reduced ? false : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6, transition: { duration: 0.15 } }}
            transition={{ duration: 0.25, ease: EASE }}
            className="absolute inset-x-0 top-full z-40 rounded-b-[20px] bg-white px-4 py-3 text-soil shadow-[0_28px_48px_-24px_rgba(46,77,52,0.45)] md:hidden"
          >
            <nav aria-label="Mobile">
              <p className="t-label px-3 pb-1 pt-2 text-forest">Products</p>
              <ul className="grid grid-cols-2 gap-x-2">
                {categories.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={`/products/${c.slug}`}
                      className={`flex items-center justify-between px-3 py-2 text-sm ${
                        c.status === "live" ? "text-soil" : "text-soil/45"
                      }`}
                    >
                      {c.name}
                      {c.status !== "live" ? <span className="t-label text-[10px]">Soon</span> : null}
                    </Link>
                  </li>
                ))}
              </ul>
              <ul className="mt-2 border-t border-line pt-2 text-[15px] font-medium">
                <li>
                  <Link href="/products" className="block px-3 py-2">
                    Full catalogue
                  </Link>
                </li>
                <li>
                  <Link href="/quick-order" className="block px-3 py-2">
                    Quick order
                  </Link>
                </li>
                <li>
                  <Link href="/business" className="block px-3 py-2">
                    Business
                  </Link>
                </li>
                <li>
                  <Link href="/certifications" className="block px-3 py-2">
                    Certifications
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="block px-3 py-2">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/account" className="block px-3 py-2">
                    Account
                  </Link>
                </li>
              </ul>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
