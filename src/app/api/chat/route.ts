import { NextRequest } from "next/server";
import { openai as aiSdkOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AI_MODELS } from "@/lib/openai";
import {
  appendMessage,
  buildChatSystemPrompt,
  createChat,
  getChat,
  logChatActivity,
} from "@/services/chatService";
import { extractMemoryFacts, commitMemoryFacts, getMemoryProfile } from "@/services/memoryService";
import { computeCollectorDNA } from "@/services/dnaEngine";
import { createDNASnapshot } from "@/services/dnaSnapshotService";
import { maybeCreateCheckpoint } from "@/services/checkpointService";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }
  const userId = auth.user.id;

  const body = await req.json();
  const { chatId: incomingChatId, message, imageUrls } = body as {
    chatId?: string;
    message: string;
    imageUrls?: string[];
  };

  const chat = incomingChatId
    ? await getChat(userId, incomingChatId)
    : await createChat(userId, message.slice(0, 60));
  if (!chat) {
    return new Response(JSON.stringify({ error: "Chat not found" }), { status: 404 });
  }

  const userMessage = await appendMessage(chat.id, "USER", message, imageUrls ?? []);

  const systemPrompt = await buildChatSystemPrompt(userId);
  const history = "messages" in chat ? chat.messages : [];

  const result = streamText({
    model: aiSdkOpenAI(AI_MODELS.chat),
    system: systemPrompt,
    messages: [
      ...history.map((m) => ({
        role: m.role.toLowerCase() as "user" | "assistant" | "system",
        content: m.content,
      })),
      { role: "user" as const, content: message },
    ],
    onFinish: async ({ text }) => {
      const assistantMessage = await appendMessage(chat.id, "ASSISTANT", text);
      await logChatActivity(userId);

      // Snapshot state BEFORE this turn's effects, so the checkpoint can
      // diff against it after.
      const before = await getMemoryProfile(userId);
      const dnaBefore = await computeCollectorDNA(userId);

      const extracted = await extractMemoryFacts(message, before.facts.map((f) => f.key));
      if (extracted.length === 0) return; // nothing learned this turn — no checkpoint, correctly

      await commitMemoryFacts(userId, extracted, "CHAT");
      await createDNASnapshot(userId, "Chat revealed new collector preferences");

      const after = await getMemoryProfile(userId);
      const dnaAfter = await computeCollectorDNA(userId);

      await maybeCreateCheckpoint({
        chatId: chat.id,
        userId,
        messageId: assistantMessage.id,
        memoryBefore: before.facts,
        memoryAfter: after.facts,
        dnaBefore,
        dnaAfter,
        activitySummary: `User said: "${message.slice(0, 200)}"`,
        triggerReason: "Memory extraction during chat",
        sources: [`Conversation: ${chat.id}`, `Message: ${userMessage.id}`],
      });
    },
  });

  return result.toDataStreamResponse();
}
