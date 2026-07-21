"use client";

import { Play, Pause, SkipBack, SkipForward, ChevronLeft, ChevronRight } from "@/components/ui/icons";
import { Icon } from "@/components/ui/Icon";

const SPEEDS = [
  { label: "0.5x", ms: 1600 },
  { label: "1x", ms: 800 },
  { label: "2x", ms: 400 },
  { label: "4x", ms: 200 },
];

interface ReplayControlsProps {
  isPlaying: boolean;
  currentIndex: number;
  totalFrames: number;
  playbackSpeed: number;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSeek: (index: number) => void;
  onSetSpeed: (ms: number) => void;
}

export function ReplayControls({
  isPlaying,
  currentIndex,
  totalFrames,
  playbackSpeed,
  onPlay,
  onPause,
  onNext,
  onPrev,
  onSeek,
  onSetSpeed,
}: ReplayControlsProps) {
  if (totalFrames === 0) return null;

  return (
    <div className="glass-strong space-y-3 rounded-2xl px-4 py-3">
      <input
        type="range"
        min={0}
        max={Math.max(0, totalFrames - 1)}
        value={currentIndex}
        onChange={(e) => onSeek(Number(e.target.value))}
        className="h-1.5 w-full cursor-pointer accent-primary"
        aria-label="Scrub timeline"
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <ControlBtn icon={SkipBack} label="First frame" onClick={() => onSeek(0)} />
          <ControlBtn icon={ChevronLeft} label="Previous frame" onClick={onPrev} />
          <button
            onClick={isPlaying ? onPause : onPlay}
            aria-label={isPlaying ? "Pause" : "Play"}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white shadow-glow hover:bg-primary/90"
          >
            <Icon icon={isPlaying ? Pause : Play} size="button" decorative />
          </button>
          <ControlBtn icon={ChevronRight} label="Next frame" onClick={onNext} />
          <ControlBtn icon={SkipForward} label="Last frame" onClick={() => onSeek(totalFrames - 1)} />
        </div>

        <span className="font-mono tabular-nums text-xs text-gray-400">
          {currentIndex + 1} / {totalFrames}
        </span>

        <div className="flex gap-1">
          {SPEEDS.map((s) => (
            <button
              key={s.label}
              onClick={() => onSetSpeed(s.ms)}
              className={`rounded-md px-2 py-1 text-[11px] transition ${
                playbackSpeed === s.ms
                  ? "bg-primary text-white"
                  : "bg-white/5 text-gray-400 hover:bg-white/10"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <p className="text-center text-[11px] text-gray-600">
        Space to play/pause · Arrow keys to step
      </p>
    </div>
  );
}

function ControlBtn({
  icon,
  label,
  onClick,
}: {
  icon: typeof Play;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="rounded-lg p-1.5 text-gray-400 hover:bg-white/5 hover:text-gray-200"
    >
      <Icon icon={icon} size="button" decorative />
    </button>
  );
}
