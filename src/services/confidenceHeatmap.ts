import type { Collectible } from "@/types/collectible";
import type { CollectorMemoryFact } from "@/types/memory";
import type { CollectorDNA } from "@/types/dna";
import type { CollectibleCategory } from "@/types/common";
import { COLLECTIBLE_CATEGORY_LABELS } from "@/types/common";
import type {
  CategoryConfidence,
  ConfidenceHeatmapData,
  ResearchRecommendation,
  // ✅ FIX: Removed unused 'ResearchActionType' import
} from "@/types/heatmap";

export function computeConfidenceHeatmap(
  collectibles: Collectible[],
  memories: CollectorMemoryFact[],
  dna: CollectorDNA
): ConfidenceHeatmapData {
  const owned = collectibles.filter((c) => c.status === "OWNED" || c.status === "PURCHASED");
  const categories = Object.keys(COLLECTIBLE_CATEGORY_LABELS) as CollectibleCategory[];

  const categoryData: CategoryConfidence[] = categories.map((cat) =>
    computeCategoryConfidence(cat, owned, memories, dna)
  );

  const withItems = categoryData.filter((c) => c.evidenceCount > 0);
  const overallConfidence = withItems.length > 0
    ? withItems.reduce((s, c) => s + c.confidence, 0) / withItems.length
    : 0;

  const strongest = withItems.sort((a, b) => b.confidence - a.confidence)[0]?.category ?? null;
  const weakest = withItems.length > 1
    ? withItems.sort((a, b) => a.confidence - b.confidence)[0]?.category ?? null
    : null;

  // ✅ FIX: Removed unused 'memories' argument from the function call
  const recommendations = generateResearchRecommendations(categoryData, owned);

  return {
    categories: categoryData,
    overallConfidence: Math.round(overallConfidence * 100) / 100,
    strongestCategory: strongest,
    weakestCategory: weakest,
    researchRecommendations: recommendations,
    computedAt: new Date().toISOString(),
  };
}

function computeCategoryConfidence(
  category: CollectibleCategory,
  owned: Collectible[],
  memories: CollectorMemoryFact[],
  dna: CollectorDNA
): CategoryConfidence {
  const items = owned.filter((c) => c.category === category);
  const relatedMemories = memories.filter(
    (m) => m.key.includes(category.toLowerCase()) || m.label.toLowerCase().includes(category.toLowerCase())
  );

  const itemCount = items.length;
  const memoryCount = relatedMemories.length;
  const authenticated = items.filter((c) => c.isAuthenticated).length;
  const graded = items.filter((c) => c.grade).length;
  const withNotes = items.filter((c) => c.notes && c.notes.length > 10).length;
  const withImages = items.filter((c) => c.images.length > 0).length;

  const knowledge = computeKnowledge(itemCount, memoryCount, withNotes, graded);
  const evidenceCount = itemCount + memoryCount;
  const coverage = computeCoverage(itemCount, authenticated, graded, withImages, withNotes);
  const freshness = computeFreshness(items, relatedMemories);

  const confidence = computeConfidenceScore(knowledge, coverage, freshness, evidenceCount);

  const missingAreas = identifyMissingAreas(items, relatedMemories);
  const suggestedResearch = generateCategorySuggestions(category, items, missingAreas);

  const dnaWheel = dna.wheel ?? [];
  const dnaContribution = dnaWheel.length > 0
    ? dnaWheel.reduce((s, w) => s + w.score, 0) / dnaWheel.length / 100 * (itemCount / Math.max(1, owned.length))
    : 0;

  return {
    category,
    label: COLLECTIBLE_CATEGORY_LABELS[category],
    knowledge,
    evidenceCount,
    confidence,
    freshness,
    coverage,
    missingAreas,
    supportingMemories: relatedMemories.map((m) => m.key).slice(0, 5),
    relatedConversations: 0,
    dnaContribution: Math.round(dnaContribution * 100) / 100,
    goals: [],
    suggestedResearch,
  };
}

function computeKnowledge(itemCount: number, memoryCount: number, withNotes: number, graded: number): number {
  if (itemCount === 0) return 0;
  const itemWeight = Math.min(1, itemCount / 10) * 0.3;
  const memWeight = Math.min(1, memoryCount / 5) * 0.25;
  const notesWeight = (withNotes / itemCount) * 0.25;
  const gradeWeight = (graded / itemCount) * 0.2;
  return Math.min(1, itemWeight + memWeight + notesWeight + gradeWeight);
}

function computeCoverage(itemCount: number, authenticated: number, graded: number, withImages: number, withNotes: number): number {
  if (itemCount === 0) return 0;
  const authRate = authenticated / itemCount;
  const gradeRate = graded / itemCount;
  const imageRate = withImages / itemCount;
  const notesRate = withNotes / itemCount;
  return (authRate * 0.3 + gradeRate * 0.2 + imageRate * 0.25 + notesRate * 0.25);
}

function computeFreshness(items: Collectible[], memories: CollectorMemoryFact[]): number {
  const now = Date.now();
  const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;

  const recentItems = items.filter((c) => now - new Date(c.updatedAt ?? c.createdAt).getTime() < thirtyDaysMs).length;
  const recentMems = memories.filter((m) => now - new Date(m.updatedAt ?? m.learnedAt).getTime() < thirtyDaysMs).length;

  const total = items.length + memories.length;
  if (total === 0) return 0;
  return (recentItems + recentMems) / total;
}

