import { NextResponse } from "next/server";
import { diagnoseImage, needsRSKTicket } from "@/lib/diagnosis-engine";
import { RSK_TICKET_MESSAGE } from "@/lib/i18n/te-templates";
import { store } from "@/lib/store";

export async function POST(request: Request) {
  try {
    const { farmerId, imageFilename } = await request.json();

    if (!farmerId || !imageFilename) {
      return NextResponse.json(
        { error: "farmerId and imageFilename are required" },
        { status: 400 },
      );
    }

    const result = diagnoseImage(imageFilename);

    const diagnosis = await store.createDiagnosis({
      farmerId,
      imagePath: result.imagePath,
      disease: result.disease,
      confidence: result.confidence,
      action: result.action,
      actionTe: result.actionTe,
    });

    let ticket = null;
    if (needsRSKTicket(result.confidence)) {
      ticket = await store.createTicket(diagnosis.id);
      await store.createAlert({
        farmerId,
        type: "rsk_referral",
        message: RSK_TICKET_MESSAGE.en,
        messageTe: RSK_TICKET_MESSAGE.te,
      });
    }

    return NextResponse.json({ ...result, diagnosisId: diagnosis.id, ticket });
  } catch {
    return NextResponse.json({ error: "Diagnosis failed" }, { status: 500 });
  }
}
