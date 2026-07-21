"use client";

import { motion } from "framer-motion";
import { Database, BadgeCheck, Sparkles, Clock, Activity } from "@/components/ui/icons";
import { SectionIcon } from "@/components/ui/icon-components";
import type { MemoryOverviewStats } from "@/services/memoryAnalyticsService";

export function OverviewCounters({ stats }: { stats: MemoryOverviewStats }) {
  const items = [
    { label: "Total Memories", value: stats.total, icon: Database },
    { label: "Verified", value: stats.verified, icon: BadgeCheck },
    { label: "AI Inferred", value: stats.aiInferred, icon: Sparkles },
    { label: "Updated Today", value: stats.updatedToday, icon: Clock },
    { label: "Avg. Confidence", value: `${stats.averageConfidence}%`, icon: Activity },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
      {items.map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="glass rounded-2xl p-4"
        >
          <SectionIcon icon={item.icon} />
          <p className="mt-2 font-display text-2xl">{item.value}</p>
          <p className="text-xs text-gray-500">{item.label}</p>
        </motion.div>
      ))}
    </div>
  );
}
