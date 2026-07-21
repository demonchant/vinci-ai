"use client";

import { useEffect, useState, useCallback } from "react";
import type { DNASnapshot } from "@/types/dnaReplay";

export function useDNAReplay() {
  const [snapshots, setSnapshots] = useState<DNASnapshot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<0.5 | 1 | 2>(1);

  useEffect(() => {
    fetch("/api/dna/replay")
      .then((r) => r.json())
      .then((data) => {
        setSnapshots(data.snapshots ?? []);
        setCurrentIndex(Math.max(0, (data.snapshots?.length ?? 1) - 1));
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((i) => {
        if (i >= snapshots.length - 1) {
          setIsPlaying(false);
          return i;
        }
        return i + 1;
      });
    }, 1500 / speed);
    return () => clearInterval(interval);
  }, [isPlaying, speed, snapshots.length]);

  const play = useCallback(() => setIsPlaying(true), []);
  const pause = useCallback(() => setIsPlaying(false), []);
  const seek = useCallback(
    (index: number) => setCurrentIndex(Math.max(0, Math.min(snapshots.length - 1, index))),
    [snapshots.length]
  );

  return {
    snapshots,
    isLoading,
    currentIndex,
    currentSnapshot: snapshots[currentIndex] ?? null,
    isPlaying,
    speed,
    setSpeed,
    play,
    pause,
    seek,
  };
}
