"use client";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

/**
 * The brand film, shown whole and uncropped on wide screens (16:9), and as a
 * 4:3 centre cut on phones so it fills more of the first screen. No overlay,
 * because the film carries its own captions and closing wordmark.
 */
export function HeroVideo({ poster, video, mobilePoster, mobileVideo }: { poster: string; video: string | null; mobilePoster?: string; mobileVideo?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();
  const [ready, setReady] = useState(false);
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => setNarrow(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const src = narrow && mobileVideo ? mobileVideo : video;
  const still = narrow && mobilePoster ? mobilePoster : poster;

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced || !src) return;
    setReady(false);
    const onPlay = () => setReady(true);
    el.addEventListener("playing", onPlay);
    el.load();
    el.play().catch(() => undefined);
    return () => el.removeEventListener("playing", onPlay);
  }, [reduced, src]);

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden bg-soil md:aspect-video">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={still} alt="" className="absolute inset-0 h-full w-full object-cover" />
      {src && !reduced ? (
        <video
          key={src}
          ref={ref}
          muted
          loop
          playsInline
          autoPlay
          preload="auto"
          poster={still}
          aria-label="Made to Disappear brand film: single-use cups pile up, then a certified home-compostable cup goes back to the earth."
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
          style={{ opacity: ready ? 1 : 0 }}
        >
          <source src={src} type="video/mp4" />
        </video>
      ) : null}
    </div>
  );
}
