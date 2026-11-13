import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

/**
 * Page opening: a flat Sage band edge to edge, matching the home hero. The
 * eyebrow, title and description sit in white on the band; `actions` sit at
 * the right on wide screens. The `image` props are accepted and ignored so
 * older call sites keep compiling; the band carries no photograph.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className = "",
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  image?: string;
  imageAlt?: string;
  objectPosition?: string;
  className?: string;
}) {
  return (
    <div className={`border-b border-line ${className}`}>
      <div className="py-12 md:py-16">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
            <div className="max-w-[62ch]">
              {eyebrow ? <p className="t-label">{eyebrow}</p> : null}
              <h1 className="t-section mt-3 text-ink">{title}</h1>
              {description ? <p className="t-lead mt-4 text-stone">{description}</p> : null}
            </div>
            {actions ? <div className="shrink-0">{actions}</div> : null}
          </div>
        </Reveal>
      </div>
    </div>
  );
}
