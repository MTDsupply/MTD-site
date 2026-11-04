"use client";
import Image from "next/image";

/**
 * Product photo scaled to fit the frame. The photos are shot on white, so on a
 * cream tile the image is multiplied (`on-cream`) and the white drops away.
 */
export function ProductImage({
  src,
  name,
  priority = false,
  className = "",
  tone = "white",
}: {
  src: string | null;
  drawing?: string;
  name: string;
  sku?: string;
  priority?: boolean;
  className?: string;
  tone?: "white" | "cream";
}) {
  return (
    <div className={`group/img relative aspect-[4/3] w-full overflow-hidden rounded-[14px] ${tone === "cream" ? "on-cream bg-cream" : "bg-white"} ${className}`}>
      {src ? (
        <Image
          src={src}
          alt={name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-contain transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/img:scale-[1.04]"
          priority={priority}
        />
      ) : (
        <span className="sr-only">{name}</span>
      )}
    </div>
  );
}
