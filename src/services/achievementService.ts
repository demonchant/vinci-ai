import { prisma } from "@/lib/prisma";
import { ACHIEVEMENT_DEFINITIONS, type AchievementSignals } from "./achievementDefinitions";

async function gatherSignals(userId: string): Promise<AchievementSignals> {
  const [collectibles, imageAnalysisCount, chatCount, snapshotCount, memoryFacts, user, dna] =
    await Promise.all([
      prisma.collectible.findMany({ where: { userId, status: { not: "WISHLIST" } } }),
      prisma.imageAnalysis.count({ where: { userId } }),
      prisma.aIChat.count({ where: { userId } }),
      prisma.dNASnapshot.count({ where: { userId } }),
      prisma.collectorMemory.findMany({ where: { userId, isArchived: false } }),
      prisma.user.findFirst({ where: { id: userId }, select: { createdAt: true } }),
      prisma.dNASnapshot.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } }),
    ]);

  const categories = new Set(collectibles.map((c) => c.category));
  const authenticated = collectibles.filter((c) => c.isAuthenticated);
  const totalValue = collectibles.reduce(
    (sum, c) => sum + Number(c.estimatedValue ?? c.purchasePrice ?? 0),
    0
  );

  const dnaScore = dna?.dnaScore ?? 0;

  const daysActive = user
    ? Math.round((Date.now() - user.createdAt.getTime()) / 86_400_000)
    : 0;

  return {
    collectibleCount: collectibles.length,
    authenticatedCount: authenticated.length,
    authenticatedPct: collectibles.length
      ? Math.round((authenticated.length / collectibles.length) * 100)
      : 0,
    imageAnalysisCount,
    chatCount,
    categoryCount: categories.size,
    totalValue,
    dnaScore,
    daysActive,
    snapshotCount,
    memoryFactCount: memoryFacts.length,
    verifiedMemoryCount: memoryFacts.filter((f) => f.isVerified).length,
  };
}

export async function syncAchievements(userId: string) {
  const signals = await gatherSignals(userId);
  const results = [];

  for (const def of ACHIEVEMENT_DEFINITIONS) {
    const isUnlocked = def.checkUnlocked(signals);
    const progress = def.progressOf(signals);
    const existing = await prisma.achievement.findFirst({ where: { userId, key: def.key } });

    if (existing) {
      const alreadyUnlocked = existing.unlockedAt !== null;
      if (existing.unlockedAt === null && isUnlocked) {
        await prisma.achievement.update({
          where: { id: existing.id },
          data: {
            unlockedAt: new Date(),
            progress,
          },
        });
      } else if (existing.progress !== progress) {
        await prisma.achievement.update({
          where: { id: existing.id },
          data: { progress },
        });
      }
    } else {
      await prisma.achievement.create({
        data: {
          userId,
          key: def.key,
          title: def.title,
          description: def.description,
          icon: def.icon,
          progress,
          unlockedAt: isUnlocked ? new Date() : null,
        },
      });
    }
    results.push({ key: def.key, isUnlocked, progress });
  }
  return results;
}

export async function listAchievements(userId: string) {
  await syncAchievements(userId);
  const rows = await prisma.achievement.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return rows.map((r) => ({
    id: r.id,
    userId: r.userId,
    key: r.key,
    title: r.title,
    description: r.description,
    icon: r.icon,
    progress: r.progress,
    unlockedAt: r.unlockedAt,
    createdAt: r.createdAt,
  }));
}