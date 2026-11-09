"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/*
 * The brand film, shown whole and uncropped on wide screens (16:9), and as a
 * 4:3 centre cut on phones. The poster paints first through next/image; the
 * video element is only created once the section is within a screen of the
 * viewport, and it loads exactly one source for the current screen width, so
 * the two MP4 files never download on first paint.
 */
export function HeroVideo({ poster, video, mobilePoster, mobileVideo }: { poster: string; video: string | null; mobilePoster?: string; mobileVideo?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = box.current;
    if (!el || !video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const pick = () => (window.matchMedia("(max-width: 767px)").matches && mobileVideo ? mobileVideo : video);
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSrc(pick());
          io.disconnect();
        }
      },
      { rootMargin: "100% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [video, mobileVideo]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !src) return;
    const onPlay = () => setReady(true);
    el.addEventListener("playing", onPlay);
    el.play().catch(() => undefined);
    return () => el.removeEventListener("playing", onPlay);
  }, [src]);

  return (
    <div ref={box} className="relative aspect-[4/3] w-full overflow-hidden bg-soil md:aspect-video">
      <Image src={poster} alt="" fill sizes="(min-width: 1024px) 1024px, 100vw" className={`object-cover ${mobilePoster ? "hidden md:block" : ""}`} />
      {mobilePoster ? <Image src={mobilePoster} alt="" fill sizes="100vw" className="object-cover md:hidden" /> : null}
      {src ? (
        <video
          ref={ref}
          muted
          loop
          playsInline
          autoPlay
          preload="auto"
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
