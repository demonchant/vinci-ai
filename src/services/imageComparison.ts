import type { LabAnalysisResult, ComparisonResult } from "@/types/imageAnalysis";

function formatRange(low: number | null, high: number | null): string {
  if (low === null && high === null) return "Unknown";
  return `$${low ?? "?"}–$${high ?? "?"}`;
}

export function compareAnalyses(left: LabAnalysisResult, right: LabAnalysisResult): ComparisonResult {
  const dimensions: { dimension: string; leftValue: string; rightValue: string }[] = [
    { dimension: "Identification", leftValue: left.identification, rightValue: right.identification },
    {
      dimension: "Category",
      leftValue: left.category ?? "Unknown",
      rightValue: right.category ?? "Unknown",
    },
    {
      dimension: "Condition",
      leftValue: left.estimatedCondition ?? "Unknown",
      rightValue: right.estimatedCondition ?? "Unknown",
    },
    {
      dimension: "Rarity",
      leftValue: left.estimatedRarity ?? "Unknown",
      rightValue: right.estimatedRarity ?? "Unknown",
    },
    {
      dimension: "Estimated Value",
      leftValue: formatRange(left.valueRangeLow, left.valueRangeHigh),
      rightValue: formatRange(right.valueRangeLow, right.valueRangeHigh),
    },
    {
      dimension: "Confidence",
      leftValue: `${left.overallConfidence}%`,
      rightValue: `${right.overallConfidence}%`,
    },
  ];

  return {
    left,
    right,
    differences: dimensions.filter((d) => d.leftValue !== d.rightValue),
  };
}
