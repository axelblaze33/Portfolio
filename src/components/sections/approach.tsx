import { BookOpen, BriefcaseBusiness, Bug, Database, Layers, Puzzle, Users, type LucideIcon } from "lucide-react";
import { Stagger, StaggerItem } from "@/components/ui/reveal";
import { Accent, SectionHeading } from "@/components/ui/section-heading";
import { Spotlight } from "@/components/ui/spotlight";
import { strengths } from "@/data/experience";
import type { Strength } from "@/types";

const icons: Record<Strength["icon"], LucideIcon> = {
  puzzle: Puzzle,
  bug: Bug,
  layers: Layers,
  database: Database,
  briefcase: BriefcaseBusiness,
  book: BookOpen,
  users: Users,
};

export function Approach() {
  return (
    <section aria-labelledby="approach-title" className="py-12 sm:py-16 lg:py-20">
      <div className="container-page">
        <SectionHeading
          index="05"
          label="What I bring"
          id="approach-title"
          align="center"
          title={
            <>
              How I add <Accent>value</Accent> to a team.
            </>
          }
          intro="The habits I rely on, whether I'm building a new feature or chasing a production issue."
        />

        <Stagger as="ul" className="grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {strengths.map((s, n) => {
            const Icon = icons[s.icon];
            const wide = n === strengths.length - 1;
            return (
              <StaggerItem as="li" key={s.title} className={wide ? "sm:col-span-2 lg:col-span-1" : ""}>
                <Spotlight className="group h-full bg-bg-elevated/90 p-7 transition-colors duration-500 hover:bg-bg-elevated">
                  <div className="flex items-center justify-between">
                    <Icon className="size-5 text-accent transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6" aria-hidden="true" />
                    <span className="font-mono text-xs text-fg-subtle">{String(n + 1).padStart(2, "0")}</span>
                  </div>
                  <h3 className="mt-8 text-lg font-semibold tracking-tight">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-fg-muted">{s.description}</p>
                </Spotlight>
              </StaggerItem>
            );
          })}
          <li aria-hidden="true" className="hidden bg-bg-elevated/90 p-7 lg:block">
            <div className="flex h-full flex-col justify-end font-mono text-xs leading-relaxed text-fg-subtle">
              <span className="text-accent">{"// "}</span>
              always.learning = <span className="text-accent-3">true</span>;
            </div>
          </li>
        </Stagger>
      </div>
    </section>
  );
}
