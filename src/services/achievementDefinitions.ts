export type AchievementTier = "bronze" | "silver" | "gold" | "legendary";

export interface AchievementDefinition {
  key: string;
  title: string;
  description: string;
  icon: string;
  tier: AchievementTier;
  xp: number;
  checkUnlocked: (signals: AchievementSignals) => boolean;
  progressOf: (signals: AchievementSignals) => number;
}

export interface AchievementSignals {
  collectibleCount: number;
  authenticatedCount: number;
  authenticatedPct: number;
  imageAnalysisCount: number;
  chatCount: number;
  categoryCount: number;
  totalValue: number;
  dnaScore: number;
  daysActive: number;
  snapshotCount: number;
  memoryFactCount: number;
  verifiedMemoryCount: number;
}

export const ACHIEVEMENT_DEFINITIONS: AchievementDefinition[] = [
  {
    key: "first_collectible",
    title: "First Acquisition",
    description: "Added your first collectible.",
    icon: "FolderOpen",
    tier: "bronze",
    xp: 50,
    checkUnlocked: (s) => s.collectibleCount >= 1,
    progressOf: (s) => Math.min(100, s.collectibleCount * 100),
  },
  {
    key: "collector_10",
    title: "Collector",
    description: "Reached 10 collectibles.",
    icon: "Layers",
    tier: "silver",
    xp: 100,
    checkUnlocked: (s) => s.collectibleCount >= 10,
    progressOf: (s) => Math.min(100, Math.round((s.collectibleCount / 10) * 100)),
  },
  {
    key: "portfolio_builder",
    title: "Portfolio Builder",
    description: "Reached $50,000 in estimated collection value.",
    icon: "Wallet",
    tier: "gold",
    xp: 300,
    checkUnlocked: (s) => s.totalValue >= 50000,
    progressOf: (s) => Math.min(100, Math.round((s.totalValue / 50000) * 100)),
  },
  {
    key: "category_explorer",
    title: "Category Explorer",
    description: "Collected across 5 or more categories.",
    icon: "Compass",
    tier: "silver",
    xp: 150,
    checkUnlocked: (s) => s.categoryCount >= 5,
    progressOf: (s) => Math.min(100, Math.round((s.categoryCount / 5) * 100)),
  },
  {
    key: "first_analysis",
    title: "First Analysis",
    description: "Used AI to analyze your first collectible image.",
    icon: "ScanSearch",
    tier: "bronze",
    xp: 50,
    checkUnlocked: (s) => s.imageAnalysisCount >= 1,
    progressOf: (s) => Math.min(100, s.imageAnalysisCount * 100),
  },
  {
    key: "research_master",
    title: "Research Master",
    description: "Completed 50+ AI image analyses.",
    icon: "BookOpen",
    tier: "gold",
    xp: 250,
    checkUnlocked: (s) => s.imageAnalysisCount >= 50,
    progressOf: (s) => Math.min(100, Math.round((s.imageAnalysisCount / 50) * 100)),
  },
  {
    key: "ai_conversationalist",
    title: "AI Conversationalist",
    description: "Had 25+ conversations with Vinci AI.",
    icon: "MessageSquare",
    tier: "silver",
    xp: 150,
    checkUnlocked: (s) => s.chatCount >= 25,
    progressOf: (s) => Math.min(100, Math.round((s.chatCount / 25) * 100)),
  },
  {
    key: "authentication_expert",
    title: "Authentication Expert",
    description: "Maintained 85%+ authentication rate with 10+ items.",
    icon: "ShieldCheck",
    tier: "gold",
    xp: 250,
    checkUnlocked: (s) => s.authenticatedPct >= 85 && s.collectibleCount >= 10,
    progressOf: (s) =>
      s.collectibleCount < 10
        ? Math.round((s.collectibleCount / 10) * 100)
        : Math.min(100, s.authenticatedPct),
  },
  {
    key: "dna_awakened",
    title: "DNA Awakened",
    description: "Reached a Collector DNA score of 50.",
    icon: "Fingerprint",
    tier: "bronze",
    xp: 100,
    checkUnlocked: (s) => s.dnaScore >= 50,
    progressOf: (s) => Math.min(100, Math.round((s.dnaScore / 50) * 100)),
  },
  {
    key: "elite_collector",
    title: "Elite Collector",
    description: "Reached a Collector DNA score of 90.",
    icon: "Crown",
    tier: "legendary",
    xp: 500,
    checkUnlocked: (s) => s.dnaScore >= 90,
    progressOf: (s) => Math.min(100, Math.round((s.dnaScore / 90) * 100)),
  },
  {
    key: "dna_veteran",
    title: "DNA Veteran",
    description: "Created 10+ Collector DNA snapshots through real activity.",
    icon: "History",
    tier: "silver",
    xp: 150,
    checkUnlocked: (s) => s.snapshotCount >= 10,
    progressOf: (s) => Math.min(100, Math.round((s.snapshotCount / 10) * 100)),
  },
  {
    key: "memory_builder",
    title: "Memory Builder",
    description: "Vinci AI has learned 10+ facts about you.",
    icon: "Database",
    tier: "bronze",
    xp: 75,
    checkUnlocked: (s) => s.memoryFactCount >= 10,
    progressOf: (s) => Math.min(100, Math.round((s.memoryFactCount / 10) * 100)),
  },
  {
    key: "verified_collector",
    title: "Verified Collector",
    description: "Manually verified 5+ Collector Memory facts.",
    icon: "BadgeCheck",
    tier: "silver",
    xp: 100,
    checkUnlocked: (s) => s.verifiedMemoryCount >= 5,
    progressOf: (s) => Math.min(100, Math.round((s.verifiedMemoryCount / 5) * 100)),
  },
  {
    key: "collector_veteran",
    title: "Collector Veteran",
    description: "Active on Vinci AI for 90+ days.",
    icon: "Award",
    tier: "gold",
    xp: 200,
    checkUnlocked: (s) => s.daysActive >= 90,
    progressOf: (s) => Math.min(100, Math.round((s.daysActive / 90) * 100)),
  },
];
