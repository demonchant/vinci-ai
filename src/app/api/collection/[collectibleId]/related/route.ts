import { NextRequest } from "next/server";
import { resolveViewer } from "@/lib/viewer";
import { findRelatedCollectibles } from "@/services/relatedCollectibles";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ collectibleId: string }> }
) {
  const { userId, demo } = await resolveViewer();
  const { collectibleId } = await params;

  if (demo) {
    return Response.json({ related: [], demo: true });
  }

  const related = await findRelatedCollectibles(userId, collectibleId);
  return Response.json({ related, demo: false });
}
