import type { Project } from "@/types";

/**
 * These three entries are illustrative DRAFT concepts, not published projects.
 * Replace them with your real work, or update `status`, the descriptions and
 * the links once a project is public. Cards and detail pages show a
 * "Draft concept" label for anything with status "draft".
 */
export const projects: Project[] = [
  {
    slug: "business-management-app",
    title: "Business Management Application",
    category: "Frontend · Web application",
    status: "draft",
    summary:
      "An Angular application for managing day-to-day business records, built around dynamic forms, filterable data tables and guided workflows.",
    overview:
      "A concept for a business operations workspace where teams create, review and update records through structured workflows. The focus is on a clean Angular architecture: feature modules, reusable form and table components, and a service layer that talks to REST APIs.",
    problem:
      "Operational teams often juggle spreadsheets and disconnected screens. The goal is a single interface where data entry is validated up front, records are easy to find, and each workflow step is clear.",
    features: [
      "Dynamic, schema-driven forms with field-level validation",
      "Data tables with server-side filtering, sorting and pagination",
      "Multi-step workflows with clear status transitions",
      "Typed API service layer with centralised error handling",
    ],
    architecture: [
      "Angular feature modules with lazy-loaded routes",
      "Reactive Forms for complex validation rules",
      "HTTP interceptors for auth headers and error reporting",
      "REST API integration with typed request/response models",
    ],
    stack: ["Angular", "TypeScript", "REST APIs", "HTML5", "CSS3"],
    githubUrl: "",
    demoUrl: "",
    art: "dashboard",
  },
  {
    slug: "sales-mis-reporting",
    title: "Sales & MIS Reporting System",
    category: "Data · Reporting",
    status: "draft",
    summary:
      "A SQL-driven reporting system that aggregates sales data into scheduled MIS reports with export-ready summaries.",
    overview:
      "A concept for a reporting pipeline that turns transactional sales data into management information: daily and monthly summaries, regional breakdowns and exportable reports that business stakeholders can rely on.",
    problem:
      "Manual report preparation is slow and error-prone. Well-structured SQL, reusable report definitions and consistent exports make the numbers repeatable and auditable.",
    features: [
      "Aggregation queries for period, region and product summaries",
      "Reusable report definitions with parameterised filters",
      "Export to spreadsheet-friendly formats",
      "Basic data-quality checks before reports are published",
    ],
    architecture: [
      "Relational schema with indexed reporting views",
      "Parameterised SQL queries for each report type",
      "Lightweight API layer to trigger and download reports",
      "Scheduled jobs for recurring MIS reports",
    ],
    stack: ["SQL", "Python", "FastAPI", "REST APIs"],
    githubUrl: "",
    demoUrl: "",
    art: "reporting",
  },
  {
    slug: "ai-document-assistant",
    title: "AI-Powered Document Assistant",
    category: "AI · Full-stack",
    status: "draft",
    summary:
      "A Python backend that answers questions about your documents using retrieval-augmented generation, embeddings and an LLM.",
    overview:
      "A concept for an assistant that ingests documents, splits them into searchable chunks, stores their embeddings in a vector database and uses retrieved context to ground an LLM's answers — with sources shown alongside each response.",
    problem:
      "Finding answers inside long documents is tedious, and plain LLM answers can drift from the source material. Retrieval keeps responses tied to the actual documents.",
    features: [
      "Document ingestion and chunking pipeline",
      "Embedding generation and vector similarity search",
      "Context-grounded answers with cited source passages",
      "FastAPI endpoints for upload, query and history",
    ],
    architecture: [
      "FastAPI service with async endpoints",
      "Embedding model + vector database for retrieval",
      "Prompt assembly from top-k retrieved chunks",
      "LLM integration behind a provider-agnostic interface",
    ],
    stack: ["Python", "FastAPI", "RAG", "Embeddings", "Vector DB", "LLM APIs"],
    githubUrl: "",
    demoUrl: "",
    art: "ai",
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export const statusLabel: Record<Project["status"], string> = {
  draft: "Draft concept",
  "in-progress": "In progress",
  completed: "Completed",
};
