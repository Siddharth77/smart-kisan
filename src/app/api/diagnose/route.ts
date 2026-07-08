import { NextResponse } from "next/server";
import { ai } from "@/lib/ai-provider";
import { needsRSKTicket } from "@/lib/diagnosis-engine";
import { RSK_TICKET_MESSAGE } from "@/lib/i18n/te-templates";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { farmerId, imageFilename } = await request.json();

    if (!farmerId || !imageFilename) {
      return NextResponse.json(
        { error: "farmerId and imageFilename are required" },
        { status: 400 },
      );
    }

    const result = await ai.diagnose(imageFilename);

    const diagnosis = await db.diagnosis.create({
      data: {
        farmerId,
        imagePath: result.imagePath,
        disease: result.disease,
        confidence: result.confidence,
        action: result.action,
        actionTe: result.actionTe,
      },
    });

    let ticket = null;
    if (needsRSKTicket(result.confidence)) {
      ticket = await db.rSKTicket.create({
        data: { diagnosisId: diagnosis.id },
      });

      await db.alert.create({
        data: {
          farmerId,
          type: "rsk_referral",
          message: RSK_TICKET_MESSAGE.en,
          messageTe: RSK_TICKET_MESSAGE.te,
        },
      });
    }

    return NextResponse.json({ ...result, diagnosisId: diagnosis.id, ticket });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Diagnosis failed" }, { status: 500 });
  }
}
