import { NextResponse } from "next/server";
import { storageMode, store } from "@/lib/store";

export async function GET() {
  try {
    const farmerCount = await store.countFarmers();
    return NextResponse.json({
      status: "ok",
      storage: storageMode(),
      farmerCount,
    });
  } catch {
    return NextResponse.json({ status: "error" }, { status: 503 });
  }
}
