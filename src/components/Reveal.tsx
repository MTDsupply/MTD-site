"use client";
import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Fades and rises content into view once, as the hiker reaches it. */
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
  const reduced = useReducedMotion();
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={reduced ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.8, ease: EASE, delay }}
    >
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
