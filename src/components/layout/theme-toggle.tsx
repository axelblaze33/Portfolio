"use client";

import { Moon, Sun } from "lucide-react";
import { useLayoutEffect } from "react";

export const THEME_KEY = "theme";

/** Runs in <head> before first paint so the saved theme never flashes. */
export const themeScript = `(function(){try{var t=localStorage.getItem("${THEME_KEY}");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;

function readTheme() {
  try {
    const t = localStorage.getItem(THEME_KEY);
    if (t === "light" || t === "dark") return t;
  } catch {}
  return null;
}

/** Flips between light and dark and remembers the choice. */
export function toggleTheme() {
  const root = document.documentElement;
  const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
  root.setAttribute("data-theme", next);
  try {
    localStorage.setItem(THEME_KEY, next);
  } catch {}
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  // React's dev-mode remount resets <html> attributes; re-apply the saved theme.
  useLayoutEffect(() => {
    const saved = readTheme();
    if (saved) document.documentElement.setAttribute("data-theme", saved);
  }, []);

  // Icons swap via CSS on [data-theme], so server and client markup always match.
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle colour theme"
      title="Toggle colour theme"
      className={`inline-flex size-10 items-center justify-center rounded-full border border-line text-fg-muted transition-colors hover:border-line-strong hover:text-fg ${className}`}
    >
      <Sun className="theme-icon-light size-[18px]" aria-hidden="true" />
      <Moon className="theme-icon-dark size-[18px]" aria-hidden="true" />
    </button>
  );
}
