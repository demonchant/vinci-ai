import { prisma } from "@/lib/prisma";
import { getMemoryProfile } from "./memoryService";

export interface TraitExplanation {
  trait: string;
  score: number;
  previousScore: number | null;
  trend: "up" | "down" | "stable";
  confidence: number;
  explanation: string;
  topMemories: string[];
  topCollectibles: string[];
  evidenceCount: number;
}

export async function explainAllTraits(userId: string): Promise<TraitExplanation[]> {
  const [snapshots, { facts }, collectibles] = await Promise.all([
    prisma.dNASnapshot.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 2,
    }),
    getMemoryProfile(userId),
    prisma.collectible.findMany({
      where: { userId },
      orderBy: { estimatedValue: "desc" },
      take: 5,
      select: { title: true, category: true },
    }),
  ]);

  // The Prisma schema flattened the old `scores` JSON field into individual columns.
  // We dynamically extract all numeric fields to reconstruct the trait scores object.
  const current = snapshots[0]
    ? (Object.fromEntries(
        Object.entries(snapshots[0]).filter(([, value]) => typeof value === "number")
      ) as Record<string, number>)
    : {};

  const previous = snapshots[1]
    ? (Object.fromEntries(
        Object.entries(snapshots[1]).filter(([, value]) => typeof value === "number")
      ) as Record<string, number>)
    : {};

  const traits = Object.entries(current).filter(([k]) => k !== "dnaScore" && k !== "primaryType");

  return traits.map(([trait, score]) => {
    const prevScore = previous[trait] ?? null;
    const trend: TraitExplanation["trend"] =
      prevScore === null ? "stable" : score > prevScore ? "up" : score < prevScore ? "down" : "stable";

    const relatedMemories = facts.filter((f) => f.confidence > 60).slice(0, 3).map((f) => f.label);

    return {
      trait,
      score: Math.round(score),
      previousScore: prevScore !== null ? Math.round(prevScore) : null,
      trend,
      confidence: Math.min(95, 60 + facts.length * 3),
      explanation: buildExplanation(trait, score, prevScore, facts.length, collectibles.length),
      topMemories: relatedMemories,
      topCollectibles: collectibles.slice(0, 2).map((c) => c.title),
      evidenceCount: facts.length + collectibles.length,
    };
  });
}

function buildExplanation(
  trait: string,
  score: number,
  prevScore: number | null,
  memoryCount: number,
  collectibleCount: number
): string {
  const label = formatTrait(trait);
  const base = `Your ${label} score is ${Math.round(score)}`;
  if (prevScore === null) {
    return `${base}, based on ${memoryCount} memory facts and ${collectibleCount} collectibles.`;
  }
  const delta = Math.round(score - prevScore);
  const direction = delta > 0 ? "increased" : delta < 0 ? "decreased" : "held steady";
  return `${base} — ${direction} by ${Math.abs(delta)} points since your last snapshot.${
    memoryCount > 0 ? ` Informed by ${memoryCount} memory facts.` : ""
  }`.trim();
}

function formatTrait(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}