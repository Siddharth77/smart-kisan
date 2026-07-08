import { memoryStore } from "./memory";
import { prismaStore } from "./prisma";
import type { DataStore } from "./types";

/** Use SQLite/Turso when DATABASE_URL is set; otherwise in-memory (Vercel default). */
export function usesDatabase(): boolean {
  if (process.env.USE_MEMORY_STORE === "true") return false;
  const url = process.env.DATABASE_URL ?? "";
  return (
    url.startsWith("file:") ||
    url.startsWith("libsql://") ||
    url.startsWith("https://")
  );
}

export const store: DataStore = usesDatabase() ? prismaStore : memoryStore;

export async function seedDatabase() {
  return store.reset();
}

export function storageMode(): "memory" | "database" {
  return store.mode;
}
