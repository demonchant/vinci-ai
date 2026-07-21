"use client";

import { useEffect, useState, useCallback } from "react";
import type { CollectorDNA } from "@/types/dna";

export function useCollectorDNA() {
  const [dna, setDna] = useState<CollectorDNA | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/dna");
      if (!res.ok) throw new Error("Failed to compute Collector DNA");
      const data = await res.json();
      setDna(data.dna);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { dna, isLoading, error, refresh };
}
