import type { CollectorDNA } from "@/types/dna";

export const demoDNA: CollectorDNA = {
  dnaScore: 92,
  primaryType: "INVESTOR",
  secondaryType: "HISTORIAN",
  summary:
    "Your collection shows strong long-term investment discipline and a preference for historically significant collectibles. You hold rather than flip, and you authenticate before you buy.",
  traits: [
    { name: "Research Driven", score: 96, explanation: "Based on 96 AI analyses and consistent pre-purchase research." },
    { name: "Long-Term Thinking", score: 91, explanation: "Average hold period exceeds 18 months across your collection." },
    { name: "Quality Focused", score: 88, explanation: "89% of your collection is authenticated." },
    { name: "Diversified Explorer", score: 68, explanation: "Spread across 7 categories, weighted toward trading cards and watches." },
    { name: "Risk Appetite", score: 28, explanation: "Very low sell-through rate — you rarely liquidate." },
  ],
  wheel: [
    { axis: "Knowledge", score: 94 },
    { axis: "Patience", score: 91 },
    { axis: "Risk", score: 28 },
    { axis: "Diversification", score: 68 },
    { axis: "Market Awareness", score: 82 },
    { axis: "Authentication", score: 89 },
    { axis: "Research", score: 96 },
    { axis: "Collection Quality", score: 90 },
    { axis: "Budget Discipline", score: 78 },
    { axis: "Community Engagement", score: 64 },
  ],
  riskProfile: "BALANCED",
  diversificationScore: 68,
  diversificationSuggestions: [
    "Consider adding vintage comics — currently your smallest category by value.",
    "Your sneaker exposure is concentrated in one era; spreading across decades could reduce risk.",
  ],
  collectionHealthScore: 89,
  collectionHealthFactors: [
    { factor: "Authentication", score: 89, note: "89% of items authenticated" },
    { factor: "Diversification", score: 68, note: "7 categories represented" },
    { factor: "Budget Discipline", score: 78, note: "Average purchase $3,460" },
  ],
  achievements: [],
  insights: [
    { text: "You consistently buy undervalued collectibles relative to comparable sales.", basedOn: ["purchase price vs. market", "category trends"] },
    { text: "Your collection has become 22% more diversified over the past 3 months.", basedOn: ["category distribution history"] },
    { text: "You rarely sell — your hold-through rate is in the top tier of comparable collectors.", basedOn: ["activity log"] },
  ],
  funFacts: [
    "62% of your purchases happen on weekends.",
    "Vintage Pokémon and watches make up over half your portfolio value.",
  ],
  predictions: [
    {
      text: "You are likely to expand into vintage comics within the next quarter, based on recent research activity.",
      confidence: 64,
      disclaimer: "This is an AI-generated prediction based on patterns in your activity. It is speculative and not financial advice.",
    },
    {
      text: "Your collection could reach $100,000 in estimated value within six months at current acquisition pace.",
      confidence: 58,
      disclaimer: "This is an AI-generated prediction based on patterns in your activity. It is speculative and not financial advice.",
    },
  ],
  compass: {
    current: "INVESTOR",
    projected: "CURATOR",
    explanation:
      "Your increasing focus on documentation and authentication over the past two months suggests a shift from pure acquisition toward long-term stewardship.",
  },
  coach: {
    strengths: ["Excellent diversification growth", "High authentication rate", "Disciplined, research-backed buying"],
    weaknesses: ["Light documentation on 3 high-value items", "Slightly overexposed to trading cards"],
    opportunities: ["Vintage comics market is trending up 12% this quarter", "Two wishlist items recently dropped in price"],
    recommendations: [
      "Document provenance for your Apollo 11 patch and both watches.",
      "Consider adding 1-2 vintage comics to round out your category mix.",
    ],
    weekOf: new Date().toISOString(),
  },
  computedAt: new Date().toISOString(),
};
