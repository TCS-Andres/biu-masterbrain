"use client";

import { useI18n, type Lang } from "@/lib/i18n";

export default function LangToggle() {
  const { lang, setLang, t } = useI18n();
  const options: { value: Lang; short: string; name: string; htmlLang: string }[] = [
    { value: "es", short: t.lang.es, name: t.lang.esName, htmlLang: "es" },
    { value: "en", short: t.lang.en, name: t.lang.enName, htmlLang: "en" },
  ];
  return (
    <div role="group" aria-label={t.a11y.language} className="flex items-center rounded-full border border-white/25 p-0.5">
      {options.map((o, i) => {
        const on = lang === o.value;
        return (
          <span key={o.value} className="flex items-center">
            {i > 0 && (
              <span aria-hidden className="px-0.5 text-white/40">
                |
              </span>
            )}
            <button
              type="button"
              onClick={() => setLang(o.value)}
              aria-pressed={on}
              lang={o.htmlLang}
              aria-label={o.name}
              className={
                "min-h-[32px] min-w-[40px] rounded-full px-2.5 text-sm font-bold tracking-wide transition " +
                (on ? "bg-orange text-navy" : "text-white/80 hover:text-white")
              }
            >
              {o.short}
            </button>
          </span>
        );
      })}
    </div>
  );
}
