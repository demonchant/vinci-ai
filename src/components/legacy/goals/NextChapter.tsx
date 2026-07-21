import { Lightbulb } from "@/components/ui/icons";
import { Icon } from "@/components/ui/Icon";

export function NextChapter({ recommendations }: { recommendations: string[] }) {
  if (recommendations.length === 0) {
    return (
      <p className="text-sm text-gray-500">Recommendations will appear in your next report.</p>
    );
  }
  return (
    <div className="space-y-3">
      {recommendations.map((rec, i) => (
        <div key={i} className="flex items-start gap-3 rounded-xl bg-white/[0.02] p-3">
          <Icon icon={Lightbulb} size="button" className="mt-0.5 shrink-0 text-accent" decorative />
          <p className="text-sm text-gray-300">{rec}</p>
        </div>
      ))}
    </div>
  );
}
