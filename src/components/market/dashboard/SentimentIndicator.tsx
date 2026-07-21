"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";
import { TrendingUp, TrendingDown, Activity } from "@/components/ui/icons";
import type { MarketSentimentAnalysis, MarketSentiment } from "@/types/market";
import { COLLECTIBLE_CATEGORY_LABELS } from "@/types/common";
import type { CollectibleCategory } from "@/types/common";

interface Props {
  sentiment: MarketSentimentAnalysis | null;
}

const sentimentConfig: Record<MarketSentiment, { label: string; color: string; icon: typeof Activity }> = {
  bullish: { label: "Bullish", color: "text-emerald-400", icon: TrendingUp },
  bearish: { label: "Bearish", color: "text-red-400", icon: TrendingDown },
  neutral: { label: "Neutral", color: "text-gray-400", icon: Activity },
};

export function SentimentIndicator({ sentiment }: Props) {
  if (!sentiment) {
    return null;
  }

  const config = sentimentConfig[sentiment.overall];
  const Icon = config.icon;

  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible" className="glass rounded-xl p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className={`h-4 w-4 ${config.color}`} strokeWidth={2} />
          <h3 className="text-sm font-medium text-gray-300">Market Sentiment</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-semibold ${config.color}`}>{config.label}</span>
          <span className="text-[10px] text-gray-500">
            ({Math.round(sentiment.confidence * 100)}%)
          </span>
        </div>
      </div>

      {Object.keys(sentiment.byCategory).length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {Object.entries(sentiment.byCategory).map(([cat, s]) => {
            const catConfig = sentimentConfig[s];
            return (
              <span
                key={cat}
                className={`rounded-md px-2 py-0.5 text-[10px] font-medium ${catConfig.color} bg-white/5`}
              >
                {COLLECTIBLE_CATEGORY_LABELS[cat as CollectibleCategory]} — {catConfig.label}
              </span>
            );
          })}
        </div>
      )}

      {sentiment.sources.length > 0 && (
        <p className="mt-2 text-[10px] text-gray-600">
          Sources: {sentiment.sources.join(", ")}
        </p>
      )}
    </motion.div>
  );
}
