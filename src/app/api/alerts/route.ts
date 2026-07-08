import { NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const farmerId = searchParams.get("farmerId") ?? undefined;
  const alerts = await store.listAlerts(farmerId);
  return NextResponse.json(alerts);
}

export async function PATCH(request: Request) {
  const { id } = await request.json();
  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const alert = await store.markAlertRead(id);
  return NextResponse.json(alert);
}
