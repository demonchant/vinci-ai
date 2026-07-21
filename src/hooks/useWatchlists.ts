"use client";

import { useState, useEffect, useCallback } from "react";
import type { Watchlist } from "@/types/market";

export function useWatchlists() {
  const [watchlists, setWatchlists] = useState<Watchlist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/market/watchlists");
      if (!res.ok) throw new Error("Failed to load watchlists");
      const data = await res.json();
      setWatchlists(data.watchlists ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { watchlists, isLoading, error, refresh };
}
