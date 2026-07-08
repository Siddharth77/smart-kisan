import { NextResponse } from "next/server";
import { seedDatabase } from "@/lib/store";

export async function POST() {
  try {
    const farmer = await seedDatabase();
    return NextResponse.json({ message: "Demo reset complete", farmer });
  } catch {
    return NextResponse.json({ error: "Demo reset failed" }, { status: 500 });
  }
}
