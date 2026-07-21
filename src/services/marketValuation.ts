import type { Collectible } from "@/types/collectible";
import type {
  CollectibleValuation,
  PortfolioValuation,
  MarketDataPoint,
} from "@/types/market";
import { getMarketProviderRegistry, type MarketDataQuery } from "./marketProvider";
import { getCachedMarketData, setCachedMarketData } from "./marketCache";

function buildQuery(collectible: Collectible): MarketDataQuery {
  return {
    collectibleId: collectible.id,
    title: collectible.title,
    category: collectible.category,
    brand: collectible.brand,
    year: collectible.year,
    condition: collectible.condition,
    grade: collectible.grade,
  };
}

export async function valuateCollectible(collectible: Collectible): Promise<CollectibleValuation> {
  const query = buildQuery(collectible);

  let cached = getCachedMarketData(query);
  if (!cached) {
    const registry = getMarketProviderRegistry();
    const result = await registry.fetchBest(query);
    if (result) {
      setCachedMarketData(query, result);
      cached = result;
    }
  }

  const currentEstimatedValue = cached?.currentEstimate ?? collectible.estimatedValue ?? null;
  const purchasePrice = collectible.purchasePrice ?? null;

  let gainLoss: number | null = null;
  let gainLossPct: number | null = null;
  if (currentEstimatedValue !== null && purchasePrice !== null && purchasePrice > 0) {
    gainLoss = currentEstimatedValue - purchasePrice;
    gainLossPct = (gainLoss / purchasePrice) * 100;
  }

  return {
    collectibleId: collectible.id,
    title: collectible.title,
    category: collectible.category,
    purchasePrice,
    currentEstimatedValue,
    gainLoss,
    gainLossPct,
    confidence: cached?.confidence ?? 0,
    lastUpdated: cached?.lastUpdated ?? new Date().toISOString(),
    marketSource: cached?.provider ?? null,
    priceHistory: cached?.priceHistory ?? [],
    comparables: cached?.comparables ?? [],
  };
}

export async function valuatePortfolio(collectibles: Collectible[]): Promise<PortfolioValuation> {
  const owned = collectibles.filter((c) => c.status === "OWNED" || c.status === "PURCHASED");

  if (owned.length === 0) {
    return emptyValuation();
  }

  const valuations = await Promise.all(owned.map(valuateCollectible));

  let totalPurchase = 0;
  let totalEstimated = 0;
  let confidenceSum = 0;
  let withMarketData = 0;
  const categories = new Set<string>();

  for (const v of valuations) {
    if (v.purchasePrice !== null) totalPurchase += v.purchasePrice;
    if (v.currentEstimatedValue !== null) {
      totalEstimated += v.currentEstimatedValue;
      withMarketData++;
    }
    confidenceSum += v.confidence;
    categories.add(v.category);
  }

  const totalGainLoss = totalEstimated - totalPurchase;
  const totalGainLossPct = totalPurchase > 0 ? (totalGainLoss / totalPurchase) * 100 : 0;

  const weeklyChange = computePeriodChange(valuations, 7);
  const monthlyChange = computePeriodChange(valuations, 30);

  return {
    totalPurchasePrice: totalPurchase,
    totalEstimatedValue: totalEstimated,
    totalGainLoss,
    totalGainLossPct,
    todayChange: computePeriodChange(valuations, 1),
    weeklyChange,
    monthlyChange,
    lifetimeGainLoss: totalGainLoss,
    averageConfidence: valuations.length > 0 ? confidenceSum / valuations.length : 0,
    marketCoverage: owned.length > 0 ? withMarketData / owned.length : 0,
    trackedCategories: categories.size,
    activeAlerts: 0,
    currency: "USD",
    lastUpdated: new Date().toISOString(),
  };
}

function computePeriodChange(valuations: CollectibleValuation[], days: number): number {
  let change = 0;
  for (const v of valuations) {
    if (v.priceHistory.length < 2) continue;
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    const recent = v.priceHistory.filter((p) => new Date(p.date).getTime() >= cutoff);
    if (recent.length >= 2) {
      change += recent[recent.length - 1]!.value - recent[0]!.value;
    }
  }
  return Math.round(change * 100) / 100;
}

function emptyValuation(): PortfolioValuation {
  return {
    totalPurchasePrice: 0,
    totalEstimatedValue: 0,
    totalGainLoss: 0,
    totalGainLossPct: 0,
    todayChange: 0,
    weeklyChange: 0,
    monthlyChange: 0,
    lifetimeGainLoss: 0,
    averageConfidence: 0,
    marketCoverage: 0,
    trackedCategories: 0,
    activeAlerts: 0,
    currency: "USD",
    lastUpdated: new Date().toISOString(),
  };
}

export function computeMovingAverage(history: MarketDataPoint[], window: number): MarketDataPoint[] {
  if (history.length < window) return history;
  const result: MarketDataPoint[] = [];
  for (let i = window - 1; i < history.length; i++) {
    const slice = history.slice(i - window + 1, i + 1);
    const avg = slice.reduce((sum, p) => sum + p.value, 0) / window;
    result.push({ ...history[i]!, value: Math.round(avg * 100) / 100 });
  }
  return result;
}

export function computePriceRange(history: MarketDataPoint[]): { high: number; low: number } {
  if (history.length === 0) return { high: 0, low: 0 };
  let high = -Infinity;
  let low = Infinity;
  for (const p of history) {
    if (p.value > high) high = p.value;
    if (p.value < low) low = p.value;
  }
  return { high, low };
}
