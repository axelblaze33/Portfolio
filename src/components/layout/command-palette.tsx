"use client";

import {
  ArrowUpRight,
  CornerDownLeft,
  Download,
  FolderGit2,
  Hash,
  Link2,
  Search,
  SunMoon,
  type LucideIcon,
} from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState, useSyncExternalStore, type KeyboardEvent } from "react";
import { toggleTheme } from "@/components/layout/theme-toggle";
import { projects } from "@/data/projects";
import { navItems } from "@/data/site";
import type { SocialLink } from "@/types";

/** Dispatch this on window to open the palette from anywhere (e.g. the navbar button). */
export const OPEN_PALETTE_EVENT = "open-command-palette";

type Command = {
  id: string;
  group: "Navigate" | "Projects" | "Actions" | "Elsewhere";
  label: string;
  hint?: string;
  icon: LucideIcon;
  keywords?: string;
  run: () => void;
};

type CommandPaletteProps = {
  resumeHref: string | null;
  socials: (SocialLink & { id: string })[];
};

export function CommandPalette(props: CommandPaletteProps) {
  const [open, setOpen] = useState(false);

  // Global shortcut (⌘K / Ctrl+K) and the custom open event.
  useEffect(() => {
    function onKey(e: globalThis.KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    }
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_PALETTE_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_PALETTE_EVENT, onOpen);
    };
  }, []);

  // The dialog remounts on every open, so its query and selection start fresh.
  return <AnimatePresence>{open && <PaletteDialog {...props} onClose={() => setOpen(false)} />}</AnimatePresence>;
}

