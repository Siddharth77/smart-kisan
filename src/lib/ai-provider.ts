import type { DiagnosisResult, PlotContext, RecommendationResult } from "@/types";
import { recommendCrops } from "@/lib/crop-engine";
import { diagnoseImage } from "@/lib/diagnosis-engine";

export interface AIProvider {
  recommend(ctx: PlotContext): Promise<RecommendationResult>;
  diagnose(imageFilename: string): Promise<DiagnosisResult>;
}

class RulesAIProvider implements AIProvider {
  async recommend(ctx: PlotContext): Promise<RecommendationResult> {
    return recommendCrops(ctx);
  }

  async diagnose(imageFilename: string): Promise<DiagnosisResult> {
    return diagnoseImage(imageFilename);
  }
}

export const ai = new RulesAIProvider();
