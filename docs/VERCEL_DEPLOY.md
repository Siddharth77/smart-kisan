# Vercel deployment (Turso)

SQLite (`file:./dev.db`) works locally but **not on Vercel** (ephemeral filesystem). Use **Turso** (free tier) — SQLite-compatible, works with the existing Prisma schema.

## 1. Create Turso database

Install the [Turso CLI](https://docs.turso.tech/cli/introduction) and run:

```bash
turso db create kisan-alert
turso db show kisan-alert --url
turso db tokens create kisan-alert
```

Save the **URL** (`libsql://...`) and **token**.

## 2. Push to GitHub

```bash
git init
git add .
git commit -m "Initial Kisan Alert MVP"
git remote add origin https://github.com/YOUR_USER/smart-kisan.git
git push -u origin main
```

## 3. Import on Vercel

1. Go to [vercel.com/new](https://vercel.com/new) → import the GitHub repo.
2. Framework: **Next.js** (auto-detected).
3. Build command: `npm run vercel-build` (set in `vercel.json`).

## 4. Environment variables

In Vercel → Project → Settings → Environment Variables:

| Variable | Value |
|----------|--------|
| `DATABASE_URL` | `libsql://kisan-alert-....turso.io` |
| `TURSO_AUTH_TOKEN` | Token from step 1 |
| `NEXT_PUBLIC_APP_URL` | `https://your-app.vercel.app` |

## 5. Deploy

Vercel runs `prisma migrate deploy` during build, creating tables on Turso.

After first deploy, seed demo data once:

```bash
curl -X POST https://your-app.vercel.app/api/demo/reset
```

Or click **Quick demo** on the home page (calls the same endpoint).

## 6. Verify E2E on live URL

1. Home → **Quick demo (Lakshmi Devi)**
2. Crop recommendation loads
3. Inbox → **Simulate dry spell**
4. Diagnose → `leaf_spot` → RSK ticket
5. `/rsk` → resolve ticket

## Build settings

| Setting | Value |
|---------|--------|
| Framework | Next.js |
| Build command | `npm run vercel-build` |
| Region | Mumbai (`bom1`) |
| Node.js | 20.x |

## Alternative: Vercel Postgres

If you prefer Vercel Postgres instead of Turso:

1. Change `provider = "postgresql"` in `prisma/schema.prisma`
2. Create a new migration for Postgres
3. Set `DATABASE_URL` to the Vercel Postgres connection string
4. Remove Turso adapter logic from `src/lib/db.ts`

Turso is recommended — no schema change needed.
