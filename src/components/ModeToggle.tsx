"use client";
import { useMode, setMode, type Mode } from "@/lib/store/mode";

/** Business/Consumer toggle, persisted in a cookie. `onInk` styles it for the ink band. */
export function ModeToggle({ className = "", onInk = false }: { className?: string; onInk?: boolean }) {
  const mode = useMode();
  const opt = (m: Mode, label: string) => (
    <button
      type="button"
      onClick={() => setMode(m)}
      aria-pressed={mode === m}
      className={`px-2.5 py-1 text-xs font-medium transition-colors ${
        mode === m
          ? onInk
            ? "bg-paper text-sage-deep"
            : "bg-sage text-white"
          : onInk
            ? "text-paper hover:bg-white/10"
            : "text-soil hover:bg-sage-tint"
      }`}
    >
      {label}
    </button>
  );
  return (
    <div
      role="group"
      aria-label="Pricing mode"
      className={`inline-flex overflow-hidden rounded-[4px] border ${onInk ? "border-paper/60" : "border-sage"} ${className}`}
    >
      {opt("consumer", "Consumer")}
      {opt("business", "Business")}
    </div>
  );
}
