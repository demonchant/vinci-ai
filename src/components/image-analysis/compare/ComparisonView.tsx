import Image from "next/image";
import { compareAnalyses } from "@/services/imageComparison";
import type { LabAnalysisResult } from "@/types/imageAnalysis";

export function ComparisonView({ left, right }: { left: LabAnalysisResult; right: LabAnalysisResult }) {
  const { differences } = compareAnalyses(left, right);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {[left, right].map((item, i) => (
          <div key={i} className="glass rounded-2xl p-3">
            <div className="relative aspect-square overflow-hidden rounded-xl bg-white/5">
              <Image
                src={item.imageUrl}
                alt={item.identification}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <p className="mt-2 truncate text-sm font-medium">{item.identification}</p>
            <p className="text-xs text-gray-500">{item.overallConfidence}% confidence</p>
          </div>
        ))}
      </div>

      <div className="glass rounded-2xl p-4">
        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-500">Differences</p>
        {differences.length === 0 && (
          <p className="text-sm text-gray-500">No meaningful differences detected.</p>
        )}
        <div className="space-y-2">
          {differences.map((d) => (
            <div key={d.dimension} className="grid grid-cols-3 gap-2 text-xs">
              <span className="text-gray-500">{d.dimension}</span>
              <span className="text-gray-300">{d.leftValue}</span>
              <span className="text-gray-300">{d.rightValue}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
