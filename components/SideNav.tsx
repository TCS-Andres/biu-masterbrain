"use client";

import { SECTION_IDS } from "@/config/site";
import { useI18n } from "@/lib/i18n";
import { NavLinks } from "./NavList";
import { useActiveSection } from "./useActiveSection";

/** Sticky rail on desktop, like the original workshop hub. */
export default function SideNav() {
  const { t } = useI18n();
  const active = useActiveSection(SECTION_IDS);
  return (
    <nav aria-label={t.a11y.sections} className="no-print hidden lg:block">
      <div className="sticky top-[calc(var(--header-h)+2rem)] pb-10 pt-14">
        <p className="mb-3 pl-4 text-[11px] font-bold uppercase tracking-[0.16em] text-ink">{t.nav.onThisPage}</p>
        <NavLinks active={active} />
      </div>
    </nav>
  );
}
