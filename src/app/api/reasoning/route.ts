import { resolveViewer } from "@/lib/viewer";
import { getCollection, getDNA, getMemoryFacts, getMarketPulse } from "@/services/dataSource";
import { runMultiPerspectiveReasoning } from "@/services/multiPerspectiveReasoning";
import type { ReasoningPerspective } from "@/types/reasoning";
import type { Collectible } from "@/types/collectible";
import type { CollectorMemoryFact } from "@/types/memory";

type CollectionResponse = {
  items: Collectible[];
};

type MemoryResponse = {
  facts: CollectorMemoryFact[];
};

export async function POST(request: Request) {
  const { userId, demo } = await resolveViewer();
  const body = await request.json();

  const query: string = body.query ?? "";
  const perspectives: ReasoningPerspective[] | undefined = body.perspectives;
  const collectibleId: string | undefined = body.collectibleId;

  const [collectiblesRaw, dna, memoryData, marketInsights] = await Promise.all([
    getCollection(userId, demo),
    getDNA(userId, demo),
    getMemoryFacts(userId, demo),
    getMarketPulse(demo),
  ]);

  const collectibles: Collectible[] = Array.isArray(collectiblesRaw)
    ? collectiblesRaw
    : (collectiblesRaw as CollectionResponse).items ?? [];

  const memories: CollectorMemoryFact[] = Array.isArray(memoryData)
    ? memoryData
    : (memoryData as MemoryResponse).facts ?? [];

  const targetCollectible = collectibleId
    ? collectibles.find((c) => c.id === collectibleId)
    : undefined;

  const synthesis = runMultiPerspectiveReasoning(
    { query, collectibles, memories, dna, marketInsights, targetCollectible },
    perspectives
  );

  return Response.json({ synthesis, demo });
}