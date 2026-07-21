"use client";

import { useState, useEffect, useCallback } from "react";
import type { CollectorJourney, JourneyStats } from "@/types/journey";

export function useJourney() {
  const [journey, setJourney] = useState<CollectorJourney | null>(null);
  const [stats, setStats] = useState<JourneyStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [demo, setDemo] = useState(false);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/journey");
      if (!res.ok) throw new Error("Failed to load Collector Journey");
      const data = await res.json();
      setJourney(data.journey);
      setStats(data.stats);
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

  return { journey, stats, isLoading, error, demo, refresh };
}
