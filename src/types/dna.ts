export type CollectorArchetype =
  | "INVESTOR"
  | "HISTORIAN"
  | "COMPLETIONIST"
  | "CURATOR"
  | "FLIPPER"
  | "EXPLORER"
  | "TREND_HUNTER"
  | "MINIMALIST"
  | "LUXURY_COLLECTOR"
  | "COMMUNITY_COLLECTOR"
  | "PRESERVATIONIST"
  | "COMPETITIVE_COLLECTOR";

export const ARCHETYPE_LABELS: Record<CollectorArchetype, string> = {
  INVESTOR: "Investor",
  HISTORIAN: "Historian",
  COMPLETIONIST: "Completionist",
  CURATOR: "Curator",
  FLIPPER: "Flipper",
  EXPLORER: "Explorer",
  TREND_HUNTER: "Trend Hunter",
  MINIMALIST: "Minimalist",
  LUXURY_COLLECTOR: "Luxury Collector",
  COMMUNITY_COLLECTOR: "Community Collector",
  PRESERVATIONIST: "Preservationist",
  COMPETITIVE_COLLECTOR: "Competitive Collector",
};

export type RiskProfile =
  | "CONSERVATIVE"
  | "BALANCED"
  | "AGGRESSIVE";

export interface DNATrait {
  name: string;
  score: number;
  explanation: string;
}

export interface DNAWheelAxis {
  axis:
    | "Knowledge"
    | "Patience"
    | "Risk"
    | "Diversification"
    | "Market Awareness"
    | "Authentication"
    | "Research"
    | "Collection Quality"
    | "Budget Discipline"
    | "Community Engagement";
  score: number;
}

export interface AchievementBadge {
  id: string;
  key: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  unlockedAt: string | null;
  isUnlocked: boolean; // ✅ Added to satisfy UI expectations
  xp: number; // ✅ Added to satisfy UI expectations
}

// ✅ Added type alias to satisfy existing imports in useDNA.ts and dna/page.tsx
export type Achievement = AchievementBadge;

export interface CollectorDNAInsight {
  text: string;
  basedOn: string[];
}

export interface CollectorDNAPrediction {
  text: string;
  confidence: number;
  disclaimer: string;
}

export interface CollectorCompass {
  current: CollectorArchetype;
  projected: CollectorArchetype;
  explanation: string;
}

export interface CollectorDNA {
  dnaScore: number;
  primaryType: CollectorArchetype;
  secondaryType: CollectorArchetype | null;
  projectedArchetype?: CollectorArchetype;
  summary: string;
  traits: DNATrait[];
  wheel: DNAWheelAxis[];
  riskProfile: RiskProfile;
  diversificationScore: number;
  diversificationSuggestions: string[];
  collectionHealthScore: number;
  collectionHealthFactors: {
    factor: string;
    score: number;
    note: string;
  }[];
  achievements: AchievementBadge[];
  insights: CollectorDNAInsight[];
  funFacts: string[];
  predictions: CollectorDNAPrediction[];
  compass: CollectorCompass;
  coach: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    recommendations: string[];
    weekOf: string;
  };
  computedAt: string;
}