import type { Collectible } from "@/types/collectible";
import type { CollectibleCategory } from "@/types/common";
import type {
  PortfolioRisk,
  RiskFactor,
  RiskLevel,
  DiversificationAnalysis,
  DiversificationBreakdown,
} from "@/types/market";
import { COLLECTIBLE_CATEGORY_LABELS } from "@/types/common";

export function computePortfolioRisk(collectibles: Collectible[]): PortfolioRisk {
  const owned = collectibles.filter((c) => c.status === "OWNED" || c.status === "PURCHASED");

  if (owned.length === 0) {
    return emptyRisk();
  }

  const categoryConcentration = computeCategoryConcentration(owned);
  const authenticationRisk = computeAuthenticationRisk(owned);
  const marketCoverage = computeMarketCoverageRisk(owned);
  const diversification = computeDiversificationRisk(owned);
  const liquidity = computeLiquidityRisk(owned);
  const knowledgeCoverage = computeKnowledgeCoverageRisk(owned);
  const confidence = computeConfidenceRisk(owned);

  const factors = {
    categoryConcentration,
    authenticationRisk,
    marketCoverage,
    diversification,
    liquidity,
    knowledgeCoverage,
    confidence,
  };

  const scores = Object.values(factors).map((f) => f.score);
  const overallScore = Math.round(scores.reduce((s, v) => s + v, 0) / scores.length);
  const overallLevel = scoreToLevel(overallScore);

  const suggestions = generateRiskSuggestions(factors, owned);

  return { overallLevel, overallScore, factors, suggestions };
}

function computeCategoryConcentration(owned: Collectible[]): RiskFactor {
  const counts = new Map<CollectibleCategory, number>();
  for (const c of owned) counts.set(c.category, (counts.get(c.category) || 0) + 1);

  const max = Math.max(...counts.values());
  const concentration = max / owned.length;
  const score = Math.round(concentration * 100);

  return {
    name: "Category Concentration",
    score,
    level: scoreToLevel(score),
    explanation: concentration > 0.7
      ? `${Math.round(concentration * 100)}% of items are in a single category — high concentration risk.`
      : concentration > 0.5
        ? "Moderate concentration in one category."
        : "Well-distributed across categories.",
  };
}

function computeAuthenticationRisk(owned: Collectible[]): RiskFactor {
  const highValue = owned.filter((c) => (c.estimatedValue ?? 0) > 200);
  if (highValue.length === 0) return { name: "Authentication Risk", score: 0, level: "low", explanation: "No high-value items require authentication." };

  const unauthenticated = highValue.filter((c) => !c.isAuthenticated);
  const ratio = unauthenticated.length / highValue.length;
  const score = Math.round(ratio * 100);

  return {
    name: "Authentication Risk",
    score,
    level: scoreToLevel(score),
    explanation: ratio > 0.5
      ? `${unauthenticated.length} of ${highValue.length} high-value items lack authentication.`
      : "Most high-value items are authenticated.",
  };
}

function computeMarketCoverageRisk(owned: Collectible[]): RiskFactor {
  const withValue = owned.filter((c) => c.estimatedValue !== null);
  const coverage = owned.length > 0 ? withValue.length / owned.length : 0;
  const score = Math.round((1 - coverage) * 100);

  return {
    name: "Market Coverage",
    score,
    level: scoreToLevel(score),
    explanation: coverage > 0.7
      ? "Good market data coverage across your collection."
      : `Only ${Math.round(coverage * 100)}% of items have market valuations.`,
  };
}

function computeDiversificationRisk(owned: Collectible[]): RiskFactor {
  const categories = new Set(owned.map((c) => c.category)).size;
  const brands = new Set(owned.filter((c) => c.brand).map((c) => c.brand)).size;
  const years = new Set(owned.filter((c) => c.year).map((c) => c.year)).size;

  const diversityScore = Math.min(100, (categories * 15) + (brands * 5) + (years * 3));
  const score = Math.max(0, 100 - diversityScore);

  return {
    name: "Diversification",
    score,
    level: scoreToLevel(score),
    explanation: score < 30
      ? "Well-diversified across categories, brands, and eras."
      : score < 60
        ? "Moderate diversification — some concentration risk."
        : "Low diversification — portfolio is narrowly focused.",
  };
}

function computeLiquidityRisk(owned: Collectible[]): RiskFactor {
  const highValueCount = owned.filter((c) => (c.estimatedValue ?? 0) > 1000).length;
  const ratio = owned.length > 0 ? highValueCount / owned.length : 0;
  const score = Math.round(ratio * 70);

  return {
    name: "Liquidity",
    score,
    level: scoreToLevel(score),
    explanation: ratio > 0.5
      ? "Many high-value items — may take longer to liquidate."
      : "Collection has reasonable liquidity characteristics.",
  };
}

function computeKnowledgeCoverageRisk(owned: Collectible[]): RiskFactor {
  const withNotes = owned.filter((c) => c.notes && c.notes.length > 20).length;
  const withTags = owned.filter((c) => c.tags.length > 0).length;
  const documented = Math.max(withNotes, withTags);
  const coverage = owned.length > 0 ? documented / owned.length : 0;
  const score = Math.round((1 - coverage) * 60);

  return {
    name: "Knowledge Coverage",
    score,
    level: scoreToLevel(score),
    explanation: coverage > 0.6
      ? "Good documentation coverage across your collection."
      : `Only ${Math.round(coverage * 100)}% of items have detailed documentation.`,
  };
}

