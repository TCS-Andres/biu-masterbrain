"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { SECTION_IDS } from "@/config/site";
import { useI18n } from "@/lib/i18n";
import LangToggle from "./LangToggle";
import { NavLinks } from "./NavList";
import { useActiveSection } from "./useActiveSection";

export default function SiteHeader() {
  const { t } = useI18n();
  const active = useActiveSection(SECTION_IDS);
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (!panelRef.current?.contains(target) && !buttonRef.current?.contains(target)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  return (
    <header className="on-dark no-print sticky top-0 z-40 h-[var(--header-h)] border-b border-white/10 bg-navy text-white">
      <div className="mx-auto flex h-full max-w-7xl items-center gap-3 px-4 sm:px-8">
        <a href="#inicio" className="flex shrink-0 items-center" aria-label={t.a11y.home}>
          <Image
            src="/brand/tcs-logo-white-text-trim.png"
            alt="The Creative Strategist"
            width={900}
            height={295}
            priority
            sizes="96px"
            className="h-[30px] w-auto"
          />
        </a>
        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <LangToggle />
          <button
            ref={buttonRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-sections"
            className="flex min-h-[36px] items-center gap-1.5 rounded-full border border-white/25 px-3 text-sm font-medium text-white transition hover:border-orange lg:hidden"
          >
            <span>{open ? t.a11y.closeMenu : t.a11y.menu}</span>
            <svg aria-hidden width="12" height="12" viewBox="0 0 12 12" className={"transition " + (open ? "rotate-180" : "")}>
              <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      <div
        ref={panelRef}
        id="mobile-sections"
        hidden={!open}
        className="border-t border-white/10 bg-navy px-4 pb-4 pt-3 shadow-xl sm:px-8 lg:hidden"
      >
        <nav aria-label={t.a11y.sections}>
          <NavLinks active={active} onNavigate={() => setOpen(false)} dark />
        </nav>
      </div>
    </header>
  );
}
