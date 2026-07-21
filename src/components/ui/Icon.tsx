import type { LucideIcon } from "./icons";
import { cn } from "@/lib/utils";

export type IconSize = "button" | "default" | "card" | "feature" | "hero" | "illustration";

const SIZE_MAP: Record<IconSize, number> = {
  button: 18,
  default: 20,
  card: 20,
  feature: 24,
  hero: 32,
  illustration: 48,
};

export interface IconProps {
  icon: LucideIcon;
  size?: IconSize | number;
  strokeWidth?: number;
  className?: string;
  /** Decorative icons (most icons next to text) are hidden from screen readers. */
  decorative?: boolean;
  /** Required when `decorative` is false — describes the icon's function. */
  "aria-label"?: string;
}

/**
 * The only way icons should be rendered in Vinci AI. Pins stroke width to 2
 * and size to the shared scale, so nothing drifts file-to-file.
 */
export function Icon({
  icon: LucideIconComponent,
  size = "default",
  strokeWidth = 2,
  className,
  decorative = true,
  "aria-label": ariaLabel,
}: IconProps) {
  const pixelSize = typeof size === "number" ? size : SIZE_MAP[size];

  return (
    <LucideIconComponent
      width={pixelSize}
      height={pixelSize}
      strokeWidth={strokeWidth}
      className={cn("shrink-0", className)}
      aria-hidden={decorative ? "true" : undefined}
      aria-label={!decorative ? ariaLabel : undefined}
      role={!decorative ? "img" : undefined}
    />
  );
}
