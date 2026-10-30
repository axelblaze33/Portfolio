import { Shell } from "@/components/sections/shell";
import { Reveal } from "@/components/ui/reveal";
import { Accent, SectionHeading } from "@/components/ui/section-heading";
import { activeSocials, resumeHref } from "@/lib/profile";

export function Playground() {
  return (
    <section aria-labelledby="playground-title" className="py-12 sm:py-16 lg:py-20">
      <div className="container-page grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <SectionHeading
          index="06"
          label="Playground"
          id="playground-title"
          className="lg:mb-0"
          title={
            <>
              Prefer the <Accent>command line</Accent>?
            </>
          }
          intro="The whole site, as a tiny shell. Ask it about my skills, browse projects or jump to any section — try typing help."
        />
        <Reveal>
          <Shell resumeHref={resumeHref} socials={activeSocials} />
        </Reveal>
      </div>
    </section>
  );
}
