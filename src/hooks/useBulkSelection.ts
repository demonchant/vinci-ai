"use client";

import { useState, useCallback } from "react";

export function useBulkSelection() {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      
      // ✅ FIX: Replaced ternary side-effect with standard if/else to satisfy no-unused-expressions
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      
      return next;
    });
  }, []);

  const selectAll = useCallback((ids: string[]) => setSelected(new Set(ids)), []);
  const clear = useCallback(() => setSelected(new Set()), []);
  const isSelected = useCallback((id: string) => selected.has(id), [selected]);

  return {
    selected: Array.from(selected),
    toggle,
    selectAll,
    clear,
    isSelected,
    count: selected.size,
  };
}