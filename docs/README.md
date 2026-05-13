# Documentation — personal-branding

Technical docs for this Next.js portfolio + admin CMS.

**Reading order.** Subfolders under `docs/` use two-digit prefixes (`01-…` through `09-…`) so they sort chronologically on disk—follow them in numerical order after the setup notes below: **01** foundation / orientation, **02** data, **03** public site, **04** admin CMS, **05** UI system, **06** SEO, **07** AI, **08** quality & delivery, **09** reference (glossary last).

Start with the [**Configuration (quick reference)**](#configuration-quick-reference) section so local and deployed environments stay aligned.

---

## Configuration (quick reference)

### 1. Environment variables

Copy the repo template and edit locally (never commit real secrets):

```bash
cp .env.example .env.local
```

| Variable | Purpose |
|----------|---------|
| `NODE_ENV` | `development` locally; production set by host |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL (**must match the origin users open**, including port in dev). Drives metadata base (`generateMetadata` also derives host from requests where relevant). |
| `DATABASE_URL` | Postgres connection string for Prisma (local Docker/Neon/etc.). |
| `AUTH_SECRET` | Signing secret for Auth.js sessions (`openssl rand -hex 32`). |
| `AUTH_URL` | **Must equal** the URL you open in the browser (e.g. `http://localhost:3001` if dev runs on 3001). |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Optional Google OAuth for admin login |
| `ALLOWED_ADMIN_EMAILS` | Comma-separated emails permitted for `/admin` after OAuth |
| `ADMIN_BOOTSTRAP_EMAIL` / `ADMIN_BOOTSTRAP_PASSWORD` | Used **only** by `npm run db:seed` to create the first admin |
| `RESEND_API_KEY` / `RESEND_FROM_EMAIL` / `CONTACT_NOTIFY_EMAIL` | Optional Resend outbound mail for contact notifications |
| `CLOUDINARY_*` | Optional avatar/uploads via Cloudinary |
| `OPENAI_API_KEY` | Future AI features (`AiExtension` / tooling) |
| `CONTACT_ALERT_EMAIL` / `CONTACT_ALERT_PASSWORD` | Legacy aliases referenced in some scripts |

See **[01-foundation/Configuration-and-Environment.md](01-foundation/Configuration-and-Environment.md)** and **[01-foundation/Site-Configuration.md](01-foundation/Site-Configuration.md)** for narrative detail.

### 2. Install & database

```bash
npm ci
cp .env.example .env.local   # then edit
npx prisma migrate dev       # or db push during prototyping
npm run db:seed               # optional: bootstrap admin + demo CMS rows
npm run dev -- --port 3001   # align port with NEXT_PUBLIC_SITE_URL + AUTH_URL
```

Common scripts:

| Script | Use |
|--------|-----|
| `npm run dev` | Next.js dev server |
| `npm run build` / `npm start` | Production build / serve |
| `npm run lint` | ESLint |
| `npm run test` | Vitest unit suite |
| `npm run test:e2e` | Playwright (starts dev server from config) |
| `npm run test:all` | Vitest + Playwright |
| `npm run db:migrate` | Prisma migrate dev |
| `npm run db:seed` | Seed from `prisma/seed.ts` |
| `npm run db:sync-medium` | Medium RSS → DB |
| `npm run db:import-medium-export` | Medium export ZIP → DB |

### 3. Production (Vercel)

`vercel.json` uses:

```json
"buildCommand": "prisma generate && prisma migrate deploy && next build"
```

Set **`DATABASE_URL`**, **`AUTH_SECRET`**, **`AUTH_URL`**, **`NEXT_PUBLIC_SITE_URL`**, and OAuth/email vars in the Vercel project dashboard. After the first deploy, point **`AUTH_URL`** and **`NEXT_PUBLIC_SITE_URL`** at your real deployment URL and redeploy.

### 4. CI

GitHub Actions (`.github/workflows/ci.yml`) runs lint, Vitest, Prisma migrate against Postgres service, `next build`, and Playwright. Uses reporters under CI (JUnit artifacts). Ensure **`package-lock.json`** includes devDependencies (`vitest`, `@playwright/test`, etc.) so `npm ci` installs test runners.

### 5. Favicons / static assets

Keep branding icons under **`public/`** (`favicon.ico`, `icon.png`, `apple-icon.png`). Do **not** add **`src/app/favicon.ico`** while `public/favicon.ico` exists — Next.js returns **500** for conflicting routes.

---

## Documentation map

Folder names are numbered for chronological browsing; headings below mirror that sequence.

### 01 · Foundation

- [Overview](01-foundation/Overview.md)
- [Getting started](01-foundation/Getting-Started.md)
- [Project structure](01-foundation/Project-Structure.md)
- [Configuration and environment](01-foundation/Configuration-and-Environment.md)
- [Site configuration](01-foundation/Site-Configuration.md)

### 02 · Data layer

- [Data layer](02-data/Data-Layer.md)
- [Database schema](02-data/Database-Schema.md)
- [Seeding and content ingestion](02-data/Seeding-and-Content-Ingestion.md)

### 03 · Public site

- [Public site](03-public-site/Public-Site.md)
- [Home page and hero](03-public-site/Home-Page-and-Hero.md)
- [About, experience, and skills](03-public-site/About,-Experience,-and-Skills-Pages.md)
- [Projects catalogue](03-public-site/Projects-Catalogue.md)
- [Blog system](03-public-site/Blog-System.md)
- [Contact page](03-public-site/Contact-Page.md)

### 04 · Admin CMS

- [Admin CMS](04-admin/Admin-CMS.md)
- [Authentication and authorization](04-admin/Authentication-and-Authorization.md)
- [Content management actions](04-admin/Content-Management-Actions.md)
- [Admin UI components](04-admin/Admin-UI-Components.md)

### 05 · UI system

- [UI component library](05-ui/UI-Component-Library.md)
- [Styling system](05-ui/Styling-System.md)
- [Layout and navigation](05-ui/Layout-and-Navigation-Components.md)

### 06 · SEO & analytics

- [SEO, analytics, and metadata](06-seo/SEO,-Analytics,-and-Metadata.md)

### 07 · AI

- [AI and extensibility](07-ai/AI-and-Extensibility.md)
- [AI extension configuration](07-ai/AI-Extension-Configuration.md)

### 08 · Quality & delivery

- [Testing](08-quality/Testing.md)
- [Unit tests (Vitest)](<08-quality/Unit-Tests-(Vitest).md>)
- [End-to-end tests (Playwright)](<08-quality/End-to-End-Tests-(Playwright).md>)
- [CI/CD pipeline](08-quality/CI-CD-Pipeline.md)

### 09 · Reference

- [Glossary](09-reference/Glossary.md)
- [Glossary supplement](09-reference/Glossary-1.md)

---

## Source

Documentation pages were imported from `docs.zip` and grouped into **numbered folders** (`01-foundation/` … `09-reference/`) so you can skim in order alongside this README.
