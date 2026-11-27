"use client";

import { useI18n } from "@/lib/i18n";
import Section from "./Section";

export default function HowItWorks() {
  const { t } = useI18n();
  const h = t.howItWorks;
  const steps = [h.step1, h.step2, h.step3];
  return (
    <Section id="como-funciona" title={h.title}>
      <ol className="mt-8 grid gap-4 md:grid-cols-3">
        {steps.map((s, i) => (
          <li key={i} className="flex items-start gap-4 rounded-2xl bg-mist/70 p-5 md:flex-col md:gap-5 md:p-6">
            <span
              aria-hidden
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-navy font-display text-lg font-bold text-orange"
            >
              {i + 1}
            </span>
            <p className="pt-2 text-lg font-medium leading-snug text-navy md:pt-0">
              <span className="sr-only">{i + 1}. </span>
              {s}
            </p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
