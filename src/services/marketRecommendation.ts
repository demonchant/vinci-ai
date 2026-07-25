import type { Collectible } from "@/types/collectible";
import type { CollectibleCategory } from "@/types/common";
import type {
  MarketRecommendation,
  RecommendationEvidence,
  MarketOpportunity,
  CategoryPerformance,
  WishlistIntelligence,
  // ✅ FIX: Removed unused 'RecommendationType', 'SignalStrength', 'OpportunityType', 'CollectibleValuation'
} from "@/types/market";
import { COLLECTIBLE_CATEGORY_LABELS } from "@/types/common";
// ✅ FIX: Removed unused 'valuateCollectible' import

export async function generateRecommendations(
  collectibles: Collectible[],
  categoryPerformance: CategoryPerformance[]
): Promise<MarketRecommendation[]> {
  const recommendations: MarketRecommendation[] = [];
  const owned = collectibles.filter((c) => c.status === "OWNED" || c.status === "PURCHASED");

  if (owned.length === 0) return recommendations;

  const concentrationRec = analyzeConcentration(owned, categoryPerformance);
  if (concentrationRec) recommendations.push(concentrationRec);

  const performanceRecs = await analyzePerformance(owned, categoryPerformance);
  recommendations.push(...performanceRecs);

  const authRec = analyzeAuthentication(owned);
  if (authRec) recommendations.push(authRec);

  const researchRec = analyzeResearchGaps(owned, categoryPerformance);
  if (researchRec) recommendations.push(researchRec);

  return recommendations.sort((a, b) => b.confidence - a.confidence).slice(0, 10);
}

function analyzeConcentration(
  owned: Collectible[],
  categoryPerformance: CategoryPerformance[]
): MarketRecommendation | null {
  const categoryCounts = new Map<CollectibleCategory, number>();
  for (const c of owned) {
    categoryCounts.set(c.category, (categoryCounts.get(c.category) || 0) + 1);
  }

  const topCategory = [...categoryCounts.entries()].sort((a, b) => b[1] - a[1])[0];
  if (!topCategory) return null;

  const concentration = topCategory[1] / owned.length;
  if (concentration < 0.6) return null;

  const categoryLabel = COLLECTIBLE_CATEGORY_LABELS[topCategory[0]];
  const categoryPerf = categoryPerformance.find((cp) => cp.category === topCategory[0]);

  const evidence: RecommendationEvidence[] = [
    {
      type: "portfolio_analysis",
      description: `${Math.round(concentration * 100)}% of your collection is in ${categoryLabel}.`,
      confidence: 0.95,
      source: "Portfolio Analysis",
      timestamp: new Date().toISOString(),
    },
  ];

  if (categoryPerf) {
    evidence.push({
      type: "market_data",
      description: `${categoryLabel} has moved ${categoryPerf.changePct > 0 ? "+" : ""}${categoryPerf.changePct}% recently.`,
      confidence: categoryPerf.confidence,
      source: "Market Data",
      timestamp: new Date().toISOString(),
    });
  }

  return {
    id: `rec-concentration-${Date.now()}`,
    type: "diversify",
    signal: concentration > 0.8 ? "strong" : "moderate",
    title: `Portfolio heavily concentrated in ${categoryLabel}`,
    explanation: `Your collection is ${Math.round(concentration * 100)}% concentrated in ${categoryLabel}. Consider diversifying to reduce category-specific risk.`,
    evidence,
    confidence: 0.85,
    affectedCollections: [],
    affectedDNATraits: ["Diversification", "Risk"],
    affectedGoals: [],
    affectedMemories: [],
    createdAt: new Date().toISOString(),
    expiresAt: null,
  };
}

