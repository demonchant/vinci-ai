"use client";

import { useMemo } from "react";
import { detectCompassShifts } from "@/services/collectorCompass";
import type { CompassPosition } from "@/types/replay";

export function useCompass(history: CompassPosition[], currentIndex: number) {
  const shifts = useMemo(() => detectCompassShifts(history), [history]);
  const current = history[currentIndex] ?? null;
  const previous = currentIndex > 0 ? history[currentIndex - 1] : null;

  const recentShift = shifts.findLast((s) => s.frameIndex <= currentIndex) ?? null;

  return { current, previous, shifts, recentShift };
}
