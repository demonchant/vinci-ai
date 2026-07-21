import { resolveViewer } from "@/lib/viewer";
import { getCollection, getDNA, getMemoryFacts } from "@/services/dataSource";
import { buildCollectorTwin, assessCollectibleFit, answerTwinQuestion } from "@/services/collectorTwin";
import type { TwinQuestion } from "@/types/collectorTwin";
import type { CollectorMemoryFact } from "@/types/memory";

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
  const twin = buildCollectorTwin(collectibles, memories as any, dna);

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

  const collectibles = Array.isArray(collectiblesRaw)
    ? collectiblesRaw
    : (collectiblesRaw as any)?.items ?? [];

  const memories = (memoryData as any).facts ?? memoryData;
  const twin = buildCollectorTwin(collectibles, memories as any, dna);

  if (body.action === "ask") {
    const question: TwinQuestion = {
      question: body.question,
      context: body.context ?? undefined,
    };
    const answer = answerTwinQuestion(question, twin, memories as CollectorMemoryFact[]);
    return Response.json({ answer, demo });
  }

  if (body.action === "assess" && body.collectibleId) {
    const target = collectibles.find((c: any) => c.id === body.collectibleId);
    if (!target) return Response.json({ error: "Collectible not found" }, { status: 404 });
    const assessment = assessCollectibleFit(target, twin);
    return Response.json({ assessment, demo });
  }

  return Response.json({ error: "Invalid action" }, { status: 400 });
}
