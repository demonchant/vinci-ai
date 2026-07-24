import { Prisma } from "@prisma/client";

export type MemorySource =
  | "CHAT"
  | "IMAGE_ANALYSIS"
  | "COLLECTION_ACTION"
  | "SEARCH"
  | "MANUAL_EDIT"
  | "ONBOARDING";

/** Canonical memory keys Vinci AI knows how to extract & personalize with. */
export type MemoryKey =
  | "favorite_category"
  | "favorite_categories"
  | "budget"
  | "favorite_brands"
  | "favorite_artists"
  | "favorite_card_games"
  | "favorite_sports"
  | "favorite_teams"
  | "favorite_watch_brands"
  | "wishlist_focus"
  | "buying_habits"
  | "selling_habits"
  | "favorite_marketplaces"
  | "investment_style"
  | "risk_tolerance"
  | "preferred_grading"
  | "preferred_language"
  | "favorite_price_range"
  | "interests"
  | "collection_goals"
  | "storage_preferences"
  | "insurance_status"
  | string; // extensible — AI may introduce new facts over time

export interface CollectorMemoryFact {
  id: string;
  key: MemoryKey;
  label: string;
  value: Prisma.JsonValue;
  source: MemorySource;
  confidence: number;
  isPinned: boolean;
  isVerified: boolean;
  isLocked: boolean;
  isArchived: boolean;
  learnedAt: Date;
  updatedAt: Date;
}

export interface MemoryExtraction {
  key: MemoryKey;
  label: string;
  value: Prisma.JsonValue;
  confidence: number;
}

export interface CollectorMemoryProfile {
  facts: CollectorMemoryFact[];
  /** Convenience flat map for prompt-building: key -> value */
  asRecord: Record<string, Prisma.JsonValue>;
}