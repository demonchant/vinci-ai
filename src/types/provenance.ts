export type TimelineEventType =
  | "FIRST_UPLOAD"
  | "IMAGE_REANALYSIS"
  | "CONDITION_UPDATED"
  | "CONFIDENCE_CHANGED"
  | "COLLECTION_ADDED"
  | "COLLECTION_UPDATED"
  | "OWNERSHIP_CHANGED"
  | "WISHLIST_ADDED"
  | "WISHLIST_REMOVED"
  | "MARKET_VALUE_UPDATED"
  | "AUTHENTICATION_UPDATED"
  | "MEMORY_IMPACT"
  | "DNA_IMPACT"
  | "CONVERSATION_REFERENCED"
  | "LEGACY_REPORT_GENERATED"
  | "GOAL_CONTRIBUTION"
  | "ACHIEVEMENT_CONTRIBUTION"
  | "MANUAL_NOTE";

export interface ProvenanceEvent {
  id: string;
  collectibleId: string;
  createdAt: string;
  eventType: TimelineEventType;
  eventTitle: string;
  eventDescription: string;
  imageId: string | null;
  analysisId: string | null;
  checkpointId: string | null;
  conversationId: string | null;
  memoryId: string | null;
  dnaSnapshotId: string | null;
  legacyReportId: string | null;
  confidence: number | null;
  conditionScore: number | null;
  estimatedValueMin: number | null;
  estimatedValueMax: number | null;
  ownershipStatus: string | null;
  metadata: Record<string, unknown> | null;
}

export interface ProvenanceTimeline {
  collectibleId: string;
  collectibleTitle: string;
  currentImageUrl: string | null;
  currentValue: { min: number | null; max: number | null };
  currentCondition: string | null;
  currentConfidence: number | null;
  collectionStatus: string;
  events: ProvenanceEvent[];
  aiStory: string;
}
