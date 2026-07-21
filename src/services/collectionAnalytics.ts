import { prisma } from "@/lib/prisma";
import { openai, AI_MODELS } from "@/lib/openai";
import type { PortfolioStats } from "@/types/collection";

function diversificationScore(categories: Record<string, number>, total: number): number {
  if (total === 0) return 0;
  const counts = Object.values(categories);
  const entropy = -counts.reduce((sum, c) => {
    const p = c / total;
    return sum + p * Math.log2(p);
  }, 0);
  const maxEntropy = Math.log2(Math.max(counts.length, 1)) || 1;
  return Math.round((entropy / maxEntropy) * 100);
}

const VALUE_BUCKETS = [
  { label: "$0–100", max: 100 },
  { label: "$100–500", max: 500 },
  { label: "$500–2,000", max: 2000 },
  { label: "$2,000–10,000", max: 10000 },
  { label: "$10,000+", max: Infinity },
];

export async function computePortfolioStats(userId: string): Promise<PortfolioStats> {
  const items = await prisma.collectible.findMany({
    where: { userId, status: { not: "WISHLIST" } },
  });

  const total = items.length;
  const totalValue = items.reduce(
    (sum, i) => sum + Number(i.estimatedValue ?? i.purchasePrice ?? 0),
    0
  );

  const categoryCounts: Record<string, number> = {};
  const categoryValue: Record<string, number> = {};
  const conditionCounts: Record<string, number> = {};
  let authenticatedCount = 0;
  let confidenceSum = 0;
  let confidenceCount = 0;

  for (const item of items) {
    categoryCounts[item.category] = (categoryCounts[item.category] ?? 0) + 1;
    categoryValue[item.category] =
      (categoryValue[item.category] ?? 0) + Number(item.estimatedValue ?? item.purchasePrice ?? 0);
    if (item.condition) conditionCounts[item.condition] = (conditionCounts[item.condition] ?? 0) + 1;
    if (item.isAuthenticated) authenticatedCount++;
    if (item.lastAnalysisConfidence !== null) {
      confidenceSum += item.lastAnalysisConfidence;
      confidenceCount++;
    }
  }

  const valueDistribution = VALUE_BUCKETS.map((bucket, i) => {
    const min = i === 0 ? 0 : VALUE_BUCKETS[i - 1]!.max;
    const count = items.filter((it) => {
      const v = Number(it.estimatedValue ?? it.purchasePrice ?? 0);
      return v > min && v <= bucket.max;
    }).length;
    return { bucket: bucket.label, count };
  });

  const growthMap = new Map<string, number>();
  const sorted = [...items].sort(
    (a, b) =>
      new Date(a.purchasedAt ?? a.createdAt).getTime() -
      new Date(b.purchasedAt ?? b.createdAt).getTime()
  );
  let running = 0;
  for (const item of sorted) {
    const date = new Date(item.purchasedAt ?? item.createdAt);
    const period = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    running += Number(item.estimatedValue ?? item.purchasePrice ?? 0);
    growthMap.set(period, running);
  }

  const diversification = diversificationScore(categoryCounts, total);
  const authenticationRatePct = total ? Math.round((authenticatedCount / total) * 100) : 0;
  const averageConfidence = confidenceCount ? Math.round(confidenceSum / confidenceCount) : 0;
  const portfolioHealthScore = Math.round(
    (diversification + authenticationRatePct + averageConfidence) / 3
  );

  const mostCommonCondition =
    Object.entries(conditionCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  return {
    totalItems: total,
    totalValue,
    averageConditionLabel: mostCommonCondition,
    authenticationRatePct,
    averageConfidence,
    diversificationScore: diversification,
    portfolioHealthScore,
    growth: Array.from(growthMap.entries()).map(([period, value]) => ({ period, value })),
    categoryDistribution: Object.entries(categoryCounts).map(([category, count]) => ({
      category,
      count,
      value: categoryValue[category] ?? 0,
    })),
    conditionDistribution: Object.entries(conditionCounts).map(([condition, count]) => ({
      condition,
      count,
    })),
    authenticationDistribution: [
      { label: "Authenticated", count: authenticatedCount },
      { label: "Unverified", count: total - authenticatedCount },
    ],
    valueDistribution,
  };
}

/**
 * Generates 2-4 grounded insight sentences from the real computed stats —
 * the model is given only the numbers above and cannot state a percentage
 * or fact not present in them.
 */
export async function generatePortfolioInsights(stats: PortfolioStats): Promise<string[]> {
  if (stats.totalItems === 0) return [];

  const completion = await openai.chat.completions.create({
    model: AI_MODELS.chat,
    temperature: 0.4,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `Given real portfolio statistics for a collectibles collection, write 2-4 short, specific
insight sentences. Use ONLY the numbers provided — never invent a percentage, trend, or fact not in the
data. Respond as JSON: { "insights": string[] }`,
      },
      { role: "user", content: JSON.stringify(stats) },
    ],
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) return [];
  try {
    return JSON.parse(raw).insights ?? [];
  } catch {
    return [];
  }
}
