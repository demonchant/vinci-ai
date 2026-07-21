"use client";

import { useState, useEffect, useCallback } from "react";
import type { ConfidenceHeatmapData } from "@/types/heatmap";

export function useConfidenceHeatmap() {
  const [heatmap, setHeatmap] = useState<ConfidenceHeatmapData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [demo, setDemo] = useState(false);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/confidence");
      if (!res.ok) throw new Error("Failed to load confidence heatmap");
      const data = await res.json();
      setHeatmap(data.heatmap);
      setDemo(data.demo ?? false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { heatmap, isLoading, error, demo, refresh };
}
