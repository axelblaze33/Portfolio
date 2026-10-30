import { ArrowLeft, ArrowRight, ExternalLink, Info } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ViewTransition, type CSSProperties } from "react";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ui/button";
import { GitHubIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";
import { ProjectArt } from "@/components/visuals/project-art";
import { getProject, projects, statusLabel } from "@/data/projects";

// Every real slug is prerendered as static HTML and unknown slugs are 404'd in
// src/proxy.ts, so reading params outside <Suspense> never blocks in practice.
export const instant = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: { title: project.title, description: project.summary, url: `/projects/${project.slug}` },
  };
}

function ListBlock({ title, items, dot }: { title: string; items: string[]; dot: string }) {
  return (
    <Reveal className="glass rounded-2xl p-6 sm:p-8">
      <h2 className="font-mono text-xs tracking-[0.18em] text-fg-subtle uppercase">{title}</h2>
      <ul className="mt-5 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 leading-relaxed text-fg-muted">
            <span aria-hidden="true" className={`mt-[0.6em] size-1.5 shrink-0 rounded-full ${dot}`} />
            {item}
          </li>
        ))}
      </ul>
    </Reveal>
  );
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = projects.indexOf(project);
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];

  return (
    <article className="pt-28 pb-12 sm:pt-40">
      <div className="container-page">
        <Link href="/#projects" className="-my-2 inline-flex min-h-10 items-center gap-2 text-sm text-fg-muted transition-colors hover:text-fg">
          <ArrowLeft className="size-4" aria-hidden="true" /> All projects
        </Link>

        <header className="mt-10 max-w-4xl">
          <div className="rise flex flex-wrap items-center gap-3 font-mono text-xs">
            <span className="rounded-full border border-line px-3 py-1 text-fg-muted">{project.category}</span>
            {project.status !== "completed" && (
              <span className="rounded-full border border-accent-3/40 px-3 py-1 text-accent-3">{statusLabel[project.status]}</span>
            )}
          </div>
          <h1 className="rise mt-6 text-5xl leading-[1] font-semibold tracking-[-0.04em] text-balance sm:text-7xl" style={{ "--i": 1 } as CSSProperties}>
            {project.title}
          </h1>
          <p className="rise mt-6 max-w-2xl text-xl leading-relaxed text-pretty text-fg-muted" style={{ "--i": 2 } as CSSProperties}>
            {project.summary}
          </p>
        </header>

        {project.status === "draft" && (
          <p className="mt-8 flex max-w-3xl items-start gap-3 rounded-xl border border-accent-3/30 bg-accent-3/5 px-4 py-3 text-sm text-fg-muted">
            <Info className="mt-0.5 size-4 shrink-0 text-accent-3" aria-hidden="true" />
            This is a draft concept describing planned or illustrative work. It is not presented as a published or deployed
            product.
          </p>
        )}

        {/* No entrance animation here: the artwork morphs in from the project card instead. */}
        <ViewTransition name={`project-art-${project.slug}`} share="morph" default="none">
          <div className="relative mt-12 aspect-[16/9] overflow-hidden rounded-3xl border border-line shadow-card">
            {project.image ? (
              <Image src={project.image} alt={`${project.title} screenshot`} fill priority sizes="100vw" className="object-cover" />
            ) : (
              <ProjectArt variant={project.art} className="absolute inset-0 size-full" />
            )}
          </div>
        </ViewTransition>

        <div className="mt-16 grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-12">
            <Reveal>
              <h2 className="text-3xl font-semibold tracking-tight">Overview</h2>
              <p className="mt-4 text-lg leading-relaxed text-pretty text-fg-muted">{project.overview}</p>
            </Reveal>
            <Reveal>
              <h2 className="text-3xl font-semibold tracking-tight">The problem</h2>
              <p className="mt-4 text-lg leading-relaxed text-pretty text-fg-muted">{project.problem}</p>
            </Reveal>
            <ListBlock title="Key features" items={project.features} dot="bg-accent" />
            <ListBlock title="Architecture" items={project.architecture} dot="bg-accent-2" />
          </div>

          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <Reveal className="glass rounded-2xl p-6 sm:p-8">
              <h2 className="font-mono text-xs tracking-[0.18em] text-fg-subtle uppercase">Tech stack</h2>
              <ul className="mt-5 flex flex-wrap gap-2">
                {project.stack.map((t) => (
                  <li key={t} className="rounded-md border border-line bg-bg/40 px-2.5 py-1.5 font-mono text-xs text-fg">
                    {t}
                  </li>
                ))}
              </ul>
              <h2 className="mt-8 font-mono text-xs tracking-[0.18em] text-fg-subtle uppercase">Links</h2>
              <div className="mt-4 flex flex-wrap gap-3">
                {project.githubUrl && (
                  <ButtonLink href={project.githubUrl} external variant="secondary">
                    <GitHubIcon className="size-4" /> Source code
                  </ButtonLink>
                )}
                {project.demoUrl && (
                  <ButtonLink href={project.demoUrl} external>
                    <ExternalLink className="size-4" aria-hidden="true" /> Live demo
                  </ButtonLink>
                )}
                {!project.githubUrl && !project.demoUrl && (
                  <p className="text-sm text-fg-muted">
                    The repository and demo aren&apos;t public yet.{" "}
                    <Link href="/#contact" className="text-accent underline-offset-2 hover:underline">
                      Ask me about it
                    </Link>
                    .
                  </p>
                )}
              </div>
            </Reveal>
          </aside>
        </div>

        <nav aria-label="More projects" className="mt-16 grid gap-8 border-t border-line pt-10 sm:grid-cols-2">
          <Link href={`/projects/${prev.slug}`} rel="prev" className="group flex items-end gap-4">
            <ArrowLeft className="mb-1.5 size-6 shrink-0 text-fg-subtle transition-transform group-hover:-translate-x-1 group-hover:text-accent" aria-hidden="true" />
            <span>
              <span className="font-mono text-xs tracking-[0.18em] text-fg-subtle uppercase">Previous project</span>
              <span className="mt-2 block text-2xl font-semibold tracking-tight text-balance transition-colors group-hover:text-accent sm:text-3xl">
                {prev.title}
              </span>
            </span>
          </Link>
          <Link href={`/projects/${next.slug}`} rel="next" className="group flex items-end justify-end gap-4 text-right">
            <span>
              <span className="font-mono text-xs tracking-[0.18em] text-fg-subtle uppercase">Next project</span>
              <span className="mt-2 block text-2xl font-semibold tracking-tight text-balance transition-colors group-hover:text-accent sm:text-3xl">
                {next.title}
              </span>
            </span>
            <ArrowRight className="mb-1.5 size-6 shrink-0 text-fg-subtle transition-transform group-hover:translate-x-1 group-hover:text-accent" aria-hidden="true" />
          </Link>
        </nav>
      </div>
    </article>
  );
}
