"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";
import type { CategoryPerformance } from "@/types/market";

interface Props {
  categories: CategoryPerformance[];
}

export function CategoryHeatmap({ categories }: Props) {
  if (categories.length === 0) {
    return (
      <div className="glass rounded-xl p-6">
        <p className="text-sm text-gray-500">No category data available.</p>
      </div>
    );
  }

  const maxAbsChange = Math.max(...categories.map((c) => Math.abs(c.changePct)), 1);

  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible" className="glass rounded-xl p-5">
      <h3 className="text-sm font-medium text-gray-400">Category Heatmap</h3>
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
        {categories.map((cat) => {
          const intensity = Math.abs(cat.changePct) / maxAbsChange;
          const bg = cat.changePct > 0
            ? `rgba(34, 197, 94, ${0.1 + intensity * 0.4})`
            : cat.changePct < 0
              ? `rgba(239, 68, 68, ${0.1 + intensity * 0.4})`
              : "rgba(161, 161, 170, 0.1)";
          const border = cat.changePct > 0
            ? `rgba(34, 197, 94, ${0.2 + intensity * 0.3})`
            : cat.changePct < 0
              ? `rgba(239, 68, 68, ${0.2 + intensity * 0.3})`
              : "rgba(161, 161, 170, 0.15)";

          return (
            <div
              key={cat.category}
              className="rounded-lg p-3 transition-transform hover:scale-[1.02]"
              style={{ background: bg, border: `1px solid ${border}` }}
            >
              <p className="text-xs font-medium text-gray-300">{cat.label}</p>
              <p className={`mt-1 text-sm font-semibold ${
                cat.changePct > 0 ? "text-emerald-400" : cat.changePct < 0 ? "text-red-400" : "text-gray-400"
              }`}>
                {cat.changePct > 0 ? "+" : ""}{cat.changePct.toFixed(1)}%
              </p>
              <p className="mt-0.5 text-[10px] text-gray-500">{cat.itemCount} items</p>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
