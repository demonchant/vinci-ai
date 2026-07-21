import { Sparkles } from "@/components/ui/icons";
import { SectionIcon } from "@/components/ui/icon-components";

export function ProvenanceStoryCard({ story }: { story: string }) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center gap-2">
        <SectionIcon icon={Sparkles} />
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">AI Story</p>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-gray-200">{story}</p>
    </div>
  );
}
