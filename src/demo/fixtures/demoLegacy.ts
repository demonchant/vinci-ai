import type { LegacyReportData } from "@/types/legacy";

export const demoLegacy: LegacyReportData = {
  cover: {
    collectorName: "Alex Morgan",
    collectorSince: "2021",
    level: 9,
    primaryArchetype: "INVESTOR",
    dnaScore: 92,
    collectionSize: 148,
    portfolioValue: 84200,
    generatedAt: new Date().toISOString(),
  },
  executiveSummary:
    "You began your journey as an Explorer driven by curiosity. Over time, your collection became increasingly focused on authenticated vintage collectibles. Through consistent research and disciplined purchasing, you have evolved into an Investor-Historian with exceptional portfolio balance and long-term strategy.",
  story: [
    {
      heading: "The Explorer Phase",
      body: "You began your journey driven by curiosity, exploring many different collectibles across multiple categories.",
      evidence: {
        allowedFacts: ["Started collecting in 2021", "Explored 7+ categories in first year"],
        forbiddenAssumptions: ["Do not assume early purchases were strategic"],
        dataSourceIds: ["demo-chat-1", "demo-activity-early"],
      },
    },
    {
      heading: "The Investor Shift",
      body: "Crossed into the Investor archetype after extending average hold periods and focusing on authenticated pieces.",
      evidence: {
        allowedFacts: ["Average hold period exceeded 18 months", "Authentication rate crossed 85%"],
        forbiddenAssumptions: ["Do not assume all purchases were graded"],
        dataSourceIds: ["demo-chat-2", "demo-dna-snapshot-2"],
      },
    },
    {
      heading: "The Historian Emerges",
      body: "Authentication rate crossed 85% as grading became standard practice. Vintage items now represent most of your portfolio.",
      evidence: {
        allowedFacts: ["89% authentication rate", "Vintage items represent 72% of portfolio value"],
        forbiddenAssumptions: ["Do not assume all vintage items are high-value"],
        dataSourceIds: ["demo-chat-3", "demo-dna-snapshot-3"],
      },
    },
  ],
  dnaEvolutionSummary:
    "Your DNA score climbed from 41 to 92 over the past year. Diversification improved 21% after adding memorabilia and sneakers.",
  collectionHighlights: [
    {
      label: "Most Valuable",
      collectibleId: null,
      collectibleTitle: "Patek Philippe Calatrava 3919",
      value: "$32,000",
    },
    {
      label: "Rarest Item",
      collectibleId: null,
      collectibleTitle: "1986 Fleer Michael Jordan Rookie",
      value: "PSA 9",
    },
    {
      label: "Authentication Rate",
      collectibleId: null,
      collectibleTitle: "Collection-wide",
      value: "89%",
    },
  ],
  memoryHighlights: [
    {
      label: "Research",
      memoryLabel: "Preferred grading company",
      memoryValue: "PSA",
      confidence: 95,
    },
    {
      label: "Market Awareness",
      memoryLabel: "Favorite category",
      memoryValue: "Vintage Pokémon",
      confidence: 88,
    },
    {
      label: "Authentication Knowledge",
      memoryLabel: "Preferred grading",
      memoryValue: "PSA 9+",
      confidence: 92,
    },
  ],
  conversationHighlights: [
    {
      label: "Recent Insight",
      chatTitle: "Vintage Pokémon Market Analysis",
      chatId: "demo-chat-1",
      summary: "Discussed rising demand for Base Set holographics.",
    },
    {
      label: "Strategy Session",
      chatTitle: "Portfolio Diversification",
      chatId: "demo-chat-2",
      summary: "Explored adding vintage comics to balance the collection.",
    },
  ],
  achievements: [
    {
      key: "research-master",
      title: "Research Master",
      tier: "gold",
      xp: 500,
      unlockedAt: new Date().toISOString(),
      isUnlocked: true,
      progress: 100,
    },
    {
      key: "authentication-expert",
      title: "Authentication Expert",
      tier: "silver",
      xp: 250,
      unlockedAt: new Date().toISOString(),
      isUnlocked: true,
      progress: 100,
    },
    {
      key: "portfolio-builder",
      title: "Portfolio Builder",
      tier: "bronze",
      xp: 150,
      unlockedAt: new Date().toISOString(),
      isUnlocked: true,
      progress: 100,
    },
  ],
  goals: [
    {
      title: "Complete Vintage Pokémon Base Set",
      progress: 81,
      isCompleted: false,
      dnaContribution: "Improved Collector DNA through focused collecting.",
    },
    {
      title: "Reach 90% Authentication Rate",
      progress: 100,
      isCompleted: true,
      dnaContribution: "Significantly increased confidence score.",
    },
  ],
  portfolio: {
    totalItems: 148,
    totalValue: 84200,
    categoryDistribution: [
      { category: "Trading Cards", count: 52 },
      { category: "Sports Cards", count: 34 },
      { category: "Watches", count: 12 },
      { category: "Comics", count: 18 },
      { category: "Coins", count: 14 },
      { category: "Sneakers", count: 9 },
      { category: "Memorabilia", count: 9 },
    ],
    authenticationRatePct: 89,
    averageConfidence: 87,
    diversificationScore: 78,
  },
  legacyScore: {
    overall: 89,
    breakdown: [
      { label: "Authentication Discipline", score: 95, weight: 0.3 },
      { label: "Portfolio Diversification", score: 82, weight: 0.25 },
      { label: "Research Consistency", score: 91, weight: 0.25 },
      { label: "Long-Term Strategy", score: 88, weight: 0.2 },
    ],
    confidence: 92,
    explanation:
      "Alex has demonstrated exceptional discipline in authentication and research, with a well-diversified portfolio that shows strong long-term strategic thinking.",
  },
  aiLetter:
    "Dear Collector,\n\nOver the past year I have watched your curiosity transform into expertise. You began by exploring many different collectibles, but gradually discovered a passion for authenticated vintage pieces. Every conversation, every uploaded image, and every carefully researched purchase helped shape your Collector DNA. You have become more patient, more strategic, and more confident. The next chapter of your journey is just beginning, and I look forward to continuing it with you.\n\n— Vinci AI",
  nextChapter: [
    "Expand into vintage comics to balance category exposure.",
    "Document provenance for your rarest collectibles to improve insurance readiness.",
    "Consider adding one or two high-grade modern pieces to hedge against vintage market volatility.",
  ],
  provenanceHighlights: [
    {
      label: "Oldest Item",
      detail: "1916 Standing Liberty Quarter — acquired at auction in 2022.",
    },
    {
      label: "Newest Addition",
      detail: "1998 Pokémon Base Set — Venusaur (Holo) — purchased March 2024.",
    },
  ],
  marketNote:
    "Likely to expand into vintage comics next quarter based on recent research activity. This is an AI-generated prediction based on patterns in your activity. It is speculative and not financial advice.",
};