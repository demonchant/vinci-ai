import type { CollectibleCategory } from "./common";

// ─── Market Data Provider ────────────────────────────────────────────────────

export type MarketDataProviderType =
  | "auction_api"
  | "marketplace_api"
  | "manual_import"
  | "csv_import"
  | "demo";

export interface MarketDataPoint {
  date: string;
  value: number;
  volume?: number;
  source: string;
  confidence: number;
}

export interface ComparableSale {
  id: string;
  title: string;
  date: string;
  price: number;
  condition: string | null;
  source: string;
  confidence: number;
  similarityScore: number;
  currency: string;
}

export interface MarketDataProviderResult {
  provider: MarketDataProviderType;
  lastUpdated: string;
  priceHistory: MarketDataPoint[];
  comparables: ComparableSale[];
  currentEstimate: number | null;
  confidence: number;
  ttl: number;
}

// ─── Market Insight (existing, extended) ─────────────────────────────────────

export interface MarketInsight {
  id: string;
  category: CollectibleCategory | null;
  headline: string;
  summary: string;
  sentiment: MarketSentiment | null;
  changePct: number | null;
  source: string | null;
  isOpportunity: boolean;
  isRisk: boolean;
  publishedAt: string;
}

// ─── Portfolio Valuation ─────────────────────────────────────────────────────

export interface PortfolioValuation {
  totalPurchasePrice: number;
  totalEstimatedValue: number;
  totalGainLoss: number;
  totalGainLossPct: number;
  todayChange: number;
  weeklyChange: number;
  monthlyChange: number;
  lifetimeGainLoss: number;
  averageConfidence: number;
  marketCoverage: number;
  trackedCategories: number;
  activeAlerts: number;
  currency: string;
  lastUpdated: string;
}

export interface CollectibleValuation {
  collectibleId: string;
  title: string;
  category: CollectibleCategory;
  purchasePrice: number | null;
  currentEstimatedValue: number | null;
  gainLoss: number | null;
  gainLossPct: number | null;
  confidence: number;
  lastUpdated: string;
  marketSource: string | null;
  priceHistory: MarketDataPoint[];
  comparables: ComparableSale[];
}

// ─── Category Heatmap ────────────────────────────────────────────────────────

export interface CategoryPerformance {
  category: CollectibleCategory;
  label: string;
  changePct: number;
  volume: number;
  confidence: number;
  volatility: number;
  growth: number;
  itemCount: number;
}

// ─── Market Sentiment ────────────────────────────────────────────────────────

export type MarketSentiment = "bullish" | "bearish" | "neutral";

export interface MarketSentimentAnalysis {
  overall: MarketSentiment;
  confidence: number;
  sources: string[];
  byCategory: Record<CollectibleCategory, MarketSentiment>;
}

// ─── Market Timeline ─────────────────────────────────────────────────────────

export type MarketEventType =
  | "price_spike"
  | "price_correction"
  | "authentication_update"
  | "collection_addition"
  | "wishlist_available"
  | "portfolio_milestone"
  | "alert_triggered"
  | "category_trend";

export interface MarketTimelineEvent {
  id: string;
  type: MarketEventType;
  title: string;
  description: string;
  timestamp: string;
  category: CollectibleCategory | null;
  collectibleId: string | null;
  impact: "positive" | "negative" | "neutral";
  data?: Record<string, unknown>;
}

// ─── Market Alerts ───────────────────────────────────────────────────────────

export type AlertType =
  | "price_increase"
  | "price_drop"
  | "authentication_news"
  | "wishlist_opportunity"
  | "category_trend"
  | "portfolio_threshold"
  | "confidence_change";

export type AlertStatus = "unread" | "read" | "muted" | "archived" | "deleted";

export interface MarketAlert {
  id: string;
  type: AlertType;
  title: string;
  description: string;
  status: AlertStatus;
  severity: "low" | "medium" | "high";
  category: CollectibleCategory | null;
  collectibleId: string | null;
  data: Record<string, unknown>;
  createdAt: string;
  readAt: string | null;
}

export interface AlertConfig {
  type: AlertType;
  enabled: boolean;
  threshold?: number;
  categories?: CollectibleCategory[];
}

// ─── Watchlists ──────────────────────────────────────────────────────────────

export interface WatchlistItem {
  id: string;
  watchlistId: string;
  title: string;
  category: CollectibleCategory;
  targetPrice: number | null;
  desiredCondition: string | null;
  notes: string | null;
  priority: "low" | "medium" | "high";
  currentPrice: number | null;
  priceHistory: MarketDataPoint[];
  aiWatchScore: number | null;
  opportunityScore: number | null;
  addedAt: string;
  lastChecked: string | null;
}

export interface Watchlist {
  id: string;
  name: string;
  description: string | null;
  itemCount: number;
  items: WatchlistItem[];
  createdAt: string;
  updatedAt: string;
}