async function analyzePerformance(
  owned: Collectible[],
  categoryPerformance: CategoryPerformance[]
): Promise<MarketRecommendation[]> {
  const recs: MarketRecommendation[] = [];

  const hotCategories = categoryPerformance.filter((cp) => cp.changePct > 8 && cp.confidence > 0.5);
  for (const hot of hotCategories.slice(0, 2)) {
    const userItems = owned.filter((c) => c.category === hot.category);
    if (userItems.length > 0) {
      recs.push({
        id: `rec-perf-${hot.category}-${Date.now()}`,
        type: "hold",
        signal: hot.changePct > 12 ? "strong" : "moderate",
        title: `${hot.label} appreciating steadily`,
        explanation: `${hot.label} has appreciated ${hot.changePct}% recently. Your ${userItems.length} item(s) in this category are benefiting from this trend.`,
        evidence: [
          {
            type: "market_data",
            description: `${hot.label} up ${hot.changePct}% with ${hot.volume} market transactions observed.`,
            confidence: hot.confidence,
            source: "Market Analytics",
            timestamp: new Date().toISOString(),
          },
          {
            type: "portfolio_analysis",
            description: `You own ${userItems.length} ${hot.label} item(s).`,
            confidence: 0.95,
            source: "Portfolio",
            timestamp: new Date().toISOString(),
          },
        ],
        confidence: hot.confidence,
        affectedCollections: [],
        affectedDNATraits: ["Market Awareness"],
        affectedGoals: [],
        affectedMemories: [],
        createdAt: new Date().toISOString(),
        expiresAt: null,
      });
    }
  }

  const coldCategories = categoryPerformance.filter((cp) => cp.changePct < -5 && cp.confidence > 0.5);
  for (const cold of coldCategories.slice(0, 1)) {
    const userItems = owned.filter((c) => c.category === cold.category);
    if (userItems.length > 2) {
      recs.push({
        id: `rec-cold-${cold.category}-${Date.now()}`,
        type: "research_more",
        signal: "moderate",
        title: `${cold.label} showing signs of cooling`,
        explanation: `${cold.label} has declined ${Math.abs(cold.changePct)}% recently. With ${userItems.length} items in this category, it may be worth researching whether this is temporary or a longer-term trend.`,
        evidence: [
          {
            type: "market_data",
            description: `${cold.label} down ${Math.abs(cold.changePct)}%.`,
            confidence: cold.confidence,
            source: "Market Analytics",
            timestamp: new Date().toISOString(),
          },
        ],
        confidence: cold.confidence * 0.8,
        affectedCollections: [],
        affectedDNATraits: ["Market Awareness", "Risk"],
        affectedGoals: [],
        affectedMemories: [],
        createdAt: new Date().toISOString(),
        expiresAt: null,
      });
    }
  }

  return recs;
}

function analyzeAuthentication(owned: Collectible[]): MarketRecommendation | null {
  const unauthenticated = owned.filter((c) => !c.isAuthenticated && (c.estimatedValue ?? 0) > 200);
  if (unauthenticated.length === 0) return null;

  const totalValue = unauthenticated.reduce((s, c) => s + (c.estimatedValue ?? 0), 0);

  return {
    id: `rec-auth-${Date.now()}`,
    type: "authenticate",
    signal: unauthenticated.length > 3 ? "strong" : "moderate",
    title: `${unauthenticated.length} high-value items lack authentication`,
    explanation: `You have ${unauthenticated.length} items valued over $200 that are not yet authenticated. Authentication can increase market confidence and resale value.`,
    evidence: [
      {
        type: "portfolio_analysis",
        description: `$${totalValue.toLocaleString()} in unverified collectibles.`,
        confidence: 0.9,
        source: "Portfolio Analysis",
        timestamp: new Date().toISOString(),
      },
    ],
    confidence: 0.8,
    affectedCollections: [],
    affectedDNATraits: ["Authentication"],
    affectedGoals: [],
    affectedMemories: [],
    createdAt: new Date().toISOString(),
    expiresAt: null,
  };
}

function analyzeResearchGaps(
  owned: Collectible[],
  categoryPerformance: CategoryPerformance[]
): MarketRecommendation | null {
  const ownedCategories = new Set(owned.map((c) => c.category));
  const trendingNotOwned = categoryPerformance.filter(
    (cp) => cp.changePct > 5 && !ownedCategories.has(cp.category) && cp.confidence > 0.5
  );

  if (trendingNotOwned.length === 0) return null;

  const top = trendingNotOwned[0]!;
  return {
    id: `rec-research-${top.category}-${Date.now()}`,
    type: "research_more",
    signal: "weak",
    title: `Trending category you don't collect: ${top.label}`,
    explanation: `${top.label} is up ${top.changePct}% but you have no items in this category. This could be worth researching if it aligns with your interests.`,
    evidence: [
      {
        type: "market_data",
        description: `${top.label} trending +${top.changePct}%.`,
        confidence: top.confidence,
        source: "Market Analytics",
        timestamp: new Date().toISOString(),
      },
    ],
    confidence: top.confidence * 0.6,
    affectedCollections: [],
    affectedDNATraits: ["Diversification", "Market Awareness"],
    affectedGoals: [],
    affectedMemories: [],
    createdAt: new Date().toISOString(),
    expiresAt: null,
  };
}

