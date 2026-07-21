"use client";

import { useState, useCallback } from "react";
import type { ReasoningSynthesis, ReasoningPerspective } from "@/types/reasoning";

export function useReasoning() {
  const [synthesis, setSynthesis] = useState<ReasoningSynthesis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(async (
    query: string,
    options?: { perspectives?: ReasoningPerspective[]; collectibleId?: string }
  ): Promise<ReasoningSynthesis | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/reasoning", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          perspectives: options?.perspectives,
          collectibleId: options?.collectibleId,
        }),
      });
      if (!res.ok) throw new Error("Failed to run reasoning analysis");
      const data = await res.json();
      setSynthesis(data.synthesis);
      return data.synthesis;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setSynthesis(null);
    setError(null);
  }, []);

  return { synthesis, isLoading, error, analyze, reset };
}
