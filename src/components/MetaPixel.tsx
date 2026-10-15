"use client";
import Script from "next/script";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

/** Meta Pixel, loaded only when NEXT_PUBLIC_META_PIXEL_ID is set. Fires PageView on every route change. */
export function MetaPixel() {
  const pathname = usePathname();
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (ID && typeof window.fbq === "function") window.fbq("track", "PageView");
  }, [pathname]);
  if (!ID) return null;
  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${ID}');fbq('track','PageView');`}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img height="1" width="1" style={{ display: "none" }} alt="" src={`https://www.facebook.com/tr?id=${ID}&ev=PageView&noscript=1`} />
      </noscript>
    </>
  );
}
