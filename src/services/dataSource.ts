import { isDemoMode } from "./demoMode";
import { computeCollectorDNA } from "./dnaEngine";
import { getCollectionStats, listCollectibles } from "./collectibleService";
import { getMemoryProfile } from "./memoryService";
import { getRecentActivity } from "./activityLogService";
import { listDNASnapshots } from "./dnaSnapshotService";
import { listChats, getChat } from "./chatService";
import { listCheckpointsForUser } from "./checkpointService";
import { computeMemoryOverview, groupByCategory, computeMemoryHealth } from "./memoryAnalyticsService";
import { buildMemoryGraph } from "./memoryGraphService";
import { listPendingSuggestions } from "./memorySuggestionService";
import { prisma } from "@/lib/prisma";

import { demoProfile } from "@/demo/fixtures/demoProfile";
import { demoCollection } from "@/demo/fixtures/demoCollection";
import { demoDNA } from "@/demo/fixtures/demoDNA";
import { demoMemory } from "@/demo/fixtures/demoMemory";
import { demoSuggestions } from "@/demo/fixtures/demoSuggestions";
import { demoActivity } from "@/demo/fixtures/demoActivity";
import { demoReplay } from "@/demo/fixtures/demoReplay";
import { demoAchievements } from "@/demo/fixtures/demoAchievements";
import { demoGoals } from "@/demo/fixtures/demoGoals";
import { demoMarket } from "@/demo/fixtures/demoMarket";
import { demoLegacy } from "@/demo/fixtures/demoLegacy";
import { demoChats } from "@/demo/fixtures/demoChats";

import type { CollectorDNA } from "@/types/dna";

export interface CollectorProfileSummary {
  displayName: string;
  collectorSince: string;
  dnaScore: number;
  primaryType: CollectorDNA["primaryType"];
  secondaryType: CollectorDNA["secondaryType"];
  portfolioHealth: number;
  knowledgeScore: number;
  researchScore: number;
  riskProfile: CollectorDNA["riskProfile"];
  collectionSize: number;
  collectionValue: number;
}

/**
 * Resolves whether to read from the real database or from demo fixtures,
 * once, per request. Every function below takes the result so a page only
 * has to call this — and isDemoMode() — a single time.
 */
export async function resolveDataMode() {
  return isDemoMode();
}

export async function getCollectorProfile(
  userId: string,
  demo: boolean
): Promise<CollectorProfileSummary> {
  if (demo) {
    return {
      displayName: demoProfile.displayName,
      collectorSince: demoProfile.collectorSince,
      dnaScore: demoProfile.dnaScore,
      primaryType: demoProfile.primaryType,
      secondaryType: demoProfile.secondaryType,
      portfolioHealth: demoProfile.portfolioHealth,
      knowledgeScore: demoProfile.knowledgeScore,
      researchScore: demoProfile.researchScore,
      riskProfile: demoProfile.riskProfile,
      collectionSize: demoProfile.collectionSize,
      collectionValue: demoProfile.collectionValue,
    };
  }

  const [stats, dna] = await Promise.all([getCollectionStats(userId), computeCollectorDNA(userId)]);
  return {
    displayName: "Collector",
    collectorSince: new Date().getFullYear().toString(),
    dnaScore: dna.dnaScore,
    primaryType: dna.primaryType,
    secondaryType: dna.secondaryType,
    portfolioHealth: dna.collectionHealthScore,
    knowledgeScore: dna.wheel.find((w) => w.axis === "Knowledge")?.score ?? 0,
    researchScore: dna.wheel.find((w) => w.axis === "Research")?.score ?? 0,
    riskProfile: dna.riskProfile,
    collectionSize: stats.total,
    collectionValue: stats.totalValue,
  };
}

export async function getDNA(userId: string, demo: boolean): Promise<CollectorDNA> {
  if (demo) return demoDNA;
  return computeCollectorDNA(userId);
}

export async function getCollection(userId: string, demo: boolean) {
  if (demo) return demoCollection;
  return listCollectibles(userId);
}

export async function getCollectionSummary(userId: string, demo: boolean) {
  if (demo) {
    const categoryCounts = demoCollection.reduce<Record<string, number>>((acc, c) => {
      acc[c.category] = (acc[c.category] ?? 0) + 1;
      return acc;
    }, {});
    return {
      total: demoProfile.collectionSize,
      totalValue: demoProfile.collectionValue,
      categoryCounts,
      authenticatedPct: Math.round(
        (demoCollection.filter((c) => c.isAuthenticated).length / demoCollection.length) * 100
      ),
      mostValuable: [...demoCollection].sort(
        (a, b) => Number(b.estimatedValue ?? 0) - Number(a.estimatedValue ?? 0)
      )[0],
    };
  }
  return getCollectionStats(userId);
}

export async function getMemoryFacts(userId: string, demo: boolean) {
  if (demo) return { facts: demoMemory, asRecord: {} };
  return getMemoryProfile(userId);
}

export async function getMemoryOverview(userId: string, demo: boolean) {
  const { facts } = await getMemoryFacts(userId, demo);
  return computeMemoryOverview(facts);
}

