#!/usr/bin/env node
/**
 * Vercel production build:
 * - Requires Turso DATABASE_URL (libsql://) on Vercel
 * - Runs migrations against Turso, then next build
 */
import { execSync } from "node:child_process";

const databaseUrl = process.env.DATABASE_URL ?? "";
const isTurso =
  databaseUrl.startsWith("libsql://") || databaseUrl.startsWith("https://");
const onVercel = Boolean(process.env.VERCEL);

execSync("npx prisma generate", { stdio: "inherit" });

if (isTurso) {
  console.log("Running prisma migrate deploy against Turso…");
  execSync("npx prisma migrate deploy", { stdio: "inherit" });
} else if (onVercel) {
  console.error(`
╔════════════════════════════════════════════════════════════════╗
║  Vercel build failed: DATABASE_URL not configured for Turso   ║
╠════════════════════════════════════════════════════════════════╣
║  Set these in Vercel → Project → Settings → Environment Vars:  ║
║    DATABASE_URL      = libsql://your-db.turso.io               ║
║    TURSO_AUTH_TOKEN  = your-turso-token                        ║
║    NEXT_PUBLIC_APP_URL = https://your-app.vercel.app           ║
║                                                                ║
║  See docs/VERCEL_DEPLOY.md for Turso setup steps.              ║
╚════════════════════════════════════════════════════════════════╝
`);
  process.exit(1);
} else {
  console.log("Skipping migrate deploy (local build with SQLite file).");
}

execSync("npx next build", { stdio: "inherit" });
