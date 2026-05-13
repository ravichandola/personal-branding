# Ravi Chandola — Personal branding platform

Production-grade portfolio and CMS scaffold: Next.js 15 App Router, React 19, Prisma ORM + PostgreSQL, Auth.js (NextAuth v5, JWT sessions), Tailwind CSS v4, Framer Motion, TanStack Query, `@vercel/analytics`, `@vercel/speed-insights`, Docker, GitHub Actions (lint, Vitest, Playwright, production build against Postgres).

**Detailed docs & deep dives:** [docs/README.md](docs/README.md)

---

## Prerequisites

| Requirement | Notes |
|-------------|--------|
| **Node.js** | **22.x** recommended (matches CI `.github/workflows/ci.yml`). LTS 20.x usually works. |
| **npm** | Uses `package-lock.json` — prefer `npm ci` in CI and clean clones. |
| **PostgreSQL** | **16** locally via Docker Compose, or hosted (Neon, RDS, etc.). |
| **Optional** | Google OAuth credentials for admin SSO; Resend for contact email; Cloudinary for avatars. |

---

## Configuration specs

### Environment variables

Create a local env file from the template (repo ships `.env.example`; use `.env` or `.env.local` — both are gitignored):

```bash
cp .env.example .env.local
```

| Variable | Required locally | Purpose |
|----------|------------------|---------|
| `NODE_ENV` | Optional | `development` locally; production is set by the host. |
| `NEXT_PUBLIC_SITE_URL` | **Yes** | Public site URL for SEO/Open Graph. **Must match the origin you open in the browser**, including **port** (e.g. `http://localhost:3001`). Used with `generateMetadata()` / `metadataBase`. |
| `DATABASE_URL` | **Yes** | Prisma + Postgres connection string. Example local: `postgresql://postgres:postgres@localhost:5432/ravi_brand` (same DB name as `docker-compose.yml`). |
| `AUTH_SECRET` | **Yes** (non-dev hacks) | Session/JWT signing. Generate: `openssl rand -hex 32`. |
| `AUTH_URL` | **Yes** | Must equal the URL users hit in the browser (**same host + port** as `NEXT_PUBLIC_SITE_URL` in typical setups). |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | No | Google OAuth for `/admin/login` when both set. |
| `ALLOWED_ADMIN_EMAILS` | Recommended prod | Comma-separated emails allowed to use admin after OAuth. |
| `ADMIN_BOOTSTRAP_EMAIL` / `ADMIN_BOOTSTRAP_PASSWORD` | For seed | Used **only** by `npm run db:seed` to create the first credential user. |
| `RESEND_API_KEY` / `RESEND_FROM_EMAIL` | No | Outbound mail via Resend for contact notifications. |
| `CONTACT_NOTIFY_EMAIL` | No | Inbox for contact form alerts (falls back to other env names in code paths). |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | No | Profile avatar uploads in admin. |
| `OPENAI_API_KEY` | No | Reserved for AI extension features. |
| `MEDIUM_FEED_URL` | No | Override Medium RSS for `npm run db:sync-medium`. |
| `MEDIUM_EXPORT_ZIP` | No | Used with `npm run db:import-medium-export` for bulk Medium archive import. |

**Port alignment:** If you run `next dev -- -p 3001`, set **`NEXT_PUBLIC_SITE_URL`** and **`AUTH_URL`** to `http://localhost:3001`. The Docker Compose **`web`** service example uses **3000** — keep env vars consistent with whichever URL you actually open.

### Build & deploy configuration

| File | Role |
|------|------|
| `vercel.json` | `buildCommand`: `prisma generate && prisma migrate deploy && next build`; region `bom1`. |
| `next.config.ts` | Strict mode, image remote patterns (Cloudinary, GitHub, Medium, LinkedIn, etc.). |
| `prisma/schema.prisma` | Single source of truth for DB models; client emitted to `src/generated/prisma` (`postinstall`: `prisma generate`). |
| `vitest.config.ts` | Unit/component tests under `tests/unit/`. |
| `playwright.config.ts` | E2E under `e2e/`; dev server + Chromium; CI-aware retries/reporters. |

