"use client";

import { useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";

type ToolKey = "claude" | "chatgpt" | "gemini";
const TOOLS: ToolKey[] = ["claude", "chatgpt", "gemini"];

/** Claude, ChatGPT and Gemini tabs, with arrow key support. */
export default function ToolTabs() {
  const { t } = useI18n();
  const a = t.assemble;
  const [active, setActive] = useState<ToolKey>("claude");
  const refs = useRef<Record<ToolKey, HTMLButtonElement | null>>({ claude: null, chatgpt: null, gemini: null });
  const tips: Record<ToolKey, string> = { claude: a.claudeTip, chatgpt: a.chatgptTip, gemini: a.geminiTip };

  function onKeyDown(e: React.KeyboardEvent) {
    const i = TOOLS.indexOf(active);
    let next: number | null = null;
    if (e.key === "ArrowRight") next = (i + 1) % TOOLS.length;
    if (e.key === "ArrowLeft") next = (i - 1 + TOOLS.length) % TOOLS.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = TOOLS.length - 1;
    if (next === null) return;
    e.preventDefault();
    setActive(TOOLS[next]);
    refs.current[TOOLS[next]]?.focus();
  }

  return (
    <div className="mt-8">
      <h4 id="tool-tabs-label" className="text-sm font-bold uppercase tracking-[0.12em] text-white/80">
        {a.tabsLabel}
      </h4>
      <div role="tablist" aria-labelledby="tool-tabs-label" onKeyDown={onKeyDown} className="mt-3 flex gap-1 rounded-xl bg-white/[0.07] p-1">
        {TOOLS.map((k) => {
          const on = k === active;
          return (
            <button
              key={k}
              ref={(el) => {
                refs.current[k] = el;
              }}
              type="button"
              role="tab"
              id={"tab-" + k}
              aria-selected={on}
              aria-controls={"panel-" + k}
              tabIndex={on ? 0 : -1}
              onClick={() => setActive(k)}
              className={
                "min-h-[40px] flex-1 rounded-lg px-3 text-sm font-bold transition " +
                (on ? "bg-white text-navy" : "text-white/80 hover:bg-white/10 hover:text-white")
              }
            >
              {a[k]}
            </button>
          );
        })}
      </div>
      {TOOLS.map((k) => (
        <div
          key={k}
          role="tabpanel"
          id={"panel-" + k}
          aria-labelledby={"tab-" + k}
          hidden={k !== active}
          tabIndex={0}
          className="mt-4 rounded-xl border border-white/10 p-5"
        >
          <ol className="space-y-2.5 text-[15px] leading-relaxed text-white/90">
            {[a.step1, a.step2, a.step3].map((s, i) => (
              <li key={i} className="flex gap-3">
                <span aria-hidden className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange text-xs font-bold text-navy">
                  {i + 1}
                </span>
                <span>
                  <span className="sr-only">{i + 1}. </span>
                  {s}
                </span>
              </li>
            ))}
          </ol>
          <p className="mt-4 border-t border-white/10 pt-4 text-sm text-white/75">{tips[k]}</p>
        </div>
      ))}
    </div>
  );
}
