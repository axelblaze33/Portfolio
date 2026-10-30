"use client";

import { ArrowUpRight, ExternalLink } from "lucide-react";
import { m, useMotionValue, useSpring, useTransform } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { ViewTransition, type PointerEvent } from "react";
import { GitHubIcon } from "@/components/ui/icons";
import { ProjectArt } from "@/components/visuals/project-art";
import { statusLabel } from "@/data/projects";
import { FINE_POINTER, useMediaQuery } from "@/lib/use-media-query";
import type { Project } from "@/types";

export function ProjectCard({ project, featured = false }: { project: Project; featured?: boolean }) {
  const tilt = useMediaQuery(FINE_POINTER);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [5, -5]), { stiffness: 180, damping: 20 });
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-6, 6]), { stiffness: 180, damping: 20 });

  function onMove(e: PointerEvent<HTMLElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
    if (!tilt) return;
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  }
  function onLeave() {
    px.set(0);
    py.set(0);
  }

  const detailsHref = `/projects/${project.slug}`;
  const hasLinks = Boolean(project.githubUrl || project.demoUrl);

  return (
    <m.article
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={tilt ? { rotateX, rotateY, transformPerspective: 1100 } : undefined}
      className={`spotlight group glass relative flex h-full flex-col overflow-hidden rounded-2xl transition-[border-color,box-shadow] duration-500 hover:border-line-strong hover:shadow-card ${
        featured ? "md:grid md:grid-cols-[1.2fr_1fr]" : ""
      }`}
    >
      <div
        className={`relative aspect-[16/10] overflow-hidden border-b border-line ${
          featured ? "md:aspect-auto md:min-h-[22rem] md:border-r md:border-b-0" : ""
        }`}
      >
        {/* Shares a name with the artwork on the project page, so it morphs between the two. */}
        <ViewTransition name={`project-art-${project.slug}`} share="morph" default="none">
          <div className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]">
            {project.image ? (
              <Image src={project.image} alt={`${project.title} screenshot`} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            ) : (
              <ProjectArt variant={project.art} className="size-full" />
            )}
          </div>
        </ViewTransition>
        <div className="absolute inset-x-4 top-4 flex flex-wrap items-center justify-between gap-2">
          <span className="glass rounded-full px-3 py-1 font-mono text-[11px] whitespace-nowrap text-fg-muted">{project.category}</span>
          {project.status !== "completed" && (
            <span className="rounded-full border border-accent-3/40 bg-bg/70 px-3 py-1 font-mono text-[11px] whitespace-nowrap text-accent-3 backdrop-blur">
              {statusLabel[project.status]}
            </span>
          )}
        </div>
      </div>

      <div className={`flex flex-1 flex-col p-6 sm:p-7 ${featured ? "lg:p-10" : ""}`}>
        <h3 className={`font-semibold tracking-tight ${featured ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl"}`}>
          <Link href={detailsHref} className="transition-colors hover:text-accent">
            {project.title}
          </Link>
        </h3>
        <p className="mt-3 leading-relaxed text-pretty text-fg-muted">{project.summary}</p>

        <ul className="mt-5 flex flex-wrap gap-2" aria-label="Technology stack">
          {project.stack.map((tech) => (
            <li key={tech} className="rounded-md border border-line bg-bg/40 px-2 py-1 font-mono text-[11px] text-fg-muted">
              {tech}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-3 pt-7">
          <Link
            href={detailsHref}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-line-strong px-4 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
          >
            View details
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
            <span className="sr-only">about {project.title}</span>
          </Link>
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-fg-muted hover:text-fg">
              <GitHubIcon className="size-4" /> Code<span className="sr-only"> for {project.title} (opens in a new tab)</span>
            </a>
          )}
          {project.demoUrl && (
            <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-fg-muted hover:text-fg">
              <ExternalLink className="size-4" aria-hidden="true" /> Live demo<span className="sr-only"> of {project.title} (opens in a new tab)</span>
            </a>
          )}
          {!hasLinks && <span className="font-mono text-xs text-fg-subtle">Repo &amp; demo not public yet</span>}
        </div>
      </div>
    </m.article>
  );
}
