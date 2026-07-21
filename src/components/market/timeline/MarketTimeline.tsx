"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";
import { Clock, TrendingUp, TrendingDown, Plus, Zap } from "@/components/ui/icons";
import type { MarketTimelineEvent, MarketEventType } from "@/types/market";

interface Props {
  events: MarketTimelineEvent[];
}

const eventConfig: Record<MarketEventType, { icon: typeof Clock; color: string }> = {
  price_spike: { icon: TrendingUp, color: "text-emerald-400" },
  price_correction: { icon: TrendingDown, color: "text-red-400" },
  authentication_update: { icon: Zap, color: "text-amber-400" },
  collection_addition: { icon: Plus, color: "text-cyan-400" },
  wishlist_available: { icon: Zap, color: "text-violet-400" },
  portfolio_milestone: { icon: TrendingUp, color: "text-primary" },
  alert_triggered: { icon: Zap, color: "text-amber-400" },
  category_trend: { icon: TrendingUp, color: "text-blue-400" },
};

export function MarketTimeline({ events }: Props) {
  if (events.length === 0) {
    return (
      <div className="glass rounded-xl p-5">
        <h3 className="text-sm font-medium text-gray-400">Market Timeline</h3>
        <p className="mt-3 text-xs text-gray-500">No recent market events.</p>
      </div>
    );
  }

  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible" className="glass rounded-xl p-5">
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-gray-400" strokeWidth={2} />
        <h3 className="text-sm font-medium text-gray-300">Market Timeline</h3>
      </div>

      <div className="mt-4 space-y-0">
        {events.slice(0, 10).map((event, i) => {
          const config = eventConfig[event.type];
          const Icon = config.icon;
          return (
            <div key={event.id} className="relative flex gap-3 pb-4">
              {i < events.length - 1 && (
                <div className="absolute left-[9px] top-6 h-full w-px bg-white/5" />
              )}
              <div className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-white/5`}>
                <Icon className={`h-3 w-3 ${config.color}`} strokeWidth={2} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-gray-300">{event.title}</p>
                <p className="mt-0.5 text-[11px] text-gray-500">{event.description}</p>
                <p className="mt-0.5 text-[10px] text-gray-600">
                  {formatRelativeTime(event.timestamp)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

function formatRelativeTime(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString();
}
