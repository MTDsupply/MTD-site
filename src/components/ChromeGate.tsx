"use client";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Hides the site header and footer on paid-traffic landing pages under /go/. */
export function ChromeGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith("/go/")) return null;
  return <>{children}</>;
}
