import { resolveViewer } from "@/lib/viewer";
import { getCollection, getDNA, getMemoryFacts } from "@/services/dataSource";
import { buildCollectorTwin, assessCollectibleFit, answerTwinQuestion } from "@/services/collectorTwin";
import type { TwinQuestion } from "@/types/collectorTwin";
import type { CollectorMemoryFact } from "@/types/memory";
import type { Collectible } from "@/types/collectible"; // Adjust path if needed

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

  const twin = buildCollectorTwin(collectibles, memories, dna);

  return Response.json({ twin, demo });
}

export async function POST(request: Request) {
  const { userId, demo } = await resolveViewer();
  const body = await request.json();

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

  const twin = buildCollectorTwin(collectibles, memories, dna);

  if (body.action === "ask") {
    const question: TwinQuestion = {
      question: body.question,
      context: body.context ?? undefined,
    };
    const answer = answerTwinQuestion(question, twin, memories);
    return Response.json({ answer, demo });
  }

  if (body.action === "assess" && body.collectibleId) {
    const target = collectibles.find((c) => c.id === body.collectibleId);
    if (!target) return Response.json({ error: "Collectible not found" }, { status: 404 });
    const assessment = assessCollectibleFit(target, twin);
    return Response.json({ assessment, demo });
  }

  return Response.json({ error: "Invalid action" }, { status: 400 });
}