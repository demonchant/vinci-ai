import { prisma } from "@/lib/prisma";
import { computeCollectorDNA } from "./dnaEngine";
import { getMemoryProfile } from "./memoryService";
import { logActivity } from "./activityLogService";
import type { ActivityType } from "@prisma/client";

/**
 * Creates a new DNASnapshot row from the current live DNA computation.
 * Call this after any activity the spec lists as snapshot-worthy:
 * collectible added, image analyzed, chat message, wishlist change,
 * favorite, buy/sell, goal change, memory update.
 */
export async function createDNASnapshot(userId: string, activityReason: string) {
  const dna = await computeCollectorDNA(userId);
  const { facts } = await getMemoryProfile(userId);
  const stats = await prisma.collectible.aggregate({
    where: { userId },
    _sum: { estimatedValue: true },
  });

  const snapshot = await prisma.dNASnapshot.create({
    data: {
      userId,
      dnaScore: dna.dnaScore,
      primaryType: dna.primaryType,
      secondaryType: dna.secondaryType,
      traits: dna.traits.map((t) => ({ name: t.name, score: t.score })),
      riskProfile: dna.riskProfile,
      portfolioHealth: dna.collectionHealthScore,
      collectionValue: stats._sum.estimatedValue ?? 0,
      knowledgeScore: dna.wheel.find((w) => w.axis === "Knowledge")?.score ?? 0,
      researchScore: dna.wheel.find((w) => w.axis === "Research")?.score ?? 0,
      patienceScore: dna.wheel.find((w) => w.axis === "Patience")?.score ?? 0,
      marketAwareness: dna.wheel.find((w) => w.axis === "Market Awareness")?.score ?? 0,
      diversification: dna.diversificationScore,
      collectorSummary: dna.summary,
      achievementsUnlocked: [],
      recommendations: dna.coach.recommendations,
      memorySnapshot: facts.map((f) => ({ key: f.key, value: f.value })),
      activityReason,
    },
  });

  await logActivity(userId, "DNA_SNAPSHOT_CREATED" as ActivityType, { snapshotId: snapshot.id });
  return snapshot;
}

export async function listDNASnapshots(userId: string) {
  return prisma.dNASnapshot.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
  });
}

export async function getSnapshotRange(userId: string, fromId: string, toId: string) {
  const [from, to] = await Promise.all([
    prisma.dNASnapshot.findFirst({ where: { id: fromId, userId } }),
    prisma.dNASnapshot.findFirst({ where: { id: toId, userId } }),
  ]);
  return { from, to };
}
