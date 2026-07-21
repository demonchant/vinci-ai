"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";
import { Lightbulb, Search, ShieldCheck, Zap } from "@/components/ui/icons";
import type { MarketOpportunity, OpportunityType } from "@/types/market";

interface Props {
  opportunities: MarketOpportunity[];
}

const typeConfig: Record<OpportunityType, { label: string; color: string; icon: typeof Lightbulb }> = {
  undervalued: { label: "Undervalued", color: "text-emerald-400", icon: Zap },
  research_opportunity: { label: "Research", color: "text-violet-400", icon: Search },
  authentication_candidate: { label: "Authenticate", color: "text-amber-400", icon: ShieldCheck },
  wishlist_match: { label: "Wishlist Match", color: "text-cyan-400", icon: Zap },
  collection_gap: { label: "Gap", color: "text-blue-400", icon: Lightbulb },
  category_expansion: { label: "Expand", color: "text-primary", icon: Lightbulb },
};

export function OpportunitiesPanel({ opportunities }: Props) {
  if (opportunities.length === 0) {
    return (
      <div className="glass rounded-xl p-5">
        <h3 className="text-sm font-medium text-gray-400">Opportunities</h3>
        <p className="mt-3 text-xs text-gray-500">No opportunities detected at this time.</p>
      </div>
    );
  }

  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible" className="glass rounded-xl p-5">
      <div className="flex items-center gap-2">
        <Lightbulb className="h-4 w-4 text-amber-400" strokeWidth={2} />
        <h3 className="text-sm font-medium text-gray-300">Opportunities</h3>
      </div>

      <div className="mt-4 space-y-3">
        {opportunities.map((opp) => {
          const config = typeConfig[opp.type];
          const Icon = config.icon;
          return (
            <div key={opp.id} className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
              <div className="flex items-center gap-2">
                <Icon className={`h-3.5 w-3.5 ${config.color}`} strokeWidth={2} />
                <span className={`text-[10px] font-medium ${config.color}`}>{config.label}</span>
                <span className="ml-auto text-[10px] text-gray-500">
                  {Math.round(opp.confidence * 100)}% confidence
                </span>
              </div>
              <p className="mt-1.5 text-xs font-medium text-gray-300">{opp.title}</p>
              <p className="mt-0.5 text-[11px] text-gray-500">{opp.explanation}</p>

              {opp.dnaImpact.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {opp.dnaImpact.map((impact) => (
                    <span
                      key={impact.trait}
                      className="rounded-md bg-primary/10 px-1.5 py-0.5 text-[9px] text-primary"
                    >
                      {impact.trait} +{impact.impact}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
