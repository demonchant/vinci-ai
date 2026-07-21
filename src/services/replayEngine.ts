import { prisma } from "@/lib/prisma";
import { buildCompassHistory } from "./collectorCompass";
import { detectMilestones, generateReplayStory } from "./replayAnalytics";
import type { ReplayFrame, ReplayManifest } from "@/types/replay";

export async function buildReplayManifest(userId: string): Promise<ReplayManifest> {
  const snapshots = await prisma.dNASnapshot.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
  });

  if (snapshots.length === 0) {
    return {
      userId,
      frames: [],
      milestones: [],
      compass: [],
      bookmarks: [],
      storyNarration:
        "No DNA history yet. Start using Vinci AI to build your Collector DNA journey.",
      totalFrames: 0,
      dateRange: null,
    };
  }

  const frames: ReplayFrame[] = await Promise.all(
    snapshots.map(async (snap, i) => {
      const scores = (snap.scores ?? {}) as Record<string, number>;
      const prev = i > 0 ? ((snapshots[i - 1]!.scores ?? {}) as Record<string, number>) : null;
      const delta = prev
        ? Math.round((scores.dnaScore ?? 50) - (prev.dnaScore ?? 50))
        : null;

      const [convCount, memCount, collCount, cpCount] = await Promise.all([
        prisma.aIChat.count({ where: { userId, createdAt: { lte: snap.createdAt } } }),
        prisma.collectorMemory.count({ where: { userId, learnedAt: { lte: snap.createdAt } } }),
        prisma.collectible.count({ where: { userId, createdAt: { lte: snap.createdAt } } }),
        prisma.conversationCheckpoint.count({
          where: { userId, createdAt: { lte: snap.createdAt } },
        }),
      ]);

      return {
        index: i,
        snapshotId: snap.id,
        createdAt: snap.createdAt.toISOString(),
        dnaScore: Math.round(scores.dnaScore ?? 50),
        primaryType: snap.primaryType,
        secondaryType: snap.secondaryType ?? null,
        trigger: snap.trigger,
        scores,
        conversationCount: convCount,
        memoryCount: memCount,
        collectionSize: collCount,
        checkpointCount: cpCount,
        delta,
      };
    })
  );

  const compass = buildCompassHistory(frames);
  const milestones = detectMilestones(frames);
  const storyNarration = await generateReplayStory(frames, milestones);

  const pinnedSnaps = await prisma.dNASnapshot.findMany({
    where: { userId, isPinned: true },
    select: { id: true, createdAt: true, trigger: true },
  });

  const bookmarks = pinnedSnaps
    .map((p) => ({
      id: `bookmark-${p.id}`,
      frameIndex: frames.findIndex((f) => f.snapshotId === p.id),
      label: p.trigger,
      note: null,
      createdAt: p.createdAt.toISOString(),
    }))
    .filter((b) => b.frameIndex >= 0);

  return {
    userId,
    frames,
    milestones,
    compass,
    bookmarks,
    storyNarration,
    totalFrames: frames.length,
    dateRange:
      frames.length > 0
        ? { from: frames[0]!.createdAt, to: frames[frames.length - 1]!.createdAt }
        : null,
  };
}
