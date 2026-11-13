"use client";
import { useMode, setMode, type Mode } from "@/lib/store/mode";

/** Business/Consumer toggle, persisted in a cookie. `onInk` styles it for a dark band. */
export function ModeToggle({ className = "" }: { className?: string; onInk?: boolean }) {
  const mode = useMode();
  const opt = (m: Mode, label: string) => (
    <button
      type="button"
      onClick={() => setMode(m)}
      aria-pressed={mode === m}
      className={`rounded-full px-3 py-1 text-xs transition-colors ${mode === m ? "bg-ink text-bone" : "text-stone hover:text-ink"}`}
    >
      {label}
    </button>
  );
  return (
    <div role="group" aria-label="Pricing mode" className={`inline-flex rounded-full border border-line p-0.5 ${className}`}>
      {opt("consumer", "consumer")}
      {opt("business", "business")}
    </div>
  );
}
