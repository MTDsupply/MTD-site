"use client";
import Image from "next/image";
import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

/**
 * A landscape that breathes: the image drifts and scales very slowly, moves a
 * little against the scroll, and fades into Paper at the edges you choose so
 * type sits on it comfortably. Still for reduced-motion users.
 */
export function Atmosphere({
  src,
  alt = "",
  priority = false,
  fade = "left",
  tone = "paper",
  className = "",
  parallax = 40,
  drift = 1.08,
  children,
  sizes = "100vw",
  objectPosition = "center",
  blend = "none",
  dark = false,
}: {
  src: string;
  alt?: string;
  priority?: boolean;
  /** Which edges dissolve into the surface colour. */
  fade?: "left" | "right" | "top" | "bottom" | "x" | "y" | "none" | "all";
  /** Soft-edge the image itself (transparent mask) so it melts into whatever is behind. */
  blend?: "top" | "bottom" | "y" | "none";
  /** Marks the section as dark so the sticky header switches to light text over it. */
  dark?: boolean;
  /** Surface colour the image fades into. */
  tone?: "paper" | "soil" | "sage";
  className?: string;
  /** Pixels of counter-scroll movement across the element's time on screen. */
  parallax?: number;
  /** Peak scale of the slow drift. */
  drift?: number;
  children?: ReactNode;
  sizes?: string;
  objectPosition?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [reduced ? 0 : -parallax, reduced ? 0 : parallax]);

  const colour = tone === "soil" ? "#2B2B2B" : tone === "sage" ? "#4F6F52" : "#F4F1EA";
  const stops = `${colour} 0%, ${colour}00 45%`;
  const masks: Record<string, string> = {
    left: `linear-gradient(to right, ${stops})`,
    right: `linear-gradient(to left, ${stops})`,
    top: `linear-gradient(to bottom, ${stops})`,
    bottom: `linear-gradient(to top, ${stops})`,
    x: `linear-gradient(to right, ${colour} 0%, ${colour}00 30%, ${colour}00 70%, ${colour} 100%)`,
    y: `linear-gradient(to bottom, ${colour} 0%, ${colour}00 30%, ${colour}00 70%, ${colour} 100%)`,
    all: `linear-gradient(to right, ${colour} 0%, ${colour}00 25%, ${colour}00 75%, ${colour} 100%), linear-gradient(to bottom, ${colour} 0%, ${colour}00 25%, ${colour}00 75%, ${colour} 100%)`,
    none: "none",
  };

  const blendMask =
    blend === "top"
      ? "linear-gradient(to bottom, transparent 0%, black 38%)"
      : blend === "bottom"
        ? "linear-gradient(to bottom, black 70%, transparent 100%)"
        : blend === "y"
          ? "linear-gradient(to bottom, transparent 0%, black 28%, black 72%, transparent 100%)"
          : undefined;

  return (
    <div
      ref={ref}
      data-tone={dark ? "dark" : undefined}
      className={`relative overflow-hidden ${className}`}
      style={{
        background: blend === "none" ? colour : "transparent",
        WebkitMaskImage: blendMask,
        maskImage: blendMask,
      }}
    >
      <motion.div className="absolute inset-[-6%]" style={{ y }}>
        <motion.div
          className="h-full w-full"
          animate={reduced ? undefined : { scale: [1, drift, 1] }}
          transition={{ duration: 36, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image src={src} alt={alt} fill priority={priority} sizes={sizes} className="object-cover" style={{ objectPosition }} />
        </motion.div>
      </motion.div>
      {fade !== "none" ? (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: masks[fade] }} />
      ) : null}
      {children ? <div className="relative">{children}</div> : null}
    </div>
  );
}
