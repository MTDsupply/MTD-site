"use client";
import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

export type GalleryPhoto = { src: string; alt: string };

/** Main frame plus a thumbnail row; clicking a thumbnail brings it into the main frame. */
export function ProductGallery({ photos, name }: { photos: GalleryPhoto[]; name: string }) {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const current = photos[active];

  if (photos.length === 0) {
    return <div className="aspect-square w-full border border-line bg-white" aria-label={name} />;
  }

  return (
    <div>
      <div className="relative aspect-[4/3] w-full overflow-hidden border border-line bg-white">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={current.src}
            className="absolute inset-0"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <Image src={current.src} alt={current.alt} fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-contain" />
          </motion.div>
        </AnimatePresence>
      </div>
      {photos.length > 1 ? (
        <div className="mt-3 grid grid-cols-4 gap-3" role="tablist" aria-label={`${name} photos`}>
          {photos.map((p, i) => (
            <button
              key={p.src}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={p.alt}
              onClick={() => setActive(i)}
              className={`relative aspect-square overflow-hidden border bg-white transition-colors ${
                i === active ? "border-sage ring-2 ring-sage" : "border-line hover:border-sage"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.src} alt="" className="h-full w-full object-contain" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
