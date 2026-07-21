import { prisma } from "@/lib/prisma";
import { openai, AI_MODELS } from "@/lib/openai";
import { getRecentActivity } from "./activityLogService";
import { getMemoryProfile } from "./memoryService";

/**
 * Looks at recent real activity (collectibles added, searches, image
 * analyses) and proposes NEW memory facts the user hasn't confirmed yet.
 * Grounded only in actual activity rows — if there's no real signal, it
 * correctly returns no suggestions rather than inventing one.
 */
export async function generateSuggestions(userId: string) {
  const [{ facts }, activity] = await Promise.all([
    getMemoryProfile(userId),
    getRecentActivity(userId, 50),
  ]);

  if (activity.length < 3) return []; // not enough signal to suggest anything honestly

  const existingKeys = facts.map((f) => f.key);
  const alreadyPending = await prisma.memorySuggestion.findMany({
    where: { userId, status: "PENDING" },
    select: { suggestedKey: true },
  });
  const pendingKeys = new Set(alreadyPending.map((s) => s.suggestedKey));

  const completion = await openai.chat.completions.create({
    model: AI_MODELS.chat,
    temperature: 0.4,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `Given a collector's recent activity log, suggest at most 2 NEW Collector Memory facts
that are not already known (skip: ${existingKeys.join(", ") || "none"}) and not already pending
(skip: ${[...pendingKeys].join(", ") || "none"}). Only suggest something with real support in the
activity given — do not invent interests with no evidence. Respond as JSON:
{ "suggestions": [{ "key": string, "label": string, "value": string, "reason": string }] }
If there's no strong pattern, respond with { "suggestions": [] }.`,
      },
      {
        role: "user",
        content: JSON.stringify(activity.map((a) => ({ type: a.type, metadata: a.metadata }))),
      },
    ],
  });

  const raw = completion.choices[0]?.message?.content;
  const parsed = raw ? JSON.parse(raw) : { suggestions: [] };

  const created = [];
  for (const s of parsed.suggestions ?? []) {
    const row = await prisma.memorySuggestion.create({
      data: {
        userId,
        suggestedKey: s.key,
        suggestedLabel: s.label,
        suggestedValue: s.value,
        reason: s.reason,
      },
    });
    created.push(row);
  }
  return created;
}

export async function listPendingSuggestions(userId: string) {
  return prisma.memorySuggestion.findMany({
    where: { userId, status: "PENDING" },
    orderBy: { createdAt: "desc" },
  });
}

export async function resolveSuggestion(
  userId: string,
  suggestionId: string,
  action: "accept" | "ignore" | "never_ask"
) {
  const suggestion = await prisma.memorySuggestion.findFirst({
    where: { id: suggestionId, userId },
  });
  if (!suggestion) return null;

  if (action === "accept") {
    await prisma.collectorMemory.upsert({
      where: { userId_key: { userId, key: suggestion.suggestedKey } },
      create: {
        userId,
        key: suggestion.suggestedKey,
        label: suggestion.suggestedLabel,
        value: suggestion.suggestedValue as any,
        source: "MANUAL_EDIT",
        confidence: 75,
      },
      update: {
        label: suggestion.suggestedLabel,
        value: suggestion.suggestedValue as any,
        isArchived: false,
      },
    });
  }

  const status = action === "accept" ? "ACCEPTED" : action === "ignore" ? "IGNORED" : "NEVER_ASK";
  return prisma.memorySuggestion.update({
    where: { id: suggestionId },
    data: { status, resolvedAt: new Date() },
  });
}
