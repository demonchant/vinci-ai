import type { CollectorMemoryFact } from "@/types/memory";

function fact(
  key: string,
  label: string,
  value: string | number | boolean | string[],
  daysAgo: number,
  pinned = false,
  verified = false
): CollectorMemoryFact {
  // ✅ FIX APPLIED HERE: Removed .toISOString() so it returns a Date object, not a string
  const date = new Date(Date.now() - daysAgo * 86_400_000);

  return {
    id: `demo-memory-${key}`,
    key: key as any,
    label,
    value,
    source: "CHAT",
    confidence: 85,
    isPinned: pinned,
    isVerified: verified,
    isLocked: false,
    isArchived: false,
    learnedAt: date,
    updatedAt: date,
  };
}

export const demoMemory: CollectorMemoryFact[] = [
  fact("favorite_category", "Favorite Category", "Vintage Pokémon", 120, true, true),
  fact("budget", "Budget", "$300 / item", 95),
  fact("preferred_grading", "Preferred Grading", "PSA 10", 88, true, true),
  fact("favorite_marketplace", "Favorite Marketplace", "Renaiss", 70),
  fact("risk_tolerance", "Risk Profile", "Balanced", 60),
  fact("favorite_brands", "Favorite Brand", "Rolex", 45),
  fact("collection_goals", "Long-term Goal", "Complete Vintage Pokémon Collection", 30, true),
  fact("interests", "Recent Interests", ["Luxury Watches", "Vintage Comics"], 6),
];