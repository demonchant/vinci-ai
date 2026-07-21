"use client";

import { useState, useEffect, useCallback } from "react";
import type { CollectorTwinProfile, TwinAnswer, TwinCollectibleAssessment } from "@/types/collectorTwin";

export function useCollectorTwin() {
  const [twin, setTwin] = useState<CollectorTwinProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [demo, setDemo] = useState(false);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/twin");
      if (!res.ok) throw new Error("Failed to load Collector Twin");
      const data = await res.json();
      setTwin(data.twin);
      setDemo(data.demo ?? false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const askTwin = useCallback(async (question: string, context?: string, collectibleId?: string): Promise<TwinAnswer | null> => {
    try {
      const res = await fetch("/api/twin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "ask", question, context, collectibleId }),
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.answer;
    } catch {
      return null;
    }
  }, []);

  const assessFit = useCallback(async (collectibleId: string): Promise<TwinCollectibleAssessment | null> => {
    try {
      const res = await fetch("/api/twin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "assess", collectibleId }),
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.assessment;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { twin, isLoading, error, demo, refresh, askTwin, assessFit };
}
