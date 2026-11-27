"use client";

import { SECTION_IDS, type SectionId } from "@/config/site";
import { useI18n } from "@/lib/i18n";
import { useAnswers } from "@/lib/answers";
import { countRequired } from "@/lib/builder";

export function useNavItems() {
  const { t } = useI18n();
  return SECTION_IDS.map((id, i) => ({ id, num: String(i + 1).padStart(2, "0"), title: t.nav[id] }));
}

export function BuilderCount() {
  const { answers } = useAnswers();
  const { done, total } = countRequired(answers);
  const complete = done === total;
  return (
    <span
      className={
        "ml-auto shrink-0 rounded-full px-1.5 py-0.5 text-[11px] font-bold tabular-nums " +
        (complete ? "bg-yellow text-navy" : done > 0 ? "bg-blue text-white" : "bg-mist text-ink")
      }
    >
      {done}/{total}
    </span>
  );
}

export function NavLinks({
  active,
  onNavigate,
  dark = false,
}: {
  active: string;
  onNavigate?: () => void;
  dark?: boolean;
}) {
  const items = useNavItems();
  return (
    <ul className={"relative border-l " + (dark ? "border-white/15" : "border-mist")}>
      {items.map((it) => {
        const on = active === it.id;
        return (
          <li key={it.id} className="relative">
            {on && <span aria-hidden className="absolute -left-px top-0 h-full w-[3px] rounded-full bg-orange" />}
            <a
              href={"#" + it.id}
              onClick={onNavigate}
              aria-current={on ? "location" : undefined}
              className={
                "flex items-center gap-2.5 py-2 pl-4 pr-2 text-[15px] leading-snug transition " +
                (dark
                  ? on
                    ? "font-semibold text-white"
                    : "text-white/75 hover:text-white"
                  : on
                    ? "font-semibold text-navy"
                    : "text-ink hover:text-navy")
              }
            >
              <span
                aria-hidden
                className={"shrink-0 text-[11px] font-bold tabular-nums " + (on ? (dark ? "text-orange" : "text-navy") : dark ? "text-white/50" : "text-muted")}
              >
                {it.num}
              </span>
              <span className="min-w-0">{it.title}</span>
              {(it.id as SectionId) === "builder" && <BuilderCount />}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
