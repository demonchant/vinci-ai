import { resolveViewer } from "@/lib/viewer";
import { getCollection, getDNA, getMemoryFacts } from "@/services/dataSource";
import { computeConfidenceHeatmap } from "@/services/confidenceHeatmap";
import type { Collectible } from "@/types/collectible";
import type { CollectorMemoryFact } from "@/types/memory";

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

  const heatmap = computeConfidenceHeatmap(collectibles, memories, dna);

  return Response.json({ heatmap, demo });
}