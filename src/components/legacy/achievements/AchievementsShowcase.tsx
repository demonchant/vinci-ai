import { motion } from "framer-motion";
import { Crown, BadgeCheck } from "@/components/ui/icons";
import { Icon } from "@/components/ui/Icon";
import type { LegacyAchievementHighlight } from "@/types/legacy";

const TIER_COLOR: Record<string, string> = {
  bronze: "text-amber-600",
  silver: "text-gray-300",
  gold: "text-yellow-400",
  legendary: "text-purple-400",
};

export function AchievementsShowcase({ achievements }: { achievements: LegacyAchievementHighlight[] }) {
  const unlocked = achievements.filter((a) => a.isUnlocked);
  const nearComplete = achievements.filter((a) => !a.isUnlocked && a.progress >= 50).slice(0, 3);
  const totalXP = unlocked.reduce((s, a) => s + a.xp, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{unlocked.length} achievements unlocked</span>
        <span>{totalXP} XP earned</span>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {unlocked.map((a, i) => (
          <motion.div
            key={a.key}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.04 }}
            className="flex items-center gap-2.5 rounded-xl border border-white/5 bg-white/[0.02] p-3"
          >
            <Icon
              icon={Crown}
              size="card"
              className={TIER_COLOR[a.tier] ?? "text-gray-400"}
              decorative
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{a.title}</p>
              <p className="text-[11px] text-gray-500">
                {a.xp} XP · {a.tier}
              </p>
            </div>
            <Icon icon={BadgeCheck} size="button" className="ml-auto shrink-0 text-success" decorative />
          </motion.div>
        ))}
      </div>

      {nearComplete.length > 0 && (
        <div>
          <p className="mb-2 text-[11px] uppercase tracking-wide text-gray-600">Close to Unlocking</p>
          {nearComplete.map((a) => (
            <div key={a.key} className="mb-2">
              <div className="flex justify-between text-xs text-gray-500">
                <span>{a.title}</span>
                <span>{a.progress}%</span>
              </div>
              <div className="mt-1 h-1 overflow-hidden rounded-full bg-white/5">
                <div
                  className="h-full rounded-full bg-primary/40"
                  style={{ width: `${a.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
