import "server-only";

import { Resend } from "resend";
import { siteUrl } from "@/lib/site-url";
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

const receivedAt = () =>
  new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date()) + " IST";

const replyHref = (data: ContactData) =>
  `mailto:${data.email}?subject=${encodeURIComponent(`Re: ${data.subject}`)}`;

/** Email-client-safe HTML: tables and inline styles only, matching the site's gold HUD look. */
function renderHtml(data: ContactData, time: string) {
  const row = (label: string, value: string) =>
    `<tr><td style="padding:8px 16px 8px 0;color:#8f837a;font:11px/1.4 ui-monospace,Menlo,Consolas,monospace;letter-spacing:.12em;text-transform:uppercase;vertical-align:top;white-space:nowrap">${label}</td><td style="padding:8px 0;font-size:15px;color:#17100c">${value}</td></tr>`;
  const email = escapeHtml(data.email);
  const site = escapeHtml(siteUrl.replace(/^https?:\/\//, ""));

  return `<!doctype html><html><body style="margin:0;padding:24px 12px;background:#efe9e1;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;border-collapse:separate;border-radius:14px;overflow:hidden;background:#ffffff;border:1px solid #e3d9cd">
<tr><td style="background:#0f0b0d;padding:22px 28px;border-bottom:3px solid #f5b83d">
<p style="margin:0 0 8px;font:11px/1 ui-monospace,Menlo,Consolas,monospace;letter-spacing:.22em;color:#f5b83d">&#9679; INCOMING TRANSMISSION</p>
<h1 style="margin:0;font-size:22px;line-height:1.3;color:#f4efe8">${escapeHtml(data.subject)}</h1>
</td></tr>
<tr><td style="padding:22px 28px 6px">
<table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse">
${row("From", escapeHtml(data.name))}
${row("Email", `<a href="mailto:${email}" style="color:#9a5800;text-decoration:none">${email}</a>`)}
${row("Received", escapeHtml(time))}
</table>
</td></tr>
<tr><td style="padding:14px 28px 6px">
<div style="white-space:pre-wrap;font-size:15px;line-height:1.65;color:#1f1712;background:#faf6f0;border-left:3px solid #e8323c;border-radius:6px;padding:16px 18px">${escapeHtml(data.message)}</div>
</td></tr>
<tr><td style="padding:20px 28px 26px">
<a href="${escapeHtml(replyHref(data))}" style="display:inline-block;background:#f5b83d;color:#1a0f00;font-weight:600;font-size:14px;text-decoration:none;padding:12px 22px;border-radius:999px">Reply to ${escapeHtml(data.name)} &rarr;</a>
<p style="margin:14px 0 0;font-size:12px;color:#8f837a">Or just hit Reply — it goes straight to ${email}.</p>
</td></tr>
<tr><td style="padding:14px 28px;background:#faf6f0;border-top:1px solid #efe6da;font:11px/1.5 ui-monospace,Menlo,Consolas,monospace;color:#8f837a">Sent from the contact form on ${site}</td></tr>
</table>
</body></html>`;
}

function renderText(data: ContactData, time: string) {
  return `INCOMING TRANSMISSION — portfolio contact form

Subject:  ${data.subject}
From:     ${data.name} <${data.email}>
Received: ${time}

${data.message}

—
Reply to this email to respond to ${data.name} directly.
Sent from the contact form on ${siteUrl.replace(/^https?:\/\//, "")}`;
}

/**
 * Sends the contact message to CONTACT_EMAIL.
 * Resolves only when Resend accepts the request; throws otherwise.
 */
export async function sendContactEmail(data: ContactData) {
  const { apiKey, to, from } = readConfig();
  const resend = new Resend(apiKey);
  const time = receivedAt();

  const { data: result, error } = await resend.emails.send({
    from,
    to: [to],
    replyTo: data.email,
    subject: `[Portfolio] ${data.subject} — ${data.name}`,
    text: renderText(data, time),
    html: renderHtml(data, time),
    tags: [{ name: "source", value: "portfolio_contact" }],
  });

  if (error || !result?.id) {
    throw new EmailSendError(
      `Resend rejected the request: ${error?.name ?? "unknown"} (${error?.statusCode ?? "n/a"}) ${error?.message ?? ""}`.trim(),
    );
  }
  return result.id;
}
