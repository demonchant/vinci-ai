import type { CollectibleCategory } from "./common";

export interface EvidenceObservation {
  text: string;
  category: "authenticity" | "condition" | "identification" | "concern";
  region?: { x: number; y: number; width: number; height: number }; // normalized 0-1, optional
  confidence: number;
}

export interface SectionConfidence {
  section: "identification" | "condition" | "authenticity" | "rarity" | "value";
  confidence: number;
  note: string;
}

export interface LabAnalysisResult {
  id: string;
  imageUrl: string;
  identification: string;
  category: CollectibleCategory | null;
  estimatedEra: string | null;
  estimatedCondition: string | null;
  visibleWear: string[];
  authenticityIndicators: string[];
  possibleConcerns: string[];
  estimatedRarity: string | null;
  valueRangeLow: number | null;
  valueRangeHigh: number | null;
  overallConfidence: number;
  sectionConfidences: SectionConfidence[];
  evidence: EvidenceObservation[];
  keyObservations: string[];
  historicalBackground: string | null;
  suggestedNextSteps: string[];
  conflictingSignals: string[];
  disclaimer: string;
  createdAt: string;
}

export interface ComparisonResult {
  left: LabAnalysisResult;
  right: LabAnalysisResult;
  differences: {
    dimension: string;
    leftValue: string;
    rightValue: string;
  }[];
}
