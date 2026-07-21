import type { CollectorArchetype, RiskProfile } from "./dna";
import type { CollectibleCategory } from "./common";

export interface DNASnapshot {
  id: string;
  userId: string;
  dnaScore: number;
  primaryType: CollectorArchetype;
  secondaryType: CollectorArchetype | null;
  traits: { name: string; score: number }[];
  riskProfile: RiskProfile;
  portfolioHealth: number;
  collectionValue: number;
  favoriteCategory: CollectibleCategory | null;
  knowledgeScore: number;
  researchScore: number;
  patienceScore: number;
  marketAwareness: number;
  diversification: number;
  collectorSummary: string;
  achievementsUnlocked: string[];
  recommendations: string[];
  activityReason: string;
  createdAt: string;
}

export interface SnapshotDelta {
  fromSnapshotId: string;
  toSnapshotId: string;
  scoreDelta: number;
  changedTraits: { name: string; from: number; to: number }[];
  archetypeChanged: boolean;
  explanation: string; // AI-written "why this changed"
}

export interface ChangeLogEntry {
  id: string;
  snapshotId: string;
  kind: "ACHIEVEMENT_UNLOCKED" | "NEW_TRAIT" | "ARCHETYPE_CHANGED" | "MEMORY_LEARNED" | "SCORE_CHANGE";
  title: string;
  reason: string;
  occurredAt: string;
}

export interface MilestoneMarker {
  id: string;
  title: string;
  icon: string;
  achievedAt: string;
}

export interface EvolutionMapNode {
  archetype: CollectorArchetype;
  reachedAt: string | null; // null if not yet reached
  isCurrent: boolean;
}

export interface DNAReplayData {
  snapshots: DNASnapshot[];
  changeLog: ChangeLogEntry[];
  milestones: MilestoneMarker[];
  evolutionMap: EvolutionMapNode[];
  recommendationHistory: { period: string; recommendation: string }[];
}

export interface ReplayPlaybackState {
  currentIndex: number;
  isPlaying: boolean;
  speed: 0.5 | 1 | 2;
}
