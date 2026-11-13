import Image from "next/image";

/**
 * Two photos in one 4:5 well: the front pair, and the standing three-quarter
 * shot that fades in on hover or focus. Pure CSS (group-hover), so it costs
 * nothing on the critical path and does nothing on touch screens except show
 * the front.
 */
export function HoverSwap({
  front,
  hover,
  alt,
  sizes,
  priority = false,
  className = "",
}: {
  front: string;
  hover?: string | null;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div className={`hover-swap relative aspect-[4/5] overflow-hidden bg-card ${className}`}>
      <Image src={front} alt={alt} fill sizes={sizes} priority={priority} className="hover-swap-front object-cover" />
      {hover && hover !== front ? <Image src={hover} alt="" fill sizes={sizes} className="hover-swap-back object-cover" aria-hidden="true" /> : null}
    </div>
  );
}
