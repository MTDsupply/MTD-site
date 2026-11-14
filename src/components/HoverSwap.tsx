import Image from "next/image";

/**
 * Two photos in one well: the front shot, and the alternate that fades in on
 * hover or focus. Pure CSS (group-hover), so it costs nothing on the critical
 * path and does nothing on touch screens except show the front. `aspect` is
 * the Tailwind aspect class for the well (4:5 by default, 2:3 on the catalogue
 * cards, where the photo is the whole card).
 */
export function HoverSwap({
  front,
  hover,
  alt,
  sizes,
  priority = false,
  className = "",
  aspect = "aspect-[4/5]",
}: {
  front: string;
  hover?: string | null;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  aspect?: string;
}) {
  return (
    <div className={`hover-swap relative ${aspect} overflow-hidden bg-card ${className}`}>
      <Image src={front} alt={alt} fill sizes={sizes} priority={priority} className="hover-swap-front object-cover" />
      {hover && hover !== front ? <Image src={hover} alt="" fill sizes={sizes} className="hover-swap-back object-cover" aria-hidden="true" /> : null}
    </div>
  );
}
