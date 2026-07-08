# Vercel deployment

## Zero-config deploy (default)

The app uses an **in-memory store** on Vercel when `DATABASE_URL` is not set. Lakshmi Devi demo data is pre-seeded automatically — no Turso or Postgres required.

```bash
npx vercel login
npx vercel deploy --prod
```

Or import the GitHub repo at [vercel.com/new](https://vercel.com/new).

### Verify after deploy

```bash
curl https://YOUR-APP.vercel.app/api/health
# → { "status": "ok", "storage": "memory", "farmerCount": 1 }

# Optional: reset demo state
curl -X POST https://YOUR-APP.vercel.app/api/demo/reset
```

### Demo flow on live URL

1. Home → **Quick demo (Lakshmi Devi)**
2. Crop recommendation → Inbox → Simulate dry spell
3. Diagnose → leaf_spot → RSK ticket → Resolve

---

## Local development (SQLite)

```bash
cp .env.local.example .env
npm run db:migrate && npm run db:seed
npm run dev
```

With `DATABASE_URL="file:./dev.db"`, the app uses **Prisma + SQLite** for persistent local storage.

---

## Optional: Turso for persistent production data

In-memory data resets when Vercel serverless functions cold-start. For persistent storage:

```bash
turso db create smart-kisan
turso db show smart-kisan --url
turso db tokens create smart-kisan
```

Set in Vercel → Environment Variables:

| Variable | Value |
|----------|--------|
| `DATABASE_URL` | `libsql://...` |
| `TURSO_AUTH_TOKEN` | Turso token |

Build will auto-run `prisma migrate deploy` when a libsql URL is detected.

---

## Build settings

| Setting | Value |
|---------|--------|
| Framework | Next.js |
| Build command | `npm run vercel-build` |
| Region | Mumbai (`bom1`) |
