"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { Brain, Zap, Target, ShieldCheck, Compass } from "@/components/ui/icons";
import type { CollectorTwinProfile } from "@/types/collectorTwin";

interface Props {
  twin: CollectorTwinProfile;
}

const behaviorIcons: Record<string, typeof Brain> = {
  "Buying Style": Zap,
  "Risk Discipline": ShieldCheck,
  "Research Depth": Brain,
  "Patience": Target,
  "Decision Speed": Zap,
  "Diversification Preference": Compass,
  "Budget Discipline": Target,
};

export function TwinProfile({ twin }: Props) {
  const behaviors = [
    twin.buyingStyle,
    twin.riskDiscipline,
    twin.researchDepth,
    twin.patience,
    twin.decisionSpeed,
    twin.diversificationPreference,
    twin.budgetDiscipline,
  ];

  return (
    <motion.div
      variants={staggerContainer(0.08)}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      <motion.div variants={fadeUp} className="glass rounded-xl p-5">
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-primary" strokeWidth={2} />
          <h3 className="text-sm font-medium text-gray-300">Collector Twin</h3>
          <span className="ml-auto text-[10px] text-gray-500">
            {twin.dataPoints} data points
          </span>
        </div>

        <div className="mt-4 rounded-lg bg-white/[0.03] border border-white/[0.06] p-4">
          <p className="text-xs text-gray-400 leading-relaxed">
            {twin.philosophy.value}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider text-primary/70">
              {twin.archetype}
            </span>
            <span className="text-[10px] text-gray-600">|</span>
            <span className="text-[10px] text-gray-500">
              DNA {twin.dnaScore}
            </span>
            <span className="text-[10px] text-gray-600">|</span>
            <span className="text-[10px] text-gray-500">
              {twin.riskProfile} risk
            </span>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-1.5">
          <div className="h-1.5 flex-1 rounded-full bg-white/[0.06] overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
              initial={{ width: 0 }}
              animate={{ width: `${Math.round(twin.confidence * 100)}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          <span className="text-[10px] text-gray-500">
            {Math.round(twin.confidence * 100)}% confidence
          </span>
        </div>
      </motion.div>

      <motion.div variants={fadeUp} className="glass rounded-xl p-5">
        <h4 className="text-xs font-medium text-gray-400 mb-3">Behavioral Profile</h4>
        <div className="space-y-3">
          {behaviors.map((b) => {
            const Icon = behaviorIcons[b.trait] ?? Brain;
            return (
              <div key={b.trait}>
                <div className="flex items-center gap-2 mb-1">
                  <Icon className="h-3 w-3 text-gray-500" strokeWidth={2} />
                  <span className="text-xs text-gray-300">{b.trait}</span>
                  <span className="ml-auto text-[10px] text-gray-500">{b.score}</span>
                </div>
                <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-primary/60"
                    initial={{ width: 0 }}
                    animate={{ width: `${b.score}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
                <p className="mt-1 text-[10px] text-gray-500">{b.description}</p>
              </div>
            );
          })}
        </div>
      </motion.div>

      {twin.favoriteCategories.length > 0 && (
        <motion.div variants={fadeUp} className="glass rounded-xl p-5">
          <h4 className="text-xs font-medium text-gray-400 mb-3">Preferences</h4>
          <div className="space-y-2">
            {twin.favoriteCategories.map((pref) => (
              <div
                key={pref.value}
                className="flex items-center justify-between rounded-lg bg-white/[0.03] border border-white/[0.06] px-3 py-2"
              >
                <span className="text-xs text-gray-300">{pref.label}</span>
                <span className="text-[10px] text-primary/70">
                  {Math.round(pref.confidence * 100)}%
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
