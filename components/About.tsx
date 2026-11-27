"use client";

import Image from "next/image";
import { CONTACT_EMAIL, WEBSITE_LABEL, WEBSITE_URL } from "@/config/site";
import { useI18n } from "@/lib/i18n";
import Section from "./Section";

export default function About() {
  const { t } = useI18n();
  const a = t.about;
  const pill =
    "inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-mist bg-white px-4 text-[15px] font-medium text-blue transition hover:border-blue";
  return (
    <Section id="andres" title={a.title}>
      <div className="mt-8 grid gap-8 sm:grid-cols-[220px_minmax(0,1fr)] sm:items-start lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-12">
        <div className="relative mx-auto w-full max-w-[260px] sm:mx-0">
          <span aria-hidden className="absolute -bottom-3 -right-3 h-full w-full rounded-3xl bg-orange" />
          <Image
            src="/andres.jpg"
            alt={a.photoAlt}
            width={1080}
            height={1350}
            sizes="(min-width: 1024px) 260px, (min-width: 640px) 220px, 260px"
            className="relative aspect-[4/5] w-full rounded-3xl object-cover"
          />
        </div>
        <div>
          <p className="max-w-prose text-lg leading-relaxed text-ink">{a.bio}</p>
          <ul className="mt-6 flex flex-wrap gap-3">
            <li>
              <a href={WEBSITE_URL} target="_blank" rel="noopener noreferrer" className={pill}>
                <span className="text-ink">{a.websiteLabel}:</span> {WEBSITE_LABEL}
                <span className="sr-only"> {t.a11y.newTab}</span>
              </a>
            </li>
            <li>
              <a href={"mailto:" + CONTACT_EMAIL} className={pill}>
                <span className="text-ink">{a.emailLabel}:</span> {CONTACT_EMAIL}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </Section>
  );
}
