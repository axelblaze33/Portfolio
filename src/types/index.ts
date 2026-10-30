export type SocialLink = {
  label: string;
  /** Leave empty ("") to hide the link everywhere on the site. */
  href: string;
};

export type SkillCategory = {
  id: string;
  title: string;
  summary: string;
  icon: "frontend" | "backend" | "data" | "tools" | "ai";
  items: string[];
};

export type ProjectStatus = "draft" | "in-progress" | "completed";

export type Project = {
  slug: string;
  title: string;
  category: string;
  status: ProjectStatus;
  /** One or two sentences shown on the card. */
  summary: string;
  /** Longer description for the details page. */
  overview: string;
  problem: string;
  features: string[];
  architecture: string[];
  stack: string[];
  /** Leave empty ("") until the repository is public. */
  githubUrl: string;
  /** Leave empty ("") until a live demo is deployed. */
  demoUrl: string;
  /** Abstract artwork style used when no screenshot is available. */
  art: "dashboard" | "reporting" | "ai";
  /** Optional screenshot in /public/images, e.g. "/images/my-project.png". */
  image?: string;
};

export type ExperienceEntry = {
  id: string;
  role: string;
  company: string;
  period: string;
  location: string;
  summary: string;
  responsibilities: string[];
  technologies: string[];
  accomplishments: string[];
};

export type Strength = {
  title: string;
  description: string;
  icon: "puzzle" | "bug" | "layers" | "database" | "briefcase" | "book" | "users";
};
