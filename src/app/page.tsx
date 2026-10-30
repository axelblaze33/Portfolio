import { About } from "@/components/sections/about";
import { Approach } from "@/components/sections/approach";
import { Contact } from "@/components/sections/contact";
import { Experience } from "@/components/sections/experience";
import { Hero } from "@/components/sections/hero";
import { Playground } from "@/components/sections/playground";
import { Projects } from "@/components/sections/projects";
import { Skills } from "@/components/sections/skills";
import { NameBand } from "@/components/visuals/name-band";
import { skillCategories } from "@/data/skills";
import { site } from "@/data/site";
import { activeSocials } from "@/lib/profile";
import { siteUrl } from "@/lib/site-url";

function PersonJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: site.name,
      jobTitle: site.title,
      description: site.description,
      url: siteUrl,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Pune",
        addressRegion: "Maharashtra",
        addressCountry: "IN",
      },
      knowsAbout: skillCategories.flatMap((c) => c.items),
      ...(activeSocials.length ? { sameAs: activeSocials.map((s) => s.href) } : {}),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
    />
  );
}

export default function Home() {
  return (
    <>
      <PersonJsonLd />
      <Hero />
      <NameBand />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Approach />
      <Playground />
      <Contact />
    </>
  );
}
