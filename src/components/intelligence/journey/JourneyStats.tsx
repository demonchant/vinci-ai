"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { Activity, Clock, Award, Layers } from "@/components/ui/icons";
import type { JourneyStats } from "@/types/journey";

interface Props {
  stats: JourneyStats;
}

export function JourneyStats({ stats }: Props) {
  const metrics = [
    { label: "Days Active", value: stats.totalDaysActive, icon: Clock },
    { label: "Collectibles", value: stats.totalCollectibles, icon: Layers },
    { label: "Memories", value: stats.totalMemories, icon: Activity },
    { label: "Achievements", value: stats.totalAchievements, icon: Award },
    { label: "Categories", value: stats.categoriesExplored, icon: Layers },
  ];

  return (
    <motion.div
      variants={staggerContainer(0.06)}
      initial="hidden"
      animate="visible"
      className="glass rounded-xl p-5"
    >
      <h4 className="text-xs font-medium text-gray-400 mb-3">Journey Stats</h4>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <motion.div
              key={m.label}
              variants={fadeUp}
              className="rounded-lg bg-white/[0.03] border border-white/[0.06] p-3 text-center"
            >
              <Icon className="h-3.5 w-3.5 text-gray-500 mx-auto mb-1" strokeWidth={2} />
              <p className="text-lg font-semibold text-gray-200">{m.value}</p>
              <p className="text-[10px] text-gray-500">{m.label}</p>
            </motion.div>
          );
        })}
        <motion.div
          variants={fadeUp}
          className="rounded-lg bg-primary/5 border border-primary/20 p-3 text-center"
        >
          <p className="text-lg font-semibold text-primary">{stats.journeyScore}</p>
          <p className="text-[10px] text-primary/60">Journey Score</p>
        </motion.div>
      </div>
    </motion.div>
  );
}
