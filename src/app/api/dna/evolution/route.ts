import { resolveViewer } from "@/lib/viewer";
import { getDNAEvolutionTimeline } from "@/services/dnaEvolution";
import { demoReplay } from "@/demo/fixtures/demoReplay";

export async function GET() {
  const { userId, demo } = await resolveViewer();
  if (demo) {
    const timeline = demoReplay.snapshots.map((s: any, i: number) => ({
      id: `demo-snap-${i}`,
      createdAt: s.timestamp,
      dnaScore: s.score,
      primaryType: s.primaryType,
      trigger: s.trigger || "Activity",
      delta: i > 0 ? s.score - demoReplay.snapshots[i - 1].score : null,
      scores: s.scores || {},
    }));
    return Response.json({ timeline, demo: true });
  }
  const timeline = await getDNAEvolutionTimeline(userId);
  return Response.json({ timeline, demo: false });
}
