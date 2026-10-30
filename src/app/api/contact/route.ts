import { EmailConfigError, isDryRun, sendContactEmail } from "@/lib/email";
import { contactRateLimiter, getClientIp } from "@/lib/rate-limit";
import {
  contactRequestSchema,
  MIN_FILL_TIME_MS,
  toFieldErrors,
  type ContactResponse,
} from "@/lib/validation";

const MAX_BODY_BYTES = 16 * 1024;

function reply(status: number, body: ContactResponse, headers?: HeadersInit) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store", ...headers },
  });
}

const GENERIC_FAILURE =
  "Sorry — your message couldn't be sent right now. Please try again later or reach out another way.";

/** Reject cross-site form posts. Same-origin fetches send a matching Origin. */
function isAllowedOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true; // Non-browser clients; still rate-limited and validated.
  try {
    const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  if (!isAllowedOrigin(request)) {
    return reply(403, { ok: false, message: "Request origin not allowed." });
  }

  if (!request.headers.get("content-type")?.includes("application/json")) {
    return reply(415, { ok: false, message: "Unsupported content type." });
  }

  const ip = getClientIp(request.headers);
  const limit = await contactRateLimiter.check(ip);
  if (!limit.allowed) {
    return reply(
      429,
      {
        ok: false,
        message: "You've sent several messages in a short time. Please try again a little later.",
      },
      { "Retry-After": String(limit.retryAfterSeconds) },
    );
  }

  const raw = await request.text();
  if (new TextEncoder().encode(raw).byteLength > MAX_BODY_BYTES) {
    return reply(413, { ok: false, message: "Message is too large." });
  }

  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return reply(400, { ok: false, message: "Invalid request body." });
  }

  const parsed = contactRequestSchema.safeParse(json);
  if (!parsed.success) {
    return reply(422, {
      ok: false,
      message: "Please correct the highlighted fields.",
      fieldErrors: toFieldErrors(parsed.error),
    });
  }

  const { company_website, elapsedMs, ...data } = parsed.data;

  // Honeypot filled or form submitted implausibly fast: treat as automated.
  if (company_website || elapsedMs < MIN_FILL_TIME_MS) {
    console.warn("[contact] spam check failed", { ip, honeypot: Boolean(company_website), elapsedMs });
    return reply(400, { ok: false, message: GENERIC_FAILURE });
  }

  if (isDryRun()) {
    console.info("[contact] DRY RUN — email not sent:", data);
    return reply(200, {
      ok: true,
      dryRun: true,
      message: "Dry run: the message was validated and logged on the server, but no email was sent.",
    });
  }

  try {
    const id = await sendContactEmail(data);
    console.info("[contact] email accepted by Resend", { id });
    return reply(200, {
      ok: true,
      message: "Thanks — your message has been sent. I'll get back to you soon.",
    });
  } catch (error) {
    console.error("[contact] send failed:", error instanceof Error ? error.message : error);
    const status = error instanceof EmailConfigError ? 500 : 502;
    return reply(status, { ok: false, message: GENERIC_FAILURE });
  }
}
