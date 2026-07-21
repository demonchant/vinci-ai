import { BentoCard, CardEyebrow } from "./BentoCard";
import { Lightbulb } from "@/components/ui/icons";
import { SectionIcon } from "@/components/ui/icon-components";

export function WelcomeCard({
  displayName,
  collectorSince,
}: {
  displayName: string;
  collectorSince: string;
}) {
  return (
    <BentoCard span="lg:col-span-1">
      <CardEyebrow>Welcome back</CardEyebrow>
      <h1 className="mt-2 font-display text-2xl">{displayName}</h1>
      <p className="mt-1 text-sm text-gray-500">Collecting since {collectorSince}</p>
    </BentoCard>
  );
}

export function DailyBriefCard({ brief }: { brief: string }) {
  return (
    <BentoCard span="lg:col-span-2" glow>
      <div className="flex items-center gap-2">
        <SectionIcon icon={Lightbulb} />
        <CardEyebrow>AI Daily Brief</CardEyebrow>
      </div>
      <p className="mt-3 text-lg leading-relaxed text-gray-100">{brief}</p>
    </BentoCard>
  );
}
