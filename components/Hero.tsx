"use client";

import Image from "next/image";
import { CALENDLY_URL, SHOW_BIU_LOGO } from "@/config/site";
import { useI18n } from "@/lib/i18n";

/** Pulls the expected reply out of the prompt's closing line, for the decorative chat card. */
function replyFrom(closing: string): string {
  const m = closing.match(/"([^"]+)"/);
  return m ? m[1] : closing;
}

export default function Hero() {
  const { t } = useI18n();
  return (
    <section id="inicio" className="on-dark relative overflow-hidden bg-navy text-white" aria-labelledby="hero-title">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(55% 70% at 88% 8%, rgba(242,141,61,0.30), transparent 62%)," +
            "radial-gradient(45% 60% at 100% 0%, rgba(252,223,9,0.14), transparent 60%)," +
            "radial-gradient(55% 75% at 0% 100%, rgba(43,105,216,0.32), transparent 62%)",
        }}
      />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-5 pb-16 pt-12 sm:px-8 sm:pb-24 sm:pt-20 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-center lg:gap-16">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-orange sm:text-sm">{t.hero.eyebrow}</p>
          <h1 id="hero-title" className="mt-5 text-[2.5rem] font-bold leading-[1.05] sm:text-6xl lg:text-7xl">
            {t.hero.title}
          </h1>
          <p className="mt-5 max-w-2xl font-display text-xl font-semibold leading-snug text-white sm:text-2xl">
            {t.hero.subhead}
          </p>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">{t.hero.body}</p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href="#builder"
              className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-orange px-6 py-3 text-base font-bold text-navy shadow-[0_8px_24px_-8px_rgba(242,141,61,0.7)] transition hover:bg-yellow"
            >
              {t.hero.ctaPrimary}
            </a>
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-white/35 px-6 py-3 text-base font-medium text-white transition hover:border-orange hover:text-orange"
            >
              {t.hero.ctaSecondary}
              <span className="sr-only"> {t.a11y.newTab}</span>
              <svg aria-hidden width="14" height="14" viewBox="0 0 14 14">
                <path d="M5 2h7v7M12 2L4.5 9.5M2 5v7h7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </a>
          </div>

          <p className="mt-6 flex items-center gap-2 text-sm text-white/75">
            <svg aria-hidden width="16" height="16" viewBox="0 0 16 16" className="shrink-0 text-yellow">
              <rect x="3" y="7" width="10" height="7" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <path d="M5.5 7V5a2.5 2.5 0 015 0v2" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            {t.hero.note}
          </p>

          <div className="mt-8 flex items-center gap-3 border-t border-white/10 pt-6">
            {SHOW_BIU_LOGO && (
              <Image src="/brand/biu-logo.png" alt="Broward International University" width={120} height={40} className="h-10 w-auto" />
            )}
            <p className="text-sm text-white/70">{t.hero.credit}</p>
          </div>
        </div>

        {/* Decorative: what a loaded Master Brain looks like inside a chat. */}
        <div aria-hidden className="hidden lg:block">
          <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-2xl backdrop-blur-sm">
            <div className="flex gap-1.5 pb-4">
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            </div>
            <div className="ml-8 rounded-2xl rounded-tr-sm bg-white/10 p-4 text-[13px] leading-relaxed text-white/85">
              {[t.prompt.voiceHeading, t.prompt.valuesHeading, t.prompt.vpHeading, t.prompt.limitsHeading].map((h, i) => (
                <div key={h} className="flex items-center gap-2 py-1">
                  <span className={"h-1.5 w-1.5 rounded-full " + ["bg-orange", "bg-yellow", "bg-blue", "bg-white"][i]} />
                  <span className="font-bold tracking-wide">{h}</span>
                  <span className="ml-1 h-1.5 flex-1 rounded-full bg-white/10" />
                </div>
              ))}
            </div>
            <div className="mr-8 mt-4 rounded-2xl rounded-tl-sm bg-orange p-4 text-[15px] font-medium leading-snug text-navy">
              {replyFrom(t.prompt.closing)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
