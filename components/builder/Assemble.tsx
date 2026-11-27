"use client";

import { useMemo, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useAnswers } from "@/lib/answers";
import { buildPrompt } from "@/lib/prompt";
import { canCopyPrompt } from "@/lib/builder";
import { fmt } from "@/lib/format";
import CopyButton from "../CopyButton";
import ClearDialog from "./ClearDialog";
import ToolTabs from "./ToolTabs";

export default function Assemble() {
  const { t, lang } = useI18n();
  const { answers, clearAll } = useAnswers();
  const a = t.assemble;
  const prompt = useMemo(() => buildPrompt(answers, t), [answers, t]);
  const unlocked = canCopyPrompt(answers);
  const hasAny = Object.values(answers).some((v) => (v ?? "").trim());
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [pdfState, setPdfState] = useState<"idle" | "working" | "err">("idle");
  const [live, setLive] = useState("");

  async function onPdf() {
    setPdfState("working");
    try {
      const { downloadAnswersPdf } = await import("@/lib/pdf");
      await downloadAnswersPdf(answers, t, lang);
      setPdfState("idle");
    } catch {
      setPdfState("err");
    }
  }

  return (
    <div role="group" aria-labelledby="round-5-title" className="on-dark rounded-3xl bg-navy p-5 text-white sm:p-8">
      <div className="border-b border-white/10 pb-5">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-orange">{fmt(t.builder.roundLabel, { n: 5 })}</p>
        <h3 id="round-5-title" className="mt-1 text-2xl font-bold">
          {t.builder.round5Title}
        </h3>
      </div>

      <p id="preview-label" className="mt-6 text-sm font-bold uppercase tracking-[0.12em] text-white/80">
        {a.previewLabel}
      </p>
      <div
        role="region"
        aria-labelledby="preview-label"
        tabIndex={0}
        className="mt-3 max-h-[26rem] overflow-auto rounded-2xl border border-white/15 bg-white/[0.06] p-4 sm:p-5"
      >
        {prompt ? (
          <pre className="whitespace-pre-wrap break-words font-sans text-[14px] leading-relaxed text-white/90">{prompt}</pre>
        ) : (
          <p className="text-[15px] text-white/75">{a.previewEmpty}</p>
        )}
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start">
        <CopyButton
          getText={() => prompt}
          label={a.copy}
          copiedLabel={a.copied}
          announce={a.copiedAnnounce}
          failText={a.copyFailed}
          disabled={!unlocked}
          describedBy={!unlocked ? "copy-locked" : undefined}
          failClassName="text-yellow"
          className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-orange px-6 font-bold text-navy transition hover:bg-yellow disabled:cursor-not-allowed disabled:bg-white/15 disabled:text-white/60 sm:w-auto"
        />
        <button
          type="button"
          onClick={onPdf}
          disabled={!hasAny || pdfState === "working"}
          aria-busy={pdfState === "working"}
          className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-white/35 px-5 font-medium text-white transition hover:border-orange hover:text-orange disabled:cursor-not-allowed disabled:opacity-50"
        >
          <svg aria-hidden width="16" height="16" viewBox="0 0 16 16">
            <path d="M8 2v8M4.5 6.8L8 10.3l3.5-3.5M2.5 13.5h11" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {pdfState === "working" ? a.pdfWorking : a.pdf}
        </button>
        <button
          type="button"
          onClick={() => dialogRef.current?.showModal()}
          disabled={!hasAny}
          className="inline-flex min-h-[48px] items-center justify-center rounded-xl px-4 text-sm font-medium text-white/80 underline-offset-4 transition hover:text-white hover:underline disabled:cursor-not-allowed disabled:opacity-50"
        >
          {a.clear}
        </button>
      </div>

      {!unlocked && (
        <p id="copy-locked" className="mt-4 flex items-start gap-2 text-sm text-white/80">
          <svg aria-hidden width="16" height="16" viewBox="0 0 16 16" className="mt-0.5 shrink-0 text-yellow">
            <rect x="3" y="7" width="10" height="7" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M5.5 7V5a2.5 2.5 0 015 0v2" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          {a.locked}
        </p>
      )}
      {pdfState === "err" && <p className="mt-4 text-sm text-yellow">{a.pdfFailed}</p>}
      <span className="sr-only" role="status" aria-live="polite">
        {live}
      </span>

      <ToolTabs />

      <ClearDialog
        ref={dialogRef}
        onConfirm={() => {
          clearAll();
          setLive(a.cleared);
          setTimeout(() => setLive(""), 4000);
        }}
      />
    </div>
  );
}
