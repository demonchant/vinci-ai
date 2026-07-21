import { NextRequest } from "next/server";
import { resolveViewer } from "@/lib/viewer";
import { updateWishlistDetails } from "@/services/collectionManager";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ collectibleId: string }> }
) {
  const { userId, demo } = await resolveViewer();
  if (demo) return Response.json({ error: "Read-only in Judge Demo Mode" }, { status: 403 });
  const { collectibleId } = await params;
  const data = await req.json();
  const item = await updateWishlistDetails(userId, collectibleId, data);
  return Response.json({ item });
}
