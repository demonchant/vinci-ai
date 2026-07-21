import Link from "next/link";
import { MessageSquare, FolderOpen, Database, ScanSearch } from "@/components/ui/icons";
import { Icon } from "@/components/ui/Icon";
import type { DNAContributor } from "@/services/dnaAnalytics";

const KIND_META: Record<
  DNAContributor["kind"],
  { icon: typeof MessageSquare; href: (id: string) => string; color: string }
> = {
  conversation: {
    icon: MessageSquare,
    href: (id) => `/chat/${id}`,
    color: "text-primary",
  },
  collectible: {
    icon: FolderOpen,
    href: (id) => `/collection/${id}`,
    color: "text-accent",
  },
  memory: {
    icon: Database,
    href: () => `/memory`,
    color: "text-secondary",
  },
  analysis: {
    icon: ScanSearch,
    href: () => `/image-analysis`,
    color: "text-success",
  },
};

export function ContributorsPanel({ contributors }: { contributors: DNAContributor[] }) {
  return (
    <div className="space-y-2">
      {contributors.map((c, i) => {
        const meta = KIND_META[c.kind];
        return (
          <Link
            key={`${c.id}-${i}`}
            href={meta.href(c.id)}
            className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 hover:bg-white/5"
          >
            <Icon icon={meta.icon} size="button" className={meta.color} decorative />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs text-gray-300">{c.label}</p>
              <p className="text-[11px] text-gray-500">{c.dimension}</p>
            </div>
            <div className="h-1.5 w-16 shrink-0 overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                style={{ width: `${c.impact}%` }}
              />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
