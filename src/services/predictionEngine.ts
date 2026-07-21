import type { ReplayFrame, PredictionResult } from "@/types/replay";

const MINIMUM_SNAPSHOTS = 20;
const DISCLAIMER =
  "These are AI-generated forecasts based on historical patterns, not guarantees. Collector DNA depends on future activity which cannot be known in advance.";

export function computePredictions(frames: ReplayFrame[]): PredictionResult {
  const n = frames.length;

  if (n < MINIMUM_SNAPSHOTS) {
    return {
      available: false,
      reason: `Vinci AI needs at least ${MINIMUM_SNAPSHOTS} DNA snapshots to generate reliable forecasts. You currently have ${n}.`,
      snapshotsRequired: MINIMUM_SNAPSHOTS,
      snapshotsPresent: n,
      traitForecasts: [],
      archetypeShiftProbability: [],
      forecastHorizonDays: 30,
      disclaimer: DISCLAIMER,
    };
  }

  const recent = frames.slice(-10);
  const traitKeys = Object.keys(recent[0]?.scores ?? {}).filter(
    (k) => k !== "dnaScore" && k !== "primaryType"
  );

  const traitForecasts = traitKeys.map((trait) => {
    const values = recent.map((f) => f.scores[trait] ?? 50);
    const slope =
      values.length > 1
        ? (values[values.length - 1]! - values[0]!) / (values.length - 1)
        : 0;
    const predictedChange = Math.round(slope * 4);
    const confidence = Math.max(40, Math.min(80, 70 - Math.abs(predictedChange) * 2));
    return { trait, predictedChange, confidence };
  });

  const recentTypes: Record<string, number> = {};
  for (const f of recent) {
    recentTypes[f.primaryType] = (recentTypes[f.primaryType] ?? 0) + 1;
  }
  const archetypeShiftProbability = Object.entries(recentTypes)
    .map(([type, count]) => ({ type, probability: Math.round((count / recent.length) * 100) }))
    .sort((a, b) => b.probability - a.probability)
    .slice(0, 4);

  return {
    available: true,
    snapshotsRequired: MINIMUM_SNAPSHOTS,
    snapshotsPresent: n,
    traitForecasts: traitForecasts.filter((t) => t.predictedChange !== 0),
    archetypeShiftProbability,
    forecastHorizonDays: 30,
    disclaimer: DISCLAIMER,
  };
}
