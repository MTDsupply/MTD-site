"use client";
import { useEffect, useRef, useState } from "react";
import { Dissolve } from "./Dissolve";
import { NotifyForm } from "./NotifyForm";
import type { Category } from "@/lib/catalog/types";

/**
 * The coming-soon tile pattern used everywhere: Fog background, line drawing
 * at 40% opacity, category name, Clay "Coming soon" tag, and a "Notify me"
 * link that opens an email capture tagged with the category.
 */
export function ComingSoonTile({ category, compact = false, photo = null }: { category: Category; compact?: boolean; photo?: string | null }) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="card glass-soft flex h-full flex-col p-3"
      data-status="coming_soon"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-white">
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo} alt={category.name} className="h-full w-full object-contain" draggable={false} />
        ) : null}
        <Dissolve active={seen} direction="in" layout="scatter" count={compact ? 24 : 40} />
      </div>
      <div className="mt-3 flex flex-wrap items-start justify-between gap-x-2 gap-y-1">
        <div>
          <h3 className="t-card text-[17px] leading-[22px]">{category.name}</h3>
          {!compact ? <p className="mt-0.5 text-xs text-soil/70">{category.description}</p> : null}
        </div>
        <span className="chip chip-clay">Coming soon</span>
      </div>
      <div className="mt-auto pt-3">
        {open ? (
          <NotifyForm categorySlug={category.slug} compact autoFocus />
        ) : (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="text-sm font-medium link-offset-2 hover:underline"
          >
            Notify me
          </button>
        )}
      </div>
    </div>
  );
}
