"use client";

import { useI18n } from "@/lib/i18n";
import Section from "./Section";

export default function WhatIs() {
  const { t } = useI18n();
  const w = t.whatIs;
  return (
    <Section id="que-es" title={w.title}>
      <p className="mt-5 max-w-prose text-lg leading-relaxed text-ink">{w.body}</p>

      <figure className="mt-10">
        <div className="flex items-start gap-3">
          <span className="mt-1 shrink-0 rounded-full bg-mist px-3 py-1 text-xs font-bold uppercase tracking-wide text-ink">
            {w.requestLabel}
          </span>
          <p className="rounded-2xl rounded-tl-sm bg-navy px-4 py-3 text-[15px] font-medium text-white">{w.request}</p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="flex flex-col rounded-2xl border border-mist bg-mist/60 p-6">
            <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-ink">
              <svg aria-hidden width="18" height="18" viewBox="0 0 18 18">
                <circle cx="9" cy="9" r="8" fill="#8B8797" />
                <path d="M6 6l6 6M12 6l-6 6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              {w.withoutLabel}
            </p>
            <blockquote className="mt-4 flex-1 text-[17px] leading-relaxed text-ink">{w.withoutText}</blockquote>
          </div>
          <div className="relative flex flex-col overflow-hidden rounded-2xl border-2 border-orange bg-white p-6 shadow-[0_12px_32px_-16px_rgba(242,141,61,0.6)]">
            <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-navy">
              <svg aria-hidden width="18" height="18" viewBox="0 0 18 18">
                <circle cx="9" cy="9" r="8" fill="#F28D3D" />
                <path d="M5.5 9.2l2.3 2.3 4.7-4.9" fill="none" stroke="#1C192A" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {w.withLabel}
            </p>
            <blockquote className="mt-4 flex-1 text-[17px] font-medium leading-relaxed text-navy">{w.withText}</blockquote>
          </div>
        </div>
        <figcaption className="mt-5 text-center font-display text-lg font-bold text-navy">{w.caption}</figcaption>
      </figure>

      <p className="mt-10 max-w-prose border-l-4 border-yellow pl-5 font-display text-xl font-semibold leading-snug text-navy sm:text-2xl">
        {w.closing}
      </p>
    </Section>
  );
}
