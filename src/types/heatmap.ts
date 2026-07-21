import type { CollectibleCategory } from "./common";

// ─── Confidence Heatmap ──────────────────────────────────────────────────────

export interface CategoryConfidence {
  category: CollectibleCategory;
  label: string;
  knowledge: number;
  evidenceCount: number;
  confidence: number;
  freshness: number;
  coverage: number;
  missingAreas: string[];
  supportingMemories: string[];
  relatedConversations: number;
  dnaContribution: number;
  goals: string[];
  suggestedResearch: string[];
}

export interface ConfidenceHeatmapData {
  categories: CategoryConfidence[];
  overallConfidence: number;
  strongestCategory: CollectibleCategory | null;
  weakestCategory: CollectibleCategory | null;
  researchRecommendations: ResearchRecommendation[];
  computedAt: string;
}

// ─── Research Recommendations ────────────────────────────────────────────────

export type ResearchActionType =
  | "read_more"
  | "authenticate"
  | "upload_images"
  | "expand_category"
  | "diversify"
  | "complete_goals";

export interface ResearchRecommendation {
  id: string;
  action: ResearchActionType;
  title: string;
  explanation: string;
  category: CollectibleCategory | null;
  priority: "low" | "medium" | "high";
  estimatedImpact: { trait: string; improvement: number }[];
  confidence: number;
}

// ─── Living Collector Events ─────────────────────────────────────────────────

export type EvolutionEventType =
  | "memory_updated"
  | "dna_recalculated"
  | "replay_snapshot"
  | "achievement_unlocked"
  | "twin_updated"
  | "dashboard_refreshed"
  | "legacy_updated"
  | "animation_complete";

export interface EvolutionEvent {
  id: string;
  type: EvolutionEventType;
  label: string;
  timestamp: string;
  data?: Record<string, unknown>;
}

export interface LivingCollectorState {
  isEvolving: boolean;
  currentStep: EvolutionEventType | null;
  events: EvolutionEvent[];
  lastEvolution: string | null;
  evolutionCount: number;
}
