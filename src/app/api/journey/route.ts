import { resolveViewer } from "@/lib/viewer";
import { getCollection, getDNA, getMemoryFacts } from "@/services/dataSource";
import { buildCollectorJourney, computeJourneyStats } from "@/services/journeyEngine";

export async function GET() {
  const { userId, demo } = await resolveViewer();

  const [collectiblesRaw, dna, memoryData] = await Promise.all([
    getCollection(userId, demo),
    getDNA(userId, demo),
    getMemoryFacts(userId, demo),
  ]);

  const collectibles = Array.isArray(collectiblesRaw)
    ? collectiblesRaw
    : (collectiblesRaw as any)?.items ?? [];

  const memories = (memoryData as any).facts ?? memoryData;
  const achievements: { title: string; unlockedAt: string | null }[] = [];

  const journey = buildCollectorJourney(collectibles, memories as any, dna, achievements);
  const stats = computeJourneyStats(collectibles, memories as any, achievements);

  return Response.json({ journey, stats, demo });
}
