import { prisma } from "@/lib/prisma";
import { Prisma, type TimelineEventType } from "@prisma/client";

export interface TimelineEventInput {
  collectibleId: string;
  userId: string;
  eventType: TimelineEventType;
  eventTitle: string;
  eventDescription: string;
  imageId?: string;
  analysisId?: string;
  checkpointId?: string;
  conversationId?: string;
  memoryId?: string;
  dnaSnapshotId?: string;
  legacyReportId?: string;
  confidence?: number;
  conditionScore?: number;
  estimatedValueMin?: number;
  estimatedValueMax?: number;
  ownershipStatus?: string;
  metadata?: Record<string, unknown>;
}

/** Events are append-only by design — there is no update/delete here. */
export async function appendTimelineEvent(input: TimelineEventInput) {
  return prisma.collectibleTimelineEvent.create({
    data: {
      ...input,
      metadata: input.metadata as Prisma.InputJsonValue,
    },
  });
}

export async function listTimelineEvents(collectibleId: string, userId: string) {
  return prisma.collectibleTimelineEvent.findMany({
    where: { collectibleId, userId },
    orderBy: { createdAt: "asc" },
  });
}

export async function getTimelineEvent(id: string, userId: string) {
  return prisma.collectibleTimelineEvent.findFirst({ where: { id, userId } });
}

/** All timeline events across a user's whole collection — used for cross-collectible search/filter. */
export async function listAllUserTimelineEvents(userId: string, limit = 200) {
  return prisma.collectibleTimelineEvent.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}