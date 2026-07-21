import { prisma } from "@/lib/prisma";
import { openai, AI_MODELS } from "@/lib/openai";
import { logActivity } from "./activityLogService";
import type { MemorySource } from "@prisma/client";
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

/**
 * Calls OpenAI to extract durable collector facts from a piece of free text
 * (a chat message, a search query, etc). Returns [] if nothing new was learned —
 * most turns will not contain a learnable fact, and that's expected.
 */
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

/**
 * Persists extracted facts as CollectorMemory rows (upsert by userId+key),
 * logs the activity, and returns the facts that were actually new/updated
 * so the caller can surface "Vinci AI just learned..." UI.
 */
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
    if (lockedKeys.has(fact.key)) continue; // locked memories are never auto-overwritten

    const result = await prisma.collectorMemory.upsert({
      where: { userId_key: { userId, key: fact.key } },
      create: {
        userId,
        key: fact.key,
        label: fact.label,
        value: fact.value as any,
        source,
        confidence: fact.confidence,
      },
      update: {
        label: fact.label,
        value: fact.value as any,
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

/** Builds the system-prompt fragment used to personalize every AI response. */
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
    data: { value: value as any, source: "MANUAL_EDIT" },
  });
}

export async function resetMemory(userId: string) {
  await prisma.collectorMemory.updateMany({
    where: { userId },
    data: { isArchived: true },
  });
}

// ──────────────────────────────────────────────────────────────
// KNOWLEDGE CATEGORIES
// ──────────────────────────────────────────────────────────────

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

// ──────────────────────────────────────────────────────────────
// VERIFY / LOCK / CORRECT
// ──────────────────────────────────────────────────────────────

/** User explicitly confirms a memory is correct. Bumps confidence to reflect that. */
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

/** Locked memories are skipped by automatic extraction — see memoryService.commitMemoryFacts. */
export async function setMemoryLock(userId: string, memoryId: string, locked: boolean) {
  return prisma.collectorMemory.update({
    where: { id: memoryId, userId },
    data: { isLocked: locked },
  });
}

/** Correct = edit + mark verified in one action, since a manual correction is high-trust. */
export async function correctMemory(
  userId: string,
  memoryId: string,
  value: string | number | boolean | string[]
) {
  return prisma.collectorMemory.update({
    where: { id: memoryId, userId },
    data: { value: value as any, source: "MANUAL_EDIT", isVerified: true, confidence: 100 },
  });
}

// ──────────────────────────────────────────────────────────────
// CONFIDENCE
// ──────────────────────────────────────────────────────────────

/**
 * Recalculates confidence for every active memory based on real evidence:
 * how many checkpoints reference this key, and how long ago it was learned
 * (confidence decays slightly for stale, never-reinforced facts). Verified
 * and locked memories are left untouched — they reflect explicit user
 * confirmation, not a heuristic.
 */
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

// ──────────────────────────────────────────────────────────────
// BULK ACTIONS
// ──────────────────────────────────────────────────────────────

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

// ──────────────────────────────────────────────────────────────
// EXPORT
// ──────────────────────────────────────────────────────────────

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
