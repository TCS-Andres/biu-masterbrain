"use client";

import { Analytics } from "@vercel/analytics/next";

/**
 * Vercel Web Analytics, page views only. The URL is reduced to origin and path
 * before sending, so nothing from the page (query strings, hashes, answers)
 * ever leaves the browser with it.
 */
export default function SiteAnalytics() {
  return (
    <Analytics
      beforeSend={(event) => {
        try {
          const u = new URL(event.url);
          return { ...event, url: u.origin + u.pathname };
        } catch {
          return null;
        }
      }}
    />
  );
}
