export interface EvidenceBundle {
  allowedFacts: string[];
  forbiddenAssumptions: string[];
  dataSourceIds: string[];
}

export interface LegacyCoverData {
  collectorName: string;
  collectorSince: string;
  level: number;
  primaryArchetype: string;
  dnaScore: number;
  collectionSize: number;
  portfolioValue: number | null;
  generatedAt: string;
}

export interface LegacyNarrativeSection {
  heading: string;
  body: string;
  evidence: EvidenceBundle;
}

export interface LegacyCollectionHighlight {
  label: string;
  collectibleId: string | null;
  collectibleTitle: string;
  value: string;
}

export interface LegacyMemoryHighlight {
  label: string;
  memoryLabel: string;
  memoryValue: string;
  confidence: number;
}

export interface LegacyConversationHighlight {
  label: string;
  chatTitle: string | null;
  chatId: string | null;
  summary: string;
}

export interface LegacyAchievementHighlight {
  key: string;
  title: string;
  tier: string;
  xp: number;
  unlockedAt: string | null;
  isUnlocked: boolean;
  progress: number;
}

export interface LegacyGoalHighlight {
  title: string;
  progress: number;
  isCompleted: boolean;
  dnaContribution: string | null;
}

export interface LegacyScore {
  overall: number;
  breakdown: { label: string; score: number; weight: number }[];
  confidence: number;
  explanation: string;
}

export interface LegacyPortfolioSnapshot {
  totalItems: number;
  totalValue: number;
  categoryDistribution: { category: string; count: number }[];
  authenticationRatePct: number;
  averageConfidence: number;
  diversificationScore: number;
}

export interface LegacyReportData {
  cover: LegacyCoverData;
  executiveSummary: string;
  story: LegacyNarrativeSection[];
  dnaEvolutionSummary: string;
  collectionHighlights: LegacyCollectionHighlight[];
  memoryHighlights: LegacyMemoryHighlight[];
  conversationHighlights: LegacyConversationHighlight[];
  achievements: LegacyAchievementHighlight[];
  goals: LegacyGoalHighlight[];
  portfolio: LegacyPortfolioSnapshot;
  legacyScore: LegacyScore;
  aiLetter: string;
  nextChapter: string[];
  provenanceHighlights: { label: string; detail: string }[];
  marketNote: string;
}

export interface LegacyReportRecord {
  id: string;
  userId: string;
  periodStart: string;
  periodEnd: string;
  reportData: LegacyReportData;
  pdfStoragePath: string | null;
  shareCardUrl: string | null;
  generatedAt: string;
}
