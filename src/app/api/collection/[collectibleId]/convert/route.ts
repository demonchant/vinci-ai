import { NextRequest } from "next/server";
import { resolveViewer } from "@/lib/viewer";
import { convertWishlistToOwned } from "@/services/collectionManager";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ collectibleId: string }> }
) {
  const { userId, demo } = await resolveViewer();
  if (demo) return Response.json({ error: "Read-only in Judge Demo Mode" }, { status: 403 });
  const { collectibleId } = await params;
  const { purchasePrice } = await req.json().catch(() => ({}));
  const item = await convertWishlistToOwned(userId, collectibleId, purchasePrice);
  return Response.json({ item });
}
