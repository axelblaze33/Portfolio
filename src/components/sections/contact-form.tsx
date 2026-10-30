"use client";

import { CircleAlert, CircleCheck, LoaderCircle, RotateCcw, Send } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import Link from "next/link";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import {
  contactSchema,
  LIMITS,
  toFieldErrors,
  type ContactField,
  type ContactInput,
  type ContactResponse,
  type FieldErrors,
} from "@/lib/validation";

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string };

const EMPTY: ContactInput = { name: "", email: "", subject: "", message: "" };

const FIELDS: { name: ContactField; label: string; type?: string; autoComplete: string; placeholder: string }[] = [
  { name: "name", label: "Name", autoComplete: "name", placeholder: "Your name" },
  { name: "email", label: "Email", type: "email", autoComplete: "email", placeholder: "you@example.com" },
  { name: "subject", label: "Subject", autoComplete: "off", placeholder: "What's this about?" },
];

// Quick starters that fill in the subject; typing your own subject overrides them.
const TOPICS = ["Job opportunity", "Freelance project", "Collaboration", "Just saying hi"];

const inputClass =
  "w-full rounded-xl border bg-bg/50 px-4 py-3 text-base text-fg sm:text-[15px] placeholder:text-fg-subtle transition-[border-color,box-shadow] outline-none focus:border-accent focus:ring-4 focus:ring-accent/15 aria-[invalid=true]:border-[#f87171]";

