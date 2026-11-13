"use client";
import { useEffect, useState } from "react";

export type RailItem = { id: string; n: string; title: string };

/**
 * A fixed index of the page's numbered sections, in the left gutter on wide
 * screens. The number of the section currently on screen is ink; the rest are
 * ash. Click to jump. Hidden below 1280 px, where there is no gutter.
 */
export function SectionRail({ items }: { items: RailItem[] }) {
  const [active, setActive] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const els = items.map((i) => document.getElementById(i.id)).filter((e): e is HTMLElement => !!e);
    if (!els.length) return;
    const ratios = new Map<string, number>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) ratios.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0);
        let best: string | null = null;
        let bestRatio = 0;
        for (const [id, r] of ratios) {
          if (r > bestRatio) {
            best = id;
            bestRatio = r;
          }
        }
        setActive(best);
        setVisible(bestRatio > 0);
      },
      { threshold: [0, 0.15, 0.3, 0.5, 0.7], rootMargin: "-20% 0px -40% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items]);

  return (
    <nav aria-label="Sections" className={`section-rail ${visible ? "is-visible" : ""}`}>
      <ol>
        {items.map((i) => (
          <li key={i.id}>
            <a href={`#${i.id}`} aria-current={active === i.id ? "true" : undefined} className={active === i.id ? "is-active" : undefined}>
              <span className="tnum">{i.n}</span>
              <span className="section-rail-title">{i.title}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
