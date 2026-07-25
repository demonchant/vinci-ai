import { prisma } from "@/lib/prisma";
import { openai, AI_MODELS } from "@/lib/openai";
import { logActivity } from "./activityLogService";
import type { MemorySource, Prisma } from "@prisma/client";
import type { MemoryExtraction } from "@/types/memory";
import { z } from "zod";

const extractionSchema = z.object({
  facts: z.array(
    z.object({
      key: z.string().describe("snake_case canonical key, e.g. favorite_category"),
      label: z.string().describe("Human readable label, e.g. 'Favorite Category'"),
      value: z.union([z.string(), z.number(), z.boolean(), z.array(z.string())]),
      confidence: z.number().min(0).max(100),
    })
  ),
});

export async function extractMemoryFacts(
  text: string,
  existingKeys: string[]
): Promise<MemoryExtraction[]> {
  if (!text.trim()) return [];

  const completion = await openai.chat.completions.create({
    model: AI_MODELS.chat,
    temperature: 0,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You extract durable, reusable facts about a collectibles collector from their message —
things like favorite categories, budget, preferred grading company, risk tolerance, favorite brands,
investment style, etc. Only extract facts that are stated or strongly implied, not guesses.
Skip anything already known: ${existingKeys.join(", ") || "(none yet)"}.
Respond with JSON: { "facts": [{ "key": string, "label": string, "value": string|number|boolean|string[], "confidence": number }] }.
If nothing new is learnable, respond with { "facts": [] }.`,
      },
      { role: "user", content: text },
    ],
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) return [];

  try {
    const parsed = extractionSchema.parse(JSON.parse(raw));
    return parsed.facts;
  } catch {
    return [];
  }
}

export async function commitMemoryFacts(
  userId: string,
  facts: MemoryExtraction[],
  source: MemorySource
) {
  const existingLocked = await prisma.collectorMemory.findMany({
    where: { userId, isLocked: true },
    select: { key: true },
  });
  const lockedKeys = new Set(existingLocked.map((f) => f.key));

  const committed = [];
  for (const fact of facts) {
    if (lockedKeys.has(fact.key)) continue;

    const result = await prisma.collectorMemory.upsert({
      where: { userId_key: { userId, key: fact.key } },
      create: {
        userId,
        key: fact.key,
        label: fact.label,
        value: fact.value as Prisma.InputJsonValue,
        source,
        confidence: fact.confidence,
      },
      update: {
        label: fact.label,
        value: fact.value as Prisma.InputJsonValue,
        source,
        confidence: fact.confidence,
        isArchived: false,
      },
    });
    committed.push(result);
  }

  if (committed.length > 0) {
    await logActivity(userId, "MEMORY_UPDATED", {
      keys: committed.map((c) => c.key),
    });
  }

  return committed;
}

export async function getMemoryProfile(userId: string) {
  const facts = await prisma.collectorMemory.findMany({
    where: { userId, isArchived: false },
    orderBy: [{ isPinned: "desc" }, { updatedAt: "desc" }],
  });

  const asRecord: Record<string, unknown> = {};
  for (const f of facts) asRecord[f.key] = f.value;

  return { facts, asRecord };
}

export async function buildMemoryPromptContext(userId: string): Promise<string> {
  const { facts } = await getMemoryProfile(userId);
  if (facts.length === 0) {
    return "You do not yet know this collector's preferences. Ask naturally, don't interrogate.";
  }
  const lines = facts.map((f) => `- ${f.label}: ${JSON.stringify(f.value)}`);
  return `Known facts about this collector (use naturally, don't just list them back):\n${lines.join("\n")}`;
}

export async function pinMemory(userId: string, memoryId: string, isPinned: boolean) {
  return prisma.collectorMemory.update({
    where: { id: memoryId, userId },
    data: { isPinned },
  });
}

export async function archiveMemory(userId: string, memoryId: string) {
  return prisma.collectorMemory.update({
    where: { id: memoryId, userId },
    data: { isArchived: true },
  });
}

export async function editMemory(
  userId: string,
  memoryId: string,
  value: string | number | boolean | string[]
) {
  return prisma.collectorMemory.update({
    where: { id: memoryId, userId },
    data: { value: value as Prisma.InputJsonValue, source: "MANUAL_EDIT" },
  });
}

export async function resetMemory(userId: string) {
  await prisma.collectorMemory.updateMany({
    where: { userId },
    data: { isArchived: true },
  });
}

export const MEMORY_CATEGORIES = [
  "Collection Preferences",
  "Budget",
  "Goals & Long-Term Plans",
  "Favorite Categories",
  "Brands",
  "Risk",
  "Research Style",
  "Buying Habits",
  "Selling Habits",
  "Authentication Preferences",
  "Wishlist",
] as const;
export type MemoryCategory = (typeof MEMORY_CATEGORIES)[number];

const CATEGORY_RULES: { test: RegExp; category: MemoryCategory }[] = [
  { test: /budget|price_range/i, category: "Budget" },
  { test: /goal|long.?term/i, category: "Goals & Long-Term Plans" },
  { test: /favorite_categor|favorite_card_games|favorite_sports|favorite_teams/i, category: "Favorite Categories" },
  { test: /brand|watch_brand|artist/i, category: "Brands" },
  { test: /risk/i, category: "Risk" },
  { test: /research|interest/i, category: "Research Style" },
  { test: /buying_habit|marketplace|investment_style/i, category: "Buying Habits" },
  { test: /selling_habit/i, category: "Selling Habits" },
  { test: /grading|authentic|insurance_status/i, category: "Authentication Preferences" },
  { test: /wishlist/i, category: "Wishlist" },
];

export function categorizeMemoryKey(key: string): MemoryCategory {
  for (const rule of CATEGORY_RULES) {
    if (rule.test.test(key)) return rule.category;
  }
  return "Collection Preferences";
}

export async function verifyMemory(userId: string, memoryId: string) {
  return prisma.collectorMemory.update({
    where: { id: memoryId, userId },
    data: { isVerified: true, confidence: 100 },
  });
}

export async function unverifyMemory(userId: string, memoryId: string) {
  return prisma.collectorMemory.update({
    where: { id: memoryId, userId },
    data: { isVerified: false },
  });
}

export async function setMemoryLock(userId: string, memoryId: string, locked: boolean) {
  return prisma.collectorMemory.update({
    where: { id: memoryId, userId },
    data: { isLocked: locked },
  });
}

export async function correctMemory(
  userId: string,
  memoryId: string,
  value: string | number | boolean | string[]
) {
  return prisma.collectorMemory.update({
    where: { id: memoryId, userId },
    data: { 
      value: value as Prisma.InputJsonValue, 
      source: "MANUAL_EDIT", 
      isVerified: true, 
      confidence: 100 
    },
  });
}

export async function recalculateAllConfidence(userId: string) {
  const facts = await prisma.collectorMemory.findMany({
    where: { userId, isArchived: false, isVerified: false, isLocked: false },
  });
  const checkpoints = await prisma.conversationCheckpoint.findMany({
    where: { userId },
    select: { memoryAfter: true },
  });

  for (const fact of facts) {
    const evidenceCount = checkpoints.filter((c) =>
      Array.isArray(c.memoryAfter) &&
      (c.memoryAfter as { key: string }[]).some((m) => m.key === fact.key)
    ).length;
    const daysSinceLearned = (Date.now() - fact.learnedAt.getTime()) / 86_400_000;
    const staleness = Math.min(20, Math.floor(daysSinceLearned / 30) * 5);
    const confidence = Math.max(30, Math.min(95, 60 + evidenceCount * 10 - staleness));

    await prisma.collectorMemory.update({ where: { id: fact.id }, data: { confidence } });
  }

  return facts.length;
}

export async function forgetCategory(userId: string, category: MemoryCategory) {
  const facts = await prisma.collectorMemory.findMany({ where: { userId, isArchived: false } });
  const idsToForget = facts.filter((f) => categorizeMemoryKey(f.key) === category).map((f) => f.id);
  if (idsToForget.length === 0) return 0;
  await prisma.collectorMemory.updateMany({
    where: { id: { in: idsToForget } },
    data: { isArchived: true },
  });
  return idsToForget.length;
}

export async function verifyAll(userId: string) {
  const result = await prisma.collectorMemory.updateMany({
    where: { userId, isArchived: false },
    data: { isVerified: true, confidence: 100 },
  });
  return result.count;
}

export async function exportMemoryAsJSON(userId: string): Promise<string> {
  const { facts } = await getMemoryProfile(userId);
  return JSON.stringify(
    facts.map((f) => ({
      key: f.key,
      label: f.label,
      value: f.value,
      confidence: f.confidence,
      verified: f.isVerified,
      source: f.source,
      learnedAt: f.learnedAt,
    })),
    null,
    2
  );
}

export async function exportMemoryAsMarkdown(userId: string): Promise<string> {
  const { facts } = await getMemoryProfile(userId);
  const byCategory = new Map<string, typeof facts>();
  for (const fact of facts) {
    const cat = categorizeMemoryKey(fact.key);
    byCategory.set(cat, [...(byCategory.get(cat) ?? []), fact]);
  }

  let md = `# Collector Memory Export\n\nGenerated ${new Date().toISOString()}\n\n`;
  for (const [category, items] of byCategory) {
    md += `## ${category}\n\n`;
    for (const item of items) {
      md += `- **${item.label}**: ${JSON.stringify(item.value)} _(confidence ${item.confidence}%${
        item.isVerified ? ", verified" : ""
      })_\n`;
    }
    md += "\n";
  }
  return md;
}