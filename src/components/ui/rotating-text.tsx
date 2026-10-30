"use client";

import { AnimatePresence, m } from "motion/react";
import { useEffect, useState } from "react";

/** Cycles through words in place. Screen readers get the full list once instead. */
export function RotatingText({ items, interval = 2200 }: { items: readonly string[]; interval?: number }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % items.length), interval);
    return () => window.clearInterval(id);
  }, [items.length, interval]);

  return (
    <>
      <span className="sr-only">{items.join(", ")}</span>
      <span aria-hidden="true" className="relative inline-grid overflow-hidden align-bottom">
        <AnimatePresence mode="popLayout" initial={false}>
          <m.span
            key={items[index]}
            className="col-start-1 row-start-1 whitespace-nowrap text-accent"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            {items[index]}
          </m.span>
        </AnimatePresence>
      </span>
    </>
  );
}
