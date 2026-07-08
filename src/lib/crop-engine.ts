import cropRules from "@/lib/seed-data/crop_rules.json";
import rainfallData from "@/lib/seed-data/rainfall_warangal.json";
import soilData from "@/lib/seed-data/warangal_soil.json";
import { RECOMMENDATION_TEMPLATE } from "@/lib/i18n/te-templates";
import type {
  CropName,
  CropScore,
  PlotContext,
  RecommendationResult,
} from "@/types";

type SoilEntry = { soilType: string; groundwaterDepth: string };
type CropRule = {
  label: string;
  labelTe: string;
  waterNeed: string;
  soilFit: string[];
  seasons: string[];
};

const WATER_SCORE: Record<string, Record<string, number>> = {
  shallow: { low: 90, medium: 70, high: 40 },
  medium: { low: 85, medium: 80, high: 55 },
  deep: { low: 80, medium: 75, high: 65 },
};

const CROPS = Object.keys(cropRules) as CropName[];

function getSoilEntry(village: string): SoilEntry {
  const entry = soilData[village as keyof typeof soilData];
  if (entry && typeof entry === "object" && "soilType" in entry) {
    return entry as SoilEntry;
  }
  return soilData.default as SoilEntry;
}

export function buildPlotContext(
  village: string,
  district: string,
  acres: number,
  season = "kharif",
): PlotContext {
  const soil = getSoilEntry(village);
  return {
    village,
    district,
    acres,
    soilType: soil.soilType,
    rainfallMm: rainfallData.currentSeasonMm,
    groundwaterDepth: soil.groundwaterDepth as PlotContext["groundwaterDepth"],
    season,
  };
}

function scoreCrop(crop: CropName, ctx: PlotContext): CropScore {
  const rule = cropRules[crop] as CropRule;
  const soilFit = rule.soilFit.includes(ctx.soilType) ? 100 : 45;
  const seasonFit = rule.seasons.includes(ctx.season) ? 100 : 30;
  const waterFit =
    WATER_SCORE[ctx.groundwaterDepth]?.[rule.waterNeed] ?? 50;
  const rainfallBonus =
    ctx.rainfallMm < 350 && rule.waterNeed === "low"
      ? 15
      : ctx.rainfallMm > 500 && rule.waterNeed === "high"
        ? 10
        : 0;

  const score = Math.round(
    soilFit * 0.4 + waterFit * 0.35 + seasonFit * 0.25 + rainfallBonus,
  );
  const riskScore = Math.max(0, Math.min(100, 100 - score));

  return { crop, score, riskScore };
}

export function recommendCrops(ctx: PlotContext): RecommendationResult {
  const scores = CROPS.map((crop) => scoreCrop(crop, ctx)).sort(
    (a, b) => b.score - a.score,
  );

  const recommended = scores.slice(0, 3).map((s) => s.crop);
  const top = scores[0];
  const avoid = scores[scores.length - 1];
  const topRule = cropRules[top.crop] as CropRule;
  const avoidRule = cropRules[avoid.crop] as CropRule;

  const riskScores = Object.fromEntries(
    scores.map((s) => [s.crop, s.riskScore]),
  ) as Record<CropName, number>;

  const reasoning = RECOMMENDATION_TEMPLATE.en
    .replace("{soil}", ctx.soilType.replace("_", " "))
    .replace("{rainfall}", String(ctx.rainfallMm))
    .replace("{groundwater}", ctx.groundwaterDepth)
    .replace("{village}", ctx.village)
    .replace("{topCrop}", topRule.label)
    .replace("{avoidCrop}", avoidRule.label);

  const reasoningTe = RECOMMENDATION_TEMPLATE.te
    .replace("{soil}", ctx.soilType.replace("_", " "))
    .replace("{rainfall}", String(ctx.rainfallMm))
    .replace("{groundwater}", ctx.groundwaterDepth)
    .replace("{village}", ctx.village)
    .replace("{topCropTe}", topRule.labelTe)
    .replace("{avoidCropTe}", avoidRule.labelTe);

  return { recommended, reasoning, reasoningTe, riskScores, scores };
}
