"use client";
import { motion } from "framer-motion";
import { Icon, type IconProps, type IconSize } from "./Icon";
import { cn } from "@/lib/utils";
import {
  Fingerprint,
  Award,
  Medal,
  Trophy,
  BadgeCheck,
  Crown,
  Gem,
  Diamond,
  Star,
  CircleCheck,
  AlertCircle,
  Info,
  Loader2,
  Database,
  type LucideIcon,
} from "./icons";

/** A button-mounted icon. Always 18px, 8px gap from its label via the parent's `gap-2`. */
export function ButtonIcon(props: Omit<IconProps, "size">) {
  return <Icon {...props} size="button" />;
}

/**
 * A complete icon-bearing button — icon + optional label, correct 18px size,
 * 8px gap, and focus-visible ring. Use this instead of hand-rolling
 * `<button><Icon/>label</button>` so spacing/alignment never drifts.
 */
export function IconButton({
  icon,
  label,
  onClick,
  type = "button",
  variant = "ghost",
  className,
  "aria-label": ariaLabel,
}: {
  icon: LucideIcon;
  label?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "ghost" | "solid" | "outline";
  className?: string;
  "aria-label"?: string;
}) {
  const variantClasses: Record<string, string> = {
    ghost: "text-gray-400 hover:bg-white/5 hover:text-white",
    solid: "bg-primary text-white hover:bg-primary/90 shadow-glow",
    outline: "border border-white/10 text-gray-200 hover:bg-white/5",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      aria-label={!label ? ariaLabel : undefined}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
        variantClasses[variant],
        className
      )}
    >
      <Icon icon={icon} size="button" decorative={Boolean(label)} aria-label={ariaLabel} />
      {label}
    </button>
  );
}

/** Icon inside a circular/rounded badge chip — e.g. a stat pill or status dot. */
export function IconBadge({
  icon,
  tone = "primary",
  size = "default",
  className,
}: {
  icon: LucideIcon;
  tone?: "primary" | "accent" | "success" | "neutral";
  size?: IconSize;
  className?: string;
}) {
  const toneClasses: Record<string, string> = {
    primary: "bg-primary/15 text-primary",
    accent: "bg-accent/15 text-accent",
    success: "bg-success/15 text-success",
    neutral: "bg-white/10 text-gray-300",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full p-2",
        toneClasses[tone],
        className
      )}
    >
      <Icon icon={icon} size={size} />
    </span>
  );
}

/** Large icon used as the lead visual for a feature/section card. 24px. */
export function FeatureIcon({ icon, className }: { icon: LucideIcon; className?: string }) {
  return (
    <span
      className={cn(
        "flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary",
        className
      )}
    >
      <Icon icon={icon} size="feature" />
    </span>
  );
}

/** Small icon paired with a number/stat — dashboard widgets, metric rows. 20px, muted. */
export function MetricIcon({ icon, className }: { icon: LucideIcon; className?: string }) {
  return <Icon icon={icon} size="default" className={cn("text-gray-500", className)} />;
}

/** Eyebrow/section-label icon — sits before small uppercase headers. 18px. */
export function SectionIcon({ icon, className }: { icon: LucideIcon; className?: string }) {
  return <Icon icon={icon} size="button" className={cn("text-accent", className)} />;
}

/** Sidebar/nav icon, 20px, with the subtle hover micro-interaction the spec calls for. */
export function NavigationIcon({
  icon,
  active,
  className,
}: {
  icon: LucideIcon;
  active?: boolean;
  className?: string;
}) {
  return (
    <Icon
      icon={icon}
      size="default"
      className={cn(active ? "text-white" : "text-gray-400", className)}
    />
  );
}

const ACHIEVEMENT_ICONS: Record<string, LucideIcon> = {
  bronze: Medal,
  silver: Award,
  gold: Trophy,
  verified: BadgeCheck,
  elite: Crown,
  rare: Gem,
  legendary: Diamond,
  starred: Star,
};

/** Achievement badge icon — never an emoji trophy. Pass a tier key or a specific icon. */
export function AchievementIcon({
  tier = "gold",
  icon,
  unlocked = true,
  className,
}: {
  tier?: keyof typeof ACHIEVEMENT_ICONS;
  icon?: LucideIcon;
  unlocked?: boolean;
  className?: string;
}) {
  // ✅ FIX APPLIED HERE: Robust fallback to satisfy strict TypeScript noUncheckedIndexedAccess
  const ResolvedIcon = icon ?? ACHIEVEMENT_ICONS[tier ?? "gold"] ?? Trophy;
  
  return (
    <motion.span
      whileHover={{ scale: 1.05 }}
      className={cn(
        "flex h-12 w-12 items-center justify-center rounded-2xl",
        unlocked ? "bg-vinci-aurora text-white shadow-glow" : "bg-white/5 text-gray-600",
        className
      )}
    >
      <Icon icon={ResolvedIcon} size="feature" decorative />
    </motion.span>
  );
}

const STATUS_ICONS = {
  success: { icon: CircleCheck, className: "text-success" },
  warning: { icon: AlertCircle, className: "text-yellow-400" },
  info: { icon: Info, className: "text-accent" },
  loading: { icon: Loader2, className: "text-gray-400 animate-spin" },
} as const;

/** Inline status icon — success/warning/info/loading, consistent color mapping. */
export function StatusIcon({
  status,
  className,
}: {
  status: keyof typeof STATUS_ICONS;
  className?: string;
}) {
  const { icon, className: toneClass } = STATUS_ICONS[status];
  return <Icon icon={icon} size="default" className={cn(toneClass, className)} />;
}

/** Collector Memory's icon treatment — Database, consistently, everywhere memory appears. */
export function MemoryIcon({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-xl bg-secondary/15 text-secondary",
        className
      )}
    >
      <Icon icon={Database} size="card" decorative />
    </span>
  );
}

/** Collector DNA's signature glyph — Fingerprint, the app-wide stand-in for the DNA concept. */
export function DNAIcon({ className, size = "feature" }: { className?: string; size?: IconSize }) {
  return (
    <span
      className={cn(
        "flex items-center justify-center rounded-xl bg-vinci-aurora text-white shadow-glow",
        size === "feature" ? "h-11 w-11" : "h-9 w-9",
        className
      )}
    >
      <Icon icon={Fingerprint} size={size} decorative />
    </span>
  );
}