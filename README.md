# Kisan Alert

Agricultural intelligence for small farmers — crop recommendations, dry-spell alerts, and crop health diagnosis with RSK expert follow-up.

## Quick start

```bash
cp .env.local.example .env
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Demo flow

1. `/farmer/register` — Register plot
2. `/farmer/recommend` — Crop advice
3. `/farmer/inbox` — Dry-spell alert
4. `/farmer/diagnose` — Photo diagnosis
5. `/rsk` — Expert queue

## Deploy

```bash
npx vercel deploy --prod
```

No database setup required on Vercel (in-memory store). Local dev uses SQLite via Prisma.

## Stack

Next.js · React · TypeScript · Tailwind · Prisma · SQLite · Vercel

## Pitch deck

[pitch/KisanAlert_PitchDeck.pdf](pitch/KisanAlert_PitchDeck.pdf) — regenerate with `npm run pitch:pdf`
