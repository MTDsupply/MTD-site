import type { ReactNode } from "react";
import { Reveal } from "./Reveal";
import { Atmosphere } from "./scene/Atmosphere";

/**
 * Page opening. With `image`, the header sits as a frosted panel over a
 * full-bleed landscape; without, it is a plain rule-under title.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  image,
  imageAlt = "",
  objectPosition = "center",
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
  const inner = (
    <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
      <div className="max-w-[62ch]">
        {eyebrow ? <p className="t-label text-sage-deep">{eyebrow}</p> : null}
        <h1 className="t-page mt-2">{title}</h1>
        {description ? <p className="mt-3 text-[15px] leading-6 text-soil/75">{description}</p> : null}
      </div>
      {actions ? <div className="shrink-0">{actions}</div> : null}
    </div>
  );

  if (!image) {
    return (
      <Reveal className={className}>
        <div className="border-b border-sage pb-6">{inner}</div>
      </Reveal>
    );
  }

  return (
    <div className={`relative left-1/2 w-screen -translate-x-1/2 ${className}`}>
      <Atmosphere src={image} alt={imageAlt} fade="none" blend="bottom" parallax={50} drift={1.06} priority objectPosition={objectPosition} className="min-h-[300px] md:min-h-[360px]">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(244,241,234,0.45)_0%,rgba(244,241,234,0.1)_45%,rgba(244,241,234,0)_100%)]" />
        <div className="relative mx-auto flex min-h-[300px] max-w-7xl items-end px-4 pb-6 pt-24 md:min-h-[360px] md:pb-8">
          <Reveal className="w-full">
            <div className="glass w-full p-6 md:p-8">{inner}</div>
          </Reveal>
        </div>
      </Atmosphere>
    </div>
  );
}
