"use client";

import { m, useMotionValue, useSpring } from "motion/react";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { FINE_POINTER, useMediaQuery } from "@/lib/use-media-query";

const INTERACTIVE = "a, button, [role='button'], [role='option'], select, label, summary";
const TEXT_FIELD = "input, textarea, [contenteditable='true']";

type Mode = "idle" | "lock" | "text";
type Pulse = { id: number; x: number; y: number };

/** Gold segmented ring with four inward ticks, drawn in a 40×40 box. */
function Reticle() {
  return (
    <svg viewBox="0 0 40 40" className="size-full overflow-visible" fill="none">
      <circle cx="20" cy="20" r="15" strokeWidth="1.5" strokeDasharray="17.5 6" className="stroke-current" />
      <path d="M20 1v6M20 33v6M1 20h6M33 20h6" strokeWidth="1.5" strokeLinecap="round" className="stroke-current" />
    </svg>
  );
}

/**
 * HUD targeting cursor for mouse/trackpad users: a reactor dot that tracks the
 * pointer exactly, a trailing reticle that locks on to interactive elements,
 * and a repulsor pulse on click. Text fields keep the native I-beam.
 * Touch devices and reduced-motion users get the normal cursor.
 */
export function CustomCursor() {
  const enabled = useMediaQuery(FINE_POINTER);
  const [mode, setMode] = useState<Mode>("idle");
  const [visible, setVisible] = useState(false);
  const [pulses, setPulses] = useState<Pulse[]>([]);
  const nextPulse = useRef(0);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 380, damping: 32, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 380, damping: 32, mass: 0.5 });

  useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      // The native cursor is hidden only once the reticle is on screen.
      root.classList.add("hud-cursor");
      const target = e.target as Element | null;
      setMode(target?.closest?.(TEXT_FIELD) ? "text" : target?.closest?.(INTERACTIVE) ? "lock" : "idle");
    };
    const leave = () => {
      setVisible(false);
      root.classList.remove("hud-cursor");
    };
    const down = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
      const id = nextPulse.current++;
      setPulses((prev) => [...prev.slice(-3), { id, x: e.clientX, y: e.clientY }]);
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down, { passive: true });
    root.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      root.removeEventListener("pointerleave", leave);
      root.classList.remove("hud-cursor");
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const lock = mode === "lock";
  const text = mode === "text";

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[70]">
      {/* Trailing reticle */}
      <m.div className="absolute top-0 left-0" style={{ x: sx, y: sy }}>
        <m.div
          className={`-translate-x-1/2 -translate-y-1/2 transition-colors duration-200 ${lock ? "text-accent-2" : "text-accent"}`}
          animate={{
            width: lock ? 46 : 34,
            height: lock ? 46 : 34,
            rotate: lock ? 45 : 0,
            opacity: visible && !text ? (lock ? 1 : 0.8) : 0,
          }}
          transition={{ type: "spring", stiffness: 320, damping: 24 }}
        >
          <div className={`size-full ${lock ? "" : "orbit-spin"}`} style={{ "--dur": "10s" } as CSSProperties}>
            <Reticle />
          </div>
        </m.div>
        <m.span
          className="absolute top-4 left-6 font-mono text-[9px] tracking-[0.2em] text-accent-2"
          animate={{ opacity: visible && lock ? 1 : 0, x: lock ? 0 : -4 }}
          transition={{ duration: 0.18 }}
        >
          LOCK
        </m.span>
      </m.div>

      {/* Reactor dot: no spring, so it sits exactly where clicks land */}
      <m.div className="absolute top-0 left-0" style={{ x, y }}>
        <m.div
          className="size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-3 shadow-[0_0_10px_2px_var(--accent-3)]"
          animate={{ opacity: visible && !text ? 1 : 0, scale: lock ? 1.4 : 1 }}
          transition={{ duration: 0.15 }}
        />
      </m.div>

      {/* Repulsor pulse on click */}
      {pulses.map((p) => (
        <m.span
          key={p.id}
          className="absolute size-10 rounded-full border-2 border-accent-3 shadow-[0_0_18px_var(--accent-3)]"
          style={{ left: p.x - 20, top: p.y - 20 }}
          initial={{ scale: 0.2, opacity: 0.9 }}
          animate={{ scale: 2.2, opacity: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          onAnimationComplete={() => setPulses((prev) => prev.filter((q) => q.id !== p.id))}
        />
      ))}
    </div>
  );
}
