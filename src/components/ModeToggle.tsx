"use client";
import { useMode, setMode, type Mode } from "@/lib/store/mode";

/** Business/Consumer toggle, persisted in a cookie. `onInk` styles it for a dark band. */
export function ModeToggle({ className = "", onInk = false }: { className?: string; onInk?: boolean }) {
  const mode = useMode();
  const opt = (m: Mode, label: string) => (
    <button
      type="button"
      onClick={() => setMode(m)}
      aria-pressed={mode === m}
      className={`rounded-full px-3 py-1 font-display text-xs font-semibold transition-colors ${
        mode === m
          ? onInk
            ? "bg-cream text-forest"
            : "bg-forest text-cream"
          : onInk
            ? "text-cream hover:bg-white/10"
            : "text-forest hover:bg-mint-light"
      }`}
    >
      {label}
    </button>
  );
  return (
    <div role="group" aria-label="Pricing mode" className={`inline-flex rounded-full border p-0.5 ${onInk ? "border-cream/50" : "border-forest/40"} ${className}`}>
      {opt("consumer", "Consumer")}
      {opt("business", "Business")}
    </div>
  );
}
