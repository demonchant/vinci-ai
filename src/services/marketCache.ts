import type { MarketDataProviderResult } from "@/types/market";
import type { MarketDataQuery } from "./marketProvider";

interface CacheEntry {
  data: MarketDataProviderResult;
  storedAt: number;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();
const DEFAULT_TTL = 3600 * 1000;

function buildKey(query: MarketDataQuery): string {
  return [query.category, query.title, query.brand ?? "", query.year ?? ""].join("|").toLowerCase();
}

export function getCachedMarketData(query: MarketDataQuery): MarketDataProviderResult | null {
  const key = buildKey(query);
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

export function setCachedMarketData(query: MarketDataQuery, data: MarketDataProviderResult): void {
  const key = buildKey(query);
  const ttl = (data.ttl || DEFAULT_TTL / 1000) * 1000;
  cache.set(key, {
    data,
    storedAt: Date.now(),
    expiresAt: Date.now() + ttl,
  });
}

export function invalidateMarketCache(query?: MarketDataQuery): void {
  if (!query) {
    cache.clear();
    return;
  }
  cache.delete(buildKey(query));
}

export function getMarketCacheStats(): { size: number; oldestEntry: string | null } {
  let oldest: number | null = null;
  for (const entry of cache.values()) {
    if (oldest === null || entry.storedAt < oldest) oldest = entry.storedAt;
  }
  return {
    size: cache.size,
    oldestEntry: oldest ? new Date(oldest).toISOString() : null,
  };
}
