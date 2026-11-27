"use client";

import { useI18n } from "@/lib/i18n";
import { useAnswers } from "@/lib/answers";
import { countRequired, type RoundDef } from "@/lib/builder";
import { fmt } from "@/lib/format";
import Field from "./Field";

export default function Round({ round }: { round: RoundDef }) {
  const { t } = useI18n();
  const { answers } = useAnswers();
  const b = t.builder;
  const titles = { voice: b.round1Title, values: b.round2Title, vp: b.round3Title, limits: b.round4Title };
  const stuck = { voice: b.round1Stuck, values: b.round2Stuck, vp: b.round3Stuck, limits: b.round4Stuck };
  const { done, total } = countRequired(answers, round.fields);
  const complete = done === total;
  const headingId = "round-" + round.n + "-title";

  return (
    <div role="group" aria-labelledby={headingId} className="rounded-3xl border border-mist bg-white p-5 shadow-[0_1px_0_rgba(28,25,42,0.04)] sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-mist pb-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-ink">{fmt(b.roundLabel, { n: round.n })}</p>
          <h3 id={headingId} className="mt-1 text-2xl font-bold text-navy">
            {titles[round.key]}
          </h3>
        </div>
        <span
          className={
            "mt-1 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold tabular-nums " +
            (complete ? "bg-yellow text-navy" : "bg-mist text-ink")
          }
        >
          {complete && (
            <svg aria-hidden width="12" height="12" viewBox="0 0 16 16">
              <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
          {fmt(b.roundProgress, { done, total })}
        </span>
      </div>

      <div className="mt-6 space-y-7">
        {round.fields.map((f) => (
          <Field key={f.id} def={f} />
        ))}
      </div>

      <details className="group mt-8 overflow-hidden rounded-2xl border border-orange/60 bg-orange/[0.07]">
        <summary className="flex cursor-pointer items-center justify-between gap-3 px-5 py-3.5 font-semibold text-navy">
          <span className="flex items-center gap-2">
            <svg aria-hidden width="18" height="18" viewBox="0 0 18 18" className="text-navy">
              <circle cx="9" cy="9" r="7.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <path d="M7 7a2 2 0 113 1.7c-.6.4-1 .8-1 1.5M9 12.6v.1" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            {b.stuck}
          </span>
          <span aria-hidden className="text-xl leading-none text-navy transition group-open:rotate-45">
            +
          </span>
        </summary>
        <p className="border-t border-orange/40 px-5 py-4 leading-relaxed text-navy">{stuck[round.key]}</p>
      </details>
    </div>
  );
}
