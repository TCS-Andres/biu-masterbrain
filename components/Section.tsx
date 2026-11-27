import type { SectionId } from "@/config/site";
import { SECTION_IDS } from "@/config/site";

/** A numbered page section with the shared heading style. */
export default function Section({
  id,
  title,
  children,
  className = "",
}: {
  id: SectionId;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  const num = String(SECTION_IDS.indexOf(id) + 1).padStart(2, "0");
  return (
    <section id={id} aria-labelledby={id + "-title"} className={"border-t border-mist py-14 first:border-t-0 sm:py-20 " + className}>
      <div className="flex items-center gap-3 sm:gap-4">
        <span
          aria-hidden
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy font-display text-sm font-bold tabular-nums text-orange sm:h-11 sm:w-11 sm:text-base"
        >
          {num}
        </span>
        <h2 id={id + "-title"} className="text-[1.75rem] font-bold leading-tight text-navy sm:text-4xl">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}
