"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";
import { Eye, Star, Target } from "@/components/ui/icons";
import type { Watchlist } from "@/types/market";

interface Props {
  watchlists: Watchlist[];
}

const priorityStyles = {
  high: "text-amber-400 bg-amber-500/10",
  medium: "text-blue-400 bg-blue-500/10",
  low: "text-gray-400 bg-gray-500/10",
};

export function WatchlistPanel({ watchlists }: Props) {
  if (watchlists.length === 0) {
    return (
      <div className="glass rounded-xl p-5">
        <h3 className="text-sm font-medium text-gray-400">Watchlists</h3>
        <p className="mt-3 text-xs text-gray-500">No watchlists created yet.</p>
      </div>
    );
  }

  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible" className="glass rounded-xl p-5">
      <div className="flex items-center gap-2">
        <Eye className="h-4 w-4 text-violet-400" strokeWidth={2} />
        <h3 className="text-sm font-medium text-gray-300">Watchlists</h3>
      </div>

      <div className="mt-4 space-y-4">
        {watchlists.map((wl) => (
          <div key={wl.id}>
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-gray-300">{wl.name}</p>
              <span className="text-[10px] text-gray-500">{wl.itemCount} items</span>
            </div>
            {wl.description && (
              <p className="mt-0.5 text-[11px] text-gray-500">{wl.description}</p>
            )}

            <div className="mt-2 space-y-1.5">
              {wl.items.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[11px] font-medium text-gray-300">{item.title}</p>
                    <div className="mt-0.5 flex items-center gap-2">
                      {item.targetPrice && (
                        <span className="flex items-center gap-0.5 text-[10px] text-gray-500">
                          <Target className="h-2.5 w-2.5" strokeWidth={2} />
                          ${item.targetPrice.toLocaleString()}
                        </span>
                      )}
                      {item.currentPrice && (
                        <span className="text-[10px] text-gray-500">
                          Now: ${item.currentPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {item.aiWatchScore !== null && (
                      <span className="flex items-center gap-0.5 text-[10px] text-primary">
                        <Star className="h-2.5 w-2.5" strokeWidth={2} />
                        {item.aiWatchScore}
                      </span>
                    )}
                    <span className={`rounded px-1.5 py-0.5 text-[9px] font-medium ${priorityStyles[item.priority]}`}>
                      {item.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