// ─── Wishlist Intelligence ───────────────────────────────────────────────────

export interface WishlistIntelligence {
  collectibleId: string;
  title: string;
  priorityScore: number;
  expectedAvailability: "rare" | "uncommon" | "common" | "available_now";
  priceTrend: "rising" | "stable" | "falling";
  marketRisk: "low" | "moderate" | "high";
  recommendedTiming: string;
  researchSuggestions: string[];
  confidence: number;
}

// ─── AI Recommendation Engine ────────────────────────────────────────────────

export type RecommendationType =
  | "buy"
  | "hold"
  | "reduce_exposure"
  | "research_more"
  | "diversify"
  | "authenticate"
  | "portfolio_rebalance";

export type SignalStrength = "strong" | "moderate" | "weak";

export interface RecommendationEvidence {
  type: "market_data" | "portfolio_analysis" | "dna_alignment" | "historical_trend" | "comparable_sales";
  description: string;
  confidence: number;
  source: string;
  timestamp: string;
}

export interface MarketRecommendation {
  id: string;
  type: RecommendationType;
  signal: SignalStrength;
  title: string;
  explanation: string;
  evidence: RecommendationEvidence[];
  confidence: number;
  affectedCollections: string[];
  affectedDNATraits: string[];
  affectedGoals: string[];
  affectedMemories: string[];
  createdAt: string;
  expiresAt: string | null;
}

// ─── Portfolio Risk ──────────────────────────────────────────────────────────

export type RiskLevel = "low" | "moderate" | "high";

export interface RiskFactor {
  name: string;
  score: number;
  level: RiskLevel;
  explanation: string;
}

export interface PortfolioRisk {
  overallLevel: RiskLevel;
  overallScore: number;
  factors: {
    categoryConcentration: RiskFactor;
    authenticationRisk: RiskFactor;
    marketCoverage: RiskFactor;
    diversification: RiskFactor;
    liquidity: RiskFactor;
    knowledgeCoverage: RiskFactor;
    confidence: RiskFactor;
  };
  suggestions: string[];
}

// ─── Diversification Analysis ────────────────────────────────────────────────

export interface DiversificationBreakdown {
  dimension: string;
  segments: { label: string; count: number; percentage: number }[];
  score: number;
}

export interface DiversificationAnalysis {
  overallScore: number;
  breakdowns: {
    categories: DiversificationBreakdown;
    brands: DiversificationBreakdown;
    years: DiversificationBreakdown;
    priceBands: DiversificationBreakdown;
    conditions: DiversificationBreakdown;
    authenticationStatus: DiversificationBreakdown;
  };
  suggestions: string[];
  expectedDNAImpact: { trait: string; currentScore: number; projectedScore: number }[];
}

// ─── Opportunity Detector ────────────────────────────────────────────────────

export type OpportunityType =
  | "undervalued"
  | "research_opportunity"
  | "authentication_candidate"
  | "wishlist_match"
  | "collection_gap"
  | "category_expansion";

export interface MarketOpportunity {
  id: string;
  type: OpportunityType;
  title: string;
  explanation: string;
  confidence: number;
  category: CollectibleCategory | null;
  collectibleId: string | null;
  potentialValue: number | null;
  evidence: RecommendationEvidence[];
  dnaImpact: { trait: string; impact: number }[];
  createdAt: string;
}

// ─── Market Dashboard (aggregate) ────────────────────────────────────────────

export interface MarketDashboard {
  valuation: PortfolioValuation;
  sentiment: MarketSentimentAnalysis | null;
  categoryPerformance: CategoryPerformance[];
  recentTimeline: MarketTimelineEvent[];
  topRecommendations: MarketRecommendation[];
  activeAlerts: MarketAlert[];
  opportunities: MarketOpportunity[];
  risk: PortfolioRisk;
  watchlistSummary: { total: number; withOpportunities: number; highPriority: number };
}

// ─── Export ──────────────────────────────────────────────────────────────────

export type MarketExportFormat = "csv" | "json" | "markdown";

export interface MarketExportOptions {
  format: MarketExportFormat;
  sections: (
    | "portfolio"
    | "watchlists"
    | "alerts"
    | "recommendations"
    | "risk"
    | "timeline"
  )[];
  dateRange?: { start: string; end: string };
}

// ─── Smart Search (existing, preserved) ──────────────────────────────────────

export interface SmartSearchResult {
  query: string;
  interpretedFilters: {
    category?: CollectibleCategory;
    maxPrice?: number;
    minPrice?: number;
    keywords?: string[];
    eraStart?: number;
    eraEnd?: number;
  };
  resultsSummary: string;
}

// ─── Market DNA Impact ───────────────────────────────────────────────────────

export interface MarketDNAImpact {
  trait: string;
  currentScore: number;
  marketInfluence: number;
  direction: "positive" | "negative" | "neutral";
  explanation: string;
}
