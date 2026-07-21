"use client";

import { useState, useCallback, useEffect } from "react";
import type { CollectionFilters, CollectionViewMode } from "@/types/collection";

const VIEW_STORAGE_KEY = "vinci-collection-view";

export function useCollectionFilters() {
  const [filters, setFilters] = useState<CollectionFilters>({});
  const [viewMode, setViewModeState] = useState<CollectionViewMode>("grid");

  useEffect(() => {
    const saved = localStorage.getItem(VIEW_STORAGE_KEY) as CollectionViewMode | null;
    if (saved) setViewModeState(saved);
  }, []);

  const setViewMode = useCallback((mode: CollectionViewMode) => {
    setViewModeState(mode);
    localStorage.setItem(VIEW_STORAGE_KEY, mode);
  }, []);

  const updateFilter = useCallback(
    <K extends keyof CollectionFilters>(key: K, value: CollectionFilters[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const clearFilters = useCallback(() => setFilters({}), []);

  return { filters, updateFilter, clearFilters, setFilters, viewMode, setViewMode };
}
