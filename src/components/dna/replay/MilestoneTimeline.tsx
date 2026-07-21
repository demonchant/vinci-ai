"use client";

import { motion } from "framer-motion";
import { Star, TrendingUp, Fingerprint, Crown, RefreshCw, ScanSearch } from "@/components/ui/icons";
import { Icon } from "@/components/ui/Icon";
import { DNAThread } from "@/components/marketing/DNAThread";
import type { ReplayMilestone, MilestoneType } from "@/types/replay";

const MILESTONE_ICON: Record<MilestoneType, typeof Star> = {
  FIRST_COLLECTIBLE: Star,
  FIRST_AUTHENTICATION: ScanSearch,
  FIRST_ANALYSIS: ScanSearch,
  DNA_LEVEL_UP: TrendingUp,
  LARGEST_INCREASE: TrendingUp,
  ACHIEVEMENT_UNLOCKED: Crown,
  ARCHETYPE_SHIFT: RefreshCw,
  PORTFOLIO_DIVERSIFIED: Fingerprint,
};

const MILESTONE_COLOR: Record<MilestoneType, string> = {
  FIRST_COLLECTIBLE: "text-accent",
  FIRST_AUTHENTICATION: "text-success",
  FIRST_ANALYSIS: "text-success",
  DNA_LEVEL_UP: "text-primary",
  LARGEST_INCREASE: "text-primary",
  ACHIEVEMENT_UNLOCKED: "text-yellow-400",
  ARCHETYPE_SHIFT: "text-secondary",
  PORTFOLIO_DIVERSIFIED: "text-accent",
};

export function MilestoneTimeline({
  milestones,
  currentIndex,
  onSeek,
}: {
  milestones: ReplayMilestone[];
  currentIndex: number;
  onSeek: (index: number) => void;
}) {
  if (milestones.length === 0) {
    return <p className="text-xs text-gray-600">Milestones appear as your journey grows.</p>;
  }

  return (
    <div className="relative space-y-2 pl-6">
      <DNAThread
        variant="spine"
        className="pointer-events-none absolute left-2 bottom-2 top-2 w-4 opacity-30"
      />
      {milestones.map((m, i) => {
        const MIcon = MILESTONE_ICON[m.type];
        const color = MILESTONE_COLOR[m.type];
        const isActive = m.frameIndex === currentIndex;
        const isPast = m.frameIndex <= currentIndex;

        return (
          <motion.button
            key={m.id}
            onClick={() => onSeek(m.frameIndex)}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            className={`w-full rounded-xl px-2.5 py-2 text-left transition ${
              isActive ? "bg-white/10" : "hover:bg-white/5"
            }`}
          >
            <div className="flex items-center gap-2">
              <Icon
                icon={MIcon}
                size="button"
                className={`shrink-0 ${isPast ? color : "text-gray-600"}`}
                decorative
              />
              <div className="min-w-0">
                <p
                  className={`truncate text-xs font-medium ${
                    isPast ? "text-gray-200" : "text-gray-600"
                  }`}
                >
                  {m.label}
                </p>
                <p className="text-[10px] text-gray-600">
                  {new Date(m.createdAt).toLocaleDateString()} · Score {m.dnaScore}
                </p>
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
