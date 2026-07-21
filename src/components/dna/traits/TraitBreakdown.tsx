"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, Database, FolderOpen } from "@/components/ui/icons";
import { Icon } from "@/components/ui/Icon";
import type { TraitExplanation } from "@/services/dnaExplainability";

const TRAIT_LABELS: Record<string, string> = {
  knowledge: "Knowledge",
  research: "Research",
  diversification: "Diversification",
  discipline: "Discipline",
  consistency: "Consistency",
  longTermVision: "Long-Term Vision",
  riskManagement: "Risk Management",
  authentication: "Authentication Awareness",
  marketAwareness: "Market Awareness",
  collectionQuality: "Collection Quality",
  portfolioBalance: "Portfolio Balance",
};

export function TraitBreakdown({ traits }: { traits: TraitExplanation[] }) {
  return (
    <div className="space-y-3">
      {traits.map((trait, i) => (
        <motion.div
          key={trait.trait}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.04 }}
          className="glass rounded-2xl p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium">{TRAIT_LABELS[trait.trait] ?? trait.trait}</p>
              <TrendBadge
                trend={trait.trend}
                delta={trait.previousScore !== null ? trait.score - trait.previousScore : 0}
              />
            </div>
            <p className="font-display text-2xl">{trait.score}</p>
          </div>

          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/5">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
              initial={{ width: 0 }}
              animate={{ width: `${trait.score}%` }}
              transition={{ duration: 0.8, delay: i * 0.04 }}
            />
          </div>

          <p className="mt-2 text-xs text-gray-400">{trait.explanation}</p>

          <div className="mt-3 flex flex-wrap gap-2">
            {trait.topMemories.length > 0 && (
              <span className="flex items-center gap-1 text-[11px] text-gray-500">
                <Icon icon={Database} size={11} decorative />
                {trait.topMemories[0]}
                {trait.topMemories.length > 1 ? ` +${trait.topMemories.length - 1}` : ""}
              </span>
            )}
            {trait.topCollectibles.length > 0 && (
              <span className="flex items-center gap-1 text-[11px] text-gray-500">
                <Icon icon={FolderOpen} size={11} decorative />
                {trait.topCollectibles[0]}
                {trait.topCollectibles.length > 1 ? ` +${trait.topCollectibles.length - 1}` : ""}
              </span>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function TrendBadge({ trend, delta }: { trend: "up" | "down" | "stable"; delta: number }) {
  if (trend === "stable") {
    return (
      <span className="flex items-center gap-0.5 rounded-full bg-white/5 px-1.5 py-0.5 text-[11px] text-gray-500">
        <Icon icon={Minus} size={10} decorative />~
      </span>
    );
  }
  const isUp = trend === "up";
  return (
    <span
      className={`flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] ${
        isUp ? "bg-success/10 text-success" : "bg-red-400/10 text-red-400"
      }`}
    >
      <Icon icon={isUp ? TrendingUp : TrendingDown} size={10} decorative />
      {isUp ? "+" : ""}
      {delta}
    </span>
  );
}
