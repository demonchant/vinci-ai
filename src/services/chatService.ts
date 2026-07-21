import { prisma } from "@/lib/prisma";
import { logActivity } from "./activityLogService";
import { buildMemoryPromptContext } from "./memoryService";

export async function createChat(userId: string, title = "New chat") {
  return prisma.aIChat.create({ data: { userId, title } });
}

export async function listChats(userId: string) {
  return prisma.aIChat.findMany({
    where: { userId },
    orderBy: [{ isPinned: "desc" }, { updatedAt: "desc" }],
    include: { messages: { orderBy: { createdAt: "desc" }, take: 1 } },
  });
}

export async function getChat(userId: string, chatId: string) {
  return prisma.aIChat.findFirst({
    where: { id: chatId, userId },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });
}

export async function appendMessage(
  chatId: string,
  role: "USER" | "ASSISTANT" | "SYSTEM",
  content: string,
  imageUrls: string[] = []
) {
  return prisma.chatMessage.create({
    data: { chatId, role, content, imageUrls },
  });
}

export async function renameChat(userId: string, chatId: string, title: string) {
  return prisma.aIChat.update({ where: { id: chatId, userId }, data: { title } });
}

export async function pinChat(userId: string, chatId: string, isPinned: boolean) {
  return prisma.aIChat.update({ where: { id: chatId, userId }, data: { isPinned } });
}

export async function deleteChat(userId: string, chatId: string) {
  return prisma.aIChat.delete({ where: { id: chatId, userId } });
}

export async function searchChats(userId: string, query: string) {
  return prisma.aIChat.findMany({
    where: {
      userId,
      messages: { some: { content: { contains: query, mode: "insensitive" } } },
    },
    include: { messages: { where: { content: { contains: query, mode: "insensitive" } }, take: 1 } },
  });
}

/**
 * Builds the full system prompt for a chat turn: persona + memory context.
 * Used by /api/chat before streaming the OpenAI response.
 */
export async function buildChatSystemPrompt(userId: string): Promise<string> {
  const memoryContext = await buildMemoryPromptContext(userId);
  return `You are Vinci AI, an expert collector copilot for trading cards, sports cards, comics, watches, sneakers, coins, NFTs, figures, and memorabilia.
You help collectors understand, organize, search, and evaluate collectibles.
Personalize every answer using what you know about this collector — reference it naturally, never as a list dump.
Whenever you state a value, rarity, or authenticity opinion, make clear it is an AI estimate, not a professional appraisal.

${memoryContext}`;
}

export async function logChatActivity(userId: string) {
  await logActivity(userId, "CHAT_MESSAGE");
}
