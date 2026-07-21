import type { ProvenanceTimeline } from "@/types/provenance";

function event(
  id: string,
  type: ProvenanceTimeline["events"][number]["eventType"],
  title: string,
  description: string,
  daysAgo: number,
  extra: Partial<ProvenanceTimeline["events"][number]> = {}
): ProvenanceTimeline["events"][number] {
  return {
    id,
    collectibleId: "demo-7",
    createdAt: new Date(Date.now() - daysAgo * 86_400_000).toISOString(),
    eventType: type,
    eventTitle: title,
    eventDescription: description,
    imageId: null,
    analysisId: null,
    checkpointId: null,
    conversationId: null,
    memoryId: null,
    dnaSnapshotId: null,
    legacyReportId: null,
    confidence: null,
    conditionScore: null,
    estimatedValueMin: null,
    estimatedValueMax: null,
    ownershipStatus: null,
    metadata: null,
    ...extra,
  };
}

const jordanRookieTimeline: ProvenanceTimeline = {
  collectibleId: "demo-7",
  collectibleTitle: "1986 Fleer Michael Jordan Rookie",
  currentImageUrl: null,
  currentValue: { min: 10200, max: 11400 },
  currentCondition: "PSA 8 (Near Mint-Mint)",
  currentConfidence: 95,
  collectionStatus: "OWNED",
  events: [
    event(
      "pe-1",
      "FIRST_UPLOAD",
      "First image analyzed",
      "Identified as 1986 Fleer Jordan rookie, condition unclear from initial photo.",
      95,
      { confidence: 71, estimatedValueMin: 7800, estimatedValueMax: 9600 }
    ),
    event("pe-2", "COLLECTION_ADDED", "Added to collection", "Marked as owned after purchase confirmation.", 94, {
      ownershipStatus: "OWNED",
    }),
    event(
      "pe-3",
      "IMAGE_REANALYSIS",
      "Re-analyzed with higher-resolution image",
      "Corner and surface detail visible; confidence increased.",
      60,
      { confidence: 84, estimatedValueMin: 9000, estimatedValueMax: 10500 }
    ),
    event(
      "pe-4",
      "AUTHENTICATION_UPDATED",
      "PSA grading confirmed",
      "Professional grading (PSA 8) matched AI's estimated condition range.",
      45,
      { confidence: 95, conditionScore: 80 }
    ),
    event(
      "pe-5",
      "MEMORY_IMPACT",
      "Influenced Collector Memory",
      "Reinforced preference for graded vintage sports cards.",
      45,
      { confidence: 90 }
    ),
    event("pe-6", "DNA_IMPACT", "Strengthened Historian profile", "Research and Authentication scores increased.", 44),
    event(
      "pe-7",
      "MARKET_VALUE_UPDATED",
      "Estimated value range updated",
      "Updated based on recent comparable sales context.",
      20,
      { estimatedValueMin: 10200, estimatedValueMax: 11400 }
    ),
    event(
      "pe-8",
      "ACHIEVEMENT_CONTRIBUTION",
      "Contributed to Authentication Expert",
      "One of several graded items pushing authentication rate above 85%.",
      18
    ),
    event(
      "pe-9",
      "LEGACY_REPORT_GENERATED",
      "Included in Legacy Report",
      "Featured as a top achievement and most valuable item.",
      4
    ),
  ],
  aiStory:
    "This card entered your collection 94 days ago and has been analyzed three times since. Confidence rose from 71% to 95% as higher-resolution images and a professional PSA 8 grade confirmed the AI's early condition estimate. It strengthened your Historian profile and contributed directly to your Authentication Expert achievement, and is now the most valuable item in your collection.",
};

export const demoProvenance: Record<string, ProvenanceTimeline> = {
  "demo-7": jordanRookieTimeline,
};
