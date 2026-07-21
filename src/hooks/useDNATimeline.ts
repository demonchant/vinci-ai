"use client";

import { useEffect, useState } from "react";
import type { DNAEvolutionEntry } from "@/services/dnaEvolution";

export function useDNATimeline() {
  const [entries, setEntries] = useState<DNAEvolutionEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dna/evolution")
      .then((r) => r.json())
      .then((d) => { setEntries(d.timeline ?? []); })
      .finally(() => setIsLoading(false));
  }, []);

  return { entries, isLoading };
}
