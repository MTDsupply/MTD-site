import type { Metadata } from "next";
import { Suspense } from "react";
import { Inter, JetBrains_Mono, Outfit } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ScrollState } from "@/components/ScrollState";
import { ChromeGate } from "@/components/ChromeGate";
import { MetaPixel } from "@/components/MetaPixel";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { site } from "@/lib/site";
import { SITE_DESCRIPTION, organizationLd, websiteLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["500", "700", "800"],
  variable: "--font-outfit",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} · Home-compostable coffee cups and lids`,
    template: `%s · ${site.name}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: site.name,
  authors: [{ name: site.legalName, url: site.url }],
  creator: site.legalName,
  publisher: site.legalName,
  category: "shopping",
  icons: { icon: "/icon.png", apple: "/apple-icon.png" },
  openGraph: {
    type: "website",
    locale: "en_CA",
    siteName: site.name,
    url: "/",
    title: `${site.name} · Home-compostable coffee cups and lids`,
    description: SITE_DESCRIPTION,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Made to disappear." }],
  },
  twitter: { card: "summary_large_image", title: `${site.name} · Home-compostable coffee cups and lids`, description: SITE_DESCRIPTION, images: ["/og.png"] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  formatDetection: { telephone: false },
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } : undefined,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-CA" className={`${outfit.variable} ${inter.variable} ${jetbrains.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        <JsonLd data={[organizationLd(), websiteLd()]} />
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <div className="mesh" aria-hidden="true" />
        <div className="grain" aria-hidden="true" />
        <ScrollState />
        <Suspense fallback={null}>
          <MetaPixel />
        </Suspense>
        <Analytics />
        <SpeedInsights />
        <ChromeGate>
          <Header />
        </ChromeGate>
        <main id="main" className="flex-1">
          {children}
        </main>
        <ChromeGate>
          <Footer />
        </ChromeGate>
      </body>
    </html>
  );
}
