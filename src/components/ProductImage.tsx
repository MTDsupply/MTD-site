"use client";
import Image from "next/image";

/** Product photo on white, scaled to fit the square so the whole product shows. */
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
}) {
  return (
    <div className={`group/img relative aspect-[4/3] w-full overflow-hidden bg-white ${className}`}>
      {src ? (
        <Image
          src={src}
          alt={name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-contain transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/img:scale-[1.03]"
          priority={priority}
        />
      ) : (
        <span className="sr-only">{name}</span>
      )}
    </div>
  );
}
