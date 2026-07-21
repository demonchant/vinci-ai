"use client";

import { useState, useEffect, useCallback } from "react";
import type { MarketDashboard } from "@/types/market";

export function useMarket() {
  const [dashboard, setDashboard] = useState<MarketDashboard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [demo, setDemo] = useState(false);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/market/dashboard");
      if (!res.ok) throw new Error("Failed to load market dashboard");
      const data = await res.json();
      setDashboard(data.dashboard);
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

  return { dashboard, isLoading, error, demo, refresh };
}
