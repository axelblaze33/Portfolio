import { ArrowUpRight, Mail, MapPin } from "lucide-react";
import { ContactForm } from "@/components/sections/contact-form";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";
import { Accent, SectionHeading } from "@/components/ui/section-heading";
import { site } from "@/data/site";
import { activeSocials } from "@/lib/profile";

export function Contact() {
  const channels = [
    ...(site.publicEmail
      ? [{ key: "email", label: "Email", value: site.publicEmail, href: `mailto:${site.publicEmail}`, icon: <Mail className="size-4" aria-hidden="true" />, external: false }]
      : []),
    ...activeSocials.map((s) => ({
      key: s.id,
      label: s.label,
      value: s.href.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, ""),
      href: s.href,
      icon: s.id === "github" ? <GitHubIcon className="size-4" /> : <LinkedInIcon className="size-4" />,
      external: true,
    })),
  ];

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative py-12 sm:py-16 lg:py-20">
      <div className="container-page grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <SectionHeading
            index="07"
            label="Contact"
            id="contact-title"
            title={
              <>
                Let&apos;s build something <Accent>worth</Accent> building.
              </>
            }
            intro="Have an interesting project, an opportunity, or an idea worth building? Let's talk."
          />

          <Reveal>
            <ul className="space-y-3">
              {channels.map((c) => (
                <li key={c.key}>
                  <a
                    href={c.href}
                    {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="group flex items-center justify-between gap-4 rounded-2xl border border-line bg-surface px-5 py-4 transition-colors hover:border-line-strong"
                  >
                    <span className="flex items-center gap-3">
                      <span className="grid size-9 place-items-center rounded-lg border border-line text-accent">{c.icon}</span>
                      <span>
                        <span className="block font-mono text-[11px] tracking-[0.15em] text-fg-subtle uppercase">{c.label}</span>
                        <span className="block text-fg">{c.value}</span>
                      </span>
                    </span>
                    <ArrowUpRight className="size-4 text-fg-subtle transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-fg" aria-hidden="true" />
                    {c.external && <span className="sr-only">(opens in a new tab)</span>}
                  </a>
                </li>
              ))}
              <li className="flex items-center gap-3 rounded-2xl border border-line bg-surface px-5 py-4">
                <span className="grid size-9 place-items-center rounded-lg border border-line text-accent">
                  <MapPin className="size-4" aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-mono text-[11px] tracking-[0.15em] text-fg-subtle uppercase">Location</span>
                  <span className="block text-fg">{site.location}</span>
                </span>
              </li>
            </ul>
            <p className="mt-8 max-w-md border-l border-accent/40 pl-4 font-mono text-xs leading-relaxed text-fg-subtle">
              {"// "}Messages sent through this form go straight to my inbox. Reply-to is set to your address, so my
              answer comes back to you directly.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
