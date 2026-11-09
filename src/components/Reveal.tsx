"use client";
import { useEffect, useRef, type ReactNode, type RefObject } from "react";

/*
 * Fades and rises content into view once, with no JavaScript in the critical
 * path: the server renders everything visible, and only elements that are below
 * the first screen when the page hydrates are hidden and then revealed by an
 * IntersectionObserver through two CSS classes (see .reveal-hidden in globals.css).
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
  y = 22,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
  as?: "div" | "section" | "li" | "article";
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Already on screen: leave it exactly as painted.
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return;
    el.style.setProperty("--reveal-y", `${y}px`);
    el.style.setProperty("--reveal-delay", `${delay}s`);
    el.classList.add("reveal-hidden");
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          el.classList.add("reveal-in");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay, y]);
  const Tag = as as "div";
  return (
    <Tag ref={ref as RefObject<HTMLDivElement>} className={className || undefined}>
      {children}
    </Tag>
  );
}

/** Reveals each child in sequence; each child becomes its own grid item. */
export function RevealGroup({
  children,
  className = "",
  itemClassName = "",
  step = 0.07,
  base = 0,
}: {
  children: ReactNode[];
  className?: string;
  itemClassName?: string;
  step?: number;
  base?: number;
}) {
  return (
    <div className={className}>
      {children.map((child, i) => (
        <Reveal key={i} delay={base + i * step} className={itemClassName}>
          {child}
        </Reveal>
      ))}
    </div>
  );
}
