import type { Collectible } from "./collectible";
import type { CollectibleCategory, CollectibleStatus } from "./common";

export type CollectionViewMode = "grid" | "list" | "table" | "gallery" | "timeline" | "masonry";

export interface NamedCollection {
  id: string;
  name: string;
  description: string | null;
  coverImageUrl: string | null;
  isDefault: boolean;
  aiSummary: string | null;
  itemCount: number;
  createdAt: string;
}

export interface CollectionTag {
  id: string;
  name: string;
  color: string;
  parentId: string | null;
  isPinned: boolean;
  isAiSuggested: boolean;
  itemCount: number;
}

export interface CollectionFilters {
  category?: CollectibleCategory;
  status?: CollectibleStatus;
  collectionId?: string;
  tagIds?: string[];
  condition?: string;
  isAuthenticated?: boolean;
  minValue?: number;
  maxValue?: number;
  minConfidence?: number;
  yearFrom?: number;
  yearTo?: number;
  query?: string;
  sortBy?: "createdAt" | "estimatedValue" | "title" | "year" | "rarityScore";
  sortDir?: "asc" | "desc";
}

export interface PortfolioStats {
  totalItems: number;
  totalValue: number;
  averageConditionLabel: string | null;
  authenticationRatePct: number;
  averageConfidence: number;
  diversificationScore: number;
  portfolioHealthScore: number;
  growth: { period: string; value: number }[];
  categoryDistribution: { category: string; count: number; value: number }[];
  conditionDistribution: { condition: string; count: number }[];
  authenticationDistribution: { label: string; count: number }[];
  valueDistribution: { bucket: string; count: number }[];
}

export interface RelatedCollectibleSuggestion {
  collectible: Collectible;
  reason: string;
}

export interface BulkActionResult {
  affected: number;
  action: string;
}
