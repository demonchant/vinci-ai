import { prisma } from "@/lib/prisma";
import { computeCollectorDNA } from "./dnaEngine";
import { getMemoryProfile } from "./memoryService";
import { computePortfolioStats } from "./collectionAnalytics";
import { listAchievements } from "./achievementService";
import type {
  LegacyCoverData,
  LegacyCollectionHighlight,
  LegacyMemoryHighlight,
  LegacyConversationHighlight,
  LegacyAchievementHighlight,
  LegacyGoalHighlight,
  LegacyPortfolioSnapshot,
  LegacyScore,
  LegacyDataBundle,
} from "@/types/legacy";

export async function gatherLegacyBundle(userId: string): Promise<LegacyDataBundle> {
  const [user, dna, { facts }, stats, achievements, collectibles, chats, goals, snapshotCount] =
    await Promise.all([
      prisma.user.findFirstOrThrow({ where: { id: userId }, select: { createdAt: true, email: true } }),
      computeCollectorDNA(userId),
      getMemoryProfile(userId),
      computePortfolioStats(userId),
      listAchievements(userId),
      prisma.collectible.findMany({ where: { userId }, orderBy: { estimatedValue: "desc" }, take: 20, include: { images: true } }),
      prisma.aIChat.findMany({ where: { userId }, orderBy: { updatedAt: "desc" }, take: 5 }),
      prisma.goal.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 10 }),
      prisma.dNASnapshot.count({ where: { userId } }),
    ]);

  const level = Math.floor(dna.dnaScore / 10) + 1;
  const cover: LegacyCoverData = {
    collectorName: user.email.split("@")[0] ?? "Collector",
    collectorSince: user.createdAt.toISOString(),
    level,
    primaryArchetype: dna.primaryType,
    dnaScore: dna.dnaScore,
    collectionSize: stats.totalItems,
    portfolioValue: stats.totalValue > 0 ? Number(stats.totalValue) : null,
    generatedAt: new Date().toISOString(),
  };

  const mostValuable = collectibles[0] ?? null;
  const mostAnalyzed = await prisma.collectible.findFirst({ where: { userId }, orderBy: { lastAnalysisConfidence: "desc" } });
  const newest = await prisma.collectible.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } });

  const collectionHighlights: LegacyCollectionHighlight[] = [];
  if (mostValuable) {
    collectionHighlights.push({
      label: "Most Valuable",
      collectibleId: mostValuable.id,
      collectibleTitle: mostValuable.title,
      value: mostValuable.estimatedValue ? `$${Number(mostValuable.estimatedValue).toLocaleString()}` : "Value unknown",
    });
  }
  if (mostAnalyzed) {
    collectionHighlights.push({
      label: "Highest Confidence",
      collectibleId: mostAnalyzed.id,
      collectibleTitle: mostAnalyzed.title,
      value: `${mostAnalyzed.lastAnalysisConfidence ?? 0}% confidence`,
    });
  }
  if (newest) {
    collectionHighlights.push({
      label: "Newest Acquisition",
      collectibleId: newest.id,
      collectibleTitle: newest.title,
      value: new Date(newest.createdAt).toLocaleDateString(),
    });
  }

  const topFacts = [...facts].sort((a, b) => b.confidence - a.confidence).slice(0, 4);
  const memoryHighlights: LegacyMemoryHighlight[] = topFacts.map((f) => ({
    label: f.isVerified ? "Verified Memory" : "AI Inferred Memory",
    memoryLabel: f.label,
    memoryValue: String(f.value),
    confidence: f.confidence,
  }));

  const conversationHighlights: LegacyConversationHighlight[] = chats.slice(0, 3).map((c) => ({
    label: "Notable Conversation",
    chatTitle: c.title,
    chatId: c.id,
    summary: `${c.title || "Conversation"} · ${new Date(c.updatedAt).toLocaleDateString()}`,
  }));

  const achievementHighlights: LegacyAchievementHighlight[] = achievements.map((a) => ({
    key: a.key,
    title: a.title,
    tier: "standard", // Fallback as requested
    xp: 0,            // Fallback as requested
    unlockedAt: a.unlockedAt?.toISOString() ?? null,
    isUnlocked: a.unlockedAt !== null,
    progress: a.progress,
  }));

  const goalHighlights: LegacyGoalHighlight[] = goals.map((g) => ({
    title: g.title,
    progress: g.progress,
    isCompleted: g.status === "COMPLETED",
    dnaContribution: null, // ✅ Added to satisfy the updated interface
  }));

  const portfolio: LegacyPortfolioSnapshot = {
    totalItems: stats.totalItems,
    totalValue: Number(stats.totalValue),
    categoryDistribution: stats.categoryDistribution.map((d) => ({ category: d.category, count: d.count })),
    authenticationRatePct: stats.authenticationRatePct,
    averageConfidence: stats.averageConfidence,
    diversificationScore: stats.diversificationScore,
  };

  const unlockedCount = achievements.filter((a) => a.unlockedAt !== null).length;
  const achievementScore = Math.round((unlockedCount / Math.max(achievements.length, 1)) * 100);
  const memoryScore = Math.min(100, Math.round((facts.length / 15) * 100));
  const consistencyScore = Math.min(100, Math.round((snapshotCount / 20) * 100));

  const breakdown = [
    { label: "Collector DNA", score: dna.dnaScore, weight: 0.3 },
    { label: "Authentication Rate", score: stats.authenticationRatePct, weight: 0.15 },
    { label: "Collection Quality", score: Math.min(100, stats.diversificationScore + 20), weight: 0.15 },
    { label: "Achievements", score: achievementScore, weight: 0.15 },
    { label: "Knowledge", score: memoryScore, weight: 0.15 },
    { label: "Consistency", score: consistencyScore, weight: 0.1 },
  ];
  const overall = Math.round(breakdown.reduce((s, b) => s + b.score * b.weight, 0));

  const legacyScore: LegacyScore = {
    overall,
    breakdown,
    confidence: Math.min(95, 50 + facts.length * 3 + snapshotCount * 2),
    explanation: `Your Legacy Score of ${overall} is a weighted composite of ${breakdown.length} real metrics — Collector DNA, authentication habits, collection quality, achievements, knowledge depth, and engagement consistency.`,
  };

  const longestTimeline = await prisma.collectible.findFirst({
    where: { userId },
    orderBy: { timelineEvents: { _count: "desc" } },
    include: { _count: { select: { timelineEvents: true } } },
  });

  const provenanceHighlights: { label: string; detail: string }[] = [];
  if (longestTimeline) {
    provenanceHighlights.push({
      label: "Longest Provenance",
      detail: `${longestTimeline.title} — ${longestTimeline._count.timelineEvents} events recorded`,
    });
  }

  return {
    userId,
    user: { createdAt: user.createdAt, email: user.email },
    dna: {
      dnaScore: dna.dnaScore,
      primaryType: dna.primaryType,
      secondaryType: dna.secondaryType,
      traits: Object.fromEntries(dna.traits.map((t) => [t.name, t.score])) as Record<string, number>,
    },
    facts,
    snapshotCount,
    cover,
    collectionHighlights,
    memoryHighlights,
    conversationHighlights,
    achievements: achievementHighlights,
    goals: goalHighlights,
    portfolio,
    legacyScore,
    provenanceHighlights,
    marketNote: "Live market data is not available in the current report period. Value estimates are AI-based estimates from image analysis, not real-time market prices.",
  };
}