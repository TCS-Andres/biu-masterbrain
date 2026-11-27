"use client";

import { useEffect, useRef, useState } from "react";
import { copyText } from "@/lib/clipboard";

type Props = {
  getText: () => string;
  label: string;
  copiedLabel: string;
  announce: string;
  failText: string;
  className: string;
  failClassName?: string;
  disabled?: boolean;
  describedBy?: string;
};

/** Copy button with a visible "Copied" state and a screen reader announcement. */
export default function CopyButton({
  getText,
  label,
  copiedLabel,
  announce,
  failText,
  className,
  failClassName = "text-ink",
  disabled,
  describedBy,
}: Props) {
  const [state, setState] = useState<"idle" | "ok" | "err">("idle");
  const [live, setLive] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function onClick() {
    const ok = await copyText(getText());
    setState(ok ? "ok" : "err");
    setLive(ok ? announce : failText);
    clearTimeout(timer.current);
    timer.current = setTimeout(
      () => {
        setState("idle");
        setLive("");
      },
      ok ? 2600 : 8000,
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <button type="button" onClick={onClick} disabled={disabled} aria-describedby={describedBy} className={className}>
        {state === "ok" ? (
          <>
            <svg aria-hidden width="16" height="16" viewBox="0 0 16 16" className="shrink-0">
              <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {copiedLabel}
          </>
        ) : (
          <>
            <svg aria-hidden width="16" height="16" viewBox="0 0 16 16" className="shrink-0">
              <rect x="5" y="5" width="8.5" height="8.5" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <path d="M3 10.5V3.5A1.5 1.5 0 014.5 2h6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            {label}
          </>
        )}
      </button>
      {state === "err" && <p className={"text-sm " + failClassName}>{failText}</p>}
      <span className="sr-only" aria-live="polite" role="status">
        {live}
      </span>
    </div>
  );
}
