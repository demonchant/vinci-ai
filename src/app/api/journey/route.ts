import { resolveViewer } from "@/lib/viewer";
import { getCollection, getDNA, getMemoryFacts } from "@/services/dataSource";
import { buildCollectorJourney, computeJourneyStats } from "@/services/journeyEngine";
import type { Collectible } from "@/types/collectible";
import type { CollectorMemoryFact } from "@/types/memory";
import type { Achievement } from "@/types/dna"; // Adjust path if needed

type CollectionResponse = {
  items: Collectible[];
};

type MemoryResponse = {
  facts: CollectorMemoryFact[];
};

export async function GET() {
  const { userId, demo } = await resolveViewer();

  const [collectiblesRaw, dna, memoryData] = await Promise.all([
    getCollection(userId, demo),
    getDNA(userId, demo),
    getMemoryFacts(userId, demo),
  ]);

  const collectibles: Collectible[] = Array.isArray(collectiblesRaw)
    ? collectiblesRaw
    : (collectiblesRaw as CollectionResponse).items ?? [];

  const memories: CollectorMemoryFact[] = Array.isArray(memoryData)
    ? memoryData
    : (memoryData as MemoryResponse).facts ?? [];

  const achievements: Achievement[] = [];

  const journey = buildCollectorJourney(collectibles, memories, dna, achievements);
  const stats = computeJourneyStats(collectibles, memories, achievements);

  return Response.json({ journey, stats, demo });
}