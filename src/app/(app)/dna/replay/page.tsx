"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useReplay } from "@/hooks/useReplay";
import { useCompass } from "@/hooks/useCompass";
import { ReplayControls } from "@/components/dna/replay/ReplayControls";
import { MilestoneTimeline } from "@/components/dna/replay/MilestoneTimeline";
import { BeforeAfterComparison } from "@/components/dna/replay/BeforeAfterComparison";
import { StoryCard } from "@/components/dna/story/StoryCard";
import { PredictionsPanel } from "@/components/dna/predictions/PredictionsPanel";
import { DNAExportButton } from "@/components/dna/export/DNAExportButton";
import { Columns } from "@/components/ui/icons"; // ✅ FIX: Removed unused 'BookOpen'
import { Icon } from "@/components/ui/Icon";

const ReplayCanvas = dynamic(
  () => import("@/components/dna/replay/ReplayCanvas").then((m) => m.ReplayCanvas),
  { loading: () => <div className="h-96 animate-pulse rounded-2xl bg-white/5" /> }
);
const CollectorCompass = dynamic(
  () => import("@/components/dna/compass/CollectorCompass").then((m) => m.CollectorCompass),
  { loading: () => <div className="h-52 animate-pulse rounded-xl bg-white/5" /> }
);

export default function DNAReplayPage() {
  const replay = useReplay();
  const { current: compassCurrent, previous: compassPrevious, recentShift } = useCompass(
    replay.manifest?.compass ?? [],
    replay.currentIndex
  );
  const [compareMode, setCompareMode] = useState(false);
  const [compareIndex, setCompareIndex] = useState(0);

  if (replay.isLoading) {
    return (
      <div className="container py-10 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 animate-pulse rounded-2xl bg-white/5" />
        ))}
      </div>
    );
  }

  const { manifest, predictions, currentFrame, currentIndex, isPlaying, playbackSpeed, demo } = replay;

  if (!manifest || manifest.totalFrames === 0) {
    return (
      <div className="container py-20 text-center">
        <p className="text-gray-400 text-lg">No DNA history to replay yet.</p>
        <p className="mt-2 text-sm text-gray-600">
          Use Vinci AI — add collectibles, run image analyses, and chat — to build your Collector DNA history.
        </p>
      </div>
    );
  }

  const firstFrame = manifest.frames[0]!;
  const compareFrame = manifest.frames[compareIndex] ?? firstFrame;

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 px-6 py-3">
        <div>
          <h1 className="font-display text-lg">DNA Evolution Replay™</h1>
          {manifest.dateRange && (
            <p className="text-xs text-gray-500">
              {new Date(manifest.dateRange.from).toLocaleDateString()} —{" "}
              {new Date(manifest.dateRange.to).toLocaleDateString()} ·{" "}
              {manifest.totalFrames} snapshots
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {demo && (
            <span className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] text-gray-400">
              Demo Mode
            </span>
          )}
          <button
            onClick={() => setCompareMode((v) => !v)}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs transition ${
              compareMode ? "bg-primary text-white" : "bg-white/5 text-gray-300 hover:bg-white/10"
            }`}
          >
            <Icon icon={Columns} size="button" decorative />
            Compare
          </button>
          <DNAExportButton />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT — milestones + controls */}
        <div className="hidden w-64 shrink-0 flex-col gap-4 overflow-y-auto border-r border-white/5 p-4 lg:flex">
          <div className="glass rounded-2xl p-3">
            <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-gray-600">
              Milestones
            </p>
            <MilestoneTimeline
              milestones={manifest.milestones}
              currentIndex={currentIndex}
              onSeek={replay.seek}
            />
          </div>
        </div>

        {/* CENTER — canvas + controls */}
        <div className="flex flex-1 flex-col overflow-y-auto">
          <div className="flex-1 p-6">
            {compareMode && currentFrame ? (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="glass rounded-2xl p-4">
                  <p className="mb-2 text-xs text-gray-500">Current (frame {currentIndex + 1})</p>
                  <ReplayCanvas frame={currentFrame} />
                </div>
                <div className="glass rounded-2xl p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-xs text-gray-500">Compare with</p>
                    <input
                      type="range"
                      min={0}
                      max={manifest.totalFrames - 1}
                      value={compareIndex}
                      onChange={(e) => setCompareIndex(Number(e.target.value))}
                      className="w-24 accent-secondary"
                      aria-label="Choose comparison frame"
                    />
                  </div>
                  <ReplayCanvas frame={compareFrame} />
                </div>
              </div>
            ) : (
              <div className="glass rounded-2xl p-4">
                <ReplayCanvas frame={currentFrame} />
              </div>
            )}

            {compareMode && currentFrame && currentFrame !== compareFrame && (
              <div className="mt-4">
                <BeforeAfterComparison frameA={compareFrame} frameB={currentFrame} />
              </div>
            )}
          </div>

          {/* Replay controls bar */}
          <div className="shrink-0 border-t border-white/5 p-4">
            <ReplayControls
              isPlaying={isPlaying}
              currentIndex={currentIndex}
              totalFrames={manifest.totalFrames}
              playbackSpeed={playbackSpeed}
              onPlay={replay.play}
              onPause={replay.pause}
              onNext={replay.next}
              onPrev={replay.prev}
              onSeek={replay.seek}
              onSetSpeed={replay.setSpeed}
            />
          </div>
        </div>

        {/* RIGHT — compass + story + predictions */}
        <div className="hidden w-80 shrink-0 flex-col gap-4 overflow-y-auto border-l border-white/5 p-4 xl:flex">
          <div className="glass rounded-2xl p-4">
            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-500">
              Collector Compass™
            </p>
            <CollectorCompass
              current={compassCurrent}
              previous={compassPrevious ?? null}
              recentShift={recentShift}
            />
          </div>

          <StoryCard narration={manifest.storyNarration} dateRange={manifest.dateRange} />

          {predictions && <PredictionsPanel predictions={predictions} />}
        </div>
      </div>
    </div>
  );
}