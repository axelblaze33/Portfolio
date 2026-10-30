"use client";

import { MapPin } from "lucide-react";
import { m, useScroll, useSpring } from "motion/react";
import { useRef } from "react";
import { Reveal } from "@/components/ui/reveal";
import { PlaceholderText } from "@/components/ui/placeholder-text";
import { currentFocus, experience } from "@/data/experience";

function Chips({ items }: { items: string[] }) {
  return (
    <ul className="mt-5 flex flex-wrap gap-2" aria-label="Technologies">
      {items.map((t) => (
        <li key={t} className="rounded-md border border-line bg-bg/40 px-2 py-1 font-mono text-[11px] text-fg-muted">
          {t}
        </li>
      ))}
    </ul>
  );
}

function Node({ active = false }: { active?: boolean }) {
  return (
    <span aria-hidden="true" className="absolute top-2 -left-[calc(1.5rem+5px)] flex size-[11px] items-center justify-center sm:-left-[calc(2.5rem+5px)]">
      <span className={`size-[11px] rounded-full border-2 ${active ? "border-accent bg-accent/30" : "border-line-strong bg-bg"}`} />
    </span>
  );
}

export function Timeline() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 28 });

  return (
    <ol ref={ref} className="relative ml-1.5 border-l border-line pl-6 sm:pl-10">
      <m.span
        aria-hidden="true"
        className="absolute top-0 -left-px h-full w-px origin-top bg-gradient-to-b from-accent via-accent-2 to-transparent"
        style={{ scaleY }}
      />

      <li className="relative pb-14">
        <Node active />
        <Reveal>
          <p className="font-mono text-xs tracking-[0.15em] text-accent uppercase">{currentFocus.label}</p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight">{currentFocus.title}</h3>
          <p className="mt-3 max-w-2xl leading-relaxed text-fg-muted">{currentFocus.description}</p>
          <Chips items={currentFocus.technologies} />
        </Reveal>
      </li>

      {experience.map((job) => (
        <li key={job.id} className="relative pb-6">
          <Node />
          <Reveal>
            <article className="glass rounded-2xl p-6 sm:p-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-2xl font-semibold tracking-tight">{job.role}</h3>
                  <p className="mt-1 text-lg text-fg-muted">
                    <PlaceholderText value={job.company} />
                  </p>
                </div>
                <div className="shrink-0 font-mono text-xs text-fg-subtle sm:text-right">
                  <p>
                    <PlaceholderText value={job.period} />
                  </p>
                  <p className="mt-1 inline-flex items-center gap-1">
                    <MapPin className="size-3" aria-hidden="true" />
                    {job.location}
                  </p>
                </div>
              </div>

              <p className="mt-5 leading-relaxed text-fg">{job.summary}</p>

              <div className="mt-6 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
                <div>
                  <h4 className="font-mono text-[11px] tracking-[0.15em] text-fg-subtle uppercase">Responsibilities</h4>
                  <ul className="mt-3 space-y-2.5">
                    {job.responsibilities.map((r) => (
                      <li key={r} className="flex gap-3 leading-relaxed text-fg-muted">
                        <span aria-hidden="true" className="mt-[0.6em] size-1.5 shrink-0 rounded-full bg-accent" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-mono text-[11px] tracking-[0.15em] text-fg-subtle uppercase">Notable work</h4>
                  <ul className="mt-3 space-y-2.5">
                    {job.accomplishments.map((a) => (
                      <li key={a} className="flex gap-3 leading-relaxed text-fg-muted">
                        <span aria-hidden="true" className="mt-[0.6em] size-1.5 shrink-0 rounded-full bg-accent-2" />
                        <span>
                          <PlaceholderText value={a} />
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Chips items={job.technologies} />
                </div>
              </div>
            </article>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
