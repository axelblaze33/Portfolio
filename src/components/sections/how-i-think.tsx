"use client";

import { AnimatePresence, m } from "motion/react";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import { thinkingSteps } from "@/data/experience";

/** Tabbed "How I Think" walkthrough with full keyboard support. */
export function HowIThink() {
  const [index, setIndex] = useState(0);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();
  const step = thinkingSteps[index];

  function onKeyDown(e: KeyboardEvent) {
    const last = thinkingSteps.length - 1;
    const next =
      e.key === "ArrowRight" ? (index === last ? 0 : index + 1)
      : e.key === "ArrowLeft" ? (index === 0 ? last : index - 1)
      : e.key === "Home" ? 0
      : e.key === "End" ? last
      : null;
    if (next === null) return;
    e.preventDefault();
    setIndex(next);
    tabsRef.current[next]?.focus();
  }

  return (
    <div className="glass rounded-2xl p-5 sm:p-6">
      <p className="mb-4 font-mono text-xs tracking-[0.18em] text-fg-subtle uppercase">How I think</p>
      <div role="tablist" aria-label="How I approach work" className="grid grid-cols-4 gap-1 rounded-full border border-line p-1" onKeyDown={onKeyDown}>
        {thinkingSteps.map((s, n) => {
          const selected = n === index;
          return (
            <button
              key={s.id}
              ref={(el) => {
                tabsRef.current[n] = el;
              }}
              role="tab"
              id={`${baseId}-tab-${s.id}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setIndex(n)}
              className={`relative rounded-full px-2 py-2 text-[11px] font-medium transition-colors sm:text-xs ${selected ? "text-bg" : "text-fg-muted hover:text-fg"}`}
            >
              {selected && (
                <m.span
                  layoutId={`${baseId}-pill`}
                  className="absolute inset-0 rounded-full bg-fg"
                  transition={{ type: "spring", stiffness: 400, damping: 34 }}
                />
              )}
              <span className="relative">{s.label}</span>
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`${baseId}-panel`}
        aria-labelledby={`${baseId}-tab-${step.id}`}
        className="relative mt-5 min-h-[9.5rem]"
      >
        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={step.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <p className="font-mono text-xs text-accent">
              0{index + 1} <span className="text-fg-subtle">/ 0{thinkingSteps.length}</span>
            </p>
            <h3 className="mt-2 text-xl font-semibold tracking-tight">{step.title}</h3>
            <p className="mt-2 leading-relaxed text-fg-muted">{step.body}</p>
            <code className="mt-4 inline-block rounded-md border border-line bg-bg/50 px-2.5 py-1 font-mono text-xs text-accent-3">
              {step.snippet}
            </code>
          </m.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
