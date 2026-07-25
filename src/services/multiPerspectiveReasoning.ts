import type {
  ReasoningPerspective,
  PerspectiveResult,
  ReasoningSynthesis,
  // ✅ FIX: Removed unused 'PERSPECTIVE_CONFIG' type import
} from "@/types/reasoning";
import type { Collectible } from "@/types/collectible";
import type { CollectorMemoryFact } from "@/types/memory";
import type { CollectorDNA } from "@/types/dna";
import type { MarketInsight } from "@/types/market";
import { PERSPECTIVE_CONFIG as CONFIG } from "@/types/reasoning";

interface ReasoningContext {
  query: string;
  collectibles: Collectible[];
  memories: CollectorMemoryFact[];
  dna: CollectorDNA;
  marketInsights: MarketInsight[];
  targetCollectible?: Collectible;
}

export function runMultiPerspectiveReasoning(
  context: ReasoningContext,
  perspectives?: ReasoningPerspective[]
): ReasoningSynthesis {
  const active = perspectives ?? (Object.keys(CONFIG) as ReasoningPerspective[]);

  const results = active.map((p) => runPerspective(p, context));
  const synthesis = synthesize(context.query, results);

  return synthesis;
}

function runPerspective(
  perspective: ReasoningPerspective,
  context: ReasoningContext
): PerspectiveResult {
  const config = CONFIG[perspective];
  const base: Omit<PerspectiveResult, "observation" | "confidence" | "evidence" | "supportingFacts" | "limitations"> = {
    perspective,
    label: config.label,
    icon: config.icon,
  };

  switch (perspective) {
    case "vision_analyst":
      return analyzeVision(base, context);
    case "market_analyst":
      return analyzeMarket(base, context);
    case "collection_analyst":
      return analyzeCollection(base, context);
    case "historian":
      return analyzeHistory(base, context);
    case "research_advisor":
      return adviseResearch(base, context);
    case "risk_advisor":
      return adviseRisk(base, context);
    case "memory_validator":
      return validateMemory(base, context);
    case "dna_interpreter":
      return interpretDNA(base, context);
    case "goal_advisor":
      return adviseGoals(base, context);
  }
}

type BaseResult = Omit<PerspectiveResult, "observation" | "confidence" | "evidence" | "supportingFacts" | "limitations">;

function analyzeVision(base: BaseResult, ctx: ReasoningContext): PerspectiveResult {
  const target = ctx.targetCollectible;
  const imaged = ctx.collectibles.filter((c) => c.images.length > 0).length;

  return {
    ...base,
    observation: target
      ? `This ${target.category} item has ${target.images.length} image(s) on file. ${target.isAuthenticated ? "Authentication is confirmed." : "No authentication on record."}`
      : `${imaged} of ${ctx.collectibles.length} items have images uploaded for visual analysis.`,
    confidence: target ? (target.images.length > 0 ? 0.7 : 0.3) : 0.5,
    evidence: target
      ? [`${target.images.length} images available`, target.condition ? `Condition: ${target.condition}` : "Condition not assessed"]
      : [`${imaged}/${ctx.collectibles.length} items have images`],
    supportingFacts: target?.grade ? [`Graded: ${target.grade} by ${target.gradingCompany}`] : [],
    limitations: target?.images.length === 0 ? ["No images available for visual analysis."] : [],
  };
}

function analyzeMarket(base: BaseResult, ctx: ReasoningContext): PerspectiveResult {
  const target = ctx.targetCollectible;
  const relevantInsights = ctx.marketInsights.filter(
    (i) => !target || i.category === target.category
  );
  const bullish = relevantInsights.filter((i) => i.sentiment === "bullish").length;
  const bearish = relevantInsights.filter((i) => i.sentiment === "bearish").length;

  const sentiment = bullish > bearish ? "positive" : bearish > bullish ? "cautious" : "neutral";

  return {
    ...base,
    observation: target
      ? `Market sentiment for ${target.category} is ${sentiment}. ${relevantInsights.length} relevant insight(s) available.`
      : `Overall market: ${bullish} bullish signal(s), ${bearish} bearish signal(s) across tracked categories.`,
    confidence: relevantInsights.length > 0 ? Math.min(0.8, 0.3 + relevantInsights.length * 0.1) : 0.2,
    evidence: relevantInsights.slice(0, 3).map((i) => i.headline),
    supportingFacts: target?.estimatedValue ? [`Current estimated value: $${target.estimatedValue.toLocaleString()}`] : [],
    limitations: relevantInsights.length === 0 ? ["No market insights available for this category."] : [],
  };
}

