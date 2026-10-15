"use client";
import { useSyncExternalStore } from "react";

export type Mode = "consumer" | "business";
export const MODE_COOKIE = "mtd_mode";

const listeners = new Set<() => void>();

function readCookie(): Mode {
  if (typeof document === "undefined") return "consumer";
  const m = document.cookie.match(new RegExp(`(?:^|; )${MODE_COOKIE}=(business|consumer)`));
  return (m?.[1] as Mode) ?? "consumer";
}

let cached: Mode | null = null;
function snapshot(): Mode {
  if (cached === null) cached = readCookie();
  return cached;
}

export function setMode(mode: Mode) {
  cached = mode;
  document.cookie = `${MODE_COOKIE}=${mode}; path=/; max-age=31536000; samesite=lax`;
  listeners.forEach((l) => l());
}

/**
 * Business/Consumer toggle, persisted in a cookie. The server snapshot is
 * always "consumer" so pages stay prerenderable; the client re-reads the
 * cookie after hydration.
 */
export function useMode(): Mode {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    snapshot,
    () => "consumer",
  );
}
