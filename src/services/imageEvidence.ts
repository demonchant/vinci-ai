import type { EvidenceObservation } from "@/types/imageAnalysis";

export function groupEvidenceByCategory(evidence: EvidenceObservation[]) {
  const groups: Record<EvidenceObservation["category"], EvidenceObservation[]> = {
    identification: [],
    condition: [],
    authenticity: [],
    concern: [],
  };
  for (const item of evidence) groups[item.category].push(item);
  return groups;
}

export function averageConfidence(evidence: EvidenceObservation[]): number {
  if (evidence.length === 0) return 0;
  return Math.round(evidence.reduce((sum, e) => sum + e.confidence, 0) / evidence.length);
}
