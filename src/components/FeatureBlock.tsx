import Link from "next/link";
import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

/**
 * Product photo beside copy, alternating sides down the page. The photo sits
 * on a white plate with a sage backing plate offset behind it; the copy side
 * carries a facts row and a second link so it never reads as three thin lines.
 */
export function FeatureBlock({
  image,
  imageAlt,
  eyebrow,
  title,
  children,
  cta,
  href,
  facts = [],
  secondary,
  reverse = false,
}: {
  image: string;
  imageAlt: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
  cta: string;
  href: string;
  facts?: [string, string][];
  secondary?: { label: string; href: string };
  reverse?: boolean;
  objectPosition?: string;
}) {
  return (
    <Reveal>
      <div
        className={`grid items-center gap-10 md:gap-16 ${
          reverse ? "md:grid-cols-[1fr_1.1fr] md:[&>*:first-child]:order-2" : "md:grid-cols-[1.1fr_1fr]"
        }`}
      >
        <div className="relative">
          <div
            aria-hidden="true"
            className={`absolute -bottom-4 top-4 w-full bg-sage/15 ${reverse ? "-left-4" : "-right-4"}`}
          />
          <div className="relative aspect-[5/4] overflow-hidden bg-white shadow-[0_32px_64px_-44px_rgba(43,43,43,0.5)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} alt={imageAlt} className="h-full w-full object-contain p-6 md:p-10" loading="lazy" />
          </div>
        </div>
        <div className="max-w-[50ch]">
          <p className="t-label text-sage-deep">{eyebrow}</p>
          <h2 className="t-page mt-3">{title}</h2>
          <div className="mt-4 space-y-3 text-[15px] leading-6 text-soil/80">{children}</div>
          {facts.length ? (
            <dl className="mt-6 grid grid-cols-3 divide-x divide-line border-y border-line py-4">
              {facts.map(([k, v]) => (
                <div key={k} className="px-4 first:pl-0 last:pr-0">
                  <dt className="t-label text-soil/55">{k}</dt>
                  <dd className="tnum mt-1 text-[15px] font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          ) : null}
          <div className="mt-6 flex flex-wrap items-center gap-5">
            <Link href={href} className="btn btn-primary">
              {cta}
            </Link>
            {secondary ? (
              <Link href={secondary.href} className="link text-sm font-medium">
                {secondary.label}
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </Reveal>
  );
}
