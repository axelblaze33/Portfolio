import { Mail } from "lucide-react";
import Link from "next/link";
import { LocalTime } from "@/components/layout/local-time";
import { GitHubIcon, LinkedInIcon, Monogram } from "@/components/ui/icons";
import { navItems, site } from "@/data/site";
import { activeSocials } from "@/lib/profile";

export function Footer() {
  return (
    <footer className="hairline-top">
      <div className="container-page flex flex-col gap-10 py-12 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <Link href="/#home" className="inline-flex items-center gap-2.5 font-medium">
            <Monogram className="size-8" />
            {site.name}
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-fg-muted">
            {site.title}. Based in {site.location}.
          </p>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-12 text-sm sm:grid-cols-3">
          {navItems.map((item) => (
            <Link key={item.id} href={`/#${item.id}`} className="inline-flex min-h-10 items-center text-fg-muted transition-colors hover:text-fg">
              {item.label}
            </Link>
          ))}
          <Link href="/privacy" className="inline-flex min-h-10 items-center text-fg-muted transition-colors hover:text-fg">
            Privacy
          </Link>
        </nav>

        <ul className="flex gap-2" aria-label="Social links">
          {activeSocials.map((s) => (
            <li key={s.id}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${s.label} (opens in a new tab)`}
                className="inline-flex size-10 items-center justify-center rounded-full border border-line text-fg-muted transition-colors hover:border-line-strong hover:text-fg"
              >
                {s.id === "github" ? <GitHubIcon className="size-4" /> : <LinkedInIcon className="size-4" />}
              </a>
            </li>
          ))}
          {site.publicEmail && (
            <li>
              <a
                href={`mailto:${site.publicEmail}`}
                aria-label={`Email ${site.name}`}
                className="inline-flex size-10 items-center justify-center rounded-full border border-line text-fg-muted transition-colors hover:border-line-strong hover:text-fg"
              >
                <Mail className="size-4" aria-hidden="true" />
              </a>
            </li>
          )}
        </ul>
      </div>
      <div className="container-page flex flex-col gap-2 border-t border-line py-6 pr-16 font-mono text-xs text-fg-subtle sm:pr-24 lg:flex-row lg:items-center lg:justify-between">
        <p>© {site.name}. All rights reserved.</p>
        <LocalTime />
        <p>Designed &amp; built with Next.js, Tailwind CSS &amp; Motion.</p>
      </div>
      {/* Oversized sign-off, cropped by the bottom of the page. */}
      <div aria-hidden="true" className="pointer-events-none overflow-hidden select-none">
        <p className="translate-y-[18%] bg-linear-to-b from-fg/20 to-fg/0 bg-clip-text text-center text-[8.4vw] leading-[0.85] font-semibold tracking-[-0.05em] whitespace-nowrap text-transparent uppercase">
          {site.name}
        </p>
      </div>
    </footer>
  );
}
