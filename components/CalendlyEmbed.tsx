"use client";

import { useEffect, useRef, useState } from "react";
import { CALENDLY_URL } from "@/config/site";
import { useI18n } from "@/lib/i18n";

const SCRIPT_SRC = "https://assets.calendly.com/assets/external/widget.js";

declare global {
  interface Window {
    Calendly?: { initInlineWidget: (opts: { url: string; parentElement: HTMLElement }) => void };
  }
}

function loadScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.Calendly) return resolve();
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`);
    const s = existing ?? document.createElement("script");
    s.addEventListener("load", () => resolve(), { once: true });
    s.addEventListener("error", () => reject(new Error("blocked")), { once: true });
    if (!existing) {
      s.src = SCRIPT_SRC;
      s.async = true;
      document.body.appendChild(s);
    }
  });
}

/**
 * Inline Calendly calendar. The script only loads when the section is close to
 * the viewport. If it is blocked or never draws, the block hides itself and the
 * button above stays as the way to book.
 */
export default function CalendlyEmbed() {
  const { t } = useI18n();
  const wrap = useRef<HTMLDivElement>(null);
  const target = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"idle" | "loading" | "ready" | "failed">("idle");

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    let cancelled = false;
    let timeout: ReturnType<typeof setTimeout> | undefined;

    const start = async () => {
      setState("loading");
      timeout = setTimeout(() => {
        if (!cancelled && !target.current?.querySelector("iframe")) setState("failed");
      }, 12000);
      try {
        await loadScript();
        if (cancelled || !target.current || !window.Calendly) throw new Error("unavailable");
        target.current.innerHTML = "";
        window.Calendly.initInlineWidget({ url: CALENDLY_URL, parentElement: target.current });
        const iframe = target.current.querySelector("iframe");
        if (!iframe) throw new Error("no frame");
        iframe.title = t.agenda.widgetTitle;
        iframe.addEventListener("load", () => !cancelled && setState("ready"), { once: true });
      } catch {
        if (!cancelled) setState("failed");
      }
    };

    if (!("IntersectionObserver" in window)) {
      start();
      return () => {
        cancelled = true;
        clearTimeout(timeout);
      };
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          start();
        }
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(el);
    return () => {
      cancelled = true;
      clearTimeout(timeout);
      io.disconnect();
    };
    // The widget is created once; a language switch only renames the frame title below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const iframe = target.current?.querySelector("iframe");
    if (iframe) iframe.title = t.agenda.widgetTitle;
  }, [t.agenda.widgetTitle, state]);

  if (state === "failed") {
    return <p className="mt-6 text-sm text-white/75">{t.agenda.widgetFailed}</p>;
  }

  return (
    <div ref={wrap} className="no-print mt-8 overflow-hidden rounded-2xl bg-white">
      {state !== "ready" && (
        <p className="px-5 pt-5 text-sm text-ink" aria-live="polite">
          {t.agenda.widgetLoading}
        </p>
      )}
      <div ref={target} className="h-[680px] min-w-[300px]" />
    </div>
  );
}
