"use client";

import { useSyncExternalStore } from "react";

const format = new Intl.DateTimeFormat("en-IN", {
  timeZone: "Asia/Kolkata",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

function subscribe(onChange: () => void) {
  const id = window.setInterval(onChange, 15_000);
  return () => window.clearInterval(id);
}

/** Current time in Pune, ticking each minute. Renders a placeholder on the server. */
export function LocalTime() {
  const time = useSyncExternalStore(subscribe, () => format.format(new Date()), () => null);
  return (
    <p className="flex items-center gap-2">
      <span className="relative flex size-1.5" aria-hidden="true">
        <span className="status-ping absolute inset-0 rounded-full bg-accent-3/70" />
        <span className="relative size-1.5 rounded-full bg-accent-3" />
      </span>
      Pune · <time>{time ?? "--:--"}</time> IST
    </p>
  );
}
