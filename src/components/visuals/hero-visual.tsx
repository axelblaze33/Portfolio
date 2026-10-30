"use client";

import { m, useMotionValue, useSpring, useTransform, type MotionValue } from "motion/react";
import { useEffect, type CSSProperties, type ReactNode } from "react";
import { Terminal } from "@/components/visuals/terminal";
import { FINE_POINTER, useMediaQuery } from "@/lib/use-media-query";

const ORBIT_NODES = [
  { label: "Angular", ring: 0, angle: 20 },
  { label: "TypeScript", ring: 0, angle: 200 },
  { label: "SQL", ring: 1, angle: 110 },
  { label: "REST", ring: 1, angle: 290 },
  { label: "FastAPI", ring: 2, angle: 60 },
  { label: "RAG", ring: 2, angle: 240 },
];

const RINGS = [
  { size: "46%", dur: "48s", reverse: false },
  { size: "70%", dur: "72s", reverse: true },
  { size: "94%", dur: "96s", reverse: false },
];

function Depth({
  px,
  py,
  depth,
  className,
  children,
}: {
  px: MotionValue<number>;
  py: MotionValue<number>;
  depth: number;
  className?: string;
  children: ReactNode;
}) {
  const x = useTransform(px, (v) => v * depth);
  const y = useTransform(py, (v) => v * depth);
  return (
    <m.div className={className} style={{ x, y }}>
      {children}
    </m.div>
  );
}

function CodeChip({ children, className = "", delay = "0s" }: { children: ReactNode; className?: string; delay?: string }) {
  return (
    <div
      className={`float-y glass rounded-lg px-3 py-2 font-mono text-[11px] leading-snug whitespace-nowrap shadow-card ${className}`}
      style={{ "--d": delay } as CSSProperties}
    >
      {children}
    </div>
  );
}

export function HeroVisual() {
  const interactive = useMediaQuery(FINE_POINTER);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const px = useSpring(rawX, { stiffness: 60, damping: 18 });
  const py = useSpring(rawY, { stiffness: 60, damping: 18 });

  useEffect(() => {
    if (!interactive) return;
    function onMove(e: PointerEvent) {
      rawX.set((e.clientX / window.innerWidth - 0.5) * 2);
      rawY.set((e.clientY / window.innerHeight - 0.5) * 2);
    }
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [interactive, rawX, rawY]);

  return (
    <div aria-hidden="true" className="relative mx-auto aspect-square w-[90%] max-w-[34rem] select-none sm:w-full">
      {/* Tilted ground plane for depth */}
      <div className="absolute inset-[8%] [perspective:900px]">
        <div
          className="absolute inset-0 rounded-full border border-line"
          style={{
            transform: "rotateX(72deg)",
            background: "radial-gradient(circle, color-mix(in oklab, var(--accent) 10%, transparent), transparent 60%)",
          }}
        />
      </div>

      {/* Orbit rings with upright tech nodes */}
      <Depth px={px} py={py} depth={-10} className="absolute inset-0">
        {RINGS.map((ring, r) => (
          <div
            key={r}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ width: ring.size, height: ring.size }}
          >
            <div
              className={`${ring.reverse ? "orbit-spin-reverse" : "orbit-spin"} absolute inset-0 rounded-full border border-dashed border-line-strong`}
              style={{ "--dur": ring.dur } as CSSProperties}
            >
              {ORBIT_NODES.filter((n) => n.ring === r).map((node) => (
                // Rotate a ring-sized box, pin the chip to its top edge, then undo
                // both the static angle and the ring's spin so labels stay upright.
                <div key={node.label} className="absolute inset-0" style={{ transform: `rotate(${node.angle}deg)` }}>
                  <div
                    className="absolute top-0 left-1/2"
                    style={{ transform: `translate(-50%, -50%) rotate(${-node.angle}deg)` }}
                  >
                    <span
                      className={`${ring.reverse ? "orbit-spin" : "orbit-spin-reverse"} glass block rounded-full px-2.5 py-1 font-mono text-[10.5px] whitespace-nowrap text-fg sm:text-[11px]`}
                      style={{ "--dur": ring.dur } as CSSProperties}
                    >
                      <span className="mr-1.5 inline-block size-1.5 rounded-full bg-accent align-middle" />
                      {node.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </Depth>

      {/* Core */}
      <Depth px={px} py={py} depth={6} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative grid size-24 place-items-center sm:size-28">
          <div className="absolute inset-0 rounded-[28px] bg-gradient-to-br from-accent/40 to-accent-2/40 blur-2xl" />
          <div className="glass relative grid size-full place-items-center rounded-[28px]">
            <span className="text-gradient font-serif text-5xl italic sm:text-6xl">PM</span>
          </div>
        </div>
      </Depth>

      {/* Floating code fragments */}
      <Depth px={px} py={py} depth={18} className="absolute top-[6%] left-0 sm:-left-[4%]">
        <CodeChip>
          <span className="text-accent-2">@Component</span>
          <span className="text-fg-muted">({"{"}</span>
          <br />
          <span className="pl-3 text-fg-muted">selector: </span>
          <span className="text-accent-3">&apos;app-impact&apos;</span>
          <br />
          <span className="text-fg-muted">{"})"}</span>
        </CodeChip>
      </Depth>
      <Depth px={px} py={py} depth={26} className="absolute top-[14%] right-0 hidden sm:block">
        <CodeChip delay="-2.5s">
          <span className="text-accent">SELECT</span> insight <span className="text-accent">FROM</span> data;
        </CodeChip>
      </Depth>
      <Depth px={px} py={py} depth={14} className="absolute right-[2%] bottom-[30%] hidden md:block">
        <CodeChip delay="-4s">
          <span className="text-accent-3">GET</span> /api/solutions <span className="text-accent">200</span>
        </CodeChip>
      </Depth>

      {/* Terminal */}
      <Depth px={px} py={py} depth={10} className="absolute bottom-0 left-[4%] w-[78%] sm:left-[2%] sm:w-[64%]">
        <Terminal />
      </Depth>
    </div>
  );
}
