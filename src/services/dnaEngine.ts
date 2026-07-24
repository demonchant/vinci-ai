import { prisma } from "@/lib/prisma";
import { openai, AI_MODELS, AI_PREDICTION_DISCLAIMER } from "@/lib/openai";
import { getMemoryProfile } from "./memoryService";
import { getRecentActivity, countActivityByType } from "./activityLogService";
import type { CollectorDNA, CollectorArchetype, RiskProfile } from "@/types/dna";

/**
All scores below are computed from real rows (collectibles, memory facts,
activity logs) — there is no mocked/sample data. A brand-new account will
legitimately score low/"Explorer" until it has real activity; that's
correct behavior, not a placeholder.
*/
interface RawSignals {
  collectibleCount: number;
  categories: Record<string, number>;
  authenticatedPct: number;
  avgPurchasePrice: number;
  totalValue: number;
  soldCount: number;
  wishlistCount: number;
  chatCount: number;
  imageAnalysisCount: number;
  searchCount: number;
  daysActive: number;
  memoryFactCount: number;
  pinnedHighConfidenceFacts: number;
}

async function gatherRawSignals(userId: string): Promise<RawSignals> {
  const [collectibles, memoryProfile, activity] = await Promise.all([
    prisma.collectible.findMany({ where: { userId } }),
    getMemoryProfile(userId),
    getRecentActivity(userId, 500),
  ]);

  const facts = memoryProfile.facts;
  const categories: Record<string, number> = {};
  let totalValue = 0;
  let purchaseSum = 0;
  let purchaseCount = 0;
  let authCount = 0;

  for (const c of collectibles) {
    categories[c.category] = (categories[c.category] ?? 0) + 1;
    const val = Number(c.estimatedValue ?? c.purchasePrice ?? 0);
    totalValue += val;
    if (c.purchasePrice) {
      purchaseSum += Number(c.purchasePrice);
      purchaseCount += 1;
    }
    if (c.isAuthenticated) authCount += 1;
  }

  const daysActive =
    activity.length > 0
      ? Math.max(
          1,
          Math.ceil(
            (Date.now() - new Date(activity[activity.length - 1]!.createdAt).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        )
      : 0;

  return {
    collectibleCount: collectibles.length,
    categories,
    authenticatedPct: collectibles.length ? Math.round((authCount / collectibles.length) * 100) : 0,
    avgPurchasePrice: purchaseCount ? purchaseSum / purchaseCount : 0,
    totalValue,
    soldCount: collectibles.filter((c) => c.status === "SOLD").length,
    wishlistCount: collectibles.filter((c) => c.status === "WISHLIST").length,
    chatCount: await countActivityByType(userId, "CHAT_MESSAGE"),
    imageAnalysisCount: await countActivityByType(userId, "IMAGE_ANALYZED"),
    searchCount: await countActivityByType(userId, "SEARCH_PERFORMED"),
    daysActive,
    memoryFactCount: facts.length,
    pinnedHighConfidenceFacts: facts.filter((f) => f.confidence >= 70).length,
  };
}

function diversificationScore(categories: Record<string, number>, total: number): number {
  if (total === 0) return 0;
  const counts = Object.values(categories);
  const entropy = -counts.reduce((sum, c) => {
    const p = c / total;
    return sum + p * Math.log2(p);
  }, 0);
  const maxEntropy = Math.log2(Math.max(counts.length, 1)) || 1;
  return Math.round((entropy / maxEntropy) * 100);
}

function clamp(n: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(n)));
}