function analyzeCollection(base: BaseResult, ctx: ReasoningContext): PerspectiveResult {
  const owned = ctx.collectibles.filter((c) => c.status === "OWNED" || c.status === "PURCHASED");
  const categories = new Set(owned.map((c) => c.category));
  const target = ctx.targetCollectible;

  const targetCatCount = target ? owned.filter((c) => c.category === target.category).length : 0;

  return {
    ...base,
    observation: target
      ? `You own ${targetCatCount} item(s) in ${target.category}. ${targetCatCount > 3 ? "This is already a strong category." : "This would expand your presence in this area."}`
      : `Collection spans ${categories.size} categories with ${owned.length} total items.`,
    confidence: 0.85,
    evidence: [
      `${owned.length} owned items across ${categories.size} categories`,
      ...(target ? [`${targetCatCount} existing items in ${target.category}`] : []),
    ],
    supportingFacts: [],
    limitations: [],
  };
}

function analyzeHistory(base: BaseResult, ctx: ReasoningContext): PerspectiveResult {
  const target = ctx.targetCollectible;
  const vintage = ctx.collectibles.filter((c) => c.year && c.year < 2000).length;

  return {
    ...base,
    observation: target?.year
      ? `This item dates to ${target.year}. ${target.year < 1970 ? "Significant historical provenance potential." : target.year < 2000 ? "Vintage era — established collector interest." : "Modern piece — historical significance still developing."}`
      : `${vintage} of ${ctx.collectibles.length} items are pre-2000 vintage.`,
    confidence: target?.year ? 0.75 : 0.6,
    evidence: target?.year ? [`Year: ${target.year}`] : [`${vintage} vintage items in collection`],
    supportingFacts: target?.notes ? [`Notes: ${target.notes}`] : [],
    limitations: !target?.year ? ["Year data unavailable — historical assessment limited."] : [],
  };
}

function adviseResearch(base: BaseResult, ctx: ReasoningContext): PerspectiveResult {
  const withNotes = ctx.collectibles.filter((c) => c.notes && c.notes.length > 10).length;
  const withGrades = ctx.collectibles.filter((c) => c.grade).length;
  const ratio = ctx.collectibles.length > 0 ? withNotes / ctx.collectibles.length : 0;

  return {
    ...base,
    observation: ratio > 0.6
      ? "Strong research habits — most items are well-documented."
      : ratio > 0.3
        ? "Moderate research coverage — some items could use more documentation."
        : "Research opportunity — many items lack detailed notes or grading.",
    confidence: 0.7,
    evidence: [
      `${withNotes}/${ctx.collectibles.length} items have notes`,
      `${withGrades}/${ctx.collectibles.length} items are graded`,
      `${ctx.memories.length} memory facts accumulated`,
    ],
    supportingFacts: [],
    limitations: [],
  };
}

function adviseRisk(base: BaseResult, ctx: ReasoningContext): PerspectiveResult {
  const owned = ctx.collectibles.filter((c) => c.status === "OWNED" || c.status === "PURCHASED");
  const unauthHighValue = owned.filter((c) => !c.isAuthenticated && (c.estimatedValue ?? 0) > 500);
  const categories = new Set(owned.map((c) => c.category)).size;
  const riskScore = ctx.dna.wheel?.find((w) => w.axis === "Risk")?.score ?? 50;

  return {
    ...base,
    observation: unauthHighValue.length > 0
      ? `${unauthHighValue.length} high-value item(s) lack authentication — this is a material risk.`
      : categories < 3
        ? "Low category diversification increases concentration risk."
        : "Risk profile appears manageable with current diversification.",
    confidence: 0.8,
    evidence: [
      `${unauthHighValue.length} unauthenticated items over $500`,
      `${categories} categories`,
      `DNA Risk score: ${riskScore}`,
    ],
    supportingFacts: [],
    limitations: [],
  };
}

