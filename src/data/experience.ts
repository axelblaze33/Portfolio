import type { ExperienceEntry, Strength } from "@/types";

/**
 * Replace every value in [square brackets] with your real details.
 * Bracketed text is rendered with a dashed "placeholder" style so it is
 * easy to spot before you deploy.
 */
export const experience: ExperienceEntry[] = [
  {
    id: "current-role",
    role: "Software Engineer",
    company: "ezAtlas",
    period: "July 2024 — Present",
    location: "Pune, Maharashtra, India",
    summary:
      "Developing and maintaining production Angular applications, from new features to support tickets and business reports.",
    responsibilities: [
      "Develop and maintain production Angular applications",
      "Implement new features and enhancements from business requirements",
      "Debug and resolve application issues across the front end and API layer",
      "Integrate REST APIs and handle data flow between UI and services",
      "Handle production support tickets and coordinate fixes with the team",
      "Develop SQL-based MIS reports for business stakeholders",
    ],
    technologies: ["Angular", "TypeScript", "REST APIs", "SQL", "Git"],
    accomplishments: ["[Add a notable accomplishment you can verify]"],
  },
];

/** Shown as the first, "ongoing" milestone on the timeline. */
export const currentFocus = {
  label: "Ongoing",
  title: "Growing toward full-stack engineering",
  description:
    "Deepening backend skills with Python and FastAPI, and exploring LLMs, RAG and vector search for AI-powered applications.",
  technologies: ["Python", "FastAPI", "RAG", "Embeddings"],
};

export const strengths: Strength[] = [
  {
    title: "Problem-solving",
    description:
      "Breaking vague problems into clear, testable steps before writing code.",
    icon: "puzzle",
  },
  {
    title: "Debugging & troubleshooting",
    description:
      "Reproducing issues, reading the logs and tracing data end to end until the root cause is clear.",
    icon: "bug",
  },
  {
    title: "Maintainable front ends",
    description:
      "Angular code organised into reusable components and services that the next developer can follow.",
    icon: "layers",
  },
  {
    title: "APIs & databases",
    description:
      "Comfortable on both sides of the API boundary — integrating services and writing the SQL behind them.",
    icon: "database",
  },
  {
    title: "Business understanding",
    description:
      "Translating requirements and reports into features that match how the business actually works.",
    icon: "briefcase",
  },
  {
    title: "Continuous learning",
    description:
      "Actively picking up backend engineering and AI tooling, and applying it to real problems.",
    icon: "book",
  },
  {
    title: "Collaboration",
    description:
      "Working with developers, testers and non-technical stakeholders, and explaining trade-offs plainly.",
    icon: "users",
  },
];

export const thinkingSteps = [
  {
    id: "understand",
    label: "Understand",
    title: "Start with the real problem",
    body: "Clarify who the feature is for, what the data looks like and what “done” means before touching the code.",
    snippet: "requirements.map(clarify)",
  },
  {
    id: "reproduce",
    label: "Reproduce",
    title: "Make the issue visible",
    body: "For bugs and tickets, reproduce first. A reliable reproduction is half of the fix.",
    snippet: "expect(bug).toBeReproducible()",
  },
  {
    id: "build",
    label: "Build",
    title: "Keep it simple and readable",
    body: "Small components, typed models and clear naming — code that is easy to review and easy to change.",
    snippet: "compose(small, typed, clear)",
  },
  {
    id: "verify",
    label: "Verify",
    title: "Check it works where it matters",
    body: "Test the edge cases, watch performance, and confirm the result with the people who asked for it.",
    snippet: "await verify(inProduction)",
  },
] as const;
