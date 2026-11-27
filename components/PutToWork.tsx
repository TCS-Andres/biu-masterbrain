"use client";

import { useI18n } from "@/lib/i18n";
import CopyButton from "./CopyButton";
import Section from "./Section";

/** Shows [bracketed] parts in a highlight so people see what to replace. */
function Highlighted({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\])/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("[") && p.endsWith("]") ? (
          <mark key={i} className="rounded bg-yellow/60 px-0.5 text-navy">
            {p}
          </mark>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}

export default function PutToWork() {
  const { t } = useI18n();
  const w = t.work;
  const cards = [
    { title: w.linkedinTitle, prompt: w.linkedinPrompt },
    { title: w.coverTitle, prompt: w.coverPrompt },
    { title: w.interviewTitle, prompt: w.interviewPrompt },
    { title: w.postTitle, prompt: w.postPrompt },
    { title: w.checkTitle, prompt: w.checkPrompt },
    { title: w.auditTitle, prompt: w.auditPrompt },
  ];
  return (
    <Section id="a-trabajar" title={w.title}>
      <p className="mt-5 max-w-prose text-lg leading-relaxed text-ink">{w.intro}</p>
      <ul className="mt-8 grid gap-4 md:grid-cols-2">
        {cards.map((c, i) => (
          <li key={i} className="flex flex-col rounded-2xl border border-mist bg-white p-5 sm:p-6">
            <h3 className="flex items-center gap-2.5 text-lg font-bold text-navy">
              <span aria-hidden className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy text-xs font-bold text-orange">
                {i + 1}
              </span>
              {c.title}
            </h3>
            <p className="mt-4 flex-1 rounded-xl bg-mist/70 p-4 text-[15px] leading-relaxed text-navy">
              <Highlighted text={c.prompt} />
            </p>
            <div className="mt-4">
              <CopyButton
                getText={() => c.prompt}
                label={w.copy}
                copiedLabel={w.copied}
                announce={w.copiedAnnounce}
                failText={w.copyFailed}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border-2 border-navy px-4 text-sm font-bold text-navy transition hover:bg-navy hover:text-white"
              />
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-8 max-w-prose border-l-4 border-orange pl-5 font-display text-xl font-semibold leading-snug text-navy">
        {w.note}
      </p>
    </Section>
  );
}
