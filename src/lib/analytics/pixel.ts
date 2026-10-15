"use client";

type Params = Record<string, string | number | string[] | undefined>;

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/** Fires a standard Meta Pixel event if the pixel is loaded. Safe to call anywhere on the client. */
export function track(event: "ViewContent" | "AddToCart" | "InitiateCheckout" | "Purchase" | "Lead", params: Params = {}, options?: { eventID: string }) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  if (options) window.fbq("track", event, params, options);
  else window.fbq("track", event, params);
}
