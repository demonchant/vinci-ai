import { prisma } from "@/lib/prisma";
import { listTimelineEvents } from "./timelineEvents";
import { generateProvenanceStory } from "./provenanceStory";
import type { ProvenanceTimeline, ProvenanceEvent } from "@/types/provenance";

// ✅ FIX: Infer the exact type returned by listTimelineEvents to avoid 'any'
type TimelineEventRow = Awaited<ReturnType<typeof listTimelineEvents>>[number];

function toProvenanceEvent(row: TimelineEventRow): ProvenanceEvent {
  return {
    id: row.id,
    collectibleId: row.collectibleId,
    createdAt: row.createdAt.toISOString(),
    eventType: row.eventType,
    eventTitle: row.eventTitle,
    eventDescription: row.eventDescription,
    imageId: row.imageId,
    analysisId: row.analysisId,
    checkpointId: row.checkpointId,
    conversationId: row.conversationId,
    memoryId: row.memoryId,
    dnaSnapshotId: row.dnaSnapshotId,
    legacyReportId: row.legacyReportId,
    confidence: row.confidence,
    conditionScore: row.conditionScore,
    estimatedValueMin: row.estimatedValueMin ? Number(row.estimatedValueMin) : null,
    estimatedValueMax: row.estimatedValueMax ? Number(row.estimatedValueMax) : null,
    ownershipStatus: row.ownershipStatus,
    metadata: row.metadata,
  };
}

export async function getProvenanceTimeline(
  collectibleId: string,
  userId: string
): Promise<ProvenanceTimeline | null> {
  const collectible = await prisma.collectible.findFirst({
    where: { id: collectibleId, userId },
    include: { images: true },
  });
  if (!collectible) return null;

  const rows = await listTimelineEvents(collectibleId, userId);
  const events = rows.map(toProvenanceEvent);

  const story = await generateProvenanceStory(collectible.title, events);

  const latestConfidenceEvent = [...events].reverse().find((e) => e.confidence !== null);
  const latestValueEvent = [...events]
    .reverse()
    .find((e) => e.estimatedValueMin !== null || e.estimatedValueMax !== null);

  return {
    collectibleId: collectible.id,
    collectibleTitle: collectible.title,
    currentImageUrl: collectible.images[0]?.publicUrl ?? null,
    currentValue: {
      min:
        latestValueEvent?.estimatedValueMin ??
        (collectible.estimatedValue ? Number(collectible.estimatedValue) : null),
      max:
        latestValueEvent?.estimatedValueMax ??
        (collectible.estimatedValue ? Number(collectible.estimatedValue) : null),
    },
    currentCondition: collectible.condition,
    currentConfidence: latestConfidenceEvent?.confidence ?? collectible.lastAnalysisConfidence ?? null,
    collectionStatus: collectible.status,
    events,
    aiStory: story,
  };
}

/**
 * Confidence evolution series for charting — only includes events that
 * actually carried a confidence value. Returns [] (not fabricated points)
 * if nothing has been analyzed yet.
 */
export function extractConfidenceSeries(events: ProvenanceEvent[]) {
  return events
    .filter((e) => e.confidence !== null)
    .map((e) => ({ date: e.createdAt, confidence: e.confidence! }));
}

export function extractValueSeries(events: ProvenanceEvent[]) {
  return events
    .filter((e) => e.estimatedValueMin !== null || e.estimatedValueMax !== null)
    .map((e) => ({
      date: e.createdAt,
      min: e.estimatedValueMin,
      max: e.estimatedValueMax,
    }));
}