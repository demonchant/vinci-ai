import { resolveViewer } from "@/lib/viewer";
import { buildReplayManifest } from "@/services/replayEngine";
import { computePredictions } from "@/services/predictionEngine";

export async function GET() {
  const { userId, demo } = await resolveViewer();
  if (demo) {
    return Response.json({
      predictions: {
        available: false,
        reason: "Demonstration mode.",
        snapshotsRequired: 20,
        snapshotsPresent: 12,
        traitForecasts: [],
        archetypeShiftProbability: [],
        forecastHorizonDays: 30,
        disclaimer: "AI-generated forecasts, not guarantees.",
      },
      demo: true,
    });
  }
  const { frames } = await buildReplayManifest(userId);
  const predictions = computePredictions(frames);
  return Response.json({ predictions, demo: false });
}
