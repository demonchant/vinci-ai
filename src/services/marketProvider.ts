import type {
  CollectibleCategory,
} from "@/types/common";
import type {
  MarketDataProviderType,
  MarketDataProviderResult,
  MarketDataPoint,
  ComparableSale,
} from "@/types/market";

export interface MarketDataQuery {
  collectibleId?: string;
  title: string;
  category: CollectibleCategory;
  brand?: string | null;
  year?: number | null;
  condition?: string | null;
  grade?: string | null;
}

export interface MarketDataProvider {
  readonly type: MarketDataProviderType;
  readonly name: string;

  isAvailable(): Promise<boolean>;

  fetchPriceHistory(query: MarketDataQuery): Promise<MarketDataPoint[]>;

  fetchComparables(query: MarketDataQuery, limit?: number): Promise<ComparableSale[]>;

  fetchCurrentEstimate(query: MarketDataQuery): Promise<{
    estimate: number | null;
    confidence: number;
  }>;
}

export class DemoMarketProvider implements MarketDataProvider {
  readonly type: MarketDataProviderType = "demo";
  readonly name = "Demonstration Data";

  async isAvailable(): Promise<boolean> {
    return true;
  }

  async fetchPriceHistory(query: MarketDataQuery): Promise<MarketDataPoint[]> {
    const now = Date.now();
    const points: MarketDataPoint[] = [];
    const baseValue = this.getBaseValue(query.category);

    for (let i = 11; i >= 0; i--) {
      const date = new Date(now - i * 30 * 24 * 60 * 60 * 1000);
      const fluctuation = 1 + (Math.sin(i * 0.8) * 0.08) + (i * 0.01);
      points.push({
        date: date.toISOString(),
        value: Math.round(baseValue * fluctuation * 100) / 100,
        volume: Math.floor(Math.random() * 50) + 10,
        source: this.name,
        confidence: 0.6,
      });
    }
    return points;
  }

  async fetchComparables(query: MarketDataQuery, limit = 5): Promise<ComparableSale[]> {
    const baseValue = this.getBaseValue(query.category);
    const comparables: ComparableSale[] = [];

    const titles = [
      `Similar ${query.title} (Near Mint)`,
      `${query.title} - Variant`,
      `Comparable ${query.category} item`,
      `${query.brand ?? "Unknown"} similar piece`,
      `${query.title} (Lower Grade)`,
    ];

    for (let i = 0; i < Math.min(limit, titles.length); i++) {
      const daysAgo = Math.floor(Math.random() * 90) + 7;
      comparables.push({
        id: `demo-comp-${query.title.slice(0, 4)}-${i}`,
        title: titles[i]!,
        date: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString(),
        price: Math.round(baseValue * (0.7 + Math.random() * 0.6) * 100) / 100,
        condition: ["Near Mint", "Excellent", "Very Good", "Good"][i % 4] ?? "Good",
        source: this.name,
        confidence: 0.55 + Math.random() * 0.15,
        similarityScore: 0.95 - i * 0.1,
        currency: "USD",
      });
    }
    return comparables;
  }

  async fetchCurrentEstimate(query: MarketDataQuery): Promise<{ estimate: number | null; confidence: number }> {
    const baseValue = this.getBaseValue(query.category);
    return {
      estimate: Math.round(baseValue * (0.9 + Math.random() * 0.2) * 100) / 100,
      confidence: 0.6,
    };
  }

  private getBaseValue(category: CollectibleCategory): number {
    const bases: Record<CollectibleCategory, number> = {
      TRADING_CARD: 150,
      SPORTS_CARD: 200,
      COMIC: 350,
      WATCH: 5000,
      SNEAKER: 300,
      COIN: 500,
      NFT: 100,
      FIGURE: 75,
      MEMORABILIA: 400,
      OTHER: 100,
    };
    return bases[category];
  }
}

export class MarketProviderRegistry {
  private providers: MarketDataProvider[] = [];

  register(provider: MarketDataProvider): void {
    this.providers.push(provider);
  }

  async getAvailable(): Promise<MarketDataProvider[]> {
    const results = await Promise.all(
      this.providers.map(async (p) => ({ provider: p, available: await p.isAvailable() }))
    );
    return results.filter((r) => r.available).map((r) => r.provider);
  }

  async fetchBest(query: MarketDataQuery): Promise<MarketDataProviderResult | null> {
    const available = await this.getAvailable();
    if (available.length === 0) return null;

    const provider = available[0]!;
    const [priceHistory, comparables, estimate] = await Promise.all([
      provider.fetchPriceHistory(query),
      provider.fetchComparables(query),
      provider.fetchCurrentEstimate(query),
    ]);

    return {
      provider: provider.type,
      lastUpdated: new Date().toISOString(),
      priceHistory,
      comparables,
      currentEstimate: estimate.estimate,
      confidence: estimate.confidence,
      ttl: 3600,
    };
  }
}

let registryInstance: MarketProviderRegistry | null = null;

export function getMarketProviderRegistry(): MarketProviderRegistry {
  if (!registryInstance) {
    registryInstance = new MarketProviderRegistry();
    registryInstance.register(new DemoMarketProvider());
  }
  return registryInstance;
}
