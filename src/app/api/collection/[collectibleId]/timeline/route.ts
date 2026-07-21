import { NextRequest } from "next/server";
import { resolveViewer } from "@/lib/viewer";
import { getProvenanceTimeline } from "@/services/provenanceTimeline";
import { demoProvenance } from "@/demo/fixtures/demoProvenance";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ collectibleId: string }> }
) {
  const { userId, demo } = await resolveViewer();
  const { collectibleId } = await params;

  if (demo) {
    const timeline = demoProvenance[collectibleId];
    if (!timeline) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json({ timeline, demo: true });
  }

  const timeline = await getProvenanceTimeline(collectibleId, userId);
  if (!timeline) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ timeline, demo: false });
}
