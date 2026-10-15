"use client";
import { useEffect, useRef } from "react";

export type DissolveProps = {
  /** Start the animation. */
  active: boolean;
  /** "out": dots scatter right and fade. "in": dots arrive from the right and settle. */
  direction: "in" | "out";
  /** "trail": a tail of shrinking dots (wordmark). "scatter": dots across the whole box. */
  layout?: "trail" | "scatter";
  /** Keep dots drawn at rest when idle (wordmark). */
  restVisible?: boolean;
  duration?: number;
  count?: number;
  color?: string;
  className?: string;
  onDone?: () => void;
};

type Dot = { x: number; y: number; r: number; dx: number; dy: number; delay: number };

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function easeOut(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * The one particle system on the site. Draws Soil/Sage dots on a canvas that
 * sits over its (position: relative) parent and animates them dissolving out
 * to the right or settling in from the right.
 */
export function Dissolve({
  active,
  direction,
  layout = "scatter",
  restVisible = false,
  duration = 400,
  count = layout === "trail" ? 18 : 40,
  color = "#2B2B2B",
  className,
  onDone,
}: DissolveProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<Dot[]>([]);
  const sizeRef = useRef({ w: 0, h: 0 });
  const doneRef = useRef(onDone);
  useEffect(() => {
    doneRef.current = onDone;
  });

  // Size the canvas to its parent and lay out the dots.
  useEffect(() => {
    const canvas = ref.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;

    const layoutDots = () => {
      const { width: w, height: h } = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      sizeRef.current = { w, h };
      const rnd = mulberry32(count * 7919 + Math.round(w));
      const dots: Dot[] = [];
      for (let i = 0; i < count; i++) {
        const f = i / Math.max(1, count - 1);
        if (layout === "trail") {
          const x = f * w * 0.95;
          const y = h * 0.5 + (rnd() - 0.5) * h * 0.8;
          const r = Math.max(0.6, (1 - f) * h * 0.16 + 0.6);
          dots.push({ x, y, r, dx: w * (0.3 + rnd() * 0.5), dy: (rnd() - 0.5) * h * 0.5, delay: f * 0.5 });
        } else {
          const x = rnd() * w;
          const y = rnd() * h;
          const r = 1 + rnd() * 2.5;
          dots.push({ x, y, r, dx: w * (0.15 + rnd() * 0.35), dy: (rnd() - 0.5) * h * 0.2, delay: rnd() * 0.4 });
        }
      }
      dotsRef.current = dots;
    };

    layoutDots();
    const ro = new ResizeObserver(layoutDots);
    ro.observe(parent);
    return () => ro.disconnect();
  }, [count, layout]);

  // Draw the current state, animating when active.
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    let raf = 0;
    let start = 0;

    const draw = (t: number) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, sizeRef.current.w, sizeRef.current.h);
      ctx.fillStyle = color;
      for (const d of dotsRef.current) {
        // Per-dot progress with a staggered delay; "in" runs backwards.
        const local = Math.min(1, Math.max(0, (t - d.delay) / (1 - d.delay)));
        const p = direction === "out" ? easeOut(local) : 1 - easeOut(local);
        const alpha = 1 - p;
        if (alpha <= 0.01) continue;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(d.x + d.dx * p, d.y + d.dy * p, d.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const clear = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, sizeRef.current.w, sizeRef.current.h);
    };

    const restT = direction === "in" ? 1 : 0;
    if (!active) {
      if (restVisible) draw(restT);
      else clear();
      return;
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      if (restVisible && direction === "in") draw(restT);
      else clear();
      doneRef.current?.();
      return;
    }

    const tick = (now: number) => {
      if (!start) start = now;
      const t = Math.min(1, (now - start) / duration);
      draw(t);
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        if (direction === "in" && restVisible) draw(restT);
        else if (direction === "in") clear();
        doneRef.current?.();
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, direction, duration, color, restVisible]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={`dissolve-canvas pointer-events-none absolute inset-0 ${className ?? ""}`}
    />
  );
}
