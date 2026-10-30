"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent, type ReactNode } from "react";
import { toggleTheme } from "@/components/layout/theme-toggle";
import { currentFocus, experience } from "@/data/experience";
import { projects, statusLabel } from "@/data/projects";
import { navItems, site } from "@/data/site";
import { skillCategories } from "@/data/skills";
import type { SocialLink } from "@/types";

type Entry = { id: number; cmd?: string; out: ReactNode };

type ShellProps = {
  resumeHref: string | null;
  socials: (SocialLink & { id: string })[];
};

const PROMPT = "visitor@pranav:~$";
const isPlaceholder = (v: string) => /^\[.*\]$/.test(v.trim());

const HELP: [string, string][] = [
  ["whoami", "who built this site"],
  ["about", "the short version"],
  ["skills", "the toolkit, by category"],
  ["projects", "list projects · open <n> to view one"],
  ["experience", "where I'm shipping code"],
  ["contact", "jump to the contact form"],
  ["goto <section>", "scroll to any section"],
  ["theme", "toggle light / dark"],
  ["clear", "clear the screen"],
];

const SUGGESTIONS = ["help", "skills", "projects", "contact"];

const Accent = ({ children }: { children: ReactNode }) => <span className="text-accent">{children}</span>;
const Muted = ({ children }: { children: ReactNode }) => <span className="text-fg-subtle">{children}</span>;

