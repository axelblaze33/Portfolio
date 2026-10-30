/**
 * Central place for personal details.
 * Values wrapped in [square brackets] or left as "" are placeholders —
 * the dev-only "Setup checklist" panel lists everything still missing.
 */
export const site = {
  name: "Pranav Malshikhare",
  shortName: "Pranav",
  initials: "PM",
  title: "Software Engineer | Angular Developer",
  location: "Pune, Maharashtra, India",
  headline: "I build digital experiences that solve real problems.",
  tagline:
    "Software engineer working across Angular front ends, REST APIs, SQL databases and reporting — turning business requirements into reliable, maintainable applications.",
  description:
    "Pranav Malshikhare is a software engineer and Angular developer in Pune, India, building production web applications with Angular, TypeScript, REST APIs and SQL, and growing toward full-stack and AI-powered development.",

  availability: {
    /** Set to false to hide the status pill in the hero. */
    show: true,
    label: "Open to new opportunities",
  },

  /** Public address shown on the site (mailto link). Leave "" to hide it. */
  publicEmail: "",

  socials: {
    github: { label: "GitHub", href: "" }, // e.g. "https://github.com/your-username"
    linkedin: { label: "LinkedIn", href: "" }, // e.g. "https://www.linkedin.com/in/your-handle"
  },

  /**
   * Drop your résumé at public/resume.pdf and the download buttons
   * appear automatically on the next build.
   */
  resumePath: "/resume.pdf",
} as const;

export const navItems = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
] as const;

export type NavId = (typeof navItems)[number]["id"];
