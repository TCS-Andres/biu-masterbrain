import type { Metadata, Viewport } from "next";
import { DM_Sans, Quicksand } from "next/font/google";
import es from "@/content/es.json";
import { NOINDEX, SITE_URL } from "@/config/site";
import Providers from "@/components/Providers";
import SiteAnalytics from "@/components/SiteAnalytics";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-sans",
  display: "swap",
});
const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-display",
  display: "swap",
});

// Spanish is the default language, so the server renders Spanish metadata.
// The description switches on the client when someone picks English.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: es.meta.title,
  description: es.meta.description,
  robots: NOINDEX ? { index: false, follow: false } : { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "es_US",
    alternateLocale: ["en_US"],
    title: es.meta.title,
    description: es.meta.description,
    siteName: "The Creative Strategist",
  },
  twitter: {
    card: "summary_large_image",
    title: es.meta.title,
    description: es.meta.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#1C192A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${dmSans.variable} ${quicksand.variable}`}>
      <body className="font-sans">
        <Providers>{children}</Providers>
        <SiteAnalytics />
      </body>
    </html>
  );
}
