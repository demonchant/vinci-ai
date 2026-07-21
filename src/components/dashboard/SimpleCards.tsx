import { BentoCard, CardEyebrow } from "./BentoCard";
import {
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  Lightbulb,
  Activity,
  Database,
  Award,
  Target,
  Image as ImageIcon,
  MessageSquare,
  Fingerprint,
  FileText,
  FolderOpen,
} from "@/components/ui/icons";
import { SectionIcon, MetricIcon, AchievementIcon } from "@/components/ui/icon-components";
import type { CollectorDNA, AchievementBadge } from "@/types/dna";
import type { MarketInsight } from "@/types/market";
import type { CollectorMemoryFact } from "@/types/memory";
import Link from "next/link";

export function PortfolioHealthCard({ dna }: { dna: CollectorDNA }) {
  return (
    <BentoCard>
      <div className="flex items-center gap-2">
        <SectionIcon icon={ShieldCheck} />
        <CardEyebrow>Portfolio Health</CardEyebrow>
      </div>
      <p className="mt-2 font-display text-3xl">
        {dna.collectionHealthScore}
        <span className="text-base text-gray-500">/100</span>
      </p>
      <div className="mt-4 space-y-2">
        {dna.collectionHealthFactors.map((f) => (
          <div key={f.factor} className="flex items-center justify-between text-xs">
            <span className="text-gray-400">{f.factor}</span>
            <span className="text-gray-500">{f.note}</span>
          </div>
        ))}
      </div>
    </BentoCard>
  );
}

export function MarketPulseCard({ insights }: { insights: MarketInsight[] }) {
  return (
    <BentoCard>
      <div className="flex items-center gap-2">
        <SectionIcon icon={TrendingUp} />
        <CardEyebrow>Market Pulse</CardEyebrow>
      </div>
      <div className="mt-4 space-y-3">
        {insights.slice(0, 3).map((insight) => (
          <div key={insight.id} className="flex items-start gap-2 text-sm">
            <MetricIcon
              icon={insight.sentiment === "bearish" ? TrendingDown : TrendingUp}
              className={insight.sentiment === "bearish" ? "text-red-400" : "text-success"}
            />
            <p className="text-gray-300">{insight.headline}</p>
          </div>
        ))}
        {insights.length === 0 && <p className="text-sm text-gray-500">No market data yet.</p>}
      </div>
      <Link href="/market" className="mt-4 inline-block text-xs text-accent hover:underline">
        View market insights →
      </Link>
    </BentoCard>
  );
}

export function RecommendationsCard({ recommendations }: { recommendations: string[] }) {
  return (
    <BentoCard span="lg:col-span-1">
      <div className="flex items-center gap-2">
        <SectionIcon icon={Lightbulb} />
        <CardEyebrow>AI Recommendations</CardEyebrow>
      </div>
      <ul className="mt-4 space-y-3">
        {recommendations.length === 0 && (
          <li className="text-sm text-gray-500">
            Add a few collectibles to unlock personalized recommendations.
          </li>
        )}
        {recommendations.map((rec, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
            {rec}
          </li>
        ))}
      </ul>
    </BentoCard>
  );
}

const ACTIVITY_ICON: Record<string, typeof Activity> = {
  COLLECTIBLE_ADDED: FolderOpen,
  IMAGE_ANALYZED: ImageIcon,
  CHAT_MESSAGE: MessageSquare,
  MEMORY_UPDATED: Database,
  DNA_SNAPSHOT_CREATED: Fingerprint,
  REPORT_GENERATED: FileText,
};

export function RecentActivityCard({
  activity,
}: {
  activity: { id: string; type: string; description: string; createdAt: string }[];
}) {
  return (
    <BentoCard span="lg:col-span-1">
      <div className="flex items-center gap-2">
        <SectionIcon icon={Activity} />
        <CardEyebrow>Recent Activity</CardEyebrow>
      </div>
      <ul className="mt-4 space-y-3">
        {activity.length === 0 && <li className="text-sm text-gray-500">No activity yet.</li>}
        {activity.slice(0, 6).map((a) => (
          <li key={a.id} className="flex items-start gap-2.5 text-sm">
            <MetricIcon icon={ACTIVITY_ICON[a.type] ?? Activity} />
            <div>
              <p className="text-gray-300">{a.description}</p>
              <p className="text-xs text-gray-500">{new Date(a.createdAt).toLocaleString()}</p>
            </div>
          </li>
        ))}
      </ul>
    </BentoCard>
  );
}

export function MemoryWidgetCard({ facts }: { facts: CollectorMemoryFact[] }) {
  return (
    <BentoCard span="lg:col-span-1">
      <div className="flex items-center gap-2">
        <SectionIcon icon={Database} />
        <CardEyebrow>Collector Memory</CardEyebrow>
      </div>
      <ul className="mt-4 space-y-2.5">
        {facts.length === 0 && <li className="text-sm text-gray-500">Nothing learned yet.</li>}
        {facts.slice(0, 4).map((f) => (
          <li key={f.id} className="flex items-center justify-between text-sm">
            <span className="text-gray-400">{f.label}</span>
            <span className="text-gray-200">
              {Array.isArray(f.value) ? f.value.join(", ") : String(f.value)}
            </span>
          </li>
        ))}
      </ul>
      <Link href="/memory" className="mt-4 inline-block text-xs text-accent hover:underline">
        Manage Memory →
      </Link>
    </BentoCard>
  );
}

export function AchievementsCard({ achievements }: { achievements: AchievementBadge[] }) {
  return (
    <BentoCard span="lg:col-span-1">
      <div className="flex items-center gap-2">
        <SectionIcon icon={Award} />
        <CardEyebrow>Achievements</CardEyebrow>
      </div>
      <div className="mt-4 grid grid-cols-4 gap-3">
        {achievements.slice(0, 4).map((a) => (
          <div key={a.id} className="flex flex-col items-center gap-1.5 text-center">
            <AchievementIcon tier="gold" />
            <p className="text-[10px] leading-tight text-gray-400">{a.title}</p>
          </div>
        ))}
        {achievements.length === 0 && (
          <p className="col-span-4 text-sm text-gray-500">No achievements unlocked yet.</p>
        )}
      </div>
    </BentoCard>
  );
}

export function GoalsCard({
  goals,
}: {
  goals: { id: string; title: string; status: string; progress: number }[];
}) {
  return (
    <BentoCard span="lg:col-span-1">
      <div className="flex items-center gap-2">
        <SectionIcon icon={Target} />
        <CardEyebrow>Goals</CardEyebrow>
      </div>
      <ul className="mt-4 space-y-3">
        {goals.length === 0 && <li className="text-sm text-gray-500">No goals set yet.</li>}
        {goals.slice(0, 4).map((g) => (
          <li key={g.id}>
            <div className="flex justify-between text-xs text-gray-400">
              <span>{g.title}</span>
              <span>{g.progress}%</span>
            </div>
            <div className="mt-1 h-1.5 rounded-full bg-white/5">
              <div className="h-1.5 rounded-full bg-vinci-aurora" style={{ width: `${g.progress}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </BentoCard>
  );
}
