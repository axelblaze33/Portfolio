# Pranav Malshikhare — Portfolio

**"Beyond the Interface — A Developer's Digital Universe."**

A personal portfolio built with Next.js 16 (App Router), TypeScript, Tailwind CSS 4 and Motion. The contact form really sends email through Resend, and the site deploys to Vercel.

- Dark-first design with an optional light theme. There is no flash on load because the saved theme is applied by an inline script before first paint.
- Pages are static. The only server code is the contact API route.
- Scroll reveals, parallax, an animated nav indicator, card tilt, a scroll progress bar and a custom cursor. All of them respect `prefers-reduced-motion`.
- Contact form: client and server validation with one shared Zod schema, a honeypot field, a minimum fill time, rate limiting, an origin check and size limits. It only reports success after Resend accepts the message.
- SEO: metadata, canonical URLs, Open Graph and Twitter images generated in code, `robots.txt`, a sitemap, a web manifest and `Person` JSON-LD.
- Measured with Lighthouse on the local production build: Desktop 100 / 100 / 100 / 100 and Mobile 94 / 100 / 100 / 100 (Performance / Accessibility / Best Practices / SEO).

---

## 1. Quick start

**Prerequisites:** [Node.js](https://nodejs.org) **20.9 or newer** (the LTS release is recommended) and Git.

```bash
node -v                 # must print v20.9.0 or higher
cd pranav-portfolio
npm install
cp .env.example .env.local   # Windows PowerShell: Copy-Item .env.example .env.local
npm run dev
```

Open http://localhost:3000.

### Scripts

| Command             | What it does                                          |
| ------------------- | ----------------------------------------------------- |
| `npm run dev`       | Development server with hot reload                    |
| `npm run build`     | Production build                                      |
| `npm start`         | Serve the production build locally                    |
| `npm run typecheck` | Generate route types, then run `tsc --noEmit`         |
| `npm run lint`      | ESLint (Next.js core-web-vitals and TypeScript rules) |
| `npm run check`     | Typecheck, then lint, then build. Run before pushing. |

### Testing the contact form locally

You can test it in either of two ways:

1. **Dry run (no email account needed).** In `.env.local`, set `CONTACT_DRY_RUN=true`, then restart `npm run dev`. Submissions are validated and printed in the terminal, and the form says that no email was sent. Dry run is ignored in production builds.
2. **Real email.** Set `RESEND_API_KEY`, `CONTACT_EMAIL` and `FROM_EMAIL` as described in [Step 4](#step-4--email-with-resend), and set `CONTACT_DRY_RUN=false`. Restart the dev server and send yourself a message.

A yellow **"Setup checklist"** panel appears in the bottom-left corner in development only. It lists every personal detail that is still missing. It is never rendered in production.

---

## 2. Project structure

```text
pranav-portfolio/
├── public/                      # Static files. Put resume.pdf and screenshots here.
│   └── images/
├── src/
│   ├── app/
│   │   ├── api/contact/route.ts # POST endpoint: validation, spam checks, rate limit, Resend
│   │   ├── projects/[slug]/     # Static detail page for each project
│   │   ├── privacy/             # Privacy notice for the contact form
│   │   ├── layout.tsx           # Fonts, metadata, theme script, nav, footer
│   │   ├── page.tsx             # Home page sections and Person JSON-LD
│   │   ├── not-found.tsx        # Custom 404 page
│   │   ├── opengraph-image.tsx  # Generated 1200×630 social preview image
│   │   ├── twitter-image.tsx    # Same image for X/Twitter
│   │   ├── icon.svg, apple-icon.tsx, manifest.ts
│   │   ├── robots.ts, sitemap.ts
│   │   └── globals.css          # Design tokens (dark/light), textures, keyframes
│   ├── components/
│   │   ├── layout/              # Navbar, footer, theme toggle, cursor, scroll progress…
│   │   ├── sections/            # Hero, About, Skills, Projects, Experience, Approach, Contact
│   │   ├── ui/                  # Button, Reveal/Stagger, SectionHeading, icons…
│   │   └── visuals/             # Hero orbit visual, terminal, project artwork (SVG)
│   ├── data/                    # ← YOUR CONTENT LIVES HERE
│   │   ├── site.ts              # Name, title, socials, email, availability, résumé
│   │   ├── skills.ts
│   │   ├── projects.ts
│   │   └── experience.ts        # Jobs, "What I bring", "How I think"
│   ├── lib/
│   │   ├── email.ts             # Resend integration (server-only)
│   │   ├── validation.ts        # Shared Zod schema and sanitising
│   │   ├── rate-limit.ts        # Pluggable rate limiter (in-memory by default)
│   │   ├── profile.ts           # Résumé detection, active socials, setup checklist
│   │   └── site-url.ts          # Canonical URL resolution
│   ├── proxy.ts                 # Returns a real 404 for unknown /projects/* slugs
│   └── types/
├── .env.example
└── next.config.ts               # Cache Components, security headers
```

---

## 3. Making it yours

All content is in `src/data/`. Anything in `[square brackets]` is a placeholder. On the site it appears with a dashed yellow underline so it's easy to spot.

| What                     | Where                                                | Notes                                                                                                             |
| ------------------------ | ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| GitHub / LinkedIn        | `src/data/site.ts` → `socials.*.href`                | Links stay hidden until a URL is set. Once set, they appear in the hero, contact section, footer and JSON-LD.      |
| Public email (mailto)    | `src/data/site.ts` → `publicEmail`                   | Hidden while empty. This is separate from `CONTACT_EMAIL`, which stays private on the server.                     |
| Availability pill        | `src/data/site.ts` → `availability`                  | Change the label, or set `show: false` to hide it.                                                                |
| Résumé                   | Save the file as `public/resume.pdf`                 | Download buttons appear automatically on the next build or dev restart.                                           |
| Experience               | `src/data/experience.ts` → `experience`              | Fill in the company, dates and verifiable accomplishments. Add more objects for more roles.                       |
| Projects                 | `src/data/projects.ts`                               | The three entries are **draft concepts**. Replace them with real work, then set `status`, `githubUrl` and `demoUrl`. |
| Project screenshots      | `public/images/x.png`, then `image: "/images/x.png"` | Without a screenshot, an abstract SVG illustration is shown.                                                       |
| Skills                   | `src/data/skills.ts`                                 | Add or remove items and categories.                                                                                |
| Headline / tagline / bio | `src/data/site.ts`, `src/components/sections/about.tsx` |                                                                                                                 |
| Colours                  | `src/app/globals.css` → `:root` / `[data-theme="light"]` | Every colour is a token, so the whole palette changes from one place.                                         |

Project `status` controls the label: `"draft"` shows "Draft concept" with a disclaimer on the detail page, `"in-progress"` shows "In progress", and `"completed"` shows no label.

---

## 4. Deployment guide

### Step 1 — Local setup

Follow [Quick start](#1-quick-start) and run `npm run check`. It should finish without errors.

### Step 2 — GitHub

1. Create an **empty** repository at https://github.com/new (for example `portfolio`). Don't add a README or .gitignore.
2. From the `pranav-portfolio` folder, run:

```bash
git init
git add .
git status                  # check that .env.local is NOT listed
git commit -m "Initial commit: portfolio site"
git branch -M main
git remote add origin https://github.com/<your-username>/portfolio.git
git push -u origin main
```

`.gitignore` excludes every `.env*` file except `.env.example`, so your keys stay out of Git.

### Step 3 — Vercel

1. Sign in at https://vercel.com with your GitHub account.
2. Click **Add New… → Project**, then **Import** your repository.
3. Vercel detects **Next.js** automatically. Leave the build command (`next build`) and output settings at their defaults. If the repository root is above `pranav-portfolio/`, set **Root Directory** to `pranav-portfolio`.
4. Open **Environment Variables** and add the variables from the table in Step 4. You can also add them later, but you must redeploy afterwards.
5. Click **Deploy**. After a minute or two you get a URL like `https://portfolio-xyz.vercel.app`.
6. Check the deployment: click through every nav link, open a project page, toggle the theme and send a test message.

**Automatic deployments:** every push to `main` triggers a production deployment. Pushes to other branches and pull requests get their own preview URLs.

### Step 4 — Email with Resend

1. Create an account at https://resend.com.
2. **API key:** go to **API Keys → Create API Key**. Choose "Sending access" and copy the key, which starts with `re_`.
3. **Choose a sender:**
   - **Testing:** use `FROM_EMAIL="Portfolio Contact <onboarding@resend.dev>"`. Without a verified domain, Resend only delivers to the email address of your own Resend account, so `CONTACT_EMAIL` must be that address. This restriction is documented by Resend; check their current docs if delivery fails.
   - **Production (recommended):** go to **Domains → Add Domain** and enter your domain (for example `your-domain.com`). Add the DNS records Resend shows (SPF/DKIM, usually TXT and MX records on a `send` subdomain) at your DNS provider, and wait until the domain shows **Verified**. Then use something like `FROM_EMAIL="Portfolio Contact <contact@your-domain.com>"` and deliver to any inbox you like.
4. **Set these environment variables** in Vercel → Project → **Settings → Environment Variables** (Production, and Preview if you want it there too):

| Variable               | Example                                       | Required        |
| ---------------------- | --------------------------------------------- | --------------- |
| `RESEND_API_KEY`       | `re_123…`                                     | Yes             |
| `CONTACT_EMAIL`        | `you@gmail.com` (the inbox that receives messages) | Yes        |
| `FROM_EMAIL`           | `Portfolio Contact <contact@your-domain.com>` | Yes             |
| `NEXT_PUBLIC_SITE_URL` | `https://your-domain.com`                     | Yes, for SEO    |
| `CONTACT_DRY_RUN`      | do not set in production                      | Dev only        |

5. **Redeploy:** environment variable changes only apply to new deployments. Go to **Deployments → ⋯ → Redeploy**.
6. **Test:** send a message from the live site. It should arrive within seconds. Hitting **Reply** should go to the visitor's address, because the server sets `replyTo`. You can see each attempt and its status under **Emails** in the Resend dashboard.

### Step 5 — Custom domain

1. Buy a domain from any registrar (Namecheap, GoDaddy, Cloudflare, Google/Squarespace, Hostinger…) or directly from Vercel.
2. In Vercel, go to **Project → Settings → Domains → Add** and enter `your-domain.com`. Vercel suggests adding `www.your-domain.com` too, and a redirect between the two.
3. At your registrar, create the records Vercel displays. Typically these are:
   - Apex (`your-domain.com`): an **A** record pointing to `76.76.21.21` (always use the value shown on your project's domain card).
   - `www`: a **CNAME** record pointing to the project-specific target Vercel shows.
   - Alternatively, switch the domain's nameservers to Vercel. Copy any existing MX/TXT records (email, Resend) first.
4. Wait for the domain to show **Valid Configuration**. Vercel issues the HTTPS certificate automatically. DNS changes can take anywhere from minutes to a few hours.
5. Set `NEXT_PUBLIC_SITE_URL=https://your-domain.com` (or the `www` version, whichever is your primary) and **redeploy**, so canonical URLs, the sitemap and social previews use the final domain.
6. Check that the non-primary host redirects to the primary one, and that `http://` redirects to `https://`.

### Step 6 — Final production checklist

- [ ] Every nav link scrolls to the correct section, on desktop and mobile.
- [ ] The mobile menu opens and closes, and Escape and tapping a link both close it.
- [ ] No horizontal scrolling on a real phone (Android Chrome and iOS Safari).
- [ ] The contact form shows errors for empty or invalid fields.
- [ ] A real message arrives in your inbox, and Reply goes to the sender.
- [ ] Spam protection: six quick submissions in a row should show a "try again later" message.
- [ ] Social previews: paste your URL into https://www.opengraph.xyz or the LinkedIn Post Inspector.
- [ ] Lighthouse (Chrome DevTools → Lighthouse) on mobile and desktop.
- [ ] `robots.txt` and `sitemap.xml` show your real domain.
- [ ] No secrets committed: `git log -p | grep -i "re_"` should find nothing.
- [ ] The dev "Setup checklist" is empty, so all placeholders have been replaced.
- [ ] `public/resume.pdf` is present and the download works.

**Updating later:** edit the files in `src/data/`, replace `public/resume.pdf`, run `npm run check`, then `git commit` and `git push`. Vercel redeploys automatically.

---

## 5. Contact form: how it works

```
Browser form ──► Zod validation (client) ──► POST /api/contact (JSON)
                                                │
          origin check → content-type → rate limit (5 / 15 min / IP)
          → body ≤ 16 KB → JSON parse → Zod validation + sanitising (server)
          → honeypot + minimum fill time (2.5 s) → Resend emails.send()
                                                │
                       200 only if Resend returns an email id
```

| Status | Meaning                                                                    |
| ------ | -------------------------------------------------------------------------- |
| 200    | Resend accepted the email (or a dev dry run)                               |
| 400    | Malformed JSON, or spam checks failed (a generic message is shown)         |
| 403    | Cross-site origin                                                          |
| 413    | Body too large                                                             |
| 415    | Not JSON                                                                   |
| 422    | Validation failed; `fieldErrors` explains which fields                     |
| 429    | Rate limited; includes a `Retry-After` header                              |
| 500    | Server not configured (missing environment variables, logged server-side) |
| 502    | Resend rejected or failed the send                                         |

Visitors only ever see generic messages. Details such as missing variables or Resend error codes go to the server logs (Vercel → Project → **Logs**).

Hardening details:

- Single-line fields have line breaks stripped, which prevents header injection.
- Control and bidi characters are removed.
- All values are HTML-escaped in the email body.
- The visitor's address is used only as `replyTo` and never as the sender.

### Rate limiting on serverless: limitations

`src/lib/rate-limit.ts` stores counters **in memory**. On Vercel, each function instance has its own memory and instances are recycled, so the limit applies per warm instance, not globally. That is enough to slow down a single noisy client, but it isn't a strict guarantee. The client IP comes from `x-forwarded-for`, which Vercel sets itself. If you self-host behind another proxy, make sure that proxy overwrites the header.

For a shared, global limit, implement the `RateLimiter` interface with Redis, for example [Upstash](https://upstash.com) through the Vercel Marketplace:

```bash
npm install @upstash/ratelimit @upstash/redis
```

```ts
// src/lib/rate-limit.ts — replace contactRateLimiter
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const upstash = new Ratelimit({
  redis: Redis.fromEnv(), // UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN
  limiter: Ratelimit.fixedWindow(5, "15 m"),
  prefix: "contact",
});

export const contactRateLimiter: RateLimiter = {
  async check(key) {
    const { success, reset } = await upstash.limit(key);
    return { allowed: success, retryAfterSeconds: Math.max(0, Math.ceil((reset - Date.now()) / 1000)) };
  },
};
```

If bots ever get through, add [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/) and verify its token in the route before sending.

---

## 6. Costs and plan limits

These were checked on the providers' pricing pages in October 2026. Plans change, so confirm them before you rely on them.

| Service    | Free tier                                                                                                            | When you might pay                                                                                                                 |
| ---------- | -------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **Vercel** | Hobby: $0/month, **personal and non-commercial use only**, 100 GB data transfer and 1M function invocations per month. Custom domains are supported. | Pro is $20/month per member if you need commercial use or more resources. A personal portfolio fits comfortably in Hobby.          |
| **Resend** | Free: 3,000 emails/month, **100 per day**, up to 3 domains                                                           | Pro is $20/month for 50,000 emails. Contact-form volume rarely gets close to the free limits.                                      |
| **Domain** | Not free                                                                                                             | Roughly $10–20/year for a `.com` or `.dev`, depending on the registrar. Renewal prices are often higher than the first year.        |
| **GitHub** | Free public or private repositories                                                                                  | Not needed for this project.                                                                                                       |

---

## 7. Troubleshooting

| Problem                                                     | Fix                                                                                                                                                                                         |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Form says "couldn't be sent", Vercel log says `Missing environment variables` | Add the three Resend variables in Vercel and **redeploy**.                                                                                                       |
| Log shows `API key is invalid` (401)                        | Copy the key again with no spaces or quotes, check you're using the right Resend account, then redeploy.                                                                                   |
| Log shows a 403 or "domain is not verified"                 | `FROM_EMAIL` uses a domain that isn't verified. Verify it in Resend, or use `onboarding@resend.dev` while testing.                                                                          |
| Works with `onboarding@resend.dev` but nothing arrives      | With the test sender, `CONTACT_EMAIL` must be your Resend account email. Check the spam folder and the Resend **Emails** log.                                                              |
| Emails land in spam                                         | Verify your domain (SPF/DKIM) and add a DMARC record (`_dmarc` TXT `v=DMARC1; p=none;`). Avoid free-mail addresses such as Gmail as `FROM_EMAIL`.                                           |
| 429 while testing                                           | You hit the rate limit of 5 per 15 minutes. Wait, or restart the dev server to reset the in-memory counters.                                                                               |
| 403 "Request origin not allowed"                            | The form was posted from a different host. Submit from the deployed site itself.                                                                                                           |
| Build fails on Vercel but works locally                     | Run `npm run check` locally. Make sure the Node version in Vercel → Settings → General is 20.x or newer, and that **Root Directory** points to the project folder.                         |
| Social preview shows `localhost`                            | Set `NEXT_PUBLIC_SITE_URL` and redeploy. Social sites cache previews, so re-scrape with their inspector tools.                                                                               |
| Domain shows "Invalid Configuration"                        | Remove conflicting A/AAAA/CNAME records at the registrar, use the exact values from Vercel's domain card, and wait for DNS to propagate.                                                     |
| Résumé button missing                                       | The file must be named exactly `public/resume.pdf`. Rebuild or restart the dev server afterwards.                                                                                           |

---

## 8. Technical notes

- **Next.js 16 with Cache Components** (`cacheComponents: true`). Pages are prerendered at build time. Version-matched framework docs ship in `node_modules/next/dist/docs/` (see `AGENTS.md`).
- **Hero entrance animations use CSS** rather than JavaScript, so the headline paints before hydration, which keeps LCP fast. Motion handles everything that is scroll- or pointer-driven.
- **Native scrolling** (no Lenis). CSS smooth scrolling is turned off for reduced-motion users and never hijacks the wheel or touch input.
- **Custom cursor** is a trailing ring added alongside the system cursor, not a replacement. It's only enabled for fine pointers without reduced motion.
- **Security headers** (`nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`) are set in `next.config.ts`.
- No analytics, tracking or cookies. The theme preference is stored in `localStorage`.
