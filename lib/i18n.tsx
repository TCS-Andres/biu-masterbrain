"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import en from "@/content/en.json";
import es from "@/content/es.json";
import { LANG_KEY } from "@/config/site";

export type Lang = "es" | "en";
export type Dict = typeof en;

// Typed against en.json, so a key missing from es.json fails the build.
const DICTS: Record<Lang, Dict> = { es, en };

type Ctx = { lang: Lang; t: Dict; setLang: (l: Lang) => void };
const I18nContext = createContext<Ctx | null>(null);

function readStoredLang(): Lang | null {
  try {
    const v = window.localStorage.getItem(LANG_KEY);
    return v === "en" || v === "es" ? v : null;
  } catch {
    return null;
  }
}

function storeLang(l: Lang) {
  try {
    window.localStorage.setItem(LANG_KEY, l);
  } catch {
    // Storage blocked: the choice still applies for this visit.
  }
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  // Spanish is the default and what the server renders.
  const [lang, setLangState] = useState<Lang>("es");

  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("lang");
    const fromQuery = q === "en" || q === "es" ? q : null;
    if (fromQuery) storeLang(fromQuery);
    const next = fromQuery ?? readStoredLang();
    // Syncing with storage and the URL can only happen after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (next && next !== "es") setLangState(next);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", DICTS[lang].meta.description);
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    storeLang(l);
    // Keep a shared link in sync when the URL already carries ?lang=.
    const url = new URL(window.location.href);
    if (url.searchParams.has("lang")) {
      url.searchParams.set("lang", l);
      window.history.replaceState(null, "", url.toString());
    }
  }, []);

  const value = useMemo(() => ({ lang, t: DICTS[lang], setLang }), [lang, setLang]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): Ctx {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}
