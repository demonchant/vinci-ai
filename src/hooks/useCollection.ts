"use client";

import { useEffect, useState, useCallback } from "react";
import type { Collectible } from "@/types/collectible";
import type { CollectionFilters } from "@/types/collection";

export function useCollection(filters: CollectionFilters) {
  const [items, setItems] = useState<Collectible[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [demo, setDemo] = useState(false);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.set(key, Array.isArray(value) ? value.join(",") : String(value));
      }
    });
    const res = await fetch(`/api/collection/query?${params.toString()}`);
    if (res.ok) {
      const data = await res.json();
      setItems(data.items ?? []);
      setDemo(Boolean(data.demo));
    }
    setIsLoading(false);
  }, [filters]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { items, isLoading, demo, refresh };
}
