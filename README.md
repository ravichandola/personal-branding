# Ravi Chandola — Personal branding platform

Production-grade portfolio and CMS scaffold: Next.js 15 App Router, React 19, Prisma ORM + PostgreSQL, NextAuth.js (JWT sessions), Tailwind CSS v4, Framer Motion, TanStack Query, `@vercel/analytics`, `@vercel/speed-insights`, Docker, GitHub Actions, and CI that runs ESLint plus a full build against Postgres.

## Quick start

```bash
cp .env.example .env
docker compose up -d db       # Postgres 16 locally
npm install
npx prisma migrate dev        # applies existing migrations → fresh DB
npm run db:seed
npm run dev
```

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Local development |
| `npm run lint` | ESLint (Next presets) |
| `npm run build` / `npm start` | Production bundle (local: no DB migrate baked in; Vercel uses `vercel.json`) |
| `npx prisma generate` | Outputs client to `src/generated/prisma` |
| `npm run db:migrate` | Interactive migrations (`prisma migrate dev`) |
| `npm run db:push` | Emergency schema prototyping (prefer migrations / `migrate deploy`) |
| `npm run db:seed` | Bootstrap CMS + persona content |
| `npm run db:studio` | Prisma Studio |

`postinstall` runs `prisma generate` so clones stay in sync with the schema after `npm install`.

## Authenticating to `/admin`

1. Seed bootstrap credentials (`ADMIN_BOOTSTRAP_EMAIL`, `ADMIN_BOOTSTRAP_PASSWORD` in `.env`).
2. Visit `/admin/login`.
3. Use Google SSO when `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` exist, or Credentials provider with seeded password hash.
4. Lock down identities with comma-separated `ALLOWED_ADMIN_EMAILS` in production environments.

JWT middleware wraps `/admin/**`; marketing routes stay public while analytics posts to `/api/track`.

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

Build Vercel पर `vercel.json` से चलेगी: `prisma generate && prisma migrate deploy && next build` — इसलिए `DATABASE_URL` build समय भी उपलब्ध होना चाहिए।

**Seed / admin user एक बार (अपने laptop से Neon पर):**

```bash
DATABASE_URL="postgresql://...neon.tech/...?sslmode=require" \
  ADMIN_BOOTSTRAP_EMAIL="aapka@email.com" \
  ADMIN_BOOTSTRAP_PASSWORD="majboor-tak-mazboot-password" \
  npm run db:seed
```

इसके बाद production पर `/admin/login` से इसी email/password से login करें।

**CLI डिप्लॉय (वैकल्पिक):** `npx vercel login` फिर रिपो root में `npx vercel --prod`। मशीन पर खाता लॉगइन हो तभी चलेगा; वरना उपर वाला GitHub-import आसान है।

### Docker

`Dockerfile` + `docker-compose.yml` demonstrate multi-stage builds; override secrets via environment interpolation before shipping.

## Repo map

```
src/
├── app/              # `(site)` marketing shell + `(admin)` console + APIs
├── features/         # MDX renderer, forms, auth helpers
├── components/       # UI kit + layout chrome
├── config/           # Site metadata + structured data
├── hooks/, store/, services/, lib/, providers/
├── auth.ts           # Auth.js handlers + providers
├── middleware.ts     # Edge-safe JWT enforcement for admins
├── prisma/schema.prisma
└── prisma/seed.ts

```

## Operational security

Contact requests persist to Postgres, apply honeypot fields, throttle per-email traffic, optionally notify through Resend, and sanitize payloads via Zod. Extend with Upstash rate limiting keys if you expose additional public mutations.

### AI integrations

Populate `AiExtension` rows plus `OPENAI_API_KEY`; implement orchestration hooks under `src/services/ai` for LangGraph workflows, embeddings, vector stores — `/assistant` is a styled placeholder awaiting wiring.
