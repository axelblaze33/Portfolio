import "server-only";

import { existsSync } from "node:fs";
import { join } from "node:path";
import { experience } from "@/data/experience";
import { projects } from "@/data/projects";
import { site } from "@/data/site";
import type { SocialLink } from "@/types";

/** True when public/resume.pdf exists at build time. */
export const hasResume = existsSync(join(process.cwd(), "public", site.resumePath));

export const resumeHref = hasResume ? site.resumePath : null;

/** Social links that have a URL configured. */
export const activeSocials: (SocialLink & { id: "github" | "linkedin" })[] = (
  ["github", "linkedin"] as const
)
  .map((id) => ({ id, ...site.socials[id] }))
  .filter((s) => s.href.trim() !== "");

const bracketed = (v: string) => /^\[.*\]$/.test(v.trim());

/** Missing personal details, surfaced in development only. */
export function getSetupChecklist() {
  const items: { label: string; where: string }[] = [];
  if (!site.socials.github.href) items.push({ label: "GitHub URL", where: "src/data/site.ts" });
  if (!site.socials.linkedin.href) items.push({ label: "LinkedIn URL", where: "src/data/site.ts" });
  if (!site.publicEmail) items.push({ label: "Public email (mailto)", where: "src/data/site.ts" });
  if (!hasResume) items.push({ label: "Résumé PDF", where: "public/resume.pdf" });
  if (!process.env.NEXT_PUBLIC_SITE_URL) items.push({ label: "Site URL", where: ".env.local → NEXT_PUBLIC_SITE_URL" });
  if (!process.env.RESEND_API_KEY && process.env.CONTACT_DRY_RUN !== "true")
    items.push({ label: "Email delivery (Resend)", where: ".env.local" });

  const expGaps = experience.some((e) =>
    [e.company, e.period, ...e.accomplishments].some(bracketed),
  );
  if (expGaps) items.push({ label: "Experience details", where: "src/data/experience.ts" });
  if (projects.some((p) => p.status === "draft"))
    items.push({ label: "Real projects (drafts shown)", where: "src/data/projects.ts" });

  return items;
}
