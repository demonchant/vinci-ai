import type { CollectorDNA } from "./dna";
import type { CollectorMemoryFact } from "./memory";

export interface MemorySnapshotLite {
  key: string;
  label: string;
  value: unknown;
}

export interface DNASnapshotLite {
  dnaScore: number;
  primaryType: string;
  secondaryType: string | null;
  wheel: { axis: string; score: number }[];
}

export interface Checkpoint {
  id: string;
  chatId: string;
  userId: string;
  messageId: string | null;
  createdAt: string;
  checkpointTitle: string;
  checkpointDescription: string;
  memoryBefore: MemorySnapshotLite[];
  memoryAfter: MemorySnapshotLite[];
  dnaBefore: DNASnapshotLite;
  dnaAfter: DNASnapshotLite;
  achievementsUnlocked: string[];
  activitySummary: string;
  aiSummary: string;
  confidence: number;
  sources: string[];
  reason: string;
  branchParentId: string | null;
}

export interface EvidenceItem {
  text: string;
  source: string;
  timestamp: string;
  confidence: number;
}

export interface ReasoningRecord {
  id: string;
  checkpointId: string;
  reason: string;
  evidence: EvidenceItem[];
  confidence: number;
  memoryImpact: { key: string; label: string; before: unknown; after: unknown }[];
  dnaImpact: { metric: string; before: number; after: number }[];
  sources: string[];
  modelVersion: string;
  createdAt: string;
}

export interface CheckpointWithReasoning extends Checkpoint {
  reasoning: ReasoningRecord | null;
}

export type { CollectorDNA, CollectorMemoryFact };
