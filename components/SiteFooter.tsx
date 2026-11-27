"use client";

import Image from "next/image";
import { CALENDLY_URL, CONTACT_EMAIL, WEBSITE_URL } from "@/config/site";
import { useI18n } from "@/lib/i18n";

export default function SiteFooter() {
  const { t } = useI18n();
  const f = t.footer;
  const link = "text-white/80 underline-offset-4 transition hover:text-orange hover:underline";
  return (
    <footer className="on-dark bg-navy text-white">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <Image
          src="/brand/tcs-logo-white-text-trim.png"
          alt="The Creative Strategist"
          width={900}
          height={295}
          sizes="128px"
          className="h-10 w-auto"
        />
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-white/90">{f.thanks}</p>
        <p className="mt-3 font-display text-lg font-bold text-orange">{f.signoff}</p>
        <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/10 pt-6 text-sm">
          <li>
            <a href={WEBSITE_URL} target="_blank" rel="noopener noreferrer" className={link}>
              {f.website}
              <span className="sr-only"> {t.a11y.newTab}</span>
            </a>
          </li>
          <li>
            <a href={"mailto:" + CONTACT_EMAIL} className={link}>
              {f.email}
            </a>
          </li>
          <li>
            <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className={link}>
              {f.calendly}
              <span className="sr-only"> {t.a11y.newTab}</span>
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
