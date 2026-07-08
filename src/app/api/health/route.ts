import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const databaseUrl = process.env.DATABASE_URL ?? "";
  const isTurso =
    databaseUrl.startsWith("libsql://") || databaseUrl.startsWith("https://");

  try {
    const farmerCount = await db.farmer.count();
    return NextResponse.json({
      status: "ok",
      database: isTurso ? "turso" : "sqlite",
      farmerCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        status: "error",
        database: isTurso ? "turso" : "sqlite",
        message:
          error instanceof Error ? error.message : "Database connection failed",
      },
      { status: 503 },
    );
  }
}
