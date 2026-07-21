import Link from "next/link";
import { Clock } from "@/components/ui/icons";
import { Icon } from "@/components/ui/Icon";

interface TimelineEntry {
  memoryLabel: string;
  memoryValue: unknown;
  source: string;
  checkpointId: string | null;
  confidence: number;
  createdAt: string;
}

export function MemoryTimeline({ entries }: { entries: TimelineEntry[] }) {
  if (entries.length === 0) {
    return <p className="text-sm text-gray-500">No timeline entries yet.</p>;
  }

  return (
    <div className="relative space-y-3 pl-6">
      <div
        aria-hidden="true"
        className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-primary via-secondary to-accent opacity-40"
      />
      {entries.slice(0, 20).map((entry, i) => (
        <div key={i} className="relative rounded-xl bg-white/[0.02] p-3">
          <span className="absolute -left-6 top-3.5 h-3 w-3 rounded-full bg-primary ring-4 ring-background" />
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">{entry.memoryLabel}</p>
            <span className="flex items-center gap-1 text-[11px] text-gray-500">
              <Icon icon={Clock} size={12} />
              {new Date(entry.createdAt).toLocaleDateString()}
            </span>
          </div>
          <p className="text-sm text-gray-400">{String(entry.memoryValue)}</p>
          <p className="mt-1 text-[11px] text-gray-500">
            {entry.source} · {entry.confidence}% confidence
            {entry.checkpointId && (
              <>
                {" · "}
                <Link href="/chat" className="text-accent hover:underline">
                  view checkpoint
                </Link>
              </>
            )}
          </p>
        </div>
      ))}
    </div>
  );
}
