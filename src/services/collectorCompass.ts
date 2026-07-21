import type { ReplayFrame, CompassPosition, CompassAxis } from "@/types/replay";

function scoreToCompassAxes(scores: Record<string, number>): Record<CompassAxis, number> {
  const get = (key: string) => Math.round(scores[key] ?? 50);

  return {
    Historian: Math.round((get("knowledge") + get("research")) / 2),
    Investor: Math.round((get("marketAwareness") + get("riskManagement")) / 2),
    Explorer: Math.round((get("diversification") + get("research")) / 2),
    Completionist: Math.round((get("discipline") + get("consistency")) / 2),
    Curator: Math.round((get("collectionQuality") + get("portfolioBalance")) / 2),
    Researcher: Math.round((get("research") + get("authentication")) / 2),
    Preservationist: Math.round((get("authentication") + get("longTermVision")) / 2),
    Minimalist: Math.round((100 - get("diversification") + get("collectionQuality")) / 2),
    Flipper: Math.round((get("marketAwareness") + 100 - get("longTermVision")) / 2),
  };
}

function dominantAxis(axes: Record<CompassAxis, number>): CompassAxis {
  return Object.entries(axes).sort((a, b) => b[1] - a[1])[0]![0] as CompassAxis;
}

export function buildCompassHistory(frames: ReplayFrame[]): CompassPosition[] {
  return frames.map((frame) => {
    const axes = scoreToCompassAxes(frame.scores);
    return {
      snapshotId: frame.snapshotId,
      createdAt: frame.createdAt,
      axes,
      dominantAxis: dominantAxis(axes),
      dnaScore: frame.dnaScore,
    };
  });
}

export function getCompassAtFrame(frames: ReplayFrame[], index: number): CompassPosition | null {
  const frame = frames[index];
  if (!frame) return null;
  const axes = scoreToCompassAxes(frame.scores);
  return {
    snapshotId: frame.snapshotId,
    createdAt: frame.createdAt,
    axes,
    dominantAxis: dominantAxis(axes),
    dnaScore: frame.dnaScore,
  };
}

export function detectCompassShifts(history: CompassPosition[]) {
  const shifts: { frameIndex: number; from: CompassAxis; to: CompassAxis; reason: string }[] = [];
  for (let i = 1; i < history.length; i++) {
    const prev = history[i - 1]!;
    const curr = history[i]!;
    if (curr.dominantAxis !== prev.dominantAxis) {
      shifts.push({
        frameIndex: i,
        from: prev.dominantAxis,
        to: curr.dominantAxis,
        reason: `Primary archetype shifted from ${prev.dominantAxis} to ${curr.dominantAxis} at DNA score ${curr.dnaScore}.`,
      });
    }
  }
  return shifts;
}
