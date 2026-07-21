import { NextRequest } from "next/server";
import { resolveViewer } from "@/lib/viewer";
import { renameTag, pinTag, deleteTag } from "@/services/collectionManager";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId, demo } = await resolveViewer();
  if (demo) return Response.json({ error: "Read-only in Judge Demo Mode" }, { status: 403 });
  const { id } = await params;
  const { name, isPinned } = await req.json();

  if (typeof name === "string") await renameTag(userId, id, name);
  if (typeof isPinned === "boolean") await pinTag(userId, id, isPinned);

  return Response.json({ success: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId, demo } = await resolveViewer();
  if (demo) return Response.json({ error: "Read-only in Judge Demo Mode" }, { status: 403 });
  const { id } = await params;
  await deleteTag(userId, id);
  return Response.json({ success: true });
}
