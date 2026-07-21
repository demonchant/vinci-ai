import { resolveViewer } from "@/lib/viewer";
import { getCollection, getDNA, getMemoryFacts, getMarketPulse } from "@/services/dataSource";
import { runMultiPerspectiveReasoning } from "@/services/multiPerspectiveReasoning";
import type { ReasoningPerspective } from "@/types/reasoning";

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

  const collectibles = Array.isArray(collectiblesRaw)
    ? collectiblesRaw
    : (collectiblesRaw as any)?.items ?? [];

  const memories = (memoryData as any).facts ?? memoryData;
  const targetCollectible = collectibleId
    ? collectibles.find((c: any) => c.id === collectibleId)
    : undefined;

  const synthesis = runMultiPerspectiveReasoning(
    { query, collectibles, memories: memories as any, dna, marketInsights, targetCollectible },
    perspectives
  );

  return Response.json({ synthesis, demo });
}
