"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useDNA } from "@/hooks/useDNA";
import { useDNATimeline } from "@/hooks/useDNATimeline";
import { DNAHero } from "@/components/dna/hero/DNAHero";
import { AchievementWall } from "@/components/dna/achievements/AchievementWall";
import { CoachCard } from "@/components/dna/coach/CoachCard";
import { ContributorsPanel } from "@/components/dna/breakdown/ContributorsPanel";
import { TraitBreakdown } from "@/components/dna/traits/TraitBreakdown";
import { Fingerprint, Trophy, Activity, Sparkles, History } from "@/components/ui/icons";
import { Icon } from "@/components/ui/Icon";

const DNAWheelInteractive = dynamic(
  () => import("@/components/dna/wheel/DNAWheelInteractive").then((m) => m.DNAWheelInteractive),
  { loading: () => <div className="h-80 animate-pulse rounded-2xl bg-white/5" /> }
);
const DNAEvolutionChart = dynamic(
  () => import("@/components/dna/wheel/DNAEvolutionChart").then((m) => m.DNAEvolutionChart),
  { loading: () => <div className="h-48 animate-pulse rounded-2xl bg-white/5" /> }
);

type Tab = "overview" | "traits" | "achievements" | "coach" | "evolution";

export default function DNAPage() {
  const { dna, stability, contributors, coach, traits, achievements, demo, isLoading } = useDNA();
  const { entries: evolutionEntries } = useDNATimeline();
  const [tab, setTab] = useState<Tab>("overview");

  if (isLoading || !dna || !stability) {
    return (
      <div className="container py-10 space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-2xl bg-white/5" />
        ))}
      </div>
    );
  }

  const TAB_ITEMS: { id: Tab; label: string; icon: typeof Fingerprint }[] = [
    { id: "overview", label: "Overview", icon: Fingerprint },
    { id: "traits", label: "Traits", icon: Activity },
    { id: "achievements", label: "Achievements", icon: Trophy },
    { id: "coach", label: "AI Coach", icon: Sparkles },
    { id: "evolution", label: "Evolution", icon: History },
  ];

  return (
    <div className="container py-10">
      {demo && (
        <p className="mb-4 rounded-lg bg-white/5 px-3 py-2 text-xs text-gray-400">
          Viewing demonstration data. Sign up to build your real Collector DNA.
        </p>
      )}

      <DNAHero
        dna={dna}
        userName="Collector"
        stability={stability}
        daysActive={
          achievements.find((a: any) => a.key === "collector_veteran")?.progress ?? 0
        }
      />

      {/* Tabs */}
      <div className="mt-6 flex gap-1 overflow-x-auto rounded-xl bg-white/5 p-1">
        {TAB_ITEMS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition ${
              tab === t.id ? "bg-primary text-white" : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <Icon icon={t.icon} size="button" decorative />
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
        {/* Main content */}
        <div>
          {tab === "overview" && (
            <div className="space-y-6">
              <div className="glass rounded-2xl p-5">
                <p className="mb-4 text-xs font-medium uppercase tracking-wide text-gray-500">
                  Collector DNA Wheel
                </p>
                {traits.length > 0 ? (
                  <DNAWheelInteractive traits={traits} />
                ) : (
                  <p className="text-sm text-gray-500">
                    DNA Wheel populates after you add collectibles, analyze images, and chat with Vinci AI.
                  </p>
                )}
              </div>

              <div className="glass rounded-2xl p-5">
                <p className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                  Evolution
                </p>
                <DNAEvolutionChart entries={evolutionEntries} />
              </div>
            </div>
          )}

          {tab === "traits" && (
            <div>
              {traits.length > 0 ? (
                <TraitBreakdown traits={traits} />
              ) : (
                <p className="text-sm text-gray-500">
                  Trait data appears after Vinci AI has recorded your first DNA snapshot.
                </p>
              )}
            </div>
          )}

          {tab === "achievements" && (
            <AchievementWall achievements={achievements} />
          )}

          {tab === "coach" && (
            <div className="glass rounded-2xl p-5">
              <p className="mb-4 text-xs font-medium uppercase tracking-wide text-gray-500">
                AI Coaching Card
              </p>
              {coach ? (
                <CoachCard coach={coach} />
              ) : (
                <p className="text-sm text-gray-500">
                  Coaching card generates after your first DNA snapshot.
                </p>
              )}
            </div>
          )}

          {tab === "evolution" && (
            <div className="space-y-4">
              <div className="glass rounded-2xl p-5">
                <p className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                  DNA Score Over Time
                </p>
                <DNAEvolutionChart entries={evolutionEntries} />
              </div>

              {evolutionEntries.length > 0 && (
                <div className="glass rounded-2xl p-5">
                  <p className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                    Snapshot History
                  </p>
                  <div className="space-y-2">
                    {evolutionEntries.slice().reverse().slice(0, 10).map((entry) => (
                      <div key={entry.id} className="flex items-center justify-between rounded-lg bg-white/[0.02] px-3 py-2 text-xs">
                        <div>
                          <p className="text-gray-300">{entry.primaryType}</p>
                          <p className="text-gray-600">{entry.trigger}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-display text-lg">{entry.dnaScore}</p>
                          {entry.delta !== null && (
                            <p className={entry.delta >= 0 ? "text-success" : "text-red-400"}>
                              {entry.delta >= 0 ? "+" : ""}{entry.delta}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          {coach && (
            <div className="glass rounded-2xl p-5">
              <p className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                Quick Coach
              </p>
              <ul className="space-y-1.5">
                {coach.recommendations.map((r, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs text-gray-300">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="glass rounded-2xl p-5">
            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-500">
              Top Contributors
            </p>
            {contributors.length > 0 ? (
              <ContributorsPanel contributors={contributors.slice(0, 6)} />
            ) : (
              <p className="text-sm text-gray-500">Contributors appear as you use Vinci AI.</p>
            )}
          </div>

          {achievements.filter((a: any) => a.isUnlocked).length > 0 && (
            <div className="glass rounded-2xl p-5">
              <p className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                Recent Achievements
              </p>
              <div className="space-y-1.5">
                {achievements
                  .filter((a: any) => a.isUnlocked)
                  .slice(0, 3)
                  .map((a: any) => (
                    <div key={a.key} className="flex items-center gap-2 text-xs">
                      <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
                      <span className="text-gray-300">{a.title}</span>
                      <span className="ml-auto text-gray-600">{a.xp} XP</span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
