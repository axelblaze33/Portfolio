"use client";

import { ArrowUp } from "lucide-react";
import { AnimatePresence, m, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";

/** Floating button that appears after the first screenful; its ring tracks page progress. */
export function BackToTop() {
  const { scrollY, scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setVisible(y > 900));

  return (
    <AnimatePresence>
      {visible && (
        <m.button
          type="button"
          aria-label="Back to top"
          onClick={() => {
            window.scrollTo({ top: 0 });
            document.getElementById("main")?.focus({ preventScroll: true });
          }}
          className="glass group fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-50 grid size-11 place-items-center rounded-full bg-bg-elevated/80! text-fg-muted shadow-card transition-colors hover:text-fg sm:right-6 sm:bottom-6 sm:size-12"
          initial={{ opacity: 0, scale: 0.8, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 12 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          <svg viewBox="0 0 48 48" className="absolute inset-0 size-full -rotate-90" aria-hidden="true">
            <m.circle
              cx="24"
              cy="24"
              r="22.5"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="1.5"
              strokeLinecap="round"
              style={{ pathLength: scrollYProgress }}
            />
          </svg>
          <ArrowUp className="size-4 transition-transform group-hover:-translate-y-0.5" aria-hidden="true" />
        </m.button>
      )}
    </AnimatePresence>
  );
}
