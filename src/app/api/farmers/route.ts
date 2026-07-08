import { NextResponse } from "next/server";
import { buildPlotContext } from "@/lib/crop-engine";
import { store } from "@/lib/store";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      phone,
      village,
      district = "Warangal",
      acres,
      cropSeason = "kharif",
    } = body;

    const acresNum = Number(acres);

    if (!name?.trim() || !phone?.trim() || !village?.trim()) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    if (!Number.isFinite(acresNum) || acresNum <= 0) {
      return NextResponse.json({ error: "Invalid plot size." }, { status: 400 });
    }

    const ctx = buildPlotContext(village.trim(), district, acresNum, cropSeason);

    const farmer = await store.createFarmer({
      name: name.trim(),
      phone: phone.trim(),
      village: village.trim(),
      district,
      acres: acresNum,
      soilType: ctx.soilType,
      cropSeason,
    });

    return NextResponse.json(farmer);
  } catch {
    return NextResponse.json({ error: "Failed to create farmer" }, { status: 500 });
  }
}

export async function GET() {
  const farmers = await store.listFarmers();
  return NextResponse.json(farmers);
}
