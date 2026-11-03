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
    <div className={`band-sage relative left-1/2 w-screen -translate-x-1/2 ${className}`}>
      <div className="mx-auto max-w-7xl px-4 py-10 md:py-14">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
            <div className="max-w-[62ch]">
              {eyebrow ? <p className="t-label text-paper/75">{eyebrow}</p> : null}
              <h1 className="t-section mt-2 text-white">{title}</h1>
              {description ? <p className="mt-4 text-[16px] leading-7 text-paper/85 md:text-[17px]">{description}</p> : null}
            </div>
            {actions ? <div className="shrink-0">{actions}</div> : null}
          </div>
        </Reveal>
      </div>
    </div>
  );
}
