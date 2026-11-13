"use client";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

export type Stage = { label: string; text: string; src: string; alt: string };

/**
 * The breakdown sequence as something you scrub rather than a strip you look
 * at. Four frames of the same cup stack in one 4:5 well and crossfade; the
 * stage list beside it is the control. Move the pointer across the photo,
 * press a stage, or use the arrow keys. On arrival it steps through once so
 * the frames read as a sequence, then it only moves when you move it.
 */
export function BreakdownScrubber({ stages }: { stages: Stage[] }) {
  const [i, setI] = useState(0);
  const [touched, setTouched] = useState(false);
  const wellRef = useRef<HTMLDivElement>(null);

  const fromPointer = useCallback(
    (clientX: number) => {
      const el = wellRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const f = Math.min(0.999, Math.max(0, (clientX - r.left) / r.width));
      setI(Math.floor(f * stages.length));
      setTouched(true);
    },
    [stages.length],
  );

  useEffect(() => {
    if (touched) return;
    const el = wellRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer: number | undefined;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        let k = 0;
        timer = window.setInterval(() => {
          k += 1;
          if (k >= stages.length - 1) {
            window.clearInterval(timer);
            return;
          }
          setI(k);
        }, 1100);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (timer) window.clearInterval(timer);
    };
  }, [stages.length, touched]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      setI((v) => Math.min(stages.length - 1, v + 1));
      setTouched(true);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      setI((v) => Math.max(0, v - 1));
      setTouched(true);
    }
  };

  return (
    <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] md:gap-14">
      <div
        ref={wellRef}
        role="slider"
        tabIndex={0}
        aria-label="Breakdown stage"
        aria-valuemin={1}
        aria-valuemax={stages.length}
        aria-valuenow={i + 1}
        aria-valuetext={stages[i].label}
        onKeyDown={onKey}
        onPointerMove={(e) => fromPointer(e.clientX)}
        onPointerDown={(e) => fromPointer(e.clientX)}
        onTouchMove={(e) => fromPointer(e.touches[0].clientX)}
        className="scrub-well relative aspect-[4/5] cursor-ew-resize select-none overflow-hidden bg-card outline-none focus-visible:ring-1 focus-visible:ring-ink"
      >
        {stages.map((s, k) => (
          <Image
            key={s.src}
            src={s.src}
            alt={k === i ? s.alt : ""}
            fill
            sizes="(min-width: 768px) 45vw, 100vw"
            className="object-cover transition-opacity duration-300 ease-out"
            style={{ opacity: k === i ? 1 : 0 }}
            priority={k === 0}
          />
        ))}
        <div className="scrub-track absolute inset-x-0 bottom-0 flex" aria-hidden="true">
          {stages.map((s, k) => (
            <span key={s.label} className={`h-[3px] flex-1 ${k <= i ? "bg-bone" : "bg-bone/30"}`} />
          ))}
        </div>
      </div>
      <ol className="hairline self-center border-y border-line">
        {stages.map((s, k) => (
          <li key={s.label}>
            <button
              type="button"
              onClick={() => {
                setI(k);
                setTouched(true);
              }}
              onMouseEnter={() => {
                setI(k);
                setTouched(true);
              }}
              aria-pressed={k === i}
              className={`grid w-full grid-cols-[48px_1fr] py-4 text-left transition-colors ${k === i ? "text-ink" : "text-stone hover:text-ink"}`}
            >
              <span className="t-label pt-1 tnum" style={{ color: k === i ? "var(--color-ink)" : undefined }}>
                0{k + 1}
              </span>
              <span>
                <span className="t-card block">{s.label}</span>
                <span className={`mt-1 block text-[15px] transition-colors ${k === i ? "text-ink" : "text-stone"}`}>{s.text}</span>
              </span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
