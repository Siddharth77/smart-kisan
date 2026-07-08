#!/usr/bin/env node
/**
 * Vercel production build.
 * Uses in-memory store when DATABASE_URL is unset (no Turso required).
 * Runs prisma migrate deploy only when Turso/libsql URL is configured.
 */
import { execSync } from "node:child_process";

const databaseUrl = process.env.DATABASE_URL ?? "";
const isTurso =
  databaseUrl.startsWith("libsql://") || databaseUrl.startsWith("https://");

execSync("npx prisma generate", { stdio: "inherit" });

if (isTurso) {
  console.log("Turso detected — running prisma migrate deploy…");
  execSync("npx prisma migrate deploy", { stdio: "inherit" });
} else {
  console.log(
    "No DATABASE_URL — using in-memory store (zero-config Vercel deploy).",
  );
}

execSync("npx next build", { stdio: "inherit" });
