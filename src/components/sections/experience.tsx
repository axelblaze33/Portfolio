import { Timeline } from "@/components/sections/timeline";
import { Accent, SectionHeading } from "@/components/ui/section-heading";

export function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-title" className="py-12 sm:py-16 lg:py-20">
      <div className="container-page grid gap-12 lg:grid-cols-[0.8fr_1.6fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            index="04"
            label="Experience"
            id="experience-title"
            title={
              <>
                Shipping in <Accent>production</Accent>.
              </>
            }
            intro="Feature development, production support, API integration and reporting on live business applications."
          />
        </div>
        <Timeline />
      </div>
    </section>
  );
}