function deriveArchetype(
  s: RawSignals,
  diversification: number
): { primary: CollectorArchetype; secondary: CollectorArchetype } {
  const scores: Record<CollectorArchetype, number> = {
    INVESTOR: s.avgPurchasePrice > 200 ? 70 : 30,
    HISTORIAN: s.imageAnalysisCount > 10 ? 60 : 20,
    COMPLETIONIST: s.wishlistCount > 5 ? 55 : 15,
    CURATOR: s.authenticatedPct > 70 ? 65 : 20,
    FLIPPER: s.soldCount > 3 ? 75 : 10,
    EXPLORER: diversification > 70 ? 80 : 25,
    TREND_HUNTER: s.searchCount > 20 ? 60 : 15,
    MINIMALIST: s.collectibleCount > 0 && s.collectibleCount < 10 ? 50 : 10,
    LUXURY_COLLECTOR: s.avgPurchasePrice > 1000 ? 80 : 5,
    COMMUNITY_COLLECTOR: s.chatCount > 30 ? 50 : 10,
    PRESERVATIONIST: s.authenticatedPct > 85 ? 60 : 10,
    COMPETITIVE_COLLECTOR: s.collectibleCount > 50 ? 55 : 10,
  };

  const ranked = (Object.entries(scores) as [CollectorArchetype, number][]).sort(
    (a, b) => b[1] - a[1]
  );
  return { primary: ranked[0]![0], secondary: ranked[1]![0] };
}

function deriveRiskProfile(s: RawSignals): RiskProfile {
  if (s.collectibleCount > 0 && s.soldCount > s.collectibleCount * 0.3) return "AGGRESSIVE";
  if (s.avgPurchasePrice > 500 && s.soldCount === 0) return "CONSERVATIVE";
  return "BALANCED";
}

interface DNANarrative {
  summary: string;
  insights: { text: string; basedOn: string[] }[];
  funFacts: string[];
  predictions: { text: string; confidence: number }[];
  diversificationSuggestions: string[];
  compass: { current: string; projected: string; explanation: string };
  coach: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    recommendations: string[];
    weekOf: string;
  };
}

/**
Computes the full Collector DNA. Numeric scores are 100% deterministic
from real data. The natural-language summary/insights/predictions are
generated by an LLM call that is given ONLY the computed numbers as
context, so it explains real signals rather than inventing facts.
*/
export async function computeCollectorDNA(userId: string): Promise<CollectorDNA> {
  const signals = await gatherRawSignals(userId);
  const diversification = diversificationScore(signals.categories, signals.collectibleCount);
  const { primary, secondary } = deriveArchetype(signals, diversification);
  const riskProfile = deriveRiskProfile(signals);

  const knowledgeScore = clamp(signals.imageAnalysisCount * 3 + signals.chatCount * 1.5);
  const researchScore = clamp(signals.searchCount * 4 + signals.chatCount);
  const patienceScore = clamp(100 - signals.soldCount * 5);
  const marketAwareness = clamp(signals.searchCount * 2 + signals.imageAnalysisCount * 2);
  const authentication = signals.authenticatedPct;
  const budgetDiscipline = clamp(100 - Math.min(signals.avgPurchasePrice / 50, 60));
  const communityEngagement = clamp(signals.chatCount * 1.2);

  const dnaScore = clamp(
    diversification * 0.2 +
      knowledgeScore * 0.15 +
      researchScore * 0.15 +
      patienceScore * 0.1 +
      authentication * 0.15 +
      budgetDiscipline * 0.1 +
      marketAwareness * 0.15
  );

  const wheel = [
    { axis: "Knowledge" as const, score: knowledgeScore },
    { axis: "Patience" as const, score: patienceScore },
    { axis: "Risk" as const, score: clamp(100 - patienceScore) },
    { axis: "Diversification" as const, score: diversification },
    { axis: "Market Awareness" as const, score: marketAwareness },
    { axis: "Authentication" as const, score: authentication },
    { axis: "Research" as const, score: researchScore },
    { axis: "Collection Quality" as const, score: clamp((authentication + diversification) / 2) },
    { axis: "Budget Discipline" as const, score: budgetDiscipline },
    { axis: "Community Engagement" as const, score: communityEngagement },
  ];

  const traits = [
    { name: "Research Driven", score: researchScore },
    { name: "Patient Collector", score: patienceScore },
    { name: "Quality Focused", score: authentication },
    { name: "Diversified Explorer", score: diversification },
    { name: "Risk Appetite", score: clamp(100 - patienceScore) },
  ].map((t) => ({ ...t, explanation: explainTrait(t.name, signals) }));

  const narrative = await generateDNANarrative({
    primary,
    secondary,
    dnaScore,
    diversification,
    riskProfile,
    signals,
  });

  return {
    dnaScore,
    primaryType: primary,
    secondaryType: secondary,
    projectedArchetype: (narrative.compass?.projected as CollectorArchetype) ?? primary, // ✅ Added
    summary: narrative.summary,
    traits,
    wheel,
    riskProfile,
    diversificationScore: diversification,
    diversificationSuggestions: narrative.diversificationSuggestions,
    collectionHealthScore: clamp((authentication + diversification + budgetDiscipline) / 3),
    collectionHealthFactors: [
      {
        factor: "Authentication",
        score: authentication,
        note: `${signals.authenticatedPct}% of items authenticated`,
      },
      {
        factor: "Diversification",
        score: diversification,
        note: `${Object.keys(signals.categories).length} categories represented`,
      },
      {
        factor: "Budget Discipline",
        score: budgetDiscipline,
        note: `Average purchase $${signals.avgPurchasePrice.toFixed(0)}`,
      },
    ],
    achievements: [],
    insights: narrative.insights,
    funFacts: narrative.funFacts,
    predictions: narrative.predictions.map((p) => ({ ...p, disclaimer: AI_PREDICTION_DISCLAIMER })),
    compass: narrative.compass as CollectorDNA["compass"],
    coach: narrative.coach,
    computedAt: new Date().toISOString(),
  };
}

