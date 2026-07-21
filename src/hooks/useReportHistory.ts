"use client";
import { useEffect, useState, useCallback } from "react";

interface ReportSummary {
  id: string;
  periodStart: string;
  periodEnd: string;
  generatedAt: string;
}

export function useReportHistory() {
  const [reports, setReports] = useState<ReportSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(() => {
    setIsLoading(true);
    fetch("/api/legacy/history")
      .then((r) => r.json())
      .then((d) => setReports(d.reports ?? []))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  async function deleteReport(id: string) {
    await fetch("/api/legacy/history", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reportId: id }),
    });
    setReports((prev) => prev.filter((r) => r.id !== id));
  }

  return { reports, isLoading, refresh, deleteReport };
}
