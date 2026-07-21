"use client";

import { useEffect, useState } from "react";
import type { ProvenanceTimeline } from "@/types/provenance";

export function useProvenance(collectibleId: string) {
  const [timeline, setTimeline] = useState<ProvenanceTimeline | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [demo, setDemo] = useState(false);

  useEffect(() => {
    fetch(`/api/collection/${collectibleId}/timeline`)
      .then((r) => r.json())
      .then((data) => {
        setTimeline(data.timeline ?? null);
        setDemo(Boolean(data.demo));
      })
      .finally(() => setIsLoading(false));
  }, [collectibleId]);

  return { timeline, isLoading, demo };
}
