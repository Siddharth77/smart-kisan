import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const farmerId = searchParams.get("farmerId");

  const alerts = await db.alert.findMany({
    where: farmerId ? { farmerId } : undefined,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(alerts);
}

export async function PATCH(request: Request) {
  const { id } = await request.json();
  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const alert = await db.alert.update({
    where: { id },
    data: { read: true },
  });

  return NextResponse.json(alert);
}
