import { ArrowDown, ArrowRight, Download, MapPin } from "lucide-react";
import type { CSSProperties } from "react";
import { ButtonLink } from "@/components/ui/button";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/icons";
import { Magnetic } from "@/components/ui/magnetic";
import { RotatingText } from "@/components/ui/rotating-text";
import { HeroCanvas } from "@/components/visuals/hero-canvas";
import { HeroVisual } from "@/components/visuals/hero-visual";
import { site } from "@/data/site";
import { activeSocials, resumeHref } from "@/lib/profile";

const i = (n: number) => ({ "--i": n }) as CSSProperties;

const heroStack = ["Angular", "TypeScript", "REST APIs", "SQL", "Python", "FastAPI"] as const;

/** Splits the headline into animated words; the last two get the accent treatment. */
function Headline() {
  const words = site.headline.split(" ");
  const accentFrom = words.length - 2;
  return (
    <span className="block text-[clamp(2.6rem,7.4vw,5.9rem)] leading-[0.98] font-semibold tracking-[-0.045em] text-balance">
      {words.map((word, n) => (
        <span key={n}>
          <span
            className={`rise-word ${n >= accentFrom ? "text-gradient font-serif font-normal tracking-[-0.01em] italic" : ""}`}
            style={i(n)}
          >
            {word}
          </span>{" "}
        </span>
      ))}
    </span>
  );
}

export function Hero() {
  return (
    <section
      id="home"
      aria-label="Introduction"
      className="relative flex items-center overflow-x-clip pt-28 pb-16 sm:min-h-[100svh] sm:pb-20 lg:pt-24"
    >
      <HeroCanvas />
      <div className="container-page relative grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8">
        <div>
          {site.availability.show && (
            <p
              className="rise mb-8 inline-flex items-center gap-2.5 rounded-full border border-line bg-surface px-3.5 py-1.5 text-xs text-fg-muted backdrop-blur"
              style={i(0)}
            >
              <span className="relative flex size-2">
                <span className="status-ping absolute inset-0 rounded-full bg-accent-3" />
                <span className="relative size-2 rounded-full bg-accent-3" />
              </span>
              {site.availability.label}
            </p>
          )}

          <h1>
            <span className="rise mb-5 block font-mono text-sm tracking-wide text-fg-muted" style={i(1)}>
              <span className="text-accent">{"<"}</span>
              {site.name}
              <span className="text-accent">{" />"}</span>
              <span className="mx-2 text-fg-subtle">—</span>
              <span className="text-fg-subtle">{site.title}</span>
            </span>
            <Headline />
          </h1>

          <p className="rise mt-8 max-w-xl text-lg leading-relaxed text-pretty text-fg-muted" style={i(9)}>
            {site.tagline}
          </p>

          <p className="rise mt-5 font-mono text-sm text-fg-subtle" style={i(9)}>
            <span className="text-accent-3">$</span> working with <RotatingText items={heroStack} />
          </p>

          <div className="rise mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center" style={i(10)}>
            <Magnetic className="w-full sm:w-auto">
              <ButtonLink href="/#projects" className="w-full sm:w-auto">
                Explore My Work
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </ButtonLink>
            </Magnetic>
            <Magnetic className="w-full sm:w-auto">
              <ButtonLink href="/#contact" variant="secondary" className="w-full sm:w-auto">
                Get In Touch
              </ButtonLink>
            </Magnetic>
            {resumeHref && (
              <ButtonLink href={resumeHref} variant="ghost" external download>
                <Download className="size-4" aria-hidden="true" />
                Résumé
              </ButtonLink>
            )}
          </div>

          <div className="rise mt-10 flex flex-wrap items-center gap-5 text-sm text-fg-subtle" style={i(11)}>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-4" aria-hidden="true" />
              {site.location}
            </span>
            {activeSocials.map((s) => (
              <a
                key={s.id}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 transition-colors hover:text-fg"
              >
                {s.id === "github" ? <GitHubIcon className="size-4" /> : <LinkedInIcon className="size-4" />}
                {s.label}
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            ))}
          </div>
        </div>

        <div className="rise" style={i(6)}>
          <HeroVisual />
        </div>
      </div>

      <a
        href="#about"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 font-mono text-[10px] tracking-[0.25em] text-fg-subtle uppercase transition-colors hover:text-fg sm:flex"
      >
        Scroll
        <span className="relative flex h-9 w-5 justify-center rounded-full border border-line-strong pt-1.5">
          <ArrowDown className="scroll-cue size-3" aria-hidden="true" />
        </span>
      </a>
    </section>
  );
}
