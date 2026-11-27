"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { STORAGE_KEY } from "@/config/site";
import { type Answers, type FieldId, sanitizeAnswers } from "./builder";

type Ctx = {
  answers: Answers;
  setAnswer: (id: FieldId, value: string) => void;
  clearAll: () => void;
  /** False when the browser refuses localStorage. Answers then live in memory only. */
  storageOk: boolean;
  /** Increments after each successful save, so the UI can announce it. */
  saveCount: number;
};

const AnswersContext = createContext<Ctx | null>(null);

export function AnswersProvider({ children }: { children: React.ReactNode }) {
  const [answers, setAnswers] = useState<Answers>({});
  const [storageOk, setStorageOk] = useState(true);
  const [saveCount, setSaveCount] = useState(0);
  const loaded = useRef(false);
  const dirty = useRef(false);

  useEffect(() => {
    let restored: Answers = {};
    let ok = true;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) restored = sanitizeAnswers(JSON.parse(raw));
    } catch {
      ok = false;
    }
    loaded.current = true;
    // Restoring saved answers can only happen in the browser, after mount.
    /* eslint-disable react-hooks/set-state-in-effect */
    if (!ok) setStorageOk(false);
    if (Object.keys(restored).length) setAnswers(restored);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    if (!loaded.current || !dirty.current) return;
    try {
      if (Object.keys(answers).length) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
      } else {
        window.localStorage.removeItem(STORAGE_KEY);
      }
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSaveCount((n) => n + 1);
    } catch {
      setStorageOk(false);
    }
  }, [answers]);

  const setAnswer = useCallback((id: FieldId, value: string) => {
    dirty.current = true;
    setAnswers((prev) => {
      const next = { ...prev };
      if (value === "") delete next[id];
      else next[id] = value;
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    dirty.current = true;
    setAnswers({});
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Nothing stored to remove.
    }
  }, []);

  const value = useMemo(
    () => ({ answers, setAnswer, clearAll, storageOk, saveCount }),
    [answers, setAnswer, clearAll, storageOk, saveCount],
  );
  return <AnswersContext.Provider value={value}>{children}</AnswersContext.Provider>;
}

export function useAnswers(): Ctx {
  const ctx = useContext(AnswersContext);
  if (!ctx) throw new Error("useAnswers must be used inside AnswersProvider");
  return ctx;
}
