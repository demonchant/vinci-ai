import type { CollectibleCategory } from "./common";
import type { CollectorArchetype, RiskProfile } from "./dna";

// ─── Collector Twin Profile ──────────────────────────────────────────────────

export interface TwinPreference {
  label: string;
  value: string;
  confidence: number;
  evidence: string[];
  lastObserved: string;
}

export interface TwinBehavior {
  trait: string;
  score: number;
  description: string;
  evidence: string[];
  observedSince: string;
}

export interface CollectorTwinProfile {
  philosophy: TwinPreference;
  buyingStyle: TwinBehavior;
  riskDiscipline: TwinBehavior;
  researchDepth: TwinBehavior;
  patience: TwinBehavior;
  decisionSpeed: TwinBehavior;
  diversificationPreference: TwinBehavior;
  budgetDiscipline: TwinBehavior;
  confidence: number;

  favoriteCategories: TwinPreference[];
  favoriteEras: TwinPreference[];
  favoriteBrands: TwinPreference[];
  favoriteArtists: TwinPreference[];
  collectionStrategy: TwinPreference;

  archetype: CollectorArchetype;
  riskProfile: RiskProfile;
  dnaScore: number;

  computedAt: string;
  dataPoints: number;
}

// ─── Ask My Twin ─────────────────────────────────────────────────────────────

export interface TwinQuestion {
  question: string;
  context?: string;
}

export interface TwinAnswer {
  answer: string;
  alignment: "aligned" | "partially_aligned" | "misaligned";
  alignmentScore: number;
  reasoning: string;
  historicalBehavior: string[];
  dnaFactors: string[];
  memoryFactors: string[];
  goalFactors: string[];
  marketFactors: string[];
  confidence: number;
  disclaimer: string;
}

// ─── Twin Evolution ──────────────────────────────────────────────────────────

export interface TwinEvolutionSnapshot {
  timestamp: string;
  philosophy: string;
  archetype: CollectorArchetype;
  dnaScore: number;
  topBehaviors: { trait: string; score: number }[];
}

// ─── Collectible Twin Assessment ─────────────────────────────────────────────

export interface TwinCollectibleAssessment {
  collectibleId: string;
  twinInterest: number;
  historicalFit: number;
  confidence: number;
  marketAlignment: number;
  dnaImpact: number;
  explanation: string;
  evidence: string[];
}
