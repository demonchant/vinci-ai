"use client";

import { useCallback, useEffect, useState } from "react";
import type { CollectorMemoryFact } from "@/types/memory";

export function useCollectorMemory() {
  const [facts, setFacts] = useState<CollectorMemoryFact[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    const res = await fetch("/api/memory");
    if (res.ok) {
      const data = await res.json();
      setFacts(data.facts ?? []);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const mutate = useCallback(
    async (memoryId: string, action: "edit" | "pin" | "unpin" | "archive", value?: unknown) => {
      const res = await fetch("/api/memory", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memoryId, action, value }),
      });
      if (res.ok) {
        const data = await res.json();
        setFacts(data.facts ?? []);
      }
    },
    []
  );

  const resetAll = useCallback(async () => {
    const res = await fetch("/api/memory", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "reset_all" }),
    });
    if (res.ok) {
      const data = await res.json();
      setFacts(data.facts ?? []);
    }
  }, []);

  return { facts, isLoading, refresh, mutate, resetAll };
}
