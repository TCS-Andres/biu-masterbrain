/**
 * Copies text to the clipboard. Uses the async Clipboard API when it exists,
 * and falls back to a hidden textarea plus document.execCommand("copy")
 * for older browsers and non-secure contexts. Call it straight from a click
 * handler so mobile Safari treats it as a user gesture.
 */
export async function copyText(text: string): Promise<boolean> {
  if (typeof navigator !== "undefined" && navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Permission denied or API blocked: try the legacy path below.
    }
  }
  return legacyCopy(text);
}

export function legacyCopy(text: string): boolean {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.setAttribute("readonly", "");
  ta.setAttribute("aria-hidden", "true");
  // 16px stops iOS from zooming; fixed and transparent keeps the page from jumping.
  Object.assign(ta.style, {
    position: "fixed",
    top: "0",
    left: "0",
    width: "1px",
    height: "1px",
    padding: "0",
    border: "0",
    opacity: "0",
    fontSize: "16px",
  });
  document.body.appendChild(ta);

  const selection = document.getSelection();
  const previous = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;

  ta.focus({ preventScroll: true });
  ta.select();
  ta.setSelectionRange(0, text.length);

  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }

  document.body.removeChild(ta);
  if (previous && selection) {
    selection.removeAllRanges();
    selection.addRange(previous);
  }
  return ok;
}
