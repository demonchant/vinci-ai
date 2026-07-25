"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";
import { Sparkles, TrendingUp, ShieldAlert, Search, Layers } from "@/components/ui/icons";
import type { MarketRecommendation, RecommendationType, SignalStrength } from "@/types/market";

interface Props {
  recommendations: MarketRecommendation[];
}

const typeConfig: Record<RecommendationType, { label: string; color: string; icon: typeof Sparkles }> = {
  buy: { label: "Buy Signal", color: "text-emerald-400", icon: TrendingUp },
  hold: { label: "Hold", color: "text-cyan-400", icon: Layers },
  reduce_exposure: { label: "Reduce Exposure", color: "text-amber-400", icon: ShieldAlert },
  research_more: { label: "Research", color: "text-violet-400", icon: Search },
  diversify: { label: "Diversify", color: "text-blue-400", icon: Layers },
  authenticate: { label: "Authenticate", color: "text-amber-400", icon: ShieldAlert },
  portfolio_rebalance: { label: "Rebalance", color: "text-cyan-400", icon: Layers },
};

const signalBadge: Record<SignalStrength, string> = {
  strong: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  moderate: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  weak: "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

export function RecommendationPanel({ recommendations }: Props) {
  if (recommendations.length === 0) {
    return (
      <div className="glass rounded-xl p-5">
        <h3 className="text-sm font-medium text-gray-400">Recommendations</h3>
        {/* ✅ FIX: Escaped apostrophe */}
        <p className="mt-3 text-xs text-gray-500">
          There isn&apos;t enough reliable market data to make recommendations yet.
        </p>
      </div>
    );
  }

  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible" className="glass rounded-xl p-5">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-primary" strokeWidth={2} />
        <h3 className="text-sm font-medium text-gray-300">AI Recommendations</h3>
      </div>

      <div className="mt-4 space-y-3">
        {recommendations.map((rec) => {
          const config = typeConfig[rec.type];
          const Icon = config.icon;
          return (
            <div key={rec.id} className="rounded-lg border border-white/5 bg-white/[0.02] p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${config.color}`} strokeWidth={2} />
                  <span className={`text-xs font-medium ${config.color}`}>{config.label}</span>
                </div>
                <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${signalBadge[rec.signal]}`}>
                  {rec.signal}
                </span>
              </div>
              <p className="mt-2 text-sm font-medium text-gray-200">{rec.title}</p>
              <p className="mt-1 text-xs text-gray-400">{rec.explanation}</p>

              {rec.evidence.length > 0 && (
                <div className="mt-3 space-y-1">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-gray-500">Evidence</p>
                  {rec.evidence.map((e, i) => (
                    <p key={i} className="text-[11px] text-gray-500">
                      {e.description}
                      <span className="ml-1 text-gray-600">({Math.round(e.confidence * 100)}% confidence)</span>
                    </p>
                  ))}
                </div>
              )}

              {rec.affectedDNATraits.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {rec.affectedDNATraits.map((trait) => (
                    <span
                      key={trait}
                      className="rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] text-primary"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-2 flex items-center gap-2">
                <div className="h-1 flex-1 rounded-full bg-white/5">
                  <div
                    className="h-1 rounded-full bg-primary/60"
                    style={{ width: `${rec.confidence * 100}%` }}
                  />
                </div>
                <span className="text-[10px] text-gray-500">{Math.round(rec.confidence * 100)}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}