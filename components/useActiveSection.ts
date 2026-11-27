"use client";

import { useEffect, useRef, useState } from "react";

/** Which section sits under the reading line near the top of the viewport. */
export function useActiveSection(ids: readonly string[]): string {
  const [active, setActive] = useState("");
  const ticking = useRef(false);

  useEffect(() => {
    let settle: ReturnType<typeof setTimeout>;
    const compute = () => {
      ticking.current = false;
      const line = 140;
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 80) {
        setActive(ids[ids.length - 1]);
        return;
      }
      let current = "";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      setActive(current);
    };
    const onScroll = () => {
      clearTimeout(settle);
      settle = setTimeout(compute, 120);
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(compute);
    };
    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      clearTimeout(settle);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ids]);

  return active;
}
