"use client";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";

export type GalleryPhoto = { src: string; alt: string };

/**
 * One large square frame with the photos stacked and cross-faded, a round
 * arrow at each side and a row of dots along the bottom edge of the frame.
 * Arrow keys work when the frame has focus; a horizontal drag of 40 px or
 * more on a touch screen moves one photo. No thumbnails: the photos are the
 * same subject from different sides, so the dots are enough.
 */
export function ProductGallery({ photos, name }: { photos: GalleryPhoto[]; name: string }) {
  const [index, setActive] = useState(0);
  const start = useRef<number | null>(null);
  const n = photos.length;
  // Clamp at render time so a shorter photo list never points past its end.
  const active = index < n ? index : 0;

  const go = useCallback((d: number) => setActive((a) => (n ? (((a < n ? a : 0) + d + n) % n) : 0)), [n]);

  if (n === 0) {
    return <div className="aspect-square w-full bg-card" aria-label={name} />;
  }

  return (
    <div
      className="gallery relative aspect-square w-full overflow-hidden bg-card outline-none"
      tabIndex={0}
      role="group"
      aria-roledescription="carousel"
      aria-label={`${name} photos`}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(1);
        if (e.key === "ArrowLeft") go(-1);
      }}
      onPointerDown={(e) => {
        if (e.pointerType !== "mouse") start.current = e.clientX;
      }}
      onPointerUp={(e) => {
        if (start.current == null) return;
        const dx = e.clientX - start.current;
        start.current = null;
        if (Math.abs(dx) >= 40) go(dx < 0 ? 1 : -1);
      }}
      onPointerCancel={() => {
        start.current = null;
      }}
    >
      {photos.map((p, i) => (
        <div key={p.src} className={`gallery-slide absolute inset-0 ${i === active ? "is-active" : ""}`} aria-hidden={i !== active}>
          <Image src={p.src} alt={p.alt} fill priority={i === 0} sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" />
        </div>
      ))}
      {n > 1 ? (
        <>
          <button type="button" className="gallery-nav left-3 md:left-5" onClick={() => go(-1)} aria-label="Previous photo">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M19 12H5M11 6l-6 6 6 6" />
            </svg>
          </button>
          <button type="button" className="gallery-nav right-3 md:right-5" onClick={() => go(1)} aria-label="Next photo">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
          <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2" role="tablist" aria-label={`${name} photo picker`}>
            {photos.map((p, i) => (
              <button key={p.src} type="button" role="tab" aria-selected={i === active} aria-label={p.alt} onClick={() => setActive(i)} className={`gallery-dot ${i === active ? "is-active" : ""}`} />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
