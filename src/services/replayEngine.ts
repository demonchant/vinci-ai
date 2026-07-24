import { prisma } from "@/lib/prisma";
import { buildCompassHistory } from "./collectorCompass";
import { detectMilestones, generateReplayStory } from "./replayAnalytics";
import type { ReplayFrame, ReplayManifest } from "@/types/replay";

export async function buildReplayManifest(
  userId: string
): Promise<ReplayManifest> {
  const snapshots = await prisma.dNASnapshot.findMany({
    where: { userId },
    orderBy: {
      createdAt: "asc",
    },
  });

  if (!snapshots.length) {
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
    snapshots.map(async (snap, index) => {
      const previous = index > 0 ? snapshots[index - 1] : null;

      const scores = {
        dnaScore: snap.dnaScore,
        knowledgeScore: snap.knowledgeScore,
        researchScore: snap.researchScore,
        patienceScore: snap.patienceScore,
        marketAwareness: snap.marketAwareness,
        diversification: snap.diversification,
        portfolioHealth: snap.portfolioHealth,
      };

      const [
        conversationCount,
        memoryCount,
        collectionSize,
        checkpointCount,
      ] = await Promise.all([
        prisma.aIChat.count({
          where: {
            userId,
            createdAt: { lte: snap.createdAt },
          },
        }),
        prisma.collectorMemory.count({
          where: {
            userId,
            learnedAt: { lte: snap.createdAt },
          },
        }),
        prisma.collectible.count({
          where: {
            userId,
            createdAt: { lte: snap.createdAt },
          },
        }),
        prisma.conversationCheckpoint.count({
          where: {
            userId,
            createdAt: { lte: snap.createdAt },
          },
        }),
      ]);

      return {
        index,
        snapshotId: snap.id,
        createdAt: snap.createdAt.toISOString(),
        dnaScore: snap.dnaScore,
        primaryType: snap.primaryType,
        secondaryType: snap.secondaryType,
        trigger: snap.activityReason ?? "Snapshot",
        scores,
        conversationCount,
        memoryCount,
        collectionSize,
        checkpointCount,
        delta: previous
          ? snap.dnaScore - previous.dnaScore
          : null,
      };
    })
  );

  const compass = buildCompassHistory(frames);
  const milestones = detectMilestones(frames);
  const storyNarration = await generateReplayStory(frames, milestones);

  const bookmarks = snapshots.map((snap) => ({
    id: `bookmark-${snap.id}`,
    frameIndex: frames.findIndex((f) => f.snapshotId === snap.id),
    label: snap.activityReason ?? "Snapshot",
    note: null,
    createdAt: snap.createdAt.toISOString(),
  }));

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
        ? {
            from: frames[0]!.createdAt,
            to: frames[frames.length - 1]!.createdAt,
          }
        : null,
  };
}