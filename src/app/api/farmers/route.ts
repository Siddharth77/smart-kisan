import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { buildPlotContext } from "@/lib/crop-engine";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, village, district = "Warangal", acres, cropSeason = "kharif" } = body;

    if (!name || !phone || !village || !acres) {
      return NextResponse.json(
        { error: "name, phone, village, and acres are required" },
        { status: 400 },
      );
    }

    const ctx = buildPlotContext(village, district, Number(acres), cropSeason);

    const farmer = await db.farmer.create({
      data: {
        name,
        phone,
        village,
        district,
        plots: {
          create: {
            acres: Number(acres),
            soilType: ctx.soilType,
            cropSeason,
          },
        },
      },
      include: { plots: true },
    });

    return NextResponse.json(farmer);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create farmer" }, { status: 500 });
  }
}

export async function GET() {
  const farmers = await db.farmer.findMany({
    include: { plots: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(farmers);
}
