import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/reveal";

type SectionHeadingProps = {
  index: string;
  label: string;
  id: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({ index, label, id, title, intro, align = "left", className = "" }: SectionHeadingProps) {
  const centered = align === "center";
  return (
    <Reveal as="header" className={`mb-10 max-w-3xl sm:mb-12 ${centered ? "mx-auto text-center" : ""} ${className}`}>
      <p
        className={`mb-5 flex items-center gap-3 font-mono text-xs tracking-[0.18em] text-fg-subtle uppercase ${centered ? "justify-center" : ""}`}
      >
        <span className="text-accent">{index}</span>
        <span className="h-px w-8 bg-line-strong" aria-hidden="true" />
        {label}
      </p>
      <h2 id={id} className="text-4xl leading-[1.05] font-semibold tracking-[-0.035em] text-balance sm:text-5xl lg:text-6xl">
        {title}
      </h2>
      {intro && <p className="mt-6 text-lg leading-relaxed text-pretty text-fg-muted">{intro}</p>}
    </Reveal>
  );
}

/** Serif italic accent used inside headings. */
export function Accent({ children }: { children: ReactNode }) {
  return <em className="text-gradient pr-1 font-serif font-normal tracking-normal">{children}</em>;
}
