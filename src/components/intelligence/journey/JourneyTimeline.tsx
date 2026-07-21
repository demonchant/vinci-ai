"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { Clock, Star, ShieldCheck, Award, Layers, Zap } from "@/components/ui/icons";
import type { CollectorJourney, JourneyMilestone, JourneyMilestoneType } from "@/types/journey";

interface Props {
  journey: CollectorJourney;
}

const milestoneIcons: Partial<Record<JourneyMilestoneType, typeof Star>> = {
  first_collectible: Star,
  first_authentication: ShieldCheck,
  first_memory: Zap,
  first_achievement: Award,
  category_mastery: Layers,
  portfolio_milestone: Star,
};

const impactColors: Record<string, string> = {
  transformative: "border-primary/40 bg-primary/10",
  major: "border-accent/40 bg-accent/10",
  moderate: "border-white/[0.08] bg-white/[0.03]",
  minor: "border-white/[0.05] bg-white/[0.02]",
};

export function JourneyTimeline({ journey }: Props) {
  return (
    <motion.div
      variants={staggerContainer(0.06)}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      <motion.div variants={fadeUp} className="glass rounded-xl p-5">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" strokeWidth={2} />
          <h3 className="text-sm font-medium text-gray-300">Collector Journey</h3>
          <span className="ml-auto text-[10px] text-gray-500">
            {journey.totalMilestones} milestone{journey.totalMilestones !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="mt-3 flex items-center gap-1.5">
          <div className="h-1.5 flex-1 rounded-full bg-white/[0.06] overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
              initial={{ width: 0 }}
              animate={{ width: `${journey.journeyProgress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          <span className="text-[10px] text-gray-500">{journey.journeyProgress}%</span>
        </div>

        {journey.nextMilestoneHint && (
          <p className="mt-2 text-[10px] text-primary/60">{journey.nextMilestoneHint}</p>
        )}
      </motion.div>

      <motion.div variants={fadeUp} className="glass rounded-xl p-5">
        <h4 className="text-xs font-medium text-gray-400 mb-3">Story</h4>
        <p className="text-xs text-gray-300 leading-relaxed">{journey.storyNarrative}</p>
      </motion.div>

      {journey.chapters.map((chapter) => (
        <motion.div key={chapter.title} variants={fadeUp} className="glass rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-medium text-gray-300">{chapter.title}</h4>
            <span className="text-[10px] text-gray-500">
              {new Date(chapter.startDate).toLocaleDateString()}
            </span>
          </div>

          <div className="relative space-y-3 pl-4 border-l border-white/[0.06]">
            {chapter.milestones.map((ms) => (
              <MilestoneCard key={ms.id} milestone={ms} />
            ))}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

function MilestoneCard({ milestone }: { milestone: JourneyMilestone }) {
  const Icon = milestoneIcons[milestone.type] ?? Star;
  const impact = impactColors[milestone.impact] ?? impactColors.minor!;

  return (
    <div className={`relative rounded-lg border p-3 ${impact}`}>
      <div className="absolute -left-[21px] top-3 h-2.5 w-2.5 rounded-full bg-primary border-2 border-[#09090B]" />
      <div className="flex items-start gap-2">
        <Icon className="h-3.5 w-3.5 text-gray-400 mt-0.5 shrink-0" strokeWidth={2} />
        <div className="min-w-0">
          <p className="text-xs text-gray-200 font-medium">{milestone.title}</p>
          <p className="mt-0.5 text-[10px] text-gray-400">{milestone.description}</p>
          <div className="mt-1.5 flex items-center gap-2">
            <span className="text-[10px] text-gray-500">
              {new Date(milestone.date).toLocaleDateString()}
            </span>
            {milestone.category && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.04] text-gray-500">
                {milestone.category}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
