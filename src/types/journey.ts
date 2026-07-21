import type { CollectorArchetype } from "./dna";
import type { CollectibleCategory } from "./common";

// ─── Journey Milestones ──────────────────────────────────────────────────────

export type JourneyMilestoneType =
  | "first_conversation"
  | "first_collectible"
  | "first_authentication"
  | "first_memory"
  | "first_achievement"
  | "largest_dna_growth"
  | "collection_doubled"
  | "research_milestone"
  | "goal_completed"
  | "legacy_report_generated"
  | "archetype_shift"
  | "category_mastery"
  | "portfolio_milestone"
  | "image_analysis_milestone";

export interface JourneyMilestone {
  id: string;
  type: JourneyMilestoneType;
  title: string;
  description: string;
  date: string;
  dnaScoreAtTime: number;
  archetypeAtTime: CollectorArchetype;
  category: CollectibleCategory | null;
  linkedConversationId: string | null;
  linkedCollectibleId: string | null;
  linkedMemoryKey: string | null;
  linkedReplayFrame: number | null;
  impact: "minor" | "moderate" | "major" | "transformative";
}

// ─── Journey Timeline ────────────────────────────────────────────────────────

export interface JourneyChapter {
  title: string;
  startDate: string;
  endDate: string | null;
  milestones: JourneyMilestone[];
  narrative: string;
  dominantArchetype: CollectorArchetype;
  dnaGrowth: number;
}

export interface CollectorJourney {
  userId: string;
  startDate: string;
  totalMilestones: number;
  chapters: JourneyChapter[];
  currentChapter: JourneyChapter;
  storyNarrative: string;
  journeyProgress: number;
  nextMilestoneHint: string | null;
  computedAt: string;
}

// ─── Journey Stats ───────────────────────────────────────────────────────────

export interface JourneyStats {
  totalDaysActive: number;
  totalConversations: number;
  totalCollectibles: number;
  totalMemories: number;
  totalAchievements: number;
  archetypeShifts: number;
  largestDNAGrowth: { date: string; growth: number };
  categoriesExplored: number;
  journeyScore: number;
}
