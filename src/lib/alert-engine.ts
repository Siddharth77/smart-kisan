import scenarios from "@/lib/seed-data/demo_scenarios.json";
import { ALERT_TEMPLATES } from "@/lib/i18n/te-templates";
import type { AlertResult, WeatherScenario } from "@/types";

const DRY_SPELL_DAYS = 10;
const LOW_MOISTURE = 0.35;

export function getScenario(name: keyof typeof scenarios): WeatherScenario {
  return scenarios[name] as WeatherScenario;
}

export function evaluateWeather(scenario: WeatherScenario): AlertResult | null {
  if (
    scenario.daysSinceRain >= DRY_SPELL_DAYS &&
    scenario.soilMoisture < LOW_MOISTURE
  ) {
    const moisturePct = Math.round(scenario.soilMoisture * 100);
    return {
      type: "dry_spell",
      message: ALERT_TEMPLATES.dry_spell.en
        .replace("{days}", String(scenario.daysSinceRain))
        .replace("{moisture}", String(moisturePct)),
      messageTe: ALERT_TEMPLATES.dry_spell.te
        .replace("{days}", String(scenario.daysSinceRain))
        .replace("{moisture}", String(moisturePct)),
    };
  }

  if (scenario.soilMoisture < 0.4) {
    return {
      type: "irrigation",
      message: ALERT_TEMPLATES.irrigation.en,
      messageTe: ALERT_TEMPLATES.irrigation.te,
    };
  }

  return null;
}

export function triggerDrySpellAlert(): AlertResult {
  const alert = evaluateWeather(getScenario("dry_spell"));
  if (!alert) {
    return {
      type: "fertilizer_hold",
      message: ALERT_TEMPLATES.fertilizer_hold.en,
      messageTe: ALERT_TEMPLATES.fertilizer_hold.te,
    };
  }
  return alert;
}
