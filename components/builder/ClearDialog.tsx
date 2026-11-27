"use client";

import { forwardRef } from "react";
import { useI18n } from "@/lib/i18n";

/** In-page confirmation built on the native dialog element (focus trap and Escape for free). */
const ClearDialog = forwardRef<HTMLDialogElement, { onConfirm: () => void }>(function ClearDialog({ onConfirm }, ref) {
  const { t } = useI18n();
  const d = t.clearDialog;
  const close = () => (ref && "current" in ref ? ref.current?.close() : undefined);
  return (
    <dialog
      ref={ref}
      aria-labelledby="clear-title"
      aria-describedby="clear-body"
      className="w-[min(92vw,440px)] rounded-2xl p-0 text-navy shadow-2xl"
    >
      <div className="p-6 sm:p-7">
        <h2 id="clear-title" className="text-2xl font-bold">
          {d.title}
        </h2>
        <p id="clear-body" className="mt-3 leading-relaxed text-ink">
          {d.body}
        </p>
        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            autoFocus
            onClick={close}
            className="min-h-[44px] rounded-xl border border-muted px-5 font-medium text-navy transition hover:border-navy"
          >
            {d.cancel}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              close();
            }}
            className="min-h-[44px] rounded-xl bg-navy px-5 font-bold text-white transition hover:bg-ink"
          >
            {d.confirm}
          </button>
        </div>
      </div>
    </dialog>
  );
});

export default ClearDialog;
