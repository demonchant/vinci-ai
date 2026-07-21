import { NextRequest } from "next/server";
import { resolveViewer } from "@/lib/viewer";
import { updateNamedCollection, deleteNamedCollection } from "@/services/collectionManager";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId, demo } = await resolveViewer();
  if (demo) return Response.json({ error: "Read-only in Judge Demo Mode" }, { status: 403 });
  const { id } = await params;
  const data = await req.json();
  const collection = await updateNamedCollection(userId, id, data);
  return Response.json({ collection });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId, demo } = await resolveViewer();
  if (demo) return Response.json({ error: "Read-only in Judge Demo Mode" }, { status: 403 });
  const { id } = await params;
  await deleteNamedCollection(userId, id);
  return Response.json({ success: true });
}