function explainTrait(name: string, s: RawSignals): string {
  switch (name) {
    case "Research Driven":
      return `Based on ${s.searchCount} searches and ${s.chatCount} AI conversations.`;
    case "Patient Collector":
      return `Based on holding items rather than reselling — ${s.soldCount} sold of ${s.collectibleCount} total.`;
    case "Quality Focused":
      return `${s.authenticatedPct}% of your collection is authenticated.`;
    case "Diversified Explorer":
      return `Spread across ${Object.keys(s.categories).length} categories.`;
    default:
      return "Derived from your recent activity.";
  }
}

async function generateDNANarrative(input: {
  primary: CollectorArchetype;
  secondary: CollectorArchetype;
  dnaScore: number;
  diversification: number;
  riskProfile: RiskProfile;
  signals: RawSignals;
}): Promise<DNANarrative> {
  const completion = await openai.chat.completions.create({
    model: AI_MODELS.chat,
    temperature: 0.6,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You write the narrative layer of a collector's "Collector DNA" profile. You are given REAL computed metrics — never invent numbers not provided. Ground every sentence in the given data. Respond as JSON: { "summary": string (2-3 sentences), "insights": [{ "text": string, "basedOn": string[] }] (3-5 items), "funFacts": string[] (2-4 items), "predictions": [{ "text": string, "confidence": number }] (2-3 items, speculative and clearly framed as such), "diversificationSuggestions": string[] (1-3 items), "compass": { "current": string, "projected": string, "explanation": string }, "coach": { "strengths": string[], "weaknesses": string[], "opportunities": string[], "recommendations": string[], "weekOf": string } } Use these archetypes for "current"/"projected": INVESTOR, HISTORIAN, COMPLETIONIST, CURATOR, FLIPPER, EXPLORER, TREND_HUNTER, MINIMALIST, LUXURY_COLLECTOR, COMMUNITY_COLLECTOR, PRESERVATIONIST, COMPETITIVE_COLLECTOR. If collectibleCount is 0, acknowledge this is a fresh profile and keep claims minimal/encouraging rather than fabricating history.`,
      },
      { role: "user", content: JSON.stringify(input) },
    ],
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) {
    return {
      summary:
        "Your Collector DNA is just getting started — add a few collectibles to begin building your profile.",
      insights: [],
      funFacts: [],
      predictions: [],
      diversificationSuggestions: [],
      compass: { current: input.primary, projected: input.primary, explanation: "Not enough activity yet." },
      coach: {
        strengths: [],
        weaknesses: [],
        opportunities: [],
        recommendations: [],
        weekOf: new Date().toISOString(),
      },
    };
  }

  return JSON.parse(raw) as DNANarrative;
}