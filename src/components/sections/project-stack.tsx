"use client";

import { m, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { ProjectCard } from "@/components/sections/project-card";
import { Stagger, StaggerItem } from "@/components/ui/reveal";
import { projects } from "@/data/projects";
import { useMediaQuery } from "@/lib/use-media-query";
import type { Project } from "@/types";

// Stacking needs room for a whole card on screen; smaller viewports get the grid.
const STACK_QUERY = "(min-width: 64rem) and (min-height: 44rem) and (prefers-reduced-motion: no-preference)";

function StackCard({
  project,
  index,
  total,
  progress,
}: {
  project: Project;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const last = index === total - 1;
  // Each card shrinks and dims a little more for every card that lands on top of it.
  const scale = useTransform(progress, [index / total, 1], [1, 1 - (total - 1 - index) * 0.06]);
  const shade = useTransform(progress, [index / total, 1], [0, last ? 0 : 0.55]);
  const labelOpacity = useTransform(shade, [0, 0.2], [1, 0]);

  // Pins just below the navbar, each card a step lower so the ones beneath peek out.
  return (
    <div className="sticky pb-[22vh] last:pb-0" style={{ top: `${8 + index * 1.75}rem` }}>
      <m.div className="relative origin-top" style={{ scale }}>
        <m.p
          style={{ opacity: labelOpacity }}
          className="absolute -top-9 left-1 font-mono text-xs tracking-[0.18em] text-fg-subtle uppercase"
        >
          <span className="text-accent">{String(index + 1).padStart(2, "0")}</span> / {String(total).padStart(2, "0")}
        </m.p>
        <ProjectCard project={project} featured />
        <m.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-2xl bg-bg"
          style={{ opacity: shade }}
        />
      </m.div>
    </div>
  );
}

function Stack() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  return (
    <div ref={ref} className="relative pt-6 pb-[4vh]">
      {projects.map((project, n) => (
        <StackCard key={project.slug} project={project} index={n} total={projects.length} progress={scrollYProgress} />
      ))}
    </div>
  );
}

/** Large screens: cards pin and pile up as you scroll. Elsewhere: a simple grid. */
export function ProjectStack() {
  const stack = useMediaQuery(STACK_QUERY);
  if (stack) return <Stack />;

  return (
    <Stagger className="grid gap-5 md:grid-cols-2" stagger={0.12}>
      {projects.map((project, n) => (
        <StaggerItem key={project.slug} className={n === 0 ? "md:col-span-2" : ""}>
          <ProjectCard project={project} featured={n === 0} />
        </StaggerItem>
      ))}
    </Stagger>
  );
}
