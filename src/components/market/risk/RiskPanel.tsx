"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";
import { ShieldAlert, ShieldCheck } from "@/components/ui/icons";
import type { PortfolioRisk, RiskLevel } from "@/types/market";

interface Props {
  risk: PortfolioRisk;
}

const levelStyles: Record<RiskLevel, { bg: string; text: string; badge: string }> = {
  low: { bg: "bg-emerald-500/10", text: "text-emerald-400", badge: "Low" },
  moderate: { bg: "bg-amber-500/10", text: "text-amber-400", badge: "Moderate" },
  high: { bg: "bg-red-500/10", text: "text-red-400", badge: "High" },
};

export function RiskPanel({ risk }: Props) {
  const style = levelStyles[risk.overallLevel];

  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible" className="glass rounded-xl p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {risk.overallLevel === "low" ? (
            <ShieldCheck className="h-4 w-4 text-emerald-400" strokeWidth={2} />
          ) : (
            <ShieldAlert className={`h-4 w-4 ${style.text}`} strokeWidth={2} />
          )}
          <h3 className="text-sm font-medium text-gray-300">Portfolio Risk</h3>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${style.bg} ${style.text}`}>
          {style.badge}
        </span>
      </div>

      <div className="mt-4 space-y-2.5">
        {Object.values(risk.factors).map((factor) => {
          const fs = levelStyles[factor.level];
          return (
            <div key={factor.name}>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">{factor.name}</span>
                <span className={`text-xs font-medium ${fs.text}`}>{factor.score}</span>
              </div>
              <div className="mt-1 h-1.5 rounded-full bg-white/5">
                <div
                  className={`h-1.5 rounded-full transition-all ${
                    factor.level === "low"
                      ? "bg-emerald-500/60"
                      : factor.level === "moderate"
                        ? "bg-amber-500/60"
                        : "bg-red-500/60"
                  }`}
                  style={{ width: `${factor.score}%` }}
                />
              </div>
              <p className="mt-0.5 text-[10px] text-gray-500">{factor.explanation}</p>
            </div>
          );
        })}
      </div>

      {risk.suggestions.length > 0 && (
        <div className="mt-4 border-t border-white/5 pt-3">
          <p className="text-[10px] font-medium uppercase tracking-wide text-gray-500">Suggestions</p>
          <ul className="mt-1.5 space-y-1">
            {risk.suggestions.map((s, i) => (
              <li key={i} className="text-xs text-gray-400">{s}</li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
}
