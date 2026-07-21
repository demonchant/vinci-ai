// ─── Reasoning Perspectives ──────────────────────────────────────────────────

export type ReasoningPerspective =
  | "vision_analyst"
  | "market_analyst"
  | "collection_analyst"
  | "historian"
  | "research_advisor"
  | "risk_advisor"
  | "memory_validator"
  | "dna_interpreter"
  | "goal_advisor";

export interface PerspectiveResult {
  perspective: ReasoningPerspective;
  label: string;
  icon: string;
  observation: string;
  confidence: number;
  evidence: string[];
  supportingFacts: string[];
  limitations: string[];
}

export interface ReasoningSynthesis {
  id: string;
  query: string;
  perspectives: PerspectiveResult[];
  consensusScore: number;
  areasOfAgreement: string[];
  areasOfUncertainty: string[];
  missingEvidence: string[];
  finalRecommendation: string;
  computedAt: string;
}

// ─── Perspective Configuration ───────────────────────────────────────────────

export const PERSPECTIVE_CONFIG: Record<
  ReasoningPerspective,
  { label: string; icon: string; focus: string }
> = {
  vision_analyst: {
    label: "Vision Analyst",
    icon: "Eye",
    focus: "image analysis, visual identification, condition assessment",
  },
  market_analyst: {
    label: "Market Analyst",
    icon: "TrendingUp",
    focus: "market trends, pricing, valuation, comparable sales",
  },
  collection_analyst: {
    label: "Collection Analyst",
    icon: "Layers",
    focus: "collection composition, gaps, duplicates, portfolio balance",
  },
  historian: {
    label: "Historian",
    icon: "BookOpen",
    focus: "historical significance, provenance, era context, cultural importance",
  },
  research_advisor: {
    label: "Research Advisor",
    icon: "Search",
    focus: "knowledge gaps, research opportunities, information quality",
  },
  risk_advisor: {
    label: "Risk Advisor",
    icon: "ShieldAlert",
    focus: "authentication risk, market risk, concentration risk, liquidity",
  },
  memory_validator: {
    label: "Memory Validator",
    icon: "Brain",
    focus: "fact consistency, memory confidence, knowledge freshness",
  },
  dna_interpreter: {
    label: "DNA Interpreter",
    icon: "Fingerprint",
    focus: "collector identity, behavioral patterns, trait evolution",
  },
  goal_advisor: {
    label: "Goal Advisor",
    icon: "Target",
    focus: "goal progress, strategic alignment, priority recommendations",
  },
};
