import { NextResponse } from "next/server";
import { triggerDrySpellAlert } from "@/lib/alert-engine";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    let farmerId = body.farmerId as string | undefined;

    if (!farmerId) {
      const latest = await db.farmer.findFirst({
        orderBy: { createdAt: "desc" },
      });
      farmerId = latest?.id;
    }

    if (!farmerId) {
      return NextResponse.json(
        { error: "No farmer found. Register a farmer first." },
        { status: 400 },
      );
    }

    const alertData = triggerDrySpellAlert();

    const alert = await db.alert.create({
      data: {
        farmerId,
        type: alertData.type,
        message: alertData.message,
        messageTe: alertData.messageTe,
      },
    });

    return NextResponse.json(alert);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to trigger alert" }, { status: 500 });
  }
}
