"use client";

import { useEffect, useState, useCallback } from "react";
import type { Checkpoint } from "@/types/checkpoint";

export function useCheckpoints(chatId: string) {
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    const res = await fetch(`/api/chat/${chatId}/checkpoints`);
    if (res.ok) {
      const data = await res.json();
      setCheckpoints(data.checkpoints ?? []);
    }
    setIsLoading(false);
  }, [chatId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { checkpoints, isLoading, refresh };
}
