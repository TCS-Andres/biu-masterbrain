"use client";

import { useI18n } from "@/lib/i18n";
import { useAnswers } from "@/lib/answers";
import { DISCLOSURE_OPTIONS, type FieldDef } from "@/lib/builder";

const inputBase =
  "mt-2.5 w-full rounded-xl border border-muted bg-white px-3.5 py-3 text-base text-navy placeholder:text-ink/80 transition focus:border-blue focus:outline-none focus:ring-2 focus:ring-blue/30";

export default function Field({ def }: { def: FieldDef }) {
  const { t } = useI18n();
  const { answers, setAnswer } = useAnswers();
  const copy = t.fields[def.id];
  const id = "f-" + def.id;
  const value = answers[def.id] ?? "";

  return (
    <div>
      <label htmlFor={id} className="flex flex-wrap items-baseline gap-x-2 gap-y-1 font-medium leading-snug text-navy">
        <span>{copy.label}</span>
        {def.optional && (
          <span className="rounded-full bg-mist px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-ink">
            {t.builder.optional}
          </span>
        )}
      </label>

      {def.type === "short" && (
        <input
          id={id}
          name={def.id}
          type="text"
          autoComplete="off"
          value={value}
          placeholder={copy.placeholder || undefined}
          aria-required={!def.optional}
          onChange={(e) => setAnswer(def.id, e.target.value)}
          className={inputBase}
        />
      )}

      {def.type === "long" && (
        <textarea
          id={id}
          name={def.id}
          rows={3}
          value={value}
          placeholder={copy.placeholder || undefined}
          aria-required={!def.optional}
          onChange={(e) => setAnswer(def.id, e.target.value)}
          className={inputBase + " min-h-[96px] resize-y leading-relaxed"}
        />
      )}

      {def.type === "select" && (
        <div className="relative">
          <select
            id={id}
            name={def.id}
            value={value}
            aria-required={!def.optional}
            onChange={(e) => setAnswer(def.id, e.target.value)}
            className={inputBase + " appearance-none pr-10 " + (value ? "" : "text-ink")}
          >
            <option value="">{t.builder.selectPlaceholder}</option>
            {DISCLOSURE_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {t.fields.limits_disclosure[o]}
              </option>
            ))}
          </select>
          <svg
            aria-hidden
            width="14"
            height="14"
            viewBox="0 0 12 12"
            className="pointer-events-none absolute right-4 top-1/2 mt-1 -translate-y-1/2 text-navy"
          >
            <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </div>
      )}
    </div>
  );
}