---

## How to run this project

### 1. Install dependencies

```bash
npm ci          # preferred for reproducible installs
# or
npm install
```

`postinstall` runs **`prisma generate`** (requires valid `schema.prisma`; DB not required for generate).

### 2. Start Postgres (local)

```bash
docker compose up -d db
```

This exposes Postgres on **localhost:5432** with database **`ravi_brand`** (user/password `postgres`/`postgres` per `docker-compose.yml`).

### 3. Configure environment

```bash
cp .env.example .env.local
```

Edit **`DATABASE_URL`**, **`AUTH_SECRET`**, **`AUTH_URL`**, and **`NEXT_PUBLIC_SITE_URL`** at minimum. Match **port** to your dev server (see below).

### 4. Apply migrations & seed

```bash
npx prisma migrate dev    # interactive dev migrations
# or for a blank DB matching repo migrations:
npx prisma migrate deploy

npm run db:seed           # optional: bootstrap admin + demo CMS content
```

### 5. Run the Next.js app (development)

Default Next port is **3000**. This repo’s `.env.example` uses **3001**:

```bash
npm run dev -- --port 3001
```

Then open **`http://localhost:3001`** — keep **`AUTH_URL`** and **`NEXT_PUBLIC_SITE_URL`** on that same origin.

### 6. Production-style run (local)

```bash
npm run build
npm start
```

Ensure **`DATABASE_URL`** (and auth secrets) are set; run **`prisma migrate deploy`** against that database before or as part of deploy.

### Full Docker stack (optional)

```bash
docker compose up --build
```

The bundled **`web`** service builds the Dockerfile and serves on **http://localhost:3000** with env wired to the compose **`db`** service. Override **`NEXT_PUBLIC_SITE_URL`** / **`AUTH_URL`** if you expose a different host/port.

---

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Next.js development server |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint (Next core-web-vitals + TypeScript) |
| `npm run test` | Vitest unit suite (`vitest run`) |
| `npm run test:watch` | Vitest watch mode |
| `npm run test:e2e` | Playwright (starts dev server per `playwright.config.ts`) |
| `npm run test:e2e:ui` | Playwright UI mode |
| `npm run test:all` | Vitest then Playwright |
| `npm run db:generate` | `prisma generate` |
| `npm run db:migrate` | `prisma migrate dev` |
| `npm run db:push` | `prisma db push` (prototyping only; prefer migrations) |
| `npm run db:seed` | Run `prisma/seed.ts` |
| `npm run db:studio` | Prisma Studio GUI |
| `npm run db:sync-medium` | Sync posts from Medium RSS |
| `npm run db:import-medium-export` | Import from Medium export ZIP |
| `npm run analyze` | Bundle analyzer (`ANALYZE=true next build`) |

---

## Testing & CI

- **Unit tests:** `npm run test` — reporters include GitHub Actions annotations + JUnit under `test-results/` when **`CI=true`**.
- **E2E:** `npx playwright install chromium` once per machine, then `npm run test:e2e`.
- **GitHub Actions:** `.github/workflows/ci.yml` — Postgres service, `npm ci`, lint, Vitest, `prisma migrate deploy`, `next build`, Playwright + artifact uploads on failure.

---

## Authenticating to `/admin`

1. Run **`npm run db:seed`** with **`ADMIN_BOOTSTRAP_EMAIL`** / **`ADMIN_BOOTSTRAP_PASSWORD`** set (see `.env.example`).
2. Visit **`/admin/login`**.
3. Use **Google** when OAuth env vars are set; otherwise use **credentials** with the seeded user.
4. Restrict access in production with **`ALLOWED_ADMIN_EMAILS`**.

