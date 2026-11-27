"use client";

import { useI18n } from "@/lib/i18n";
import Section from "./Section";

const ACCENTS = ["bg-orange", "bg-yellow", "bg-blue", "bg-navy"];

export default function FourParts() {
  const { t } = useI18n();
  const f = t.fourParts;
  const items = [
    { title: f.voiceTitle, body: f.voiceBody },
    { title: f.valuesTitle, body: f.valuesBody },
    { title: f.vpTitle, body: f.vpBody },
    { title: f.limitsTitle, body: f.limitsBody },
  ];
  return (
    <Section id="cuatro-partes" title={f.title}>
      <ol className="mt-8 grid gap-4 sm:grid-cols-2">
        {items.map((it, i) => (
          <li key={i} className="relative overflow-hidden rounded-2xl border border-mist bg-white p-6">
            <span aria-hidden className={"absolute inset-y-0 left-0 w-1.5 " + ACCENTS[i]} />
            <p className="text-xs font-bold tabular-nums tracking-widest text-ink">0{i + 1}</p>
            <h3 className="mt-2 text-xl font-bold text-navy">{it.title}</h3>
            <p className="mt-2 leading-relaxed text-ink">{it.body}</p>
          </li>
        ))}
      </ol>
      <p className="mt-6 text-[15px] text-ink">{f.note}</p>
    </Section>
  );
}
