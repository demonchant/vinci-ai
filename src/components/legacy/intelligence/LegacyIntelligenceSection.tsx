"use client";

import { useEffect, useState } from "react";
import { Brain, Clock } from "@/components/ui/icons";
import type { CollectorTwinProfile } from "@/types/collectorTwin";
import type { CollectorJourney } from "@/types/journey";

export function LegacyIntelligenceSection() {
  const [twin, setTwin] = useState<CollectorTwinProfile | null>(null);
  const [journey, setJourney] = useState<CollectorJourney | null>(null);

  useEffect(() => {
    fetch("/api/twin")
      .then((r) => r.json())
      .then((d) => setTwin(d.twin))
      .catch(() => {});
    fetch("/api/journey")
      .then((r) => r.json())
      .then((d) => setJourney(d.journey))
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      {twin && (
        <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-5">
          <div className="flex items-center gap-2 mb-3">
            <Brain className="h-4 w-4 text-primary" strokeWidth={2} />
            <h4 className="text-sm font-medium text-gray-300">Collector Twin Profile</h4>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed">{twin.philosophy.value}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="text-[10px] px-2 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary/80">
              {twin.archetype}
            </span>
            <span className="text-[10px] px-2 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-gray-400">
              DNA Score: {twin.dnaScore}
            </span>
            <span className="text-[10px] px-2 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-gray-400">
              {twin.riskProfile} Risk
            </span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[twin.buyingStyle, twin.riskDiscipline, twin.researchDepth, twin.patience].map((b) => (
              <div key={b.trait} className="text-center">
                <p className="text-lg font-semibold text-gray-200">{b.score}</p>
                <p className="text-[10px] text-gray-500">{b.trait}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {journey && (
        <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-5">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="h-4 w-4 text-primary" strokeWidth={2} />
            <h4 className="text-sm font-medium text-gray-300">Collector Journey</h4>
            <span className="ml-auto text-[10px] text-gray-500">
              {journey.totalMilestones} milestones
            </span>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed">{journey.storyNarrative}</p>
          <div className="mt-3 flex items-center gap-1.5">
            <div className="h-1.5 flex-1 rounded-full bg-white/[0.06] overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                style={{ width: `${journey.journeyProgress}%` }}
              />
            </div>
            <span className="text-[10px] text-gray-400">{journey.journeyProgress}%</span>
          </div>
        </div>
      )}

      {!twin && !journey && (
        <div className="h-32 animate-pulse rounded-xl bg-white/[0.03]" />
      )}
    </div>
  );
}
