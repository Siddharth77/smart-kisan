import { NextResponse } from "next/server";
import { ai } from "@/lib/ai-provider";
import { buildPlotContext } from "@/lib/crop-engine";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { plotId } = await request.json();

    if (!plotId) {
      return NextResponse.json({ error: "plotId is required" }, { status: 400 });
    }

    const plot = await db.plot.findUnique({
      where: { id: plotId },
      include: { farmer: true },
    });

    if (!plot) {
      return NextResponse.json({ error: "Plot not found" }, { status: 404 });
    }

    const ctx = buildPlotContext(
      plot.farmer.village,
      plot.farmer.district,
      plot.acres,
      plot.cropSeason,
    );

    const result = await ai.recommend(ctx);

    const recommendation = await db.recommendation.create({
      data: {
        plotId: plot.id,
        crops: JSON.stringify(result.recommended),
        reasoning: result.reasoning,
        reasoningTe: result.reasoningTe,
        riskScores: JSON.stringify(result.riskScores),
      },
    });

    return NextResponse.json({ ...result, id: recommendation.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Recommendation failed" }, { status: 500 });
  }
}