export function Shell({ resumeHref, socials }: ShellProps) {
  const router = useRouter();
  const [entries, setEntries] = useState<Entry[]>(() => [
    {
      id: 0,
      out: (
        <>
          Welcome to <Accent>pranav.sh</Accent> — an interactive way to explore this site.
          <br />
          Type <Accent>help</Accent> to see what you can do, or tap a suggestion below.
        </>
      ),
    },
  ]);
  const [value, setValue] = useState("");
  const history = useRef<string[]>([]);
  const cursor = useRef(-1);
  const nextId = useRef(1);
  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const inputId = useId();

  // Keep the newest output in view without moving the page.
  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [entries]);

  const commands = ["help", "whoami", "about", "skills", "projects", "open", "experience", "contact", "goto", "theme", "clear", "socials", "resume", "sudo", "date", "echo", "ls"];

  function respond(raw: string): ReactNode | "clear" {
    const [name = "", ...args] = raw.trim().split(/\s+/);
    const arg = args.join(" ");

    switch (name.toLowerCase()) {
      case "":
        return null;
      case "help":
        return (
          <div className="grid gap-x-6 gap-y-1 sm:grid-cols-[auto_1fr]">
            {HELP.map(([cmd, desc]) => (
              <div key={cmd} className="contents">
                <Accent>{cmd}</Accent>
                <Muted>{desc}</Muted>
              </div>
            ))}
          </div>
        );
      case "whoami":
        return (
          <>
            {site.name} <Muted>— {site.title} · {site.location}</Muted>
          </>
        );
      case "about":
        return site.tagline;
      case "skills":
        return (
          <div className="space-y-1.5">
            {skillCategories.map((c) => (
              <p key={c.id}>
                <Accent>{c.title.padEnd(22, " ")}</Accent>
                <Muted>{c.items.join(" · ")}</Muted>
              </p>
            ))}
          </div>
        );
      case "projects":
      case "ls":
        return (
          <div className="space-y-1">
            {projects.map((p, n) => (
              <p key={p.slug}>
                <Accent>[{n + 1}]</Accent> {p.title} <Muted>— {statusLabel[p.status].toLowerCase()}</Muted>
              </p>
            ))}
            <p className="pt-1">
              <Muted>Run </Muted>
              <Accent>open 1</Accent>
              <Muted> to read about a project.</Muted>
            </p>
          </div>
        );
      case "open": {
        const project = projects[Number(arg) - 1] ?? projects.find((p) => p.slug === arg);
        if (!project) return <>Usage: <Accent>open &lt;1-{projects.length}&gt;</Accent></>;
        router.push(`/projects/${project.slug}`);
        return <>Opening {project.title}…</>;
      }
      case "experience":
        return (
          <div className="space-y-1">
            {experience.map((job) => (
              <p key={job.id}>
                <Accent>{job.role}</Accent>
                {!isPlaceholder(job.company) && <> @ {job.company}</>} <Muted>— {job.summary}</Muted>
              </p>
            ))}
            <p>
              <Accent>Next</Accent> <Muted>— {currentFocus.title.toLowerCase()}</Muted>
            </p>
          </div>
        );
      case "contact":
      case "hire":
        router.push("/#contact");
        return <>Taking you to the contact form — looking forward to hearing from you.</>;
      case "goto":
      case "cd": {
        const target = navItems.find((n) => n.id === arg.toLowerCase() || n.label.toLowerCase() === arg.toLowerCase());
        if (!target) return <>Sections: <Accent>{navItems.map((n) => n.id).join("  ")}</Accent></>;
        router.push(`/#${target.id}`);
        return <>Scrolling to {target.label}…</>;
      }
      case "theme":
        toggleTheme();
        return <>Theme switched.</>;
      case "clear":
        return "clear";
      case "socials":
        return socials.length ? (
          <div className="space-y-1">
            {socials.map((s) => (
              <p key={s.id}>
                <Accent>{s.label}</Accent>{" "}
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-fg">
                  {s.href}
                </a>
              </p>
            ))}
          </div>
        ) : (
          <>No public profiles listed yet — <Accent>contact</Accent> is the best way to reach me.</>
        );
      case "resume":
        if (!resumeHref) return <>The résumé isn&apos;t online yet — ask for it via <Accent>contact</Accent>.</>;
        window.open(resumeHref, "_blank", "noopener");
        return <>Opening résumé…</>;
      case "sudo":
        return <>Nice try. Permission denied — but you can still <Accent>contact</Accent> me.</>;
      case "date":
        return new Date().toString();
      case "echo":
        return arg;
      default:
        return (
          <>
            command not found: {name}. Try <Accent>help</Accent>.
          </>
        );
    }
  }

  function execute(raw: string) {
    const out = respond(raw);
    if (raw.trim()) {
      history.current.push(raw);
      cursor.current = -1;
    }
    if (out === "clear") {
      setEntries([]);
    } else {
      setEntries((prev) => [...prev.slice(-30), { id: nextId.current++, cmd: raw, out }]);
    }
    setValue("");
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    execute(value);
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    const past = history.current;
    if (e.key === "ArrowUp" && past.length) {
      e.preventDefault();
      cursor.current = cursor.current === -1 ? past.length - 1 : Math.max(0, cursor.current - 1);
      setValue(past[cursor.current]);
    } else if (e.key === "ArrowDown" && cursor.current !== -1) {
      e.preventDefault();
      cursor.current = cursor.current + 1 >= past.length ? -1 : cursor.current + 1;
      setValue(cursor.current === -1 ? "" : past[cursor.current]);
    } else if (e.key === "Tab" && value.trim() && !value.includes(" ")) {
      const match = commands.find((c) => c.startsWith(value.trim().toLowerCase()));
      if (match) {
        e.preventDefault();
        setValue(`${match} `);
      }
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setEntries([]);
    }
  }

  return (
    <div className="glass overflow-hidden rounded-2xl bg-bg-elevated/85! font-mono text-[13px] leading-relaxed shadow-card">
      <div className="flex items-center gap-1.5 border-b border-line px-4 py-3">
        <span className="size-3 rounded-full bg-[#ff5f57]/80" aria-hidden="true" />
        <span className="size-3 rounded-full bg-[#febc2e]/80" aria-hidden="true" />
        <span className="size-3 rounded-full bg-[#28c840]/80" aria-hidden="true" />
        <span className="ml-3 text-xs text-fg-subtle">pranav.sh — interactive</span>
      </div>

      {/* Clicking anywhere in the body focuses the prompt, like a real terminal. */}
      <div
        ref={logRef}
        role="log"
        aria-live="polite"
        aria-label="Terminal output"
        onClick={() => window.getSelection()?.isCollapsed && inputRef.current?.focus({ preventScroll: true })}
        className="h-[18rem] cursor-text space-y-3 overflow-y-auto px-4 py-4 sm:h-[20rem] sm:px-5"
      >
        {entries.map((entry) => (
          <div key={entry.id}>
            {entry.cmd !== undefined && (
              <p>
                <span className="text-accent-3">{PROMPT}</span> <span className="text-fg">{entry.cmd}</span>
              </p>
            )}
            {entry.out && <div className="mt-1 break-words whitespace-pre-wrap text-fg-muted">{entry.out}</div>}
          </div>
        ))}

        <form onSubmit={onSubmit} className="flex items-center gap-2">
          <label htmlFor={inputId} className="shrink-0 text-accent-3">
            <span aria-hidden="true">{PROMPT}</span>
            <span className="sr-only">Type a command</span>
          </label>
          <input
            ref={inputRef}
            id={inputId}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="send"
            className="min-w-0 flex-1 bg-transparent text-base text-fg caret-accent outline-none! sm:text-[13px]"
          />
        </form>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-line px-4 py-3">
        <span className="mr-1 text-[11px] text-fg-subtle">Try:</span>
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => execute(s)}
            className="min-h-9 rounded-full border border-line px-3 text-xs text-fg-muted transition-colors hover:border-accent/60 hover:text-accent"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
