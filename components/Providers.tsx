"use client";

import { I18nProvider } from "@/lib/i18n";
import { AnswersProvider } from "@/lib/answers";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <AnswersProvider>{children}</AnswersProvider>
    </I18nProvider>
  );
}
