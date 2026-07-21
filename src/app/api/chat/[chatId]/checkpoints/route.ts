import { NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { listCheckpoints } from "@/services/checkpointService";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ chatId: string }> }) {
  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { chatId } = await params;
  const checkpoints = await listCheckpoints(chatId, auth.user.id);
  return Response.json({ checkpoints });
}
