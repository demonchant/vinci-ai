import { Sparkles } from "@/components/ui/icons";
import { Icon } from "@/components/ui/Icon";

export function DemoModeBanner() {
  return (
    <div
      role="status"
      className="glass sticky top-0 z-40 flex items-center justify-center gap-2 border-b border-white/5 px-4 py-2.5 text-xs text-gray-300"
    >
      <Icon icon={Sparkles} size="button" className="text-accent" />
      <span className="font-medium text-white">Judge Demo Mode</span>
      <span className="text-gray-500">— viewing demonstration data for evaluation.</span>
    </div>
  );
}
