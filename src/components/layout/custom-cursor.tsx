"use client";

import { m, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { FINE_POINTER, useMediaQuery } from "@/lib/use-media-query";

const INTERACTIVE = "a, button, [role='button'], input, textarea, select, label, summary";

/**
 * A soft ring that trails the pointer on mouse/trackpad devices.
 * The native cursor stays visible, so usability is unaffected.
 * Disabled on touch devices and when reduced motion is requested.
 */
export function CustomCursor() {
  const enabled = useMediaQuery(FINE_POINTER);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });

  useEffect(() => {
    if (!enabled) return;
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      setHovering(Boolean((e.target as Element | null)?.closest?.(INTERACTIVE)));
    };
    const leave = () => setVisible(false);
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <m.div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[70] rounded-full border border-accent/70 mix-blend-difference"
      style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%" }}
      animate={{
        width: hovering ? 44 : 22,
        height: hovering ? 44 : 22,
        opacity: visible ? 1 : 0,
        backgroundColor: hovering ? "rgba(94,225,249,0.12)" : "rgba(94,225,249,0)",
      }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    />
  );
}
