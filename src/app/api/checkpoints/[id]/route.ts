import { NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCheckpoint } from "@/services/checkpointService";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const checkpoint = await getCheckpoint(id, auth.user.id);
  if (!checkpoint) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ checkpoint });
}
