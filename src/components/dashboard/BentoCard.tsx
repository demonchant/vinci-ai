import { cn } from "@/lib/utils";

export function BentoCard({
  children,
  className,
  span,
  glow = false,
}: {
  children: React.ReactNode;
  className?: string;
  /** Tailwind col-span utility for the bento layout, e.g. "lg:col-span-2" */
  span?: string;
  glow?: boolean;
}) {
  return (
    <div
      className={cn(
        "glass rounded-2xl p-6 transition-shadow duration-300 hover:bg-white/[0.04]",
        glow && "shadow-glow",
        span,
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardEyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{children}</p>;
}
