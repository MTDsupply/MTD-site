"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/account", label: "Overview" },
  { href: "/account/orders", label: "Orders" },
  { href: "/account/usual", label: "Your usual" },
  { href: "/account/addresses", label: "Addresses" },
  { href: "/account/details", label: "Business details" },
];

/** Account section nav: wrapping tabs on small screens, a rail on large ones. */
export function AccountNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Account" className="min-w-0">
      <ul className="flex flex-wrap gap-1 border-b border-line pb-2 lg:flex-col lg:border-b-0 lg:pb-0">
        {ITEMS.map((item) => {
          const active = item.href === "/account" ? pathname === "/account" : pathname.startsWith(item.href);
          return (
            <li key={item.href} className="shrink-0">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`block whitespace-nowrap rounded-full px-4 py-2 font-display text-sm font-semibold transition-colors ${
                  active ? "bg-forest text-cream" : "text-forest/80 hover:bg-mint-light"
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
