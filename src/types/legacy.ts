export interface EvidenceBundle {
  allowedFacts: string[];
  forbiddenAssumptions: string[];
  dataSourceIds: string[];
}

export interface LegacyNarrativeSection {
  heading: string;
  body: string;
  evidence: EvidenceBundle;
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
  chatId: string;
  summary: string;
}

export interface LegacyAchievementHighlight {
  key: string;
  title: string;
  tier: string; // Fallback preserved for legacy compatibility
  xp: number;   // Fallback preserved for legacy compatibility
  unlockedAt: string | null;
  isUnlocked: boolean;
  progress: number;
}

export interface LegacyGoalHighlight {
  title: string;
  progress: number;
  isCompleted: boolean;
  dnaContribution: string | null; // ✅ Added to match newer Legacy Report implementation
}

export interface LegacyPortfolioSnapshot {
  totalItems: number;
  totalValue: number;
  categoryDistribution: { category: string; count: number }[];
  authenticationRatePct: number;
  averageConfidence: number;
  diversificationScore: number;
}

export interface LegacyScore {
  overall: number;
  breakdown: { label: string; score: number; weight: number }[];
  confidence: number;
  explanation: string;
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

export interface LegacyDataBundle {
  userId: string;
  user: { createdAt: Date; email: string };
  dna: { dnaScore: number; primaryType: string; secondaryType: string | null; traits: Record<string, number> };
  facts: { id: string; label: string; value: unknown; confidence: number; isVerified: boolean; key: string }[];
  snapshotCount: number;
  cover: LegacyCoverData;
  collectionHighlights: LegacyCollectionHighlight[];
  memoryHighlights: LegacyMemoryHighlight[];
  conversationHighlights: LegacyConversationHighlight[];
  achievements: LegacyAchievementHighlight[];
  goals: LegacyGoalHighlight[];
  portfolio: LegacyPortfolioSnapshot;
  legacyScore: LegacyScore;
  provenanceHighlights: { label: string; detail: string }[];
  marketNote: string;
}