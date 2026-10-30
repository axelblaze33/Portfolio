import { HowIThink } from "@/components/sections/how-i-think";
import { Reveal } from "@/components/ui/reveal";
import { ScrollWords } from "@/components/ui/scroll-words";
import { Accent, SectionHeading } from "@/components/ui/section-heading";
import { site } from "@/data/site";

const paragraphs = [
  `I'm a software engineer based in Pune who enjoys the practical side of building software — taking a real requirement, understanding the people and data behind it, and shipping something that works reliably.`,
  `Most of my work is on production Angular applications: implementing features, integrating REST APIs, tracking down bugs and working through support tickets with my team. Working on live systems every day has taught me to value clean, readable code, careful debugging and attention to performance.`,
  `Alongside front-end work, I've spent time with SQL and MIS reporting — building reports that business teams rely on. It gave me an appreciation for how data shapes decisions, and for queries that are both correct and efficient.`,
  `Right now I'm growing toward full-stack engineering: deepening my backend skills with Python and FastAPI, and exploring how LLMs, retrieval-augmented generation and vector search can power genuinely useful applications.`,
];

const [statement, ...details] = paragraphs;

/** The developer profile, rendered as a small TypeScript file. */
function ProfileCard() {
  const k = (s: string) => <span className="text-accent-2">{s}</span>;
  const str = (s: string) => <span className="text-accent-3">&quot;{s}&quot;</span>;
  const p = (s: string) => <span className="text-fg-muted">{s}</span>;

  return (
    <figure className="glass overflow-hidden rounded-2xl shadow-card">
      <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="rounded bg-accent/15 px-1.5 py-0.5 text-[10px] font-semibold text-accent">TS</span>
          <span className="text-fg">profile.ts</span>
        </div>
        <span className="hidden font-mono text-[10px] text-fg-subtle min-[360px]:inline">UTF-8 · TypeScript</span>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[12.5px] leading-[1.75] sm:p-5 sm:text-[13px]">
        <code>
          {k("const")} developer {p("=")} {"{"}
          {"\n"}  name{p(":")} {str(site.name)},
          {"\n"}  role{p(":")} {str("Software Engineer")},
          {"\n"}  location{p(":")} {str("Pune, India")},
          {"\n"}  focus{p(":")} [{str("Angular")}, {str("APIs")}, {str("SQL")}],
          {"\n"}  learning{p(":")} [{str("FastAPI")}, {str("RAG")}],
          {"\n"}  values{p(":")} [{str("clean code")}, {str("reliability")}],
          {"\n"}  goal{p(":")} {str("full-stack engineer")},
          {"\n"}{"}"} {k("satisfies")} Engineer{p(";")}
        </code>
      </pre>
      <figcaption className="sr-only">
        Profile summary: {site.name}, software engineer in Pune focused on Angular, APIs and SQL, learning FastAPI
        and RAG, aiming to become a full-stack engineer.
      </figcaption>
    </figure>
  );
}

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="py-12 sm:py-16 lg:py-20">
      <div className="container-page">
        <SectionHeading
          index="01"
          label="About"
          id="about-title"
          title={
            <>
              Beyond the interface: <Accent>practical</Accent> software, built with care.
            </>
          }
        />

        <ScrollWords
          text={statement}
          className="mb-12 max-w-5xl text-[clamp(1.6rem,3.6vw,3rem)] leading-[1.18] font-medium tracking-[-0.025em] text-fg sm:mb-16"
        />

        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div className="space-y-6 text-lg leading-relaxed text-pretty text-fg-muted">
            {details.map((text, n) => (
              <Reveal key={n} delay={n * 0.05}>
                <p>{text}</p>
              </Reveal>
            ))}

            <Reveal>
              <dl className="mt-4 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
                {[
                  ["Based in", "Pune, India"],
                  ["Day to day", "Angular · APIs · SQL"],
                  ["Exploring", "FastAPI · RAG"],
                ].map(([term, value]) => (
                  <div key={term} className="bg-bg-elevated/80 p-4">
                    <dt className="font-mono text-[11px] tracking-[0.15em] text-fg-subtle uppercase">{term}</dt>
                    <dd className="mt-1 text-base text-fg">{value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          <div className="space-y-6">
            <Reveal>
              <ProfileCard />
            </Reveal>
            <Reveal delay={0.1}>
              <HowIThink />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
