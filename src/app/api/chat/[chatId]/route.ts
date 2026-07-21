import { NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { resolveViewer } from "@/lib/viewer";
import { getChatThread } from "@/services/dataSource";
import { renameChat, pinChat, deleteChat, getChat } from "@/services/chatService";

async function requireUser() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  return data.user;
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ chatId: string }> }) {
  const { userId, demo } = await resolveViewer();
  const { chatId } = await params;
  const chat = await getChatThread(userId, chatId, demo);
  if (!chat) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ chat, demo });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ chatId: string }> }) {
  // Renaming/pinning real chats requires a real account — demo data is read-only.
  const user = await requireUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { chatId } = await params;
  const { title, isPinned } = await req.json();

  if (typeof title === "string") await renameChat(user.id, chatId, title);
  if (typeof isPinned === "boolean") await pinChat(user.id, chatId, isPinned);

  const chat = await getChat(user.id, chatId);
  return Response.json({ chat });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ chatId: string }> }) {
  const user = await requireUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { chatId } = await params;
  await deleteChat(user.id, chatId);
  return Response.json({ success: true });
}
