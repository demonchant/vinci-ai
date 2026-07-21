import Link from "next/link";
import { Database } from "@/components/ui/icons";
import { Icon } from "@/components/ui/Icon";
import type { LegacyMemoryHighlight } from "@/types/legacy";

export function MemoryHighlights({ highlights }: { highlights: LegacyMemoryHighlight[] }) {
  if (highlights.length === 0) {
    return <p className="text-sm text-gray-500">No memory data yet.</p>;
  }
  return (
    <div className="space-y-3">
      {highlights.map((h, i) => (
        <div key={i} className="flex items-start gap-3 rounded-xl bg-white/[0.02] p-3">
          <Icon icon={Database} size="button" className="mt-0.5 shrink-0 text-secondary" decorative />
          <div className="min-w-0 flex-1">
            <p className="text-[11px] uppercase tracking-wide text-gray-600">{h.label}</p>
            <p className="font-medium text-gray-200">{h.memoryLabel}</p>
            <p className="text-sm text-gray-400">{h.memoryValue}</p>
          </div>
          <span className="shrink-0 text-xs text-gray-600">{h.confidence}%</span>
        </div>
      ))}
      <Link href="/memory" className="block text-center text-xs text-accent hover:underline">
        View all memories →
      </Link>
    </div>
  );
}
