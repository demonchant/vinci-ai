import { NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCollectible, updateCollectible, deleteCollectible } from "@/services/collectibleService";

async function requireUser() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  return data.user;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ collectibleId: string }> }
) {
  const user = await requireUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { collectibleId } = await params;
  const item = await getCollectible(user.id, collectibleId);
  if (!item) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ item });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ collectibleId: string }> }
) {
  const user = await requireUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { collectibleId } = await params;
  const data = await req.json();
  const item = await updateCollectible(user.id, collectibleId, data);
  return Response.json({ item });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ collectibleId: string }> }
) {
  const user = await requireUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { collectibleId } = await params;
  await deleteCollectible(user.id, collectibleId);
  return Response.json({ success: true });
}
