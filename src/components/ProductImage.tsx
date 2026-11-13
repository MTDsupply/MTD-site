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
    <div className={`group/img relative aspect-[4/5] w-full overflow-hidden bg-card ${className}`}>
      {src ? (
        <Image
          src={src}
          alt={name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
          priority={priority}
        />
      ) : (
        <span className="sr-only">{name}</span>
      )}
    </div>
  );
}
