"use client";

import { useState, useEffect, useCallback } from "react";
import type { MarketAlert, AlertStatus } from "@/types/market";

export function useAlerts() {
  const [alerts, setAlerts] = useState<MarketAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/market/alerts");
      if (!res.ok) throw new Error("Failed to load alerts");
      const data = await res.json();
      setAlerts(data.alerts ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateStatus = useCallback(async (alertId: string, status: AlertStatus) => {
    try {
      const res = await fetch("/api/market/alerts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alertId, status }),
      });
      if (!res.ok) throw new Error("Failed to update alert");
      setAlerts((prev) =>
        prev.map((a) =>
          a.id === alertId ? { ...a, status, readAt: status === "read" ? new Date().toISOString() : a.readAt } : a
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const unreadCount = alerts.filter((a) => a.status === "unread").length;

  return { alerts, unreadCount, isLoading, error, refresh, updateStatus };
}
