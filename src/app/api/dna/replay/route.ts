import { resolveViewer } from "@/lib/viewer";
import { buildReplayManifest } from "@/services/replayEngine";
import { computePredictions } from "@/services/predictionEngine";
import { demoReplay } from "@/demo/fixtures/demoReplay";

export const maxDuration = 30;

type DemoReplaySnapshot = (typeof demoReplay.snapshots)[number];

export async function GET() {
  const { userId, demo } = await resolveViewer();

  if (demo) {
    const frames = demoReplay.snapshots.map((s: DemoReplaySnapshot, i: number) => ({
      index: i,
      snapshotId: `demo-snap-${i}`,
      createdAt: s.timestamp,
      dnaScore: s.score,
      primaryType: s.primaryType,
      secondaryType: null,
      trigger: s.trigger || "Activity",
      scores: s.scores || {},
      conversationCount: 2 + i * 2,
      memoryCount: 3 + i,
      collectionSize: 1 + i,
      checkpointCount: i,
      delta: i > 0 ? s.score - (demoReplay.snapshots[i - 1]?.score ?? s.score) : null,
    }));

    const firstFrame = frames[0];
    const lastFrame = frames.at(-1);

    return Response.json({
      manifest: {
        userId: "demo",
        frames,
        milestones: demoReplay.milestones || [],
        compass: [],
        bookmarks: [],
        storyNarration:
          demoReplay.storyNarration ||
          "This collector's journey began with a focus on vintage Pokémon cards and evolved into a multi-category portfolio.",
        totalFrames: frames.length,
        dateRange:
          firstFrame && lastFrame
            ? {
                from: firstFrame.createdAt,
                to: lastFrame.createdAt,
              }
            : null,
      },
      predictions: {
        available: false,
        reason: "Demonstration mode — predictions are not available for demo data.",
        snapshotsRequired: 20,
        snapshotsPresent: frames.length,
        traitForecasts: [],
        archetypeShiftProbability: [],
        forecastHorizonDays: 30,
        disclaimer: "These are AI-generated forecasts based on historical patterns, not guarantees.",
      },
      demo: true,
    });
  }

  const manifest = await buildReplayManifest(userId);
  const predictions = computePredictions(manifest.frames);

  return Response.json({ manifest, predictions, demo: false });
}