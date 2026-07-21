"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";
import { PieChart } from "@/components/ui/icons";
import type { DiversificationAnalysis } from "@/types/market";

interface Props {
  analysis: DiversificationAnalysis;
}

export function DiversificationChart({ analysis }: Props) {
  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible" className="glass rounded-xl p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PieChart className="h-4 w-4 text-violet-400" strokeWidth={2} />
          <h3 className="text-sm font-medium text-gray-300">Diversification</h3>
        </div>
        <span className="text-sm font-semibold text-primary">{analysis.overallScore}/100</span>
      </div>

      <div className="mt-4 space-y-3">
        {Object.values(analysis.breakdowns).map((breakdown) => (
          <div key={breakdown.dimension}>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">{breakdown.dimension}</span>
              <span className="text-xs font-medium text-gray-300">{breakdown.score}</span>
            </div>
            <div className="mt-1 h-1.5 rounded-full bg-white/5">
              <div
                className="h-1.5 rounded-full bg-gradient-to-r from-primary/40 to-primary"
                style={{ width: `${breakdown.score}%` }}
              />
            </div>
            <div className="mt-1 flex flex-wrap gap-1">
              {breakdown.segments.slice(0, 4).map((seg) => (
                <span key={seg.label} className="text-[9px] text-gray-500">
                  {seg.label} ({seg.percentage}%)
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {analysis.suggestions.length > 0 && (
        <div className="mt-4 border-t border-white/5 pt-3">
          <p className="text-[10px] font-medium uppercase tracking-wide text-gray-500">Suggestions</p>
          <ul className="mt-1.5 space-y-1">
            {analysis.suggestions.map((s, i) => (
              <li key={i} className="text-xs text-gray-400">{s}</li>
            ))}
          </ul>
        </div>
      )}

      {analysis.expectedDNAImpact.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {analysis.expectedDNAImpact.map((impact) => (
            <span
              key={impact.trait}
              className="rounded-md bg-primary/10 px-1.5 py-0.5 text-[9px] text-primary"
            >
              {impact.trait}: {impact.currentScore} → {impact.projectedScore}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}
