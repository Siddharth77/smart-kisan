import type { AlertResult } from "@/types";

export const ALERT_TEMPLATES: Record<
  AlertResult["type"],
  { en: string; te: string }
> = {
  dry_spell: {
    en: "No rain for {days} days. Soil moisture is low ({moisture}%). Irrigate lightly in the evening. Hold fertilizer until rain returns.",
    te: "{days} రోజులుగా వర్షం లేదు. నేల తేమ తగ్గింది ({moisture}%). సాయంత్రం తేలికపాటి నీటిపారుదల చేయండి. వర్షం వచ్చే వరకు ఎరువు వేయవద్దు.",
  },
  irrigation: {
    en: "Soil moisture below optimal. Schedule light irrigation within 2 days.",
    te: "నేల తేమ సరైన మట్టంలో లేదు. 2 రోజులలో తేలికపాటి నీటిపారుదల చేయండి.",
  },
  fertilizer_hold: {
    en: "Dry conditions detected. Delay fertilizer application to avoid crop burn.",
    te: "ఎండ పరిస్థితులు ఉన్నాయి. పంట కాలిపోకుండా ఎరువు వేయడం వాయిదా వేయండి.",
  },
};

export const RECOMMENDATION_TEMPLATE = {
  en: "Based on {soil} soil, {rainfall}mm rainfall, and {groundwater} groundwater in {village}: {topCrop} is the best fit. {avoidCrop} carries higher water-stress risk this season.",
  te: "{village}లో {soil} నేల, {rainfall}mm వర్షం, {groundwater} groundwater ఆధారంగా: {topCropTe} అత్యుత్తమం. {avoidCropTe}కు ఈ సీజన్‌లో నీటి stress ఎక్కువ.",
};

export const RSK_TICKET_MESSAGE = {
  en: "Your crop photo was sent to Rythu Seva Kendra. An expert will call within 24 hours.",
  te: "మీ పంట ఫోటో Rythu Seva Kendraకు పంపబడింది. 24 గంటలలో expert మీకు కాల్ చేస్తారు.",
};
