"use client";

import { motion, AnimatePresence } from "framer-motion";
import { fadeUp } from "@/lib/motion";
import { Activity, Check, Loader2 } from "@/components/ui/icons";
import type { LivingCollectorState, EvolutionEventType } from "@/types/heatmap";
import { getEvolutionProgress, getEvolutionSequence } from "@/services/livingCollector";

interface Props {
  state: LivingCollectorState;
}

const stepIcons: Partial<Record<EvolutionEventType, string>> = {
  memory_updated: "Memory",
  dna_recalculated: "DNA",
  replay_snapshot: "Replay",
  achievement_unlocked: "Achievements",
  twin_updated: "Twin",
  dashboard_refreshed: "Dashboard",
  legacy_updated: "Legacy",
  animation_complete: "Complete",
};

export function LivingCollectorPulse({ state }: Props) {
  const progress = getEvolutionProgress(state);
  const sequence = getEvolutionSequence();
  const completedTypes = new Set(state.events.map((e) => e.type));

  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible" className="glass rounded-xl p-5">
      <div className="flex items-center gap-2">
        <Activity className="h-4 w-4 text-primary" strokeWidth={2} />
        <h3 className="text-sm font-medium text-gray-300">Living Collector</h3>
        {state.isEvolving && (
          <span className="ml-auto flex items-center gap-1 text-[10px] text-primary">
            <Loader2 className="h-3 w-3 animate-spin" />
            Evolving
          </span>
        )}
        {!state.isEvolving && state.evolutionCount > 0 && (
          <span className="ml-auto text-[10px] text-gray-500">
            {state.evolutionCount} evolution{state.evolutionCount !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      <AnimatePresence>
        {state.isEvolving && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3"
          >
            <div className="flex items-center gap-1.5 mb-2">
              <div className="h-1.5 flex-1 rounded-full bg-white/[0.06] overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-primary via-accent to-primary"
                  animate={{ width: `${progress.percent}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <span className="text-[10px] text-gray-500">
                {progress.step}/{progress.total}
              </span>
            </div>
            <p className="text-[10px] text-primary/60">{progress.label}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {sequence.map(({ type, label }) => {
          const isDone = completedTypes.has(type);
          const isCurrent = state.currentStep === type;

          return (
            <span
              key={type}
              className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors ${
                isDone
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                  : isCurrent
                    ? "bg-primary/10 border-primary/20 text-primary animate-pulse"
                    : "bg-white/[0.02] border-white/[0.06] text-gray-600"
              }`}
            >
              {isDone && <Check className="inline h-2.5 w-2.5 mr-0.5" />}
              {stepIcons[type] ?? label}
            </span>
          );
        })}
      </div>

      {state.lastEvolution && (
        <p className="mt-2 text-[10px] text-gray-600">
          Last evolution: {new Date(state.lastEvolution).toLocaleString()}
        </p>
      )}
    </motion.div>
  );
}
