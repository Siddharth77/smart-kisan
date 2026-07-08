export type CropName = "groundnut" | "maize" | "cotton" | "pigeon_pea" | "rice";

export interface PlotContext {
  village: string;
  district: string;
  acres: number;
  soilType: string;
  rainfallMm: number;
  groundwaterDepth: "shallow" | "medium" | "deep";
  season: string;
}

export interface CropScore {
  crop: CropName;
  score: number;
  riskScore: number;
}

export interface RecommendationResult {
  recommended: CropName[];
  reasoning: string;
  reasoningTe: string;
  riskScores: Record<CropName, number>;
  scores: CropScore[];
}

export interface AlertResult {
  type: "dry_spell" | "irrigation" | "fertilizer_hold";
  message: string;
  messageTe: string;
}

export interface DiagnosisResult {
  disease: string;
  confidence: number;
  action: string;
  actionTe: string;
  imagePath: string;
}

export interface WeatherScenario {
  name: string;
  daysSinceRain: number;
  soilMoisture: number;
  forecastMm: number;
}
