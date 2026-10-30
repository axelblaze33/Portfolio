import { z } from "zod";

/** Shared by the client form and the API route so both enforce the same rules. */
export const LIMITS = {
  name: { min: 2, max: 80 },
  email: { max: 254 },
  subject: { min: 3, max: 120 },
  message: { min: 20, max: 4000 },
} as const;

/** Minimum time (ms) between the form appearing and being submitted. */
export const MIN_FILL_TIME_MS = 2500;

// Control characters other than tab/newline, plus zero-width and bidi overrides.
const UNSAFE_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F​-‏‪-‮⁦-⁩]/g;

/** Strip unsafe characters, normalise line endings and trim. */
export function cleanText(value: string) {
  return value.replace(/\r\n?/g, "\n").replace(UNSAFE_CHARS, "").trim();
}

/** Single-line fields must never contain line breaks (prevents header injection). */
function singleLine(value: string) {
  return cleanText(value).replace(/\s+/g, " ");
}

export const contactSchema = z.object({
  name: z
    .string()
    .transform(singleLine)
    .pipe(
      z
        .string()
        .min(LIMITS.name.min, "Please enter your name.")
        .max(LIMITS.name.max, `Name must be under ${LIMITS.name.max} characters.`),
    ),
  email: z
    .string()
    .transform(singleLine)
    .pipe(
      z
        .email("Please enter a valid email address.")
        .max(LIMITS.email.max, "Email address is too long."),
    ),
  subject: z
    .string()
    .transform(singleLine)
    .pipe(
      z
        .string()
        .min(LIMITS.subject.min, "Please add a short subject.")
        .max(LIMITS.subject.max, `Subject must be under ${LIMITS.subject.max} characters.`),
    ),
  message: z
    .string()
    .transform(cleanText)
    .pipe(
      z
        .string()
        .min(LIMITS.message.min, `Message should be at least ${LIMITS.message.min} characters.`)
        .max(LIMITS.message.max, `Message must be under ${LIMITS.message.max} characters.`),
    ),
});

/** Anti-spam metadata sent alongside the form fields. */
export const spamSchema = z.object({
  /** Honeypot: hidden from people, often filled in by bots. */
  company_website: z.string().max(200).optional().default(""),
  /** Milliseconds the form was open before submission. */
  elapsedMs: z.number().int().nonnegative().max(86_400_000),
});

export const contactRequestSchema = contactSchema.extend(spamSchema.shape);

export type ContactInput = z.input<typeof contactSchema>;
export type ContactData = z.output<typeof contactSchema>;
export type ContactField = keyof ContactInput;
export type FieldErrors = Partial<Record<ContactField, string>>;

export function toFieldErrors(error: z.ZodError): FieldErrors {
  const errors: FieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && key in LIMITS && !(key in errors)) {
      errors[key as ContactField] = issue.message;
    }
  }
  return errors;
}

export type ContactResponse =
  | { ok: true; message: string; dryRun?: boolean }
  | { ok: false; message: string; fieldErrors?: FieldErrors };
