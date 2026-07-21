import { BookOpen } from "@/components/ui/icons";
import { SectionIcon } from "@/components/ui/icon-components";

export function StoryCard({
  narration,
  dateRange,
}: {
  narration: string;
  dateRange: { from: string; to: string } | null;
}) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="mb-3 flex items-center gap-2">
        <SectionIcon icon={BookOpen} />
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Your Story</p>
      </div>
      {dateRange && (
        <p className="mb-2 text-[11px] text-gray-600">
          {new Date(dateRange.from).toLocaleDateString()} —{" "}
          {new Date(dateRange.to).toLocaleDateString()}
        </p>
      )}
      <p className="text-sm leading-relaxed text-gray-300">{narration}</p>
    </div>
  );
}
