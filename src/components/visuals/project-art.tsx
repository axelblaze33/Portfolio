import type { Project } from "@/types";

/**
 * Original abstract artwork for projects without screenshots.
 * Deliberately schematic so it never reads as a real product capture.
 */
export function ProjectArt({ variant, className = "" }: { variant: Project["art"]; className?: string }) {
  return (
    <svg viewBox="0 0 400 250" className={className} role="img" aria-label="Abstract illustration" preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="250" fill="var(--bg-elevated)" />
      <g stroke="var(--grid)" strokeWidth="1">
        {Array.from({ length: 11 }, (_, i) => (
          <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2="250" />
        ))}
        {Array.from({ length: 7 }, (_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 40} x2="400" y2={i * 40} />
        ))}
      </g>
      {variant === "dashboard" && <Dashboard />}
      {variant === "reporting" && <Reporting />}
      {variant === "ai" && <Ai />}
    </svg>
  );
}

function Dashboard() {
  return (
    <g>
      <circle cx="330" cy="40" r="90" fill="var(--accent)" opacity="0.08" />
      <rect x="40" y="36" width="320" height="180" rx="12" fill="var(--surface-strong)" stroke="var(--line-strong)" />
      <rect x="40" y="36" width="70" height="180" rx="12" fill="var(--bg)" opacity="0.6" />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x="54" y={58 + i * 22} width={i === 1 ? 44 : 34} height="7" rx="3.5" fill={i === 1 ? "var(--accent)" : "var(--line-strong)"} />
      ))}
      <rect x="126" y="54" width="100" height="10" rx="5" fill="var(--fg)" opacity="0.7" />
      <rect x="296" y="52" width="48" height="16" rx="8" fill="var(--accent)" opacity="0.9" />
      {/* form fields */}
      {[0, 1].map((i) => (
        <rect key={i} x={126 + i * 112} y="80" width="104" height="22" rx="6" fill="none" stroke="var(--line-strong)" />
      ))}
      {/* table */}
      {[0, 1, 2, 3].map((r) => (
        <g key={r}>
          <rect x="126" y={116 + r * 23} width="218" height="18" rx="4" fill={r === 0 ? "var(--bg)" : "transparent"} stroke={r === 0 ? "none" : "var(--line)"} />
          <rect x="134" y={122 + r * 23} width="50" height="6" rx="3" fill="var(--fg-subtle)" opacity={r === 0 ? 0.9 : 0.5} />
          <rect x="204" y={122 + r * 23} width="40" height="6" rx="3" fill="var(--fg-subtle)" opacity="0.4" />
          <rect x="300" y={121 + r * 23} width="34" height="8" rx="4" fill={r === 2 ? "var(--accent-3)" : "var(--accent-2)"} opacity={r === 0 ? 0 : 0.6} />
        </g>
      ))}
    </g>
  );
}

function Reporting() {
  const bars = [62, 88, 54, 110, 96, 132, 118, 150];
  return (
    <g>
      <circle cx="70" cy="210" r="110" fill="var(--accent-2)" opacity="0.08" />
      <rect x="36" y="30" width="328" height="190" rx="12" fill="var(--surface-strong)" stroke="var(--line-strong)" />
      <rect x="56" y="50" width="90" height="10" rx="5" fill="var(--fg)" opacity="0.7" />
      <rect x="56" y="68" width="56" height="6" rx="3" fill="var(--fg-subtle)" opacity="0.5" />
      {bars.map((h, i) => (
        <rect
          key={i}
          x={64 + i * 30}
          y={200 - h * 0.75}
          width="16"
          height={h * 0.75}
          rx="4"
          fill={i === bars.length - 1 ? "var(--accent)" : "var(--accent-2)"}
          opacity={i === bars.length - 1 ? 0.95 : 0.35 + i * 0.06}
        />
      ))}
      <polyline
        points={bars.map((h, i) => `${72 + i * 30},${186 - h * 0.85}`).join(" ")}
        fill="none"
        stroke="var(--accent-3)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="290" y="48" width="56" height="30" rx="8" fill="var(--bg)" stroke="var(--line)" />
      <rect x="300" y="58" width="36" height="10" rx="5" fill="var(--accent)" opacity="0.8" />
    </g>
  );
}

function Ai() {
  const nodes = [
    [90, 70], [70, 150], [140, 190], [150, 110], [220, 60], [230, 150], [300, 100], [320, 180],
  ] as const;
  const edges = [[0, 3], [1, 3], [2, 3], [3, 4], [3, 5], [4, 6], [5, 6], [5, 7], [6, 7], [1, 2]];
  return (
    <g>
      <circle cx="200" cy="125" r="120" fill="var(--accent)" opacity="0.07" />
      {edges.map(([a, b], i) => (
        <line key={i} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} stroke="var(--line-strong)" strokeWidth="1.2" />
      ))}
      {nodes.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={i === 3 || i === 6 ? 11 : 7} fill="var(--surface-strong)" stroke={i === 3 ? "var(--accent)" : i === 6 ? "var(--accent-2)" : "var(--line-strong)"} strokeWidth="1.5" />
          {(i === 3 || i === 6) && <circle cx={x} cy={y} r="4" fill={i === 3 ? "var(--accent)" : "var(--accent-2)"} />}
        </g>
      ))}
      {/* query / answer bubbles */}
      <rect x="236" y="196" width="130" height="30" rx="15" fill="var(--surface-strong)" stroke="var(--line-strong)" />
      <rect x="252" y="208" width="70" height="6" rx="3" fill="var(--fg-subtle)" opacity="0.6" />
      <circle cx="346" cy="211" r="5" fill="var(--accent-3)" />
      <rect x="30" y="24" width="110" height="26" rx="13" fill="var(--surface-strong)" stroke="var(--line-strong)" />
      <rect x="44" y="34" width="60" height="6" rx="3" fill="var(--accent)" opacity="0.7" />
    </g>
  );
}
