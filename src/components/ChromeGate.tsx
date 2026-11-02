"use client";
import { usePathname } from "next/navigation";
import { Suspense, type ReactNode } from "react";

/**
 * Hides the site header and footer on paid-traffic landing pages under /go/.
 * The pathname read sits in its own Suspense boundary so routes with dynamic
 * params (order detail) can still prerender a static shell; the chrome then
 * streams in with the rest of the page.
 */
export function ChromeGate({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={null}>
      <Gate>{children}</Gate>
    </Suspense>
  );
}

function Gate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith("/go/")) return null;
  return <>{children}</>;
}
