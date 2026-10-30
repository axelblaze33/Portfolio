import { Braces, Database, Server, Sparkles, Wrench, type LucideIcon } from "lucide-react";
import { Stagger, StaggerItem } from "@/components/ui/reveal";
import { Accent, SectionHeading } from "@/components/ui/section-heading";
import { Spotlight } from "@/components/ui/spotlight";
import { skillCategories } from "@/data/skills";
import type { SkillCategory } from "@/types";

const icons: Record<SkillCategory["icon"], LucideIcon> = {
  frontend: Braces,
  backend: Server,
  data: Database,
  tools: Wrench,
  ai: Sparkles,
};

// Bento layout on large screens: two wide cards, then three narrower ones.
const spans = ["lg:col-span-3", "lg:col-span-3", "lg:col-span-2", "lg:col-span-2", "lg:col-span-2"];

function Marquee() {
  const all = skillCategories.flatMap((c) => c.items);
  return (
    <div
      aria-hidden="true"
      className="marquee relative mt-12 sm:mt-16 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]"
    >
      <div className="marquee-track flex w-max gap-10 py-2">
        {[...all, ...all].map((item, n) => (
          <span key={n} className="flex items-center gap-10 font-mono text-sm whitespace-nowrap text-fg-subtle">
            {item}
            <span className="text-accent">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function Skills() {
  return (
    <section id="skills" aria-labelledby="skills-title" className="py-12 sm:py-16 lg:py-20">
      <div className="container-page">
        <SectionHeading
          index="02"
          label="Skills"
          id="skills-title"
          title={
            <>
              The <Accent>arsenal</Accent> behind the work.
            </>
          }
          intro="Grouped by where they fit in an application — from the interface down to the data, plus the AI tooling I'm exploring next."
        />

        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6" as="ul">
          {skillCategories.map((cat, n) => {
            const Icon = icons[cat.icon];
            return (
              <StaggerItem key={cat.id} as="li" className={`${spans[n]} ${n === 4 ? "sm:col-span-2 lg:col-span-2" : ""}`}>
                <Spotlight className="group glass h-full rounded-2xl p-6 transition-[border-color,transform] duration-500 hover:-translate-y-1 hover:border-line-strong sm:p-7">
                  <div className="flex items-start justify-between">
                    <span className="grid size-11 place-items-center rounded-xl border border-line bg-bg/40 text-accent transition-[border-color,background-color,box-shadow] duration-500 group-hover:border-accent/50 group-hover:bg-accent/10 group-hover:shadow-[0_0_28px_-6px_var(--accent)]">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <span className="font-mono text-xs text-fg-subtle">0{n + 1}</span>
                  </div>
                  <h3 className="mt-6 text-xl font-semibold tracking-tight">{cat.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-fg-muted">{cat.summary}</p>
                  <ul className="mt-6 flex flex-wrap gap-2" aria-label={`${cat.title} skills`}>
                    {cat.items.map((item) => (
                      <li
                        key={item}
                        className="rounded-full border border-line bg-bg/40 px-3 py-1.5 text-[13px] text-fg transition-[border-color,color,transform] duration-300 hover:-translate-y-0.5 hover:border-accent/60 hover:text-accent"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </Spotlight>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
      <Marquee />
    </section>
  );
}
