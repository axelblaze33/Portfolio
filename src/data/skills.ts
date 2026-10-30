import type { SkillCategory } from "@/types";

export const skillCategories: SkillCategory[] = [
  {
    id: "frontend",
    title: "Frontend",
    summary: "Component-driven interfaces with typed, maintainable code.",
    icon: "frontend",
    items: ["Angular", "TypeScript", "JavaScript", "HTML5", "CSS3"],
  },
  {
    id: "backend",
    title: "Backend & APIs",
    summary: "Designing, consuming and debugging the services behind the UI.",
    icon: "backend",
    items: ["REST APIs", "FastAPI", "Python", "API integration & debugging"],
  },
  {
    id: "data",
    title: "Databases & Reporting",
    summary: "Turning raw business data into reports people can act on.",
    icon: "data",
    items: [
      "SQL",
      "Query optimization fundamentals",
      "MIS reporting",
      "Data analysis & reporting workflows",
    ],
  },
  {
    id: "tools",
    title: "Tools & Workflow",
    summary: "The everyday toolkit for shipping and collaborating.",
    icon: "tools",
    items: ["Git", "GitHub", "VS Code", "Postman"],
  },
  {
    id: "ai",
    title: "AI & Emerging Tech",
    summary: "Exploring how language models fit into real products.",
    icon: "ai",
    items: [
      "LLM fundamentals",
      "Retrieval-Augmented Generation (RAG)",
      "Embeddings & vector databases",
      "AI-powered application development",
    ],
  },
];
