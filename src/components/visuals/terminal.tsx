"use client";

import { useMediaQuery } from "@/lib/use-media-query";
import { useEffect, useState } from "react";

const SCRIPT = [
  { cmd: "whoami", out: "pranav.malshikhare" },
  { cmd: "cat role.txt", out: "Software Engineer · Angular Developer" },
  { cmd: "ls ./stack", out: "angular  typescript  sql  fastapi  rag" },
  { cmd: "echo $NEXT_GOAL", out: "full-stack engineer" },
];

type Line = { cmd: string; out?: string };

/** Decorative terminal that types out a short intro on a loop. */
export function Terminal() {
  // useSyncExternalStore-based, so hydration uses the server value (false) first.
  const reduce = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [lines, setLines] = useState<Line[]>([]);
  const [typing, setTyping] = useState("");

  useEffect(() => {
    if (reduce) return;
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const wait = (ms: number) => new Promise<void>((r) => timers.push(setTimeout(r, ms)));

    (async () => {
      await wait(1200);
      while (!cancelled) {
        for (let i = 0; i < SCRIPT.length && !cancelled; i++) {
          const { cmd, out } = SCRIPT[i];
          for (let c = 1; c <= cmd.length && !cancelled; c++) {
            setTyping(cmd.slice(0, c));
            await wait(55 + Math.random() * 40);
          }
          await wait(250);
          setTyping("");
          setLines((prev) => [...prev.slice(-2), { cmd, out }]);
          await wait(1100);
        }
        await wait(1600);
        setLines([]);
      }
    })();

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [reduce]);

  const shown: Line[] = reduce ? SCRIPT.slice(0, 3) : lines;

  return (
    <div className="glass overflow-hidden rounded-xl bg-bg-elevated/90! font-mono text-[11px] leading-relaxed shadow-card sm:text-xs">
      <div className="flex items-center gap-1.5 border-b border-line px-3 py-2">
        <span className="size-2.5 rounded-full bg-[#ff5f57]/80" />
        <span className="size-2.5 rounded-full bg-[#febc2e]/80" />
        <span className="size-2.5 rounded-full bg-[#28c840]/80" />
        <span className="ml-2 text-fg-subtle">~/pranav — zsh</span>
      </div>
      <div className="h-[7.5rem] space-y-1 overflow-hidden px-3.5 py-3">
        {shown.map((line, i) => (
          <div key={`${line.cmd}-${i}`}>
            <p className="text-fg">
              <span className="text-accent-3">➜</span> <span className="text-accent">~</span> {line.cmd}
            </p>
            {line.out && <p className="text-fg-muted">{line.out}</p>}
          </div>
        ))}
        {!reduce && (
          <p className="caret text-fg">
            <span className="text-accent-3">➜</span> <span className="text-accent">~</span> {typing}
          </p>
        )}
      </div>
    </div>
  );
}
