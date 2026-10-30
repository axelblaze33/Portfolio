"use client";

import type { ComponentProps, PointerEvent } from "react";

/** Tracks the pointer and exposes it as --mx / --my for the .spotlight glow. */
export function Spotlight({ className = "", onPointerMove, ...props }: ComponentProps<"div">) {
  function handleMove(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--my", `${event.clientY - rect.top}px`);
    onPointerMove?.(event);
  }
  return <div className={`spotlight ${className}`} onPointerMove={handleMove} {...props} />;
}