function computeConfidenceScore(knowledge: number, coverage: number, freshness: number, evidenceCount: number): number {
  if (evidenceCount === 0) return 0;
  const evidenceWeight = Math.min(1, evidenceCount / 15);
  const raw = knowledge * 0.35 + coverage * 0.3 + freshness * 0.15 + evidenceWeight * 0.2;
  return Math.round(Math.min(1, raw) * 100) / 100;
}

function identifyMissingAreas(items: Collectible[], memories: CollectorMemoryFact[]): string[] {
  const missing: string[] = [];
  if (items.length === 0) return ["No items in this category"];

  const unauthed = items.filter((c) => !c.isAuthenticated).length;
  if (unauthed > items.length * 0.5) missing.push("Most items lack authentication");

  const noImages = items.filter((c) => c.images.length === 0).length;
  if (noImages > items.length * 0.3) missing.push("Missing images for visual analysis");

  const noNotes = items.filter((c) => !c.notes || c.notes.length < 10).length;
  if (noNotes > items.length * 0.5) missing.push("Incomplete documentation/notes");

  const noGrade = items.filter((c) => !c.grade).length;
  if (noGrade === items.length && items.length > 2) missing.push("No graded items");

  if (memories.length === 0) missing.push("No memories related to this category");

  return missing;
}

function generateCategorySuggestions(category: CollectibleCategory, items: Collectible[], missingAreas: string[]): string[] {
  const suggestions: string[] = [];

  if (missingAreas.includes("Most items lack authentication")) {
    suggestions.push(`Authenticate your ${COLLECTIBLE_CATEGORY_LABELS[category]} items to improve confidence.`);
  }
  if (missingAreas.includes("Missing images for visual analysis")) {
    suggestions.push("Upload photos to enable visual condition tracking.");
  }
  if (missingAreas.includes("Incomplete documentation/notes")) {
    suggestions.push("Add detailed notes about provenance, condition, and history.");
  }
  if (items.length > 0 && items.length < 3) {
    suggestions.push(`Expand your ${COLLECTIBLE_CATEGORY_LABELS[category]} collection for deeper insights.`);
  }

  return suggestions.slice(0, 3);
}

// ✅ FIX: Removed unused 'memories' parameter from the function signature
function generateResearchRecommendations(
  categoryData: CategoryConfidence[],
  owned: Collectible[]
): ResearchRecommendation[] {
  const recommendations: ResearchRecommendation[] = [];
  let id = 0;
  const mkId = () => `rr-${++id}`;

  const weakCategories = categoryData
    .filter((c) => c.evidenceCount > 0 && c.confidence < 0.4)
    .sort((a, b) => a.confidence - b.confidence);

  for (const weak of weakCategories.slice(0, 2)) {
    recommendations.push({
      id: mkId(),
      action: "read_more",
      title: `Research ${weak.label}`,
      explanation: `Your knowledge of ${weak.label} is limited (${Math.round(weak.confidence * 100)}% confidence). Research market trends and pricing for this category.`,
      category: weak.category,
      priority: "high",
      estimatedImpact: [{ trait: "Knowledge", improvement: 15 }],
      confidence: 0.8,
    });
  }

  const unauthed = owned.filter((c) => !c.isAuthenticated && (c.estimatedValue ?? 0) > 200);
  if (unauthed.length > 0) {
    recommendations.push({
      id: mkId(),
      action: "authenticate",
      title: "Authenticate High-Value Items",
      explanation: `${unauthed.length} item(s) worth over $200 lack authentication. This is a confidence and risk factor.`,
      category: unauthed[0]!.category as CollectibleCategory,
      priority: "high",
      estimatedImpact: [{ trait: "Trust", improvement: 20 }, { trait: "Risk", improvement: 10 }],
      confidence: 0.9,
    });
  }

  const noImages = owned.filter((c) => c.images.length === 0);
  if (noImages.length > owned.length * 0.3) {
    recommendations.push({
      id: mkId(),
      action: "upload_images",
      title: "Upload Item Photos",
      explanation: `${noImages.length} items lack images. Photos enable visual analysis and condition tracking.`,
      category: null,
      priority: "medium",
      estimatedImpact: [{ trait: "Coverage", improvement: 12 }],
      confidence: 0.85,
    });
  }

  const activeCategories = new Set(owned.map((c) => c.category));
  if (activeCategories.size < 3 && owned.length > 5) {
    recommendations.push({
      id: mkId(),
      action: "diversify",
      title: "Explore New Categories",
      explanation: `You focus on ${activeCategories.size} category(ies). Diversification can reduce risk and expand knowledge.`,
      category: null,
      priority: "low",
      estimatedImpact: [{ trait: "Diversification", improvement: 15 }],
      confidence: 0.7,
    });
  }

  return recommendations.sort((a, b) => {
    const prio = { high: 0, medium: 1, low: 2 };
    return prio[a.priority] - prio[b.priority];
  });
}