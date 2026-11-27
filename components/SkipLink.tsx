"use client";

import { useI18n } from "@/lib/i18n";

export default function SkipLink() {
  const { t } = useI18n();
  return (
    <a
      href="#contenido"
      className="sr-only z-50 rounded-xl bg-yellow px-4 py-3 font-bold text-navy focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
    >
      {t.a11y.skip}
    </a>
  );
}
