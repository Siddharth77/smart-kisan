# Kisan Alert

Voice & SMS agricultural intelligence for small and marginal farmers. Local MVP with rules-based crop recommendations, dry-spell alerts, and demo photo diagnosis with Rythu Seva Kendra (RSK) expert follow-up.

## Demo flow

1. **Register** — `/farmer/register` (Lakshmi Devi, Hanamkonda, 2 acres)
2. **Crop advice** — `/farmer/recommend` (soil + rainfall rules engine)
3. **Dry-spell alert** — `/farmer/inbox` → “Simulate dry spell”
4. **Photo diagnosis** — `/farmer/diagnose` (demo images; low confidence → RSK ticket)
5. **RSK queue** — `/rsk` (expert resolves ticket)

## Local setup

```bash
cp .env.local.example .env
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:seed` | Seed Lakshmi Devi demo farmer |
| `npm run db:reset` | Reset DB and re-seed |

## API routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/farmers` | POST, GET | Register / list farmers |
| `/api/recommend` | POST | Crop recommendation |
| `/api/alerts` | GET, PATCH | Farmer inbox |
| `/api/alerts/trigger` | POST | Simulate dry spell |
| `/api/diagnose` | POST | Photo diagnosis |
| `/api/tickets` | GET, PATCH | RSK queue |
| `/api/demo/reset` | POST | Reset demo data |

## Architecture

- **Next.js 16** (App Router) + TypeScript + Tailwind
- **Prisma + SQLite** (local dev)
- **Rules engine** — no external AI APIs (`src/lib/crop-engine.ts`, `alert-engine.ts`, `diagnosis-engine.ts`)
- **AI plug-in point** — `src/lib/ai-provider.ts` (swap to real ML later)

## Deploy (Vercel + Turso)

See [docs/VERCEL_DEPLOY.md](docs/VERCEL_DEPLOY.md) for step-by-step instructions.

Quick summary:
1. Create a Turso DB (`libsql://...` + auth token)
2. Push repo to GitHub and import on Vercel
3. Set `DATABASE_URL`, `TURSO_AUTH_TOKEN`, `NEXT_PUBLIC_APP_URL`
4. Deploy → then `POST /api/demo/reset` to seed

## Docs

- [Local setup](docs/LOCAL_SETUP.md)
- [Demo script](docs/DEMO_SCRIPT.md)
