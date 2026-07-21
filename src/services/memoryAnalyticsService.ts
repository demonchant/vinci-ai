import { categorizeMemoryKey, MEMORY_CATEGORIES, type MemoryCategory } from "./memoryService";
import type { CollectorMemoryFact } from "@/types/memory";

export interface MemoryOverviewStats {
  total: number;
  verified: number;
  aiInferred: number;
  updatedToday: number;
  averageConfidence: number;
}

export function computeMemoryOverview(facts: CollectorMemoryFact[]): MemoryOverviewStats {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const verified = facts.filter((f) => f.isVerified).length;
  const updatedToday = facts.filter((f) => new Date(f.updatedAt) >= today).length;
  const avgConfidence = facts.length
    ? Math.round(facts.reduce((sum, f) => sum + f.confidence, 0) / facts.length)
    : 0;

  return {
    total: facts.length,
    verified,
    aiInferred: facts.length - verified,
    updatedToday,
    averageConfidence: avgConfidence,
  };
}

export interface CategoryGroup {
  category: MemoryCategory;
  facts: CollectorMemoryFact[];
}

export function groupByCategory(facts: CollectorMemoryFact[]): CategoryGroup[] {
  const groups = new Map<MemoryCategory, CollectorMemoryFact[]>();
  for (const cat of MEMORY_CATEGORIES) groups.set(cat, []);
  for (const fact of facts) {
    const cat = categorizeMemoryKey(fact.key);
    groups.get(cat)!.push(fact);
  }
  return Array.from(groups.entries())
    .map(([category, facts]) => ({ category, facts }))
    .filter((g) => g.facts.length > 0);
}

export interface MemoryHealth {
  completeness: number;
  consistency: number;
  averageConfidence: number;
  coverage: number;
  freshness: number;
  duplicates: { label: string; keys: string[] }[];
  recommendations: string[];
}

/**
 * Every score here is computed from real facts — there is no simulated
 * health score. A collector with few memories will correctly see low
 * completeness/coverage; that's accurate, not a bug.
 */
export function computeMemoryHealth(facts: CollectorMemoryFact[]): MemoryHealth {
  const active = facts.filter((f) => !f.isArchived);
  const categoriesCovered = new Set(active.map((f) => categorizeMemoryKey(f.key)));
  const coverage = Math.round((categoriesCovered.size / MEMORY_CATEGORIES.length) * 100);
  const completeness = Math.min(100, Math.round((active.length / 12) * 100)); // 12 facts ~ "complete" baseline

  const avgConfidence = active.length
    ? Math.round(active.reduce((sum, f) => sum + f.confidence, 0) / active.length)
    : 0;

  const now = Date.now();
  const avgAgeDays = active.length
    ? active.reduce((sum, f) => sum + (now - new Date(f.updatedAt).getTime()) / 86_400_000, 0) /
      active.length
    : 0;
  const freshness = Math.max(0, Math.round(100 - avgAgeDays * 1.5));

  // Duplicate detection: same label appearing under different keys.
  const byLabel = new Map<string, string[]>();
  for (const f of active) {
    byLabel.set(f.label, [...(byLabel.get(f.label) ?? []), f.key]);
  }
  const duplicates = Array.from(byLabel.entries())
    .filter(([, keys]) => keys.length > 1)
    .map(([label, keys]) => ({ label, keys }));

  const consistency = duplicates.length === 0 ? 100 : Math.max(50, 100 - duplicates.length * 15);

  const recommendations: string[] = [];
  if (coverage < 50) {
    recommendations.push(
      "Chat with Vinci AI about your budget, goals, and preferred brands to build out more categories."
    );
  }
  if (avgConfidence < 60) {
    recommendations.push("Verify a few key memories to lock in higher confidence.");
  }
  if (duplicates.length > 0) {
    recommendations.push(
      `Found ${duplicates.length} possible duplicate memor${duplicates.length === 1 ? "y" : "ies"} — consider merging.`
    );
  }
  if (freshness < 50) {
    recommendations.push("Many memories haven't been reinforced recently — they may be out of date.");
  }

  return {
    completeness,
    consistency,
    averageConfidence: avgConfidence,
    coverage,
    freshness,
    duplicates,
    recommendations,
  };
}
