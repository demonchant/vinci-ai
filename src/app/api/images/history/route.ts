import { NextRequest } from "next/server";
import { resolveViewer } from "@/lib/viewer";
import { getAnalysisHistory } from "@/services/imageAnalysisService";
import { demoCollection } from "@/demo/fixtures/demoCollection";

export async function GET(req: NextRequest) {
  const { userId, demo } = await resolveViewer();
  const limit = Number(new URL(req.url).searchParams.get("limit") ?? 30);

  if (demo) {
    // Demo history is derived from the demo collection's purchase events,
    // since there's no separate demo ImageAnalysis fixture table.
    const history = demoCollection.slice(0, limit).map((c) => ({
      id: `demo-analysis-${c.id}`,
      collectibleId: c.id,
      imageUrl: c.images[0]?.publicUrl ?? null,
      identification: c.title,
      category: c.category,
      confidenceScore: c.rarityScore ?? 80,
      createdAt: c.createdAt,
    }));
    return Response.json({ history, demo: true });
  }

  const history = await getAnalysisHistory(userId, limit);
  return Response.json({ history, demo: false });
}
