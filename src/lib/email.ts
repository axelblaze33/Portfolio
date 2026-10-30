import "server-only";

import { Resend } from "resend";
import type { ContactData } from "@/lib/validation";

export class EmailConfigError extends Error {}
export class EmailSendError extends Error {}

type EmailConfig = { apiKey: string; to: string; from: string };

function readConfig(): EmailConfig {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const to = process.env.CONTACT_EMAIL?.trim();
  const from = process.env.FROM_EMAIL?.trim();

  const missing = [
    !apiKey && "RESEND_API_KEY",
    !to && "CONTACT_EMAIL",
    !from && "FROM_EMAIL",
  ].filter(Boolean);

  if (missing.length) {
    throw new EmailConfigError(`Missing environment variables: ${missing.join(", ")}`);
  }
  return { apiKey: apiKey!, to: to!, from: from! };
}

/** Development-only: log instead of sending when CONTACT_DRY_RUN=true. */
export function isDryRun() {
  return process.env.NODE_ENV !== "production" && process.env.CONTACT_DRY_RUN === "true";
}

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

function renderHtml(data: ContactData) {
  const row = (label: string, value: string) =>
    `<tr><td style="padding:6px 16px 6px 0;color:#64748b;font-size:13px;vertical-align:top">${label}</td><td style="padding:6px 0;font-size:14px;color:#0f172a">${escapeHtml(value)}</td></tr>`;

  return `<!doctype html><html><body style="margin:0;padding:24px;background:#f1f5f9;font-family:-apple-system,Segoe UI,Roboto,sans-serif">
<div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;padding:28px;border:1px solid #e2e8f0">
<p style="margin:0 0 4px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#0891b2">Portfolio contact form</p>
<h1 style="margin:0 0 20px;font-size:20px;color:#0f172a">${escapeHtml(data.subject)}</h1>
<table style="border-collapse:collapse;margin-bottom:20px">${row("From", data.name)}${row("Email", data.email)}</table>
<div style="white-space:pre-wrap;font-size:15px;line-height:1.6;color:#1e293b;border-top:1px solid #e2e8f0;padding-top:20px">${escapeHtml(data.message)}</div>
<p style="margin:24px 0 0;font-size:12px;color:#94a3b8">Reply directly to this email to respond to ${escapeHtml(data.name)}.</p>
</div></body></html>`;
}

function renderText(data: ContactData) {
  return `New message from your portfolio contact form

From: ${data.name} <${data.email}>
Subject: ${data.subject}

${data.message}

—
Reply to this email to respond directly.`;
}

/**
 * Sends the contact message to CONTACT_EMAIL.
 * Resolves only when Resend accepts the request; throws otherwise.
 */
export async function sendContactEmail(data: ContactData) {
  const { apiKey, to, from } = readConfig();
  const resend = new Resend(apiKey);

  const { data: result, error } = await resend.emails.send({
    from,
    to: [to],
    replyTo: data.email,
    subject: `[Portfolio] ${data.subject} — ${data.name}`,
    text: renderText(data),
    html: renderHtml(data),
    tags: [{ name: "source", value: "portfolio_contact" }],
  });

  if (error || !result?.id) {
    throw new EmailSendError(
      `Resend rejected the request: ${error?.name ?? "unknown"} (${error?.statusCode ?? "n/a"}) ${error?.message ?? ""}`.trim(),
    );
  }
  return result.id;
}
