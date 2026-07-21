"use client";

import { motion } from "framer-motion";
import type { LegacyScore } from "@/types/legacy";

export function LegacyScorePanel({ score }: { score: LegacyScore }) {
  return (
    <div className="glass-strong rounded-2xl p-6">
      <div className="mb-6 text-center">
        <p className="text-xs uppercase tracking-widest text-gray-500">Collector Legacy Score</p>
        <motion.p
          className="mt-2 font-display text-6xl text-gradient"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          {score.overall}
        </motion.p>
        <p className="mt-1 text-xs text-gray-500">Confidence: {score.confidence}%</p>
      </div>

      <div className="space-y-3">
        {score.breakdown.map((b, i) => (
          <div key={b.label}>
            <div className="mb-1 flex items-center justify-between text-xs text-gray-400">
              <span>{b.label}</span>
              <span className="font-medium text-gray-200">{b.score}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                initial={{ width: 0 }}
                animate={{ width: `${b.score}%` }}
                transition={{ duration: 0.8, delay: i * 0.07 }}
              />
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs leading-relaxed text-gray-500">{score.explanation}</p>
    </div>
  );
}
