import type { DiagnosisResult } from "@/types";

const RSK_CONFIDENCE_THRESHOLD = 0.8;

const DEMO_DIAGNOSES: Record<
  string,
  Omit<DiagnosisResult, "imagePath">
> = {
  "leaf_spot.svg": {
    disease: "Early leaf spot",
    confidence: 0.62,
    action:
      "Remove affected leaves. Apply neem-based spray. Monitor for 5 days.",
    actionTe:
      "అనారోగ్యంగా ఉన్న ఆకులు తొలగించండి. వేప ఆధారిత spray వేయండి. 5 రోజులు наблюдение.",
  },
  "healthy.svg": {
    disease: "Healthy crop",
    confidence: 0.95,
    action: "No treatment needed. Continue regular irrigation schedule.",
    actionTe: "చికిత్స అవసరం లేదు. సాధారణ నీటిపారుదల కొనసాగించండి.",
  },
  "nutrient_def.svg": {
    disease: "Nitrogen deficiency",
    confidence: 0.71,
    action:
      "Apply split dose of urea after irrigation. Retest in 10 days.",
    actionTe:
      "నీటిపారుదల తర్వాత urea చిన్న మోతాదులో వేయండి. 10 రోజులలో మళ్లీ పరీక్షించండి.",
  },
};

export function diagnoseImage(filename: string): DiagnosisResult {
  const key = filename.split("/").pop() ?? filename;
  const match = DEMO_DIAGNOSES[key] ?? DEMO_DIAGNOSES["leaf_spot.svg"];

  return {
    ...match,
    imagePath: `/demo-crops/${key}`,
  };
}

export function needsRSKTicket(confidence: number): boolean {
  return confidence < RSK_CONFIDENCE_THRESHOLD;
}

export const DEMO_IMAGES = Object.keys(DEMO_DIAGNOSES).map(
  (name) => `/demo-crops/${name}`,
);

export { RSK_CONFIDENCE_THRESHOLD };