export async function detectOpportunities(
  collectibles: Collectible[],
  categoryPerformance: CategoryPerformance[]
): Promise<MarketOpportunity[]> {
  const opportunities: MarketOpportunity[] = [];
  const owned = collectibles.filter((c) => c.status === "OWNED" || c.status === "PURCHASED");

  const unauthHigh = owned.filter((c) => !c.isAuthenticated && (c.estimatedValue ?? 0) > 500);
  for (const item of unauthHigh.slice(0, 3)) {
    opportunities.push({
      id: `opp-auth-${item.id}`,
      type: "authentication_candidate",
      title: `Authenticate: ${item.title}`,
      explanation: `This item is valued at $${item.estimatedValue?.toLocaleString()} but lacks authentication. Grading could increase its market value and confidence.`,
      confidence: 0.75,
      category: item.category,
      collectibleId: item.id,
      potentialValue: (item.estimatedValue ?? 0) * 1.2,
      evidence: [
        {
          type: "portfolio_analysis",
          description: `Current estimated value: $${item.estimatedValue?.toLocaleString()}.`,
          confidence: 0.8,
          source: "Portfolio",
          timestamp: new Date().toISOString(),
        },
      ],
      dnaImpact: [{ trait: "Authentication", impact: 5 }],
      createdAt: new Date().toISOString(),
    });
  }

  const ownedCategories = new Set(owned.map((c) => c.category));
  const gapCategories = categoryPerformance.filter(
    (cp) => !ownedCategories.has(cp.category) && cp.changePct > 3
  );
  for (const gap of gapCategories.slice(0, 2)) {
    opportunities.push({
      id: `opp-gap-${gap.category}`,
      type: "category_expansion",
      title: `Explore ${gap.label}`,
      explanation: `${gap.label} is trending positively (+${gap.changePct}%) and could complement your existing collection.`,
      confidence: gap.confidence * 0.7,
      category: gap.category,
      collectibleId: null,
      potentialValue: null,
      evidence: [
        {
          type: "market_data",
          description: `${gap.label} up ${gap.changePct}% with growing volume.`,
          confidence: gap.confidence,
          source: "Market Analytics",
          timestamp: new Date().toISOString(),
        },
      ],
      dnaImpact: [
        { trait: "Diversification", impact: 8 },
        { trait: "Market Awareness", impact: 3 },
      ],
      createdAt: new Date().toISOString(),
    });
  }

  return opportunities.sort((a, b) => b.confidence - a.confidence);
}

export function computeWishlistIntelligence(
  collectible: Collectible,
  categoryPerformance: CategoryPerformance[]
): WishlistIntelligence {
  const catPerf = categoryPerformance.find((cp) => cp.category === collectible.category);

  let priceTrend: "rising" | "stable" | "falling" = "stable";
  if (catPerf) {
    if (catPerf.changePct > 3) priceTrend = "rising";
    else if (catPerf.changePct < -3) priceTrend = "falling";
  }

  const marketRisk = catPerf
    ? catPerf.volatility > 15 ? "high" : catPerf.volatility > 8 ? "moderate" : "low"
    : "moderate";

  const priorityScore = computeWishlistPriority(collectible, catPerf);

  let recommendedTiming = "No specific timing recommendation available.";
  if (priceTrend === "rising") {
    recommendedTiming = "Prices are rising — acting sooner may be advantageous if budget allows.";
  } else if (priceTrend === "falling") {
    recommendedTiming = "Prices are declining — waiting may present a better entry point.";
  }

  return {
    collectibleId: collectible.id,
    title: collectible.title,
    priorityScore,
    expectedAvailability: "uncommon",
    priceTrend,
    marketRisk,
    recommendedTiming,
    researchSuggestions: generateResearchSuggestions(collectible, catPerf),
    confidence: catPerf?.confidence ?? 0.4,
  };
}

function computeWishlistPriority(
  collectible: Collectible,
  catPerf: CategoryPerformance | undefined
): number {
  let score = 50;
  if (catPerf) {
    if (catPerf.changePct > 5) score += 15;
    if (catPerf.confidence > 0.7) score += 10;
  }
  if (collectible.rarityScore && collectible.rarityScore > 7) score += 10;
  return Math.min(score, 100);
}

function generateResearchSuggestions(
  collectible: Collectible,
  catPerf: CategoryPerformance | undefined
): string[] {
  const suggestions: string[] = [];
  suggestions.push(`Check recent auction results for "${collectible.title}" or similar items.`);
  if (collectible.brand) {
    suggestions.push(`Research ${collectible.brand} market trends and upcoming releases.`);
  }
  if (catPerf && catPerf.volatility > 10) {
    suggestions.push(`This category shows high volatility — monitor for price dips.`);
  }
  suggestions.push("Compare condition grades and their impact on market value.");
  return suggestions.slice(0, 4);
}