function PaletteDialog({ resumeHref, socials, onClose }: CommandPaletteProps & { onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listId = useId();

  const commands = useMemo<Command[]>(() => {
    const go = (href: string) => () => router.push(href);
    const list: Command[] = [
      ...navItems.map((item) => ({
        id: `nav-${item.id}`,
        group: "Navigate" as const,
        label: item.label,
        hint: "Section",
        icon: Hash,
        run: go(`/#${item.id}`),
      })),
      ...projects.map((p) => ({
        id: `project-${p.slug}`,
        group: "Projects" as const,
        label: p.title,
        hint: p.category,
        icon: FolderGit2,
        keywords: p.stack.join(" "),
        run: go(`/projects/${p.slug}`),
      })),
      {
        id: "theme",
        group: "Actions",
        label: "Toggle light / dark theme",
        icon: SunMoon,
        keywords: "mode colour color appearance",
        run: toggleTheme,
      },
      {
        id: "copy-link",
        group: "Actions",
        label: "Copy link to this page",
        icon: Link2,
        keywords: "share url clipboard",
        run: () => {
          navigator.clipboard?.writeText(window.location.href).then(() => {
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1800);
          });
        },
      },
    ];
    if (resumeHref) {
      list.push({
        id: "resume",
        group: "Actions",
        label: "Download résumé",
        icon: Download,
        keywords: "cv resume pdf",
        run: () => window.open(resumeHref, "_blank", "noopener"),
      });
    }
    for (const s of socials) {
      list.push({
        id: `social-${s.id}`,
        group: "Elsewhere",
        label: s.label,
        hint: "Opens in a new tab",
        icon: ArrowUpRight,
        run: () => window.open(s.href, "_blank", "noopener,noreferrer"),
      });
    }
    return list;
  }, [router, resumeHref, socials]);

  const results = useMemo(() => {
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) return commands;
    return commands.filter((c) => {
      const haystack = `${c.label} ${c.hint ?? ""} ${c.group} ${c.keywords ?? ""}`.toLowerCase();
      return terms.every((t) => haystack.includes(t));
    });
  }, [commands, query]);

  // Lock scroll while open and hand focus back to where it came from on close.
  useEffect(() => {
    const restoreFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    inputRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      restoreFocus?.focus?.();
    };
  }, []);

  // Keep the highlighted option in view.
  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active]);

  function select(command: Command | undefined) {
    if (!command) return;
    command.run();
    // Keep the dialog up briefly so "Copied" is visible.
    if (command.id !== "copy-link") onClose();
  }

  function onInputKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (results.length ? (i + 1) % results.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (results.length ? (i - 1 + results.length) % results.length : 0));
    } else if (e.key === "Home") {
      e.preventDefault();
      setActive(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setActive(Math.max(results.length - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      select(results[active]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "Tab") {
      // The input is the only focus stop; keep focus inside the dialog.
      e.preventDefault();
    }
  }

  const optionId = (n: number) => `${listId}-option-${n}`;
  let lastGroup: Command["group"] | null = null;

  return (
        <m.div
          className="fixed inset-0 z-[90] flex items-start justify-center px-4 pt-[12vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <div className="absolute inset-0 bg-bg/60 backdrop-blur-sm" aria-hidden="true" onClick={() => onClose()} />

          <m.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            className="glass relative w-full max-w-xl overflow-hidden rounded-2xl bg-bg-elevated/90 shadow-card"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-3 border-b border-line px-4">
              <Search className="size-4 shrink-0 text-fg-subtle" aria-hidden="true" />
              <input
                ref={inputRef}
                type="text"
                role="combobox"
                aria-expanded="true"
                aria-controls={listId}
                aria-activedescendant={results.length ? optionId(active) : undefined}
                aria-autocomplete="list"
                aria-label="Search sections, projects and actions"
                placeholder="Jump to a section, project or action…"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
                onKeyDown={onInputKey}
                autoComplete="off"
                spellCheck={false}
                className="h-14 w-full bg-transparent text-base sm:text-[15px] text-fg outline-none placeholder:text-fg-subtle outline-none!"
              />
              <kbd className="hidden rounded-md border border-line px-1.5 py-0.5 font-mono text-[10px] text-fg-subtle sm:block">
                Esc
              </kbd>
            </div>

            <ul ref={listRef} id={listId} role="listbox" aria-label="Results" className="max-h-[min(60vh,24rem)] overflow-y-auto p-2">
              {results.length === 0 && (
                <li className="px-3 py-10 text-center text-sm text-fg-muted" role="presentation">
                  No matches for “{query}”.
                </li>
              )}
              {results.map((c, n) => {
                const showGroup = c.group !== lastGroup;
                lastGroup = c.group;
                const Icon = c.icon;
                const selected = n === active;
                return (
                  <li key={c.id} role="presentation">
                    {showGroup && (
                      <p className="px-3 pt-3 pb-1.5 font-mono text-[10px] tracking-[0.18em] text-fg-subtle uppercase" aria-hidden="true">
                        {c.group}
                      </p>
                    )}
                    <div
                      id={optionId(n)}
                      role="option"
                      aria-selected={selected}
                      data-index={n}
                      onPointerMove={() => setActive(n)}
                      onClick={() => select(c)}
                      className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                        selected ? "bg-surface-strong text-fg" : "text-fg-muted"
                      }`}
                    >
                      <Icon className={`size-4 shrink-0 ${selected ? "text-accent" : "text-fg-subtle"}`} aria-hidden="true" />
                      <span className="min-w-0 flex-1 truncate">
                        {c.id === "copy-link" && copied ? "Copied to clipboard ✓" : c.label}
                      </span>
                      {c.hint && <span className="hidden shrink-0 font-mono text-[11px] text-fg-subtle sm:inline">{c.hint}</span>}
                      {selected && <CornerDownLeft className="size-3.5 shrink-0 text-fg-subtle" aria-hidden="true" />}
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center justify-between gap-4 border-t border-line px-4 py-2.5 font-mono text-[10px] text-fg-subtle">
              <span className="flex items-center gap-3">
                <span>↑↓ navigate</span>
                <span>↵ select</span>
              </span>
              <span aria-live="polite">
                {results.length} result{results.length === 1 ? "" : "s"}
              </span>
            </div>
          </m.div>
        </m.div>
  );
}

const noopSubscribe = () => () => {};

/** Small trigger button for the navbar. */
export function CommandPaletteTrigger() {
  const isMac = useSyncExternalStore(
    noopSubscribe,
    () => /Mac|iPhone|iPad/.test(navigator.platform),
    () => false,
  );

  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_PALETTE_EVENT))}
      aria-label="Open command palette"
      aria-keyshortcuts={isMac ? "Meta+K" : "Control+K"}
      className="hidden h-10 items-center gap-2 rounded-full border border-line pr-2 pl-3 text-fg-muted transition-colors hover:border-line-strong hover:text-fg md:inline-flex"
    >
      <Search className="size-4" aria-hidden="true" />
      <kbd className="rounded-md border border-line bg-bg/40 px-1.5 py-0.5 font-mono text-[10px]">{isMac ? "⌘K" : "Ctrl K"}</kbd>
    </button>
  );
}