export async function getMemoryCategories(userId: string, demo: boolean) {
  const { facts } = await getMemoryFacts(userId, demo);
  return groupByCategory(facts);
}

export async function getMemoryHealth(userId: string, demo: boolean) {
  const { facts } = await getMemoryFacts(userId, demo);
  return computeMemoryHealth(facts);
}

export async function getMemoryGraph(userId: string, demo: boolean) {
  const { facts } = await getMemoryFacts(userId, demo);
  const goals = await getGoals(userId, demo);
  return buildMemoryGraph(facts, goals.map((g) => ({ id: g.id, title: g.title })));
}

export async function getMemoryTimeline(userId: string, demo: boolean) {
  if (demo) {
    return demoMemory.map((f) => ({
      memoryLabel: f.label,
      memoryValue: f.value,
      source: "Demonstration chat",
      checkpointId: null,
      confidence: f.confidence,
      createdAt: f.learnedAt,
    }));
  }
  const checkpoints = await listCheckpointsForUser(userId, 100);
  return checkpoints
    .filter((c) => Array.isArray(c.memoryAfter) && (c.memoryAfter as unknown[]).length >= 0)
    .flatMap((c) => {
      const before = (c.memoryBefore as { key: string; value: unknown }[]) ?? [];
      const after = (c.memoryAfter as { key: string; label: string; value: unknown }[]) ?? [];
      return after
        .filter((m) => {
          const prev = before.find((b) => b.key === m.key);
          return JSON.stringify(prev?.value) !== JSON.stringify(m.value);
        })
        .map((m) => ({
          memoryLabel: m.label,
          memoryValue: m.value,
          source: `Conversation`,
          checkpointId: c.id,
          confidence: c.confidence,
          createdAt: c.createdAt.toISOString(),
        }));
    });
}

export async function getMemorySuggestions(userId: string, demo: boolean) {
  if (demo) return demoSuggestions;
  return listPendingSuggestions(userId);
}

function describeActivity(type: string, metadata: Record<string, unknown> | null): string {
  switch (type) {
    case "COLLECTIBLE_ADDED":
      return "Added a new collectible to your collection";
    case "IMAGE_ANALYZED":
      return "Analyzed a collectible image";
    case "CHAT_MESSAGE":
      return "Chatted with Vinci AI";
    case "MEMORY_UPDATED":
      return `Collector Memory updated${
        metadata?.keys ? ` (${(metadata.keys as string[]).join(", ")})` : ""
      }`;
    case "DNA_SNAPSHOT_CREATED":
      return "Collector DNA updated";
    case "REPORT_GENERATED":
      return "Generated a Legacy Report";
    default:
      return type.replaceAll("_", " ").toLowerCase();
  }
}

export async function getActivityFeed(userId: string, demo: boolean, limit = 10) {
  if (demo) return demoActivity.slice(0, limit);
  const real = await getRecentActivity(userId, limit);
  return real.map((a) => ({
    id: a.id,
    type: a.type,
    description: describeActivity(a.type, a.metadata as Record<string, unknown> | null),
    createdAt: a.createdAt.toISOString(),
  }));
}

export async function getDNASnapshots(userId: string, demo: boolean) {
  if (demo) return demoReplay;
  return listDNASnapshots(userId);
}

export async function getAchievements(userId: string, demo: boolean) {
  if (demo) return demoAchievements;
  const rows = await prisma.achievement.findMany({ where: { userId, unlockedAt: { not: null } } });
  return rows.map((r) => ({
    id: r.id,
    key: r.key,
    title: r.title,
    description: r.description,
    icon: r.icon,
    progress: r.progress,
    unlockedAt: r.unlockedAt?.toISOString() ?? null,
  }));
}

export async function getGoals(userId: string, demo: boolean) {
  if (demo) return demoGoals;
  const rows = await prisma.goal.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
  return rows.map((g) => ({
    id: g.id,
    title: g.title,
    description: g.description,
    status: g.status,
    progress: g.progress,
  }));
}

export async function getMarketPulse(demo: boolean) {
  if (demo) return demoMarket;
  const rows = await prisma.marketInsight.findMany({ orderBy: { publishedAt: "desc" }, take: 10 });
  return rows.map((r) => ({
    id: r.id,
    category: r.category,
    headline: r.headline,
    summary: r.summary,
    sentiment: r.sentiment as "bullish" | "bearish" | "neutral" | null,
    changePct: r.changePct ? Number(r.changePct) : null,
    source: r.source,
    isOpportunity: r.isOpportunity,
    isRisk: r.isRisk,
    publishedAt: r.publishedAt.toISOString(),
  }));
}

export async function getLegacyReport(userId: string, demo: boolean) {
  if (demo) return demoLegacy;
  const row = await prisma.legacyReport.findFirst({
    where: { userId },
    orderBy: { generatedAt: "desc" },
  });
  return row ? (row.reportData as object) : null;
}

export async function getChatList(userId: string, demo: boolean) {
  if (demo) return demoChats;
  return listChats(userId);
}

export async function getChatThread(userId: string, chatId: string, demo: boolean) {
  if (demo) return demoChats.find((c) => c.id === chatId) ?? null;
  return getChat(userId, chatId);
}
