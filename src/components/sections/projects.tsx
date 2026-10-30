import { ProjectStack } from "@/components/sections/project-stack";
import { Accent, SectionHeading } from "@/components/ui/section-heading";
import { projects } from "@/data/projects";

export function Projects() {
  const hasDrafts = projects.some((p) => p.status === "draft");

  return (
    <section id="projects" aria-labelledby="projects-title" className="py-12 sm:py-16 lg:py-20">
      <div className="container-page">
        <SectionHeading
          index="03"
          label="Projects"
          id="projects-title"
          title={
            <>
              Selected <Accent>work</Accent> &amp; explorations.
            </>
          }
          intro={
            hasDrafts
              ? "Projects that reflect the kind of problems I like to solve. Entries marked “Draft concept” describe planned or illustrative work rather than published products."
              : "Projects that reflect the kind of problems I like to solve."
          }
        />

        <ProjectStack />
      </div>
    </section>
  );
}
