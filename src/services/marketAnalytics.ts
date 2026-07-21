import type { Collectible } from "@/types/collectible";
import type { CollectibleCategory } from "@/types/common";
import type {
  CategoryPerformance,
  MarketSentimentAnalysis,
  MarketSentiment,
  MarketTimelineEvent,
  MarketDNAImpact,
  MarketInsight,
} from "@/types/market";
import { COLLECTIBLE_CATEGORY_LABELS } from "@/types/common";
import { valuateCollectible } from "./marketValuation";

export async function computeCategoryPerformance(
  collectibles: Collectible[]
): Promise<CategoryPerformance[]> {
  const byCategory = new Map<CollectibleCategory, Collectible[]>();
  for (const c of collectibles) {
    const list = byCategory.get(c.category) || [];
    list.push(c);
    byCategory.set(c.category, list);
  }

  const results: CategoryPerformance[] = [];

  for (const [category, items] of byCategory) {
    const valuations = await Promise.all(items.map(valuateCollectible));

    let totalChange = 0;
    let totalVolume = 0;
    let confidenceSum = 0;
    let validCount = 0;
    const changes: number[] = [];

    for (const v of valuations) {
      if (v.gainLossPct !== null) {
        totalChange += v.gainLossPct;
        changes.push(v.gainLossPct);
        validCount++;
      }
      confidenceSum += v.confidence;
      totalVolume += v.priceHistory.reduce((s, p) => s + (p.volume ?? 0), 0);
    }

    const avgChange = validCount > 0 ? totalChange / validCount : 0;
    const volatility = computeVolatility(changes);
    const growth = computeGrowth(valuations.flatMap((v) => v.priceHistory));

    results.push({
      category,
      label: COLLECTIBLE_CATEGORY_LABELS[category],
      changePct: Math.round(avgChange * 100) / 100,
      volume: totalVolume,
      confidence: valuations.length > 0 ? confidenceSum / valuations.length : 0,
      volatility,
      growth,
      itemCount: items.length,
    });
  }

  return results.sort((a, b) => b.changePct - a.changePct);
}

function computeVolatility(changes: number[]): number {
  if (changes.length < 2) return 0;
  const mean = changes.reduce((s, v) => s + v, 0) / changes.length;
  const variance = changes.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / changes.length;
  return Math.round(Math.sqrt(variance) * 100) / 100;
}

function computeGrowth(history: { date: string; value: number }[]): number {
  if (history.length < 2) return 0;
  const sorted = [...history].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const first = sorted[0]!.value;
  const last = sorted[sorted.length - 1]!.value;
  if (first === 0) return 0;
  return Math.round(((last - first) / first) * 100 * 100) / 100;
}

export function computeMarketSentiment(
  insights: MarketInsight[],
  categoryPerformance: CategoryPerformance[]
): MarketSentimentAnalysis | null {
  if (insights.length === 0 && categoryPerformance.length === 0) return null;

  let bullish = 0;
  let bearish = 0;
  let neutral = 0;
  const sources = new Set<string>();

  for (const i of insights) {
    if (i.sentiment === "bullish") bullish++;
    else if (i.sentiment === "bearish") bearish++;
    else neutral++;
    if (i.source) sources.add(i.source);
  }

  for (const cp of categoryPerformance) {
    if (cp.changePct > 3) bullish++;
    else if (cp.changePct < -3) bearish++;
    else neutral++;
  }

  const total = bullish + bearish + neutral;
  let overall: MarketSentiment = "neutral";
  if (bullish > bearish && bullish > neutral) overall = "bullish";
  else if (bearish > bullish && bearish > neutral) overall = "bearish";

  const byCategory: Record<string, MarketSentiment> = {} as Record<CollectibleCategory, MarketSentiment>;
  for (const cp of categoryPerformance) {
    if (cp.changePct > 3) byCategory[cp.category] = "bullish";
    else if (cp.changePct < -3) byCategory[cp.category] = "bearish";
    else byCategory[cp.category] = "neutral";
  }

  const maxVotes = Math.max(bullish, bearish, neutral);
  const confidence = total > 0 ? maxVotes / total : 0;

  return {
    overall,
    confidence,
    sources: Array.from(sources),
    byCategory: byCategory as Record<CollectibleCategory, MarketSentiment>,
  };
}

export function buildMarketTimeline(
  insights: MarketInsight[],
  collectibles: Collectible[]
): MarketTimelineEvent[] {
  const events: MarketTimelineEvent[] = [];

  for (const insight of insights) {
    events.push({
      id: `timeline-insight-${insight.id}`,
      type: insight.changePct && insight.changePct > 5 ? "price_spike" : insight.changePct && insight.changePct < -5 ? "price_correction" : "category_trend",
      title: insight.headline,
      description: insight.summary,
      timestamp: insight.publishedAt,
      category: insight.category,
      collectibleId: null,
      impact: insight.sentiment === "bullish" ? "positive" : insight.sentiment === "bearish" ? "negative" : "neutral",
    });
  }

  const recentAdds = collectibles
    .filter((c) => {
      const created = new Date(c.createdAt).getTime();
      return Date.now() - created < 30 * 24 * 60 * 60 * 1000;
    })
    .slice(0, 5);

  for (const c of recentAdds) {
    events.push({
      id: `timeline-add-${c.id}`,
      type: "collection_addition",
      title: `Added: ${c.title}`,
      description: `New ${COLLECTIBLE_CATEGORY_LABELS[c.category]} added to collection.`,
      timestamp: c.createdAt,
      category: c.category,
      collectibleId: c.id,
      impact: "positive",
    });
  }

  return events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export function computeMarketDNAImpact(
  categoryPerformance: CategoryPerformance[],
  dnaTraits?: Record<string, number>
): MarketDNAImpact[] {
  const impacts: MarketDNAImpact[] = [];

  const avgPerformance = categoryPerformance.length > 0
    ? categoryPerformance.reduce((s, cp) => s + cp.changePct, 0) / categoryPerformance.length
    : 0;

  impacts.push({
    trait: "Market Awareness",
    currentScore: dnaTraits?.["Market Awareness"] ?? 50,
    marketInfluence: Math.min(avgPerformance * 2, 15),
    direction: avgPerformance > 0 ? "positive" : avgPerformance < 0 ? "negative" : "neutral",
    explanation: avgPerformance > 0
      ? "Your tracked categories are performing well, reflecting good market awareness."
      : "Market headwinds in your categories — staying informed helps you adapt.",
  });

  const diverseCategories = categoryPerformance.length;
  impacts.push({
    trait: "Diversification",
    currentScore: dnaTraits?.["Diversification"] ?? 50,
    marketInfluence: Math.min(diverseCategories * 3, 20),
    direction: diverseCategories >= 3 ? "positive" : "neutral",
    explanation: diverseCategories >= 3
      ? "Spread across multiple categories reduces your overall market risk."
      : "Consider expanding into additional categories for better diversification.",
  });

  const highConfidence = categoryPerformance.filter((cp) => cp.confidence > 0.7).length;
  impacts.push({
    trait: "Research",
    currentScore: dnaTraits?.["Research"] ?? 50,
    marketInfluence: highConfidence * 5,
    direction: highConfidence > 0 ? "positive" : "neutral",
    explanation: highConfidence > 0
      ? "High-confidence market data suggests thorough research habits."
      : "More authenticated market data would improve research scoring.",
  });

  return impacts;
}