function computeConfidenceRisk(owned: Collectible[]): RiskFactor {
  const withGrade = owned.filter((c) => c.grade || c.gradingCompany).length;
  const withCondition = owned.filter((c) => c.condition).length;
  const assessed = Math.max(withGrade, withCondition);
  const coverage = owned.length > 0 ? assessed / owned.length : 0;
  const score = Math.round((1 - coverage) * 50);

  return {
    name: "Confidence",
    score,
    level: scoreToLevel(score),
    explanation: coverage > 0.7
      ? "Most items have condition or grade assessments."
      : "Many items lack formal condition assessments.",
  };
}

function scoreToLevel(score: number): RiskLevel {
  if (score >= 60) return "high";
  if (score >= 35) return "moderate";
  return "low";
}

function generateRiskSuggestions(
  factors: PortfolioRisk["factors"],
  owned: Collectible[]
): string[] {
  const suggestions: string[] = [];

  if (factors.categoryConcentration.level === "high") {
    suggestions.push("Consider diversifying into additional collectible categories.");
  }
  if (factors.authenticationRisk.level === "high") {
    suggestions.push("Prioritize authenticating your highest-value unverified items.");
  }
  if (factors.marketCoverage.level === "high") {
    suggestions.push("Add estimated values to more items to improve portfolio tracking.");
  }
  if (factors.diversification.level === "high") {
    suggestions.push("Explore collectibles from different brands, eras, or categories.");
  }
  if (factors.knowledgeCoverage.level !== "low") {
    suggestions.push("Document more items with notes and tags for better analysis.");
  }

  return suggestions.slice(0, 5);
}

export function computeDiversificationAnalysis(collectibles: Collectible[]): DiversificationAnalysis {
  const owned = collectibles.filter((c) => c.status === "OWNED" || c.status === "PURCHASED");

  const categories = computeBreakdown("Categories", owned, (c) => COLLECTIBLE_CATEGORY_LABELS[c.category]);
  const brands = computeBreakdown("Brands", owned, (c) => c.brand ?? "Unknown");
  const years = computeBreakdown("Years", owned, (c) => {
    if (!c.year) return "Unknown";
    const decade = Math.floor(c.year / 10) * 10;
    return `${decade}s`;
  });
  const priceBands = computeBreakdown("Price Bands", owned, (c) => {
    const price = c.estimatedValue ?? c.purchasePrice ?? 0;
    if (price === 0) return "Unknown";
    if (price < 50) return "Under $50";
    if (price < 200) return "$50–$200";
    if (price < 1000) return "$200–$1,000";
    if (price < 5000) return "$1,000–$5,000";
    return "$5,000+";
  });
  const conditions = computeBreakdown("Conditions", owned, (c) => c.condition ?? "Unassessed");
  const authenticationStatus = computeBreakdown("Authentication", owned, (c) =>
    c.isAuthenticated ? "Authenticated" : "Not Authenticated"
  );

  const scores = [categories, brands, years, priceBands, conditions, authenticationStatus].map((b) => b.score);
  const overallScore = Math.round(scores.reduce((s, v) => s + v, 0) / scores.length);

  const suggestions: string[] = [];
  if (categories.score < 40) suggestions.push("Explore new collectible categories to improve diversification.");
  if (brands.score < 30) suggestions.push("Consider items from different brands or manufacturers.");
  if (years.score < 30) suggestions.push("Mix vintage and modern items for era diversification.");

  return {
    overallScore,
    breakdowns: { categories, brands, years, priceBands, conditions, authenticationStatus },
    suggestions,
    expectedDNAImpact: [
      { trait: "Diversification", currentScore: overallScore, projectedScore: Math.min(100, overallScore + 10) },
    ],
  };
}

function computeBreakdown(
  dimension: string,
  items: Collectible[],
  classifier: (c: Collectible) => string
): DiversificationBreakdown {
  const counts = new Map<string, number>();
  for (const item of items) {
    const label = classifier(item);
    counts.set(label, (counts.get(label) || 0) + 1);
  }

  const total = items.length || 1;
  const segments = [...counts.entries()]
    .map(([label, count]) => ({ label, count, percentage: Math.round((count / total) * 100) }))
    .sort((a, b) => b.count - a.count);

  const uniqueCount = segments.length;
  const evenness = computeEvenness(segments.map((s) => s.count));
  const score = Math.round(Math.min(100, uniqueCount * 10 + evenness * 50));

  return { dimension, segments, score };
}

function computeEvenness(counts: number[]): number {
  if (counts.length <= 1) return 0;
  const total = counts.reduce((s, v) => s + v, 0);
  if (total === 0) return 0;
  const proportions = counts.map((c) => c / total);
  const entropy = -proportions.reduce((s, p) => s + (p > 0 ? p * Math.log(p) : 0), 0);
  const maxEntropy = Math.log(counts.length);
  return maxEntropy > 0 ? entropy / maxEntropy : 0;
}

function emptyRisk(): PortfolioRisk {
  const emptyFactor: RiskFactor = { name: "", score: 0, level: "low", explanation: "No items to analyze." };
  return {
    overallLevel: "low",
    overallScore: 0,
    factors: {
      categoryConcentration: { ...emptyFactor, name: "Category Concentration" },
      authenticationRisk: { ...emptyFactor, name: "Authentication Risk" },
      marketCoverage: { ...emptyFactor, name: "Market Coverage" },
      diversification: { ...emptyFactor, name: "Diversification" },
      liquidity: { ...emptyFactor, name: "Liquidity" },
      knowledgeCoverage: { ...emptyFactor, name: "Knowledge Coverage" },
      confidence: { ...emptyFactor, name: "Confidence" },
    },
    suggestions: ["Add collectibles to your collection to begin risk analysis."],
  };
}
