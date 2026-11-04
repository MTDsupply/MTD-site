import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

const PRIVATE = ["/account", "/admin", "/cart", "/checkout", "/api/", "/go/", "/auth/"];

/**
 * Search engines and AI assistants may read every public page; carts,
 * accounts, checkout and paid landing pages stay out. The AI crawlers are
 * named so a blanket block added later at the CDN does not silently remove
 * the site from answer engines.
 */
const AI_CRAWLERS = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "anthropic-ai", "PerplexityBot", "Google-Extended", "Applebot-Extended", "Amazonbot", "CCBot", "DuckAssistBot", "meta-externalagent"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE },
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: "/", disallow: PRIVATE })),
    ],
    sitemap: `${site.url.replace(/\/$/, "")}/sitemap.xml`,
    host: site.url.replace(/\/$/, ""),
  };
}
