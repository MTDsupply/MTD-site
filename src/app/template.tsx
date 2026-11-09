"use client";
import { useEffect, type ReactNode } from "react";

/*
 * Soft page transition on client-side navigations only. The first load renders
 * fully visible on the server, so nothing waits for JavaScript before it paints;
 * later navigations mount a fresh Template (Next remounts it per route) and get
 * the CSS fade. `navigated` lives on the client module, so the server never sets it.
 */
let navigated = false;

export default function Template({ children }: { children: ReactNode }) {
  const animate = navigated;
  useEffect(() => {
    navigated = true;
  }, []);
  return <div className={animate ? "page-in" : undefined}>{children}</div>;
}
