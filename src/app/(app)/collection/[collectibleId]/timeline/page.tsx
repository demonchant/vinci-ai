"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { useProvenance } from "@/hooks/useProvenance";
import { ProvenanceTimelineView } from "@/components/provenance/timeline/ProvenanceTimelineView";
import {
  ConfidenceEvolutionChart,
  ValueHistoryChart,
} from "@/components/provenance/charts/EvolutionCharts";
import { ProvenanceStoryCard } from "@/components/provenance/story/ProvenanceStoryCard";
import { formatCurrency } from "@/lib/utils";

export default function CollectibleTimelinePage() {
  const { collectibleId } = useParams<{ collectibleId: string }>();
  const { timeline, isLoading, demo } = useProvenance(collectibleId);

  if (isLoading) {
    return <div className="container py-10 text-sm text-gray-500">Loading timeline...</div>;
  }

  if (!timeline) {
    return <div className="container py-10 text-sm text-gray-500">Timeline not found.</div>;
  }

  return (
    <div className="container py-10">
      {demo && (
        <p className="mb-4 rounded-lg bg-white/5 px-3 py-2 text-xs text-gray-400">
          This is demonstration data showing what a fully-built provenance timeline looks like.
        </p>
      )}

      <div className="glass-strong flex items-center gap-5 rounded-2xl p-6">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-white/5">
          {timeline.currentImageUrl && (
            <Image
              src={timeline.currentImageUrl}
              alt={timeline.collectibleTitle}
              fill
              className="object-cover"
              unoptimized
            />
          )}
        </div>
        <div className="grid flex-1 grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <p className="text-xs text-gray-500">Current Value</p>
            <p className="mt-1 font-display text-xl">
              {timeline.currentValue.max ? formatCurrency(timeline.currentValue.max) : "—"}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Condition</p>
            <p className="mt-1 text-sm text-gray-200">{timeline.currentCondition ?? "Unknown"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Confidence</p>
            <p className="mt-1 text-sm text-gray-200">
              {timeline.currentConfidence !== null ? `${timeline.currentConfidence}%` : "—"}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Timeline Length</p>
            <p className="mt-1 text-sm text-gray-200">{timeline.events.length} events</p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div>
          <h2 className="mb-4 text-sm font-medium text-gray-300">Timeline</h2>
          <ProvenanceTimelineView events={timeline.events} />
        </div>

        <div className="space-y-4">
          <ProvenanceStoryCard story={timeline.aiStory} />

          <div className="glass rounded-2xl p-5">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
              Confidence Evolution
            </p>
            <ConfidenceEvolutionChart events={timeline.events} />
          </div>

          <div className="glass rounded-2xl p-5">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
              Value History
            </p>
            <ValueHistoryChart events={timeline.events} />
          </div>
        </div>
      </div>
    </div>
  );
}
