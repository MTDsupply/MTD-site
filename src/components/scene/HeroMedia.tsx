"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

/**
 * Hero backdrop: a generated landscape that drifts slowly. When a looping clip
 * exists it plays over the still (muted, inline), otherwise the still breathes
 * on its own. Fades into Paper on the left so the headline reads cleanly.
 */
export function HeroMedia({ poster, video }: { poster: string; video?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [ready, setReady] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 90]);
  const dim = useTransform(scrollYProgress, [0, 1], [1, 0.55]);

  useEffect(() => {
    if (!video || reduced) return;
    const el = ref.current?.querySelector("video");
    if (!el) return;
    const onPlay = () => setReady(true);
    el.addEventListener("playing", onPlay);
    el.play().catch(() => undefined);
    return () => el.removeEventListener("playing", onPlay);
  }, [video, reduced]);

  return (
    <div
      ref={ref}
      className="absolute inset-0 overflow-hidden"
      aria-hidden="true"
      style={{
        WebkitMaskImage: "linear-gradient(to bottom, black 62%, transparent 100%)",
        maskImage: "linear-gradient(to bottom, black 62%, transparent 100%)",
      }}
    >
      <motion.div className="absolute inset-[-5%]" style={{ y, opacity: dim }}>
        <motion.div
          className="h-full w-full"
          animate={reduced ? undefined : { scale: [1, 1.06, 1] }}
          transition={{ duration: 40, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image src={poster} alt="" fill priority sizes="100vw" className="object-cover object-[70%_40%]" />
          {video && !reduced ? (
            <video
              muted
              loop
              playsInline
              autoPlay
              preload="auto"
              poster={poster}
              className="absolute inset-0 h-full w-full object-cover object-[70%_40%] transition-opacity duration-[1200ms]"
              style={{ opacity: ready ? 1 : 0 }}
            >
              <source src={video} type="video/mp4" />
            </video>
          ) : null}
        </motion.div>
      </motion.div>
      {/* Paper on the left for the headline, paper along the bottom to meet the page. */}
      <div
        className="pointer-events-none absolute inset-0 hidden md:block"
        style={{
          background:
            "linear-gradient(to right, rgba(244,241,234,0.96) 0%, rgba(244,241,234,0.92) 28%, rgba(244,241,234,0.6) 46%, rgba(244,241,234,0) 70%)",
        }}
      />
      {/* On phones the copy sits above the image, so fade from the top instead. */}
      <div
        className="pointer-events-none absolute inset-0 md:hidden"
        style={{
          background:
            "linear-gradient(to bottom, rgba(244,241,234,0.96) 0%, rgba(244,241,234,0.9) 38%, rgba(244,241,234,0.55) 58%, rgba(244,241,234,0) 80%)",
        }}
      />
    </div>
  );
}