JWT **`middleware.ts`** protects **`/admin/*`** except **`/admin/login`**; marketing routes stay public.

---

## Deploy on Vercel (free `.vercel.app` URL — no custom domain needed)

Paid domain खरीदना ज़रूरी नहीं: हर डिप्लॉय पर Vercel अपने आप `https://<project-name>.vercel.app` देता है।

1. **GitHub** पर repo push करें।
2. [vercel.com](https://vercel.com) → **Add New… → Project** → repo import करें।
3. **Postgres**: [Neon](https://neon.tech) या Vercel marketplace से **फ्री** Postgres लें। `DATABASE_URL` कॉपी करें (`?sslmode=require` अगर Neon कहे)।  
4. Vercel project **Settings → Environment Variables** में ये डालें (Production + Preview चाहिए तो दोनों):

   | Name | Example / note |
   | --- | --- |
   | `DATABASE_URL` | Neon connection string |
   | `AUTH_SECRET` | `openssl rand -base64 32` |
   | `AUTH_URL` | पहली deploy के बाद: **`https://<your-deployment>.vercel.app`** |
   | `NEXT_PUBLIC_SITE_URL` | **`AUTH_URL` जैसा ही** (SEO / canonical लिंक्स के लिए) |
   | `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | खाली छोड़ें अगर सिर्फ email/password से login हो |
   | `ALLOWED_ADMIN_EMAILS` | (optional) Google login के लिए अपनी comma-separated emails |

5. पहली successful deploy के बाद Vercel द्वारा दिया गया **`https://…vercel.app`** URL **`AUTH_URL` और `NEXT_PUBLIC_SITE_URL`** दोनों में अपडेट करके **Redeploy** करें (Auth और metadata सही रहेंगे)।

Build Vercel पर `vercel.json` से चलेगी: `prisma generate && prisma migrate deploy && next build` — इसलिए **`DATABASE_URL`** build समय भी उपलब्ध होना चाहिए।

**Seed / admin user एक बार (अपने laptop से Neon पर):**

```bash
DATABASE_URL="postgresql://...neon.tech/...?sslmode=require" \
  ADMIN_BOOTSTRAP_EMAIL="aapka@email.com" \
  ADMIN_BOOTSTRAP_PASSWORD="majboor-tak-mazboot-password" \
  npm run db:seed
```

इसके बाद production पर `/admin/login` से इसी email/password से login करें।

**CLI डिप्लॉय (वैकल्पिक):** `npx vercel login` फिर रिपो root में `npx vercel --prod`। मशीन पर खाता लॉगइन हो तभी चलेगा; वरना उपर वाला GitHub-import आसान है।

---

## Repo map

```
src/
├── app/              # `(site)` marketing shell + `(admin)` console + APIs
├── features/         # Pages features (blog, contact, admin panels, …)
├── components/       # UI kit + layout chrome
├── config/           # Site metadata + structured data
├── hooks/, lib/, providers/
├── auth.ts           # Auth.js config + providers
├── middleware.ts     # JWT gate for `/admin/*`
├── prisma/schema.prisma
└── prisma/seed.ts

docs/                 # Technical docs: 01-foundation … 09-reference + docs/README.md (read folders in order)
tests/unit/           # Vitest suites
e2e/                  # Playwright specs
public/               # Static assets (favicon, icons — avoid duplicating app/favicon.ico)
```

## Favicons

Serve **`public/favicon.ico`**, **`public/icon.png`**, **`public/apple-icon.png`**. Do **not** add **`src/app/favicon.ico`** at the same time — Next.js errors with conflicting public vs app routes.

## Operational security

Contact submissions go to Postgres with validation (Zod), honeypot, per-email throttling, optional Resend notifications. Harden further (e.g. Upstash rate limiting) if you add more public mutations.

### AI integrations

Wire **`AiExtension`** and **`OPENAI_API_KEY`** when ready; orchestration belongs under services/features — UI placeholders may exist ahead of backend completion.