export function ContactForm() {
  const id = useId();
  const [values, setValues] = useState<ContactInput>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const openedAt = useRef(0);
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    openedAt.current = performance.now();
  }, []);

  useEffect(() => {
    if (status.kind === "success") successRef.current?.focus({ preventScroll: true });
  }, [status.kind]);

  function pickTopic(topic: string) {
    // Only replace the subject if it's empty or still holds another topic.
    if (values.subject && !TOPICS.includes(values.subject)) return;
    update("subject", values.subject === topic ? "" : topic);
  }

  function reset() {
    setStatus({ kind: "idle" });
    openedAt.current = performance.now();
    requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('[name="name"]')?.focus());
  }

  function validateField(name: ContactField, value: string) {
    const result = contactSchema.shape[name].safeParse(value);
    setErrors((prev) => ({ ...prev, [name]: result.success ? undefined : result.error.issues[0]?.message }));
  }

  function update(name: ContactField, value: string) {
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) validateField(name, value);
    if (status.kind === "error" || status.kind === "success") setStatus({ kind: "idle" });
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status.kind === "submitting") return;

    const parsed = contactSchema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors = toFieldErrors(parsed.error);
      setErrors(fieldErrors);
      const first = (Object.keys(fieldErrors) as ContactField[])[0];
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    const honeypot = new FormData(e.currentTarget).get("company_website");
    setStatus({ kind: "submitting" });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          company_website: typeof honeypot === "string" ? honeypot : "",
          elapsedMs: Math.round(performance.now() - openedAt.current),
        }),
      });
      const data = (await res.json().catch(() => null)) as ContactResponse | null;

      if (res.ok && data?.ok) {
        setStatus({ kind: "success", message: data.message });
        setValues(EMPTY);
        setErrors({});
        return;
      }
      if (data && !data.ok && data.fieldErrors) setErrors(data.fieldErrors);
      setStatus({
        kind: "error",
        message: data?.message ?? "Something went wrong. Please try again in a moment.",
      });
    } catch {
      setStatus({ kind: "error", message: "Network error — check your connection and try again." });
    }
  }

  const submitting = status.kind === "submitting";
  const messageLength = values.message.length;

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="glass relative overflow-hidden rounded-3xl shadow-card" aria-describedby={`${id}-privacy`}>
      <div className="flex items-center justify-between border-b border-line px-5 py-3 font-mono text-xs text-fg-subtle sm:px-7">
        <span>
          <span className="text-accent">~/</span>message.compose
        </span>
        <span className="flex items-center gap-2" aria-hidden="true">
          <span className="relative flex size-1.5">
            <span className="status-ping absolute inset-0 rounded-full bg-accent-3/70" />
            <span className="relative size-1.5 rounded-full bg-accent-3" />
          </span>
          secure channel
        </span>
      </div>

      {status.kind === "success" ? (
        <m.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center px-6 py-14 text-center sm:py-20"
        >
          <span className="relative grid size-16 place-items-center rounded-full border border-accent-3/50 shadow-[0_0_30px_-4px_var(--accent-3)]">
            <span className="status-ping absolute inset-0 rounded-full border border-accent-3/40" aria-hidden="true" />
            <CircleCheck className="size-7 text-accent-3" aria-hidden="true" />
          </span>
          <p className="mt-6 font-mono text-xs tracking-[0.2em] text-accent uppercase">Transmission received</p>
          <h3 ref={successRef} tabIndex={-1} className="mt-2 text-2xl font-semibold tracking-tight outline-none">
            Message sent.
          </h3>
          <p className="mt-3 max-w-sm text-fg-muted">{status.message}</p>
          <button
            type="button"
            onClick={reset}
            className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-full border border-line-strong px-5 text-sm text-fg transition-colors hover:border-accent/60 hover:text-accent"
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            Send another message
          </button>
        </m.div>
      ) : (
        <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-7">
          <div className="sm:col-span-2">
            <p id={`${id}-topics`} className="mb-2.5 text-sm font-medium text-fg">
              What&apos;s it about? <span className="font-normal text-fg-subtle">(optional)</span>
            </p>
            <div role="group" aria-labelledby={`${id}-topics`} className="flex flex-wrap gap-2">
              {TOPICS.map((topic) => {
                const active = values.subject === topic;
                return (
                  <button
                    key={topic}
                    type="button"
                    aria-pressed={active}
                    onClick={() => pickTopic(topic)}
                    disabled={submitting}
                    className={`min-h-9 rounded-full border px-3.5 text-[13px] transition-colors ${
                      active
                        ? "border-accent bg-accent/15 text-accent"
                        : "border-line text-fg-muted hover:border-accent/50 hover:text-fg"
                    }`}
                  >
                    {topic}
                  </button>
                );
              })}
            </div>
          </div>

          {FIELDS.map((f) => (
            <div key={f.name} className={f.name === "subject" ? "sm:col-span-2" : ""}>
              <label htmlFor={`${id}-${f.name}`} className="mb-2 block text-sm font-medium text-fg">
                {f.label} <span className="text-accent" aria-hidden="true">*</span>
              </label>
              <input
                id={`${id}-${f.name}`}
                name={f.name}
                type={f.type ?? "text"}
                autoComplete={f.autoComplete}
                placeholder={f.placeholder}
                required
                maxLength={LIMITS[f.name].max}
                value={values[f.name]}
                onChange={(e) => update(f.name, e.target.value)}
                onBlur={(e) => e.target.value && validateField(f.name, e.target.value)}
                aria-invalid={errors[f.name] ? true : undefined}
                aria-describedby={errors[f.name] ? `${id}-${f.name}-error` : undefined}
                className={`${inputClass} border-line`}
                disabled={submitting}
              />
              {errors[f.name] && (
                <p id={`${id}-${f.name}-error`} className="mt-1.5 text-sm text-[#f87171]">
                  {errors[f.name]}
                </p>
              )}
            </div>
          ))}

          <div className="sm:col-span-2">
            <div className="mb-2 flex items-baseline justify-between">
              <label htmlFor={`${id}-message`} className="text-sm font-medium text-fg">
                Message <span className="text-accent" aria-hidden="true">*</span>
              </label>
              <span className="flex items-center gap-3 font-mono text-xs text-fg-subtle">
                <span className="hidden md:inline" aria-hidden="true">
                  Ctrl + ↵ to send
                </span>
                <span id={`${id}-message-count`} className={messageLength > LIMITS.message.max * 0.9 ? "text-accent-3" : ""}>
                  {messageLength}/{LIMITS.message.max}
                </span>
              </span>
            </div>
            <textarea
              id={`${id}-message`}
              name="message"
              rows={6}
              required
              maxLength={LIMITS.message.max}
              placeholder="Tell me a little about your project, role or idea…"
              value={values.message}
              onChange={(e) => update("message", e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                  e.preventDefault();
                  formRef.current?.requestSubmit();
                }
              }}
              onBlur={(e) => e.target.value && validateField("message", e.target.value)}
              aria-invalid={errors.message ? true : undefined}
              aria-describedby={`${errors.message ? `${id}-message-error ` : ""}${id}-message-count`}
              className={`${inputClass} min-h-40 resize-y border-line`}
              disabled={submitting}
            />
            {errors.message && (
              <p id={`${id}-message-error`} className="mt-1.5 text-sm text-[#f87171]">
                {errors.message}
              </p>
            )}
          </div>

          {/* Honeypot: invisible to people and assistive tech, tempting to bots. */}
          <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
            <label htmlFor={`${id}-hp`}>Leave this field empty</label>
            <input id={`${id}-hp`} type="text" name="company_website" tabIndex={-1} autoComplete="off" defaultValue="" />
          </div>

          <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
            <p id={`${id}-privacy`} className="max-w-sm text-xs leading-relaxed text-fg-subtle">
              Your message is emailed to me and not stored on this site.{" "}
              <Link href="/privacy" className="underline underline-offset-2 hover:text-fg">
                Privacy notice
              </Link>
              .
            </p>
            <button
              type="submit"
              disabled={submitting}
              aria-disabled={submitting}
              className="group inline-flex min-h-12 w-full shrink-0 items-center justify-center gap-2 rounded-full bg-accent px-7 text-sm font-medium text-accent-ink transition-[transform,box-shadow,opacity] hover:-translate-y-0.5 hover:shadow-[0_12px_40px_-12px_var(--accent)] active:scale-[0.97] disabled:opacity-70 sm:w-auto"
            >
              {submitting ? (
                <>
                  <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
                  Sending…
                </>
              ) : (
                <>
                  Send message
                  <Send className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                </>
              )}
            </button>
          </div>

          <AnimatePresence>
            {status.kind === "error" && (
              <m.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-start gap-3 rounded-xl border border-[#f87171]/40 bg-[#f87171]/10 px-4 py-3 text-sm text-fg sm:col-span-2"
              >
                <CircleAlert className="mt-0.5 size-4 shrink-0 text-[#f87171]" aria-hidden="true" />
                {status.message}
              </m.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Always mounted so screen readers announce both outcomes. */}
      <p aria-live="polite" role="status" className="sr-only">
        {status.kind === "success" || status.kind === "error" ? status.message : ""}
      </p>
    </form>
  );
}
