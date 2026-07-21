import { NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createChat, listChats } from "@/services/chatService";

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const chats = await listChats(auth.user.id);
  return Response.json({ chats });
}

export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { title } = await req.json().catch(() => ({ title: undefined }));
  const chat = await createChat(auth.user.id, title);
  return Response.json({ chat });
}
