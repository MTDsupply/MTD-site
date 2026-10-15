"use client";
import { useEffect } from "react";

const DARK = '[data-tone="dark"], .band-ink, .band-sage';

/**
 * Sets data-scrolled on <html> once the page moves, and data-header-tone
 * ("dark" | "light") from whatever is directly behind the sticky header bar,
 * so the header can switch to light text over dark sections.
 */
export function ScrollState() {
  useEffect(() => {
    const root = document.documentElement;
    let frame = 0;

    const toneBehindHeader = (): "dark" | "light" => {
      const bar = document.querySelector(".header-surface");
      if (!bar) return "light";
      const r = bar.getBoundingClientRect();
      const y = Math.max(1, Math.min(window.innerHeight - 1, r.top + r.height / 2));
      // Sample across the bar, including both edges where the logo and cart
      // sit; the header only goes light when every point is over dark.
      const xs = [0.06, 0.3, 0.5, 0.7, 0.94].map((f) => window.innerWidth * f);
      for (const x of xs) {
        const under = document.elementsFromPoint(x, y).find((el) => !el.closest(".site-header"));
        if (!under?.closest(DARK)) return "light";
      }
      return "dark";
    };

    const update = () => {
      frame = 0;
      const scrolled = window.scrollY > 8;
      if (scrolled) root.dataset.scrolled = "";
      else delete root.dataset.scrolled;
      root.dataset.headerTone = scrolled ? toneBehindHeader() : "light";
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);
  return null;
}
