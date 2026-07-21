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
    const scores = (snap.scores ?? {}) as Record<string, number>;
    const prev = i > 0 ? ((snapshots[i - 1]!.scores ?? {}) as Record<string, number>) : null;
    const delta = prev ? Math.round((scores.dnaScore ?? 50) - (prev.dnaScore ?? 50)) : null;

    return {
      id: snap.id,
      createdAt: snap.createdAt.toISOString(),
      dnaScore: Math.round(scores.dnaScore ?? 50),
      primaryType: snap.primaryType,
      trigger: snap.trigger,
      delta,
      scores,
    };
  });
}
