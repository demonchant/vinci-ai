import { prisma } from "@/lib/prisma";

export interface DNAContributor {
  kind: "conversation" | "collectible" | "memory" | "analysis";
  id: string;
  label: string;
  dimension: string;
  impact: number;
}

export type DNAStabilityLabel =
  | "Stable"
  | "Growing"
  | "Rapidly Changing"
  | "Highly Specialized"
  | "Generalist";

export interface DNAStability {
  label: DNAStabilityLabel;
  score: number;
  explanation: string;
}

export async function rankDNAContributors(userId: string): Promise<DNAContributor[]> {
  const [chats, collectibles, memories, analyses] = await Promise.all([
    prisma.aIChat.findMany({ where: { userId }, orderBy: { updatedAt: "desc" }, take: 5 }),
    prisma.collectible.findMany({
      where: { userId },
      orderBy: { estimatedValue: "desc" },
      take: 5,
    }),
    prisma.collectorMemory.findMany({
      where: { userId, isArchived: false },
      orderBy: { confidence: "desc" },
      take: 5,
    }),
    prisma.imageAnalysis.findMany({
      where: { userId },
      orderBy: { confidenceScore: "desc" },
      take: 5,
    }),
  ]);

  const contributors: DNAContributor[] = [
    ...chats.map((c, i) => ({
      kind: "conversation" as const,
      id: c.id,
      label: c.title,
      dimension: "Research",
      impact: 100 - i * 12,
    })),
    ...collectibles.map((c, i) => ({
      kind: "collectible" as const,
      id: c.id,
      label: c.title,
      dimension: "Collection Quality",
      impact: 95 - i * 10,
    })),
    ...memories.map((m, i) => ({
      kind: "memory" as const,
      id: m.id,
      label: m.label,
      dimension: "Knowledge",
      impact: 90 - i * 10,
    })),
    ...analyses.map((a, i) => ({
      kind: "analysis" as const,
      id: a.id,
      label: a.identification,
      dimension: "Authentication Awareness",
      impact: 85 - i * 10,
    })),
  ];

  return contributors.sort((a, b) => b.impact - a.impact).slice(0, 12);
}

export async function computeDNAStability(userId: string): Promise<DNAStability> {
  const snapshots = await prisma.dNASnapshot.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 10,
    select: { scores: true },
  });

  if (snapshots.length < 2) {
    return {
      label: "Growing",
      score: 50,
      explanation:
        "Not enough snapshot history yet. Keep using Vinci AI to build your profile.",
    };
  }

  const scores = snapshots.map((s) => ((s.scores as any)?.dnaScore ?? 50) as number);
  const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
  const variance =
    scores.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / scores.length;
  const stdDev = Math.sqrt(variance);
  const stabilityScore = Math.max(0, Math.min(100, 100 - stdDev * 5));

  let label: DNAStabilityLabel;
  let explanation: string;

  if (stdDev < 2) {
    label = "Stable";
    explanation =
      "Your Collector DNA has remained consistent across recent activity, indicating well-established collecting habits.";
  } else if (stdDev < 6) {
    label = "Growing";
    explanation =
      "Your profile is evolving at a healthy pace — new experiences are gradually shaping your collector identity.";
  } else {
    label = "Rapidly Changing";
    explanation =
      "Your Collector DNA is in flux, likely because you've been exploring new categories or significantly changing your habits.";
  }

  return { label, score: Math.round(stabilityScore), explanation };
}
