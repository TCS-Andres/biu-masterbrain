"use client";

import { CALENDLY_URL } from "@/config/site";
import { useI18n } from "@/lib/i18n";
import CalendlyEmbed from "./CalendlyEmbed";
import Section from "./Section";

export default function Agenda() {
  const { t } = useI18n();
  const a = t.agenda;
  return (
    <Section id="agenda" title={a.title}>
      <div className="on-dark relative mt-8 overflow-hidden rounded-3xl bg-navy p-6 text-white sm:p-10">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 90% at 100% 0%, rgba(242,141,61,0.28), transparent 60%), radial-gradient(50% 80% at 0% 100%, rgba(43,105,216,0.28), transparent 60%)",
          }}
        />
        <div className="relative">
          <p className="max-w-prose text-lg leading-relaxed text-white/90">{a.body}</p>
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-orange px-6 font-bold text-navy transition hover:bg-yellow"
          >
            {a.cta}
            <span className="sr-only"> {t.a11y.newTab}</span>
            <svg aria-hidden width="14" height="14" viewBox="0 0 14 14">
              <path d="M5 2h7v7M12 2L4.5 9.5M2 5v7h7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </a>
          <CalendlyEmbed />
        </div>
      </div>
    </Section>
  );
}