function validateMemory(base: BaseResult, ctx: ReasoningContext): PerspectiveResult {
  const highConf = ctx.memories.filter((m) => m.confidence > 0.8).length;
  const lowConf = ctx.memories.filter((m) => m.confidence < 0.5).length;
  const verified = ctx.memories.filter((m) => m.isVerified).length;

  return {
    ...base,
    observation: lowConf > 0
      ? `${lowConf} memory fact(s) have low confidence and should be verified.`
      : ctx.memories.length === 0
        ? "No memory facts recorded yet — preferences are not well understood."
        : `${highConf} of ${ctx.memories.length} facts are high-confidence. Knowledge base is solid.`,
    confidence: ctx.memories.length > 0 ? 0.8 : 0.3,
    evidence: [
      `${ctx.memories.length} total facts`,
      `${highConf} high confidence`,
      `${verified} verified`,
    ],
    supportingFacts: ctx.memories.filter((m) => m.isPinned).map((m) => `${m.label}: ${m.value}`).slice(0, 3),
    limitations: lowConf > 0 ? [`${lowConf} low-confidence facts need verification`] : [],
  };
}

function interpretDNA(base: BaseResult, ctx: ReasoningContext): PerspectiveResult {
  const dna = ctx.dna;
  return {
    ...base,
    observation: `You are a ${dna.primaryType}${dna.secondaryType ? ` / ${dna.secondaryType}` : ""} with a DNA score of ${dna.dnaScore}. Risk profile: ${dna.riskProfile}.`,
    confidence: 0.85,
    evidence: [
      `DNA Score: ${dna.dnaScore}`,
      `Primary: ${dna.primaryType}`,
      `Risk: ${dna.riskProfile}`,
      `Diversification: ${dna.diversificationScore}`,
    ],
    supportingFacts: dna.insights?.slice(0, 2).map((i) => i.text) ?? [],
    limitations: dna.dnaScore < 20 ? ["Limited data — DNA profile is still forming."] : [],
  };
}

function adviseGoals(base: BaseResult, ctx: ReasoningContext): PerspectiveResult {
  const goalMems = ctx.memories.filter((m) => m.key === "collection_goals");

  return {
    ...base,
    observation: goalMems.length > 0
      ? `Active goals: ${goalMems.map((g) => g.value).join(", ")}. Consider how this decision aligns.`
      : "No explicit collection goals found. Setting goals would improve strategic recommendations.",
    confidence: goalMems.length > 0 ? 0.7 : 0.4,
    evidence: goalMems.map((g) => `Goal: ${g.value}`),
    supportingFacts: [],
    limitations: goalMems.length === 0 ? ["No goals recorded — recommendations are less targeted."] : [],
  };
}

function synthesize(query: string, perspectives: PerspectiveResult[]): ReasoningSynthesis {
  const avgConfidence = perspectives.reduce((s, p) => s + p.confidence, 0) / perspectives.length;

  // ✅ FIX: Removed unused 'allEvidence' variable
  const allLimitations = perspectives.flatMap((p) => p.limitations);

  const highConfidence = perspectives.filter((p) => p.confidence > 0.6);
  const lowConfidence = perspectives.filter((p) => p.confidence < 0.4);

  const agreements = highConfidence.length > perspectives.length / 2
    ? highConfidence.map((p) => p.observation)
    : [];

  const uncertainties = lowConfidence.map((p) => `${p.label}: ${p.limitations[0] ?? "Low confidence in assessment."}`);

  const consensusScore = Math.round(avgConfidence * 100);

  const recommendation = consensusScore > 70
    ? perspectives.sort((a, b) => b.confidence - a.confidence)[0]?.observation ?? "Proceed with moderate confidence."
    : "Gather more evidence before making a decision — several perspectives lack sufficient data.";

  return {
    id: `reasoning-${Date.now()}`,
    query,
    perspectives,
    consensusScore,
    areasOfAgreement: agreements.slice(0, 3),
    areasOfUncertainty: uncertainties.slice(0, 3),
    missingEvidence: allLimitations.slice(0, 5),
    finalRecommendation: recommendation,
    computedAt: new Date().toISOString(),
  };
}