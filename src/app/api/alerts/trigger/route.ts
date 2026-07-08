import { NextResponse } from "next/server";
import { triggerDrySpellAlert } from "@/lib/alert-engine";
import { store } from "@/lib/store";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    let farmerId = body.farmerId as string | undefined;

    if (!farmerId) {
      const latest = await store.findLatestFarmer();
      farmerId = latest?.id;
    }

    if (!farmerId) {
      return NextResponse.json({ error: "No farmer found." }, { status: 400 });
    }

    const alertData = triggerDrySpellAlert();
    const alert = await store.createAlert({
      farmerId,
      type: alertData.type,
      message: alertData.message,
      messageTe: alertData.messageTe,
    });

    return NextResponse.json(alert);
  } catch {
    return NextResponse.json({ error: "Failed to trigger alert" }, { status: 500 });
  }
}
