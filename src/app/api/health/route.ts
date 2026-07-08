import { NextResponse } from "next/server";
import { storageMode, store } from "@/lib/store";

export async function GET() {
  try {
    const farmerCount = await store.countFarmers();
    return NextResponse.json({
      status: "ok",
      storage: storageMode(),
      farmerCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        status: "error",
        storage: storageMode(),
        message:
          error instanceof Error ? error.message : "Health check failed",
      },
      { status: 503 },
    );
  }
}
