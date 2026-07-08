import { NextResponse } from "next/server";
import { buildPlotContext, recommendCrops } from "@/lib/crop-engine";
import { store } from "@/lib/store";

export async function POST(request: Request) {
  try {
    const { plotId } = await request.json();

    if (!plotId) {
      return NextResponse.json({ error: "plotId is required" }, { status: 400 });
    }

    const plot = await store.findPlotWithFarmer(plotId);
    if (!plot) {
      return NextResponse.json({ error: "Plot not found" }, { status: 404 });
    }

    const ctx = buildPlotContext(
      plot.farmer.village,
      plot.farmer.district,
      plot.acres,
      plot.cropSeason,
    );

    const result = recommendCrops(ctx);

    const recommendation = await store.createRecommendation({
      plotId: plot.id,
      crops: JSON.stringify(result.recommended),
      reasoning: result.reasoning,
      reasoningTe: result.reasoningTe,
      riskScores: JSON.stringify(result.riskScores),
    });

    return NextResponse.json({ ...result, id: recommendation.id });
  } catch {
    return NextResponse.json({ error: "Recommendation failed" }, { status: 500 });
  }
}
