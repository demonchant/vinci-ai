import { resolveViewer } from "@/lib/viewer";
import { getCollection, getDNA, getMemoryFacts } from "@/services/dataSource";
import { computeConfidenceHeatmap } from "@/services/confidenceHeatmap";

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
  const heatmap = computeConfidenceHeatmap(collectibles, memories as any, dna);

  return Response.json({ heatmap, demo });
}
