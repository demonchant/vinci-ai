import { prisma } from "@/lib/prisma";

export interface DNAEvolutionEntry {
  id: string;
  createdAt: string;
  dnaScore: number;
  primaryType: string;
  trigger: string;
  delta: number | null;
  scores: Record<string, number>;
}

export async function getDNAEvolutionTimeline(
  userId: string,
  limit = 50
): Promise<DNAEvolutionEntry[]> {
  const snapshots = await prisma.dNASnapshot.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
    take: limit,
  });

  return snapshots.map((snap, i) => {
    const scores = {
      dnaScore: snap.dnaScore,
      knowledgeScore: snap.knowledgeScore,
      researchScore: snap.researchScore,
      marketAwareness: snap.marketAwareness,
      diversification: snap.diversification,
      patienceScore: snap.patienceScore,
      portfolioHealth: snap.portfolioHealth,
    };

    const prev = i > 0 ? snapshots[i - 1] : null;
    const delta = prev == null ? null : Math.round(snap.dnaScore - prev.dnaScore);

    return {
      id: snap.id,
      createdAt: snap.createdAt.toISOString(),
      dnaScore: snap.dnaScore,
      primaryType: snap.primaryType,
      trigger: snap.activityReason,
      delta,
      scores,
    };
  });
}