import type { LegacyReportData } from "@/types/legacy";

export const demoLegacy: LegacyReportData = {
  cover: {
    userDisplayName: "Alex Morgan",
    avatarUrl: null,
    dnaScore: 92,
    primaryType: "INVESTOR",
    secondaryType: "HISTORIAN",
    collectionValue: 84200,
    generatedAt: new Date().toISOString(),
  },
  executiveSummary:
    "You began your journey as an Explorer driven by curiosity. Over time, your collection became increasingly focused on authenticated vintage collectibles. Through consistent research and disciplined purchasing, you have evolved into an Investor-Historian with exceptional portfolio balance and long-term strategy.",
  dnaEvolution: {
    scoreTimeline: [
      { date: "Jan", score: 41 },
      { date: "Apr", score: 58 },
      { date: "Jul", score: 71 },
      { date: "Oct", score: 84 },
      { date: "Today", score: 92 },
    ],
    explanations: [
      "Crossed into the Investor archetype after extending average hold periods.",
      "Diversification improved 21% after adding memorabilia and sneakers.",
      "Authentication rate crossed 85% as grading became standard practice.",
    ],
  },
  collectionOverview: {
    totalCollectibles: 148,
    categoryBreakdown: [
      { category: "Trading Cards", count: 52 },
      { category: "Sports Cards", count: 34 },
      { category: "Watches", count: 12 },
      { category: "Comics", count: 18 },
      { category: "Coins", count: 14 },
      { category: "Sneakers", count: 9 },
      { category: "Memorabilia", count: 9 },
    ],
    mostValuableItem: "Patek Philippe Calatrava 3919",
    rarestItem: "1986 Fleer Michael Jordan Rookie",
    newestAddition: "1998 Pokémon Base Set — Venusaur (Holo)",
    oldestItem: "1916 Standing Liberty Quarter",
    averageRarity: 78,
    authenticationPct: 89,
    portfolioValue: 84200,
    growthChart: [
      { date: "Jan", value: 8000 },
      { date: "Apr", value: 35600 },
      { date: "Jul", value: 56300 },
      { date: "Oct", value: 73500 },
      { date: "Today", value: 84200 },
    ],
  },
  achievements: [
    { icon: "BookOpen", title: "Research Master", description: "Completed 50+ AI analyses.", unlockedAt: "12 days ago", explanation: "Your analysis volume put you in the top tier of active collectors." },
    { icon: "ShieldCheck", title: "Authentication Expert", description: "Maintained 85%+ authentication rate.", unlockedAt: "25 days ago", explanation: "Consistent grading habits across high-value purchases." },
    { icon: "Wallet", title: "Portfolio Builder", description: "Reached $50,000 in estimated value.", unlockedAt: "60 days ago", explanation: "Crossed this milestone after the Patek Philippe acquisition." },
  ],
  knowledgeGrowth: [
    { metric: "Research", before: 35, after: 96, explanation: "Driven by 96 cumulative AI analyses." },
    { metric: "Market Awareness", before: 30, after: 82, explanation: "Frequent market insight reviews and search activity." },
    { metric: "Authentication Knowledge", before: 20, after: 89, explanation: "Authentication rate climbed steadily quarter over quarter." },
  ],
  personality: {
    primaryType: "INVESTOR",
    secondaryType: "HISTORIAN",
    topTraits: ["Research Driven", "Long-Term Thinking", "Quality Focused"],
    riskProfile: "BALANCED",
    collectionStyle: "Quality over quantity, vintage-weighted",
    decisionMakingStyle: "Research-first, patient",
    buyingBehavior: "Deliberate, authenticated purchases",
    sellingBehavior: "Rarely sells — high hold-through rate",
    preferredCategories: ["Trading Cards", "Watches"],
    preferredBrands: ["Rolex", "PSA-graded"],
  },
  collectionHealth: {
    score: 89,
    strengths: ["High authentication rate", "Strong diversification growth", "Disciplined budget"],
    weaknesses: ["Light documentation on 3 high-value items", "Slight overexposure to trading cards"],
  },
  aiInsights: [
    "You consistently purchase authenticated collectibles.",
    "You rarely make impulsive purchases.",
    "Your research habits improved 35% over the past year.",
    "Vintage items now represent most of your portfolio.",
  ],
  funStats: [
    { label: "Most searched category", value: "Vintage Pokémon" },
    { label: "Images analyzed", value: "96" },
    { label: "AI conversations", value: "61" },
    { label: "Favorite grading company", value: "PSA" },
  ],
  goals: [
    { title: "Complete Vintage Pokémon Base Set", status: "IN_PROGRESS", progress: 81 },
    { title: "Reach 90%+ authentication rate", status: "COMPLETED", progress: 100 },
  ],
  predictions: [
    {
      text: "Likely to expand into vintage comics next quarter based on recent research activity.",
      disclaimer: "This is an AI-generated prediction based on patterns in your activity. It is speculative and not financial advice.",
    },
  ],
  personalizedLetter:
    "Dear Collector,\n\nOver the past year I have watched your curiosity transform into expertise. You began by exploring many different collectibles, but gradually discovered a passion for authenticated vintage pieces. Every conversation, every uploaded image, and every carefully researched purchase helped shape your Collector DNA. You have become more patient, more strategic, and more confident. The next chapter of your journey is just beginning, and I look forward to continuing it with you.\n\n— Vinci AI",
  nextSteps: [
    { recommendation: "Expand into vintage comics.", reason: "Early market momentum and a gap in your category mix." },
    { recommendation: "Document provenance for your rarest collectibles.", reason: "Improves both insurance readiness and resale value." },
  ],
  legacyBadge: {
    title: "Investor Plus",
    level: 3,
    quote: "Quality over quantity, always.",
  },
};
