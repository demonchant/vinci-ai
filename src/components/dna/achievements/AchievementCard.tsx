import { motion } from "framer-motion";
import {
  FolderOpen,
  Layers,
  Wallet,
  Compass,
  ScanSearch,
  BookOpen,
  MessageSquare,
  ShieldCheck,
  Fingerprint,
  Crown,
  History,
  Database,
  BadgeCheck,
  Award,
} from "@/components/ui/icons";
import { Icon } from "@/components/ui/Icon";

const ICON_MAP: Record<string, typeof FolderOpen> = {
  FolderOpen,
  Layers,
  Wallet,
  Compass,
  ScanSearch,
  BookOpen,
  MessageSquare,
  ShieldCheck,
  Fingerprint,
  Crown,
  History,
  Database,
  BadgeCheck,
  Award,
};

const TIER_COLORS: Record<string, string> = {
  bronze: "border-amber-600/40 bg-amber-600/10",
  silver: "border-gray-400/40 bg-gray-400/10",
  gold: "border-yellow-400/40 bg-yellow-400/10",
  legendary: "border-purple-400/40 bg-purple-400/10",
};
const TIER_TEXT: Record<string, string> = {
  bronze: "text-amber-600",
  silver: "text-gray-300",
  gold: "text-yellow-400",
  legendary: "text-purple-400",
};

interface AchievementCardProps {
  title: string;
  description: string;
  icon: string;
  tier?: "bronze" | "silver" | "gold" | "legendary";
  xp: number;
  isUnlocked: boolean;
  progress: number;
  unlockedAt?: string | null;
  index?: number;
}

export function AchievementCard({
  title,
  description,
  icon,
  tier = "bronze",
  xp,
  isUnlocked,
  progress,
  unlockedAt,
  index = 0,
}: AchievementCardProps) {
  const IconComp = ICON_MAP[icon] ?? Award;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.03 }}
      className={`relative overflow-hidden rounded-2xl border p-4 ${
        isUnlocked ? TIER_COLORS[tier] : "border-white/5 bg-white/[0.02] opacity-60"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 ${
            isUnlocked ? TIER_TEXT[tier] : "text-gray-600"
          }`}
        >
          <Icon icon={IconComp} size="default" decorative />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <p className={`text-sm font-medium ${isUnlocked ? "text-white" : "text-gray-500"}`}>
              {title}
            </p>
            <span className={`text-[11px] font-medium ${TIER_TEXT[tier]}`}>{xp} XP</span>
          </div>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
      </div>

      {!isUnlocked && (
        <div className="mt-3">
          <div className="h-1 overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-1 text-right text-[11px] text-gray-600">{progress}%</p>
        </div>
      )}

      {isUnlocked && unlockedAt && (
        <p className="mt-2 text-[11px] text-gray-600">
          Unlocked {new Date(unlockedAt).toLocaleDateString()}
        </p>
      )}

      {isUnlocked && (
        <div className="pointer-events-none absolute -right-4 -top-4 h-16 w-16 rounded-full bg-white/[0.04] blur-xl" />
      )}
    </motion.div>
  );
}
