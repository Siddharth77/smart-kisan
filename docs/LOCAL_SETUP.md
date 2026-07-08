# Local setup

## Prerequisites

- Node.js 20+
- npm

## Steps

1. Clone the repo and install dependencies:

   ```bash
   npm install
   ```

2. Copy environment file:

   ```bash
   cp .env.local.example .env
   ```

   Default `DATABASE_URL`:

   ```env
   DATABASE_URL="file:./dev.db"
   ```

3. Run database migration and seed:

   ```bash
   npx prisma migrate dev --name init
   npm run db:seed
   ```

4. Start the dev server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) and follow the demo flow.

## Reset demo between runs

- UI: **RSK queue** → “Reset demo”
- API: `POST /api/demo/reset`

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `PrismaClient` not found | Run `npx prisma generate` |
| Empty recommend page | Register a farmer first or run `npm run db:seed` |
| No alerts | Click “Simulate dry spell” on `/farmer/inbox` |
