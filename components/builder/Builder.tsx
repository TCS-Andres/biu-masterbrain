"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useAnswers } from "@/lib/answers";
import { ROUNDS, countRequired } from "@/lib/builder";
import { fmt } from "@/lib/format";
import Section from "../Section";
import Round from "./Round";
import Assemble from "./Assemble";

export default function Builder() {
  const { t } = useI18n();
  const { answers, storageOk, saveCount } = useAnswers();
  const b = t.builder;
  const { done, total } = countRequired(answers);
  const pct = Math.round((done / total) * 100);
  const progressText = fmt(b.progress, { done, total });

  // Announce autosave once typing pauses, not on every keystroke.
  const [savedLive, setSavedLive] = useState("");
  useEffect(() => {
    if (!saveCount) return;
    const id = setTimeout(() => setSavedLive(b.saved), 1500);
    return () => {
      clearTimeout(id);
      setSavedLive("");
    };
  }, [saveCount, b.saved]);

  const hasAny = Object.keys(answers).length > 0;

  return (
    <Section id="builder" title={b.title}>
      <p className="mt-6 flex max-w-prose items-start gap-3 rounded-2xl bg-mist px-5 py-4 text-[15px] leading-relaxed text-navy">
        <svg aria-hidden width="20" height="20" viewBox="0 0 20 20" className="mt-0.5 shrink-0 text-navy">
          <path d="M10 2l6 2.5v4.7c0 4-2.6 7-6 8.3-3.4-1.3-6-4.3-6-8.3V4.5L10 2z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M7.2 10l2 2 3.8-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {b.privacy}
      </p>

      <div className="mt-8">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p id="progress-label" className="text-sm font-bold text-navy">
            {b.progressLabel}: <span className="font-medium text-ink">{progressText}</span>
          </p>
          {storageOk && hasAny && (
            <p className="flex items-center gap-1.5 text-sm text-ink">
              <svg aria-hidden width="14" height="14" viewBox="0 0 16 16" className="text-blue">
                <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {b.saved}
            </p>
          )}
        </div>
        <div
          role="progressbar"
          aria-labelledby="progress-label"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={done}
          aria-valuetext={progressText}
          className="mt-2.5 h-2.5 overflow-hidden rounded-full bg-mist"
        >
          <div className="h-full rounded-full bg-orange transition-[width] duration-500" style={{ width: pct + "%" }} />
        </div>
        <span className="sr-only" role="status" aria-live="polite">
          {savedLive}
        </span>
        {!storageOk && (
          <p role="alert" className="mt-4 rounded-xl border border-orange bg-orange/10 px-4 py-3 text-sm text-navy">
            {b.storageError}
          </p>
        )}
      </div>

      <div className="mt-8 space-y-6">
        {ROUNDS.map((r) => (
          <Round key={r.key} round={r} />
        ))}
        <Assemble />
      </div>
    </Section>
  );
}
