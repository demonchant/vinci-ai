import { useState, useCallback } from "react";
import type { LegacyReportRecord, LegacyReportData } from "@/types/legacy";

export function useLegacy() {
  const [report, setReport] = useState<LegacyReportRecord | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const res = await fetch("/api/legacy", { method: "POST" });
      if (!res.ok) throw new Error("Failed to generate report");
      const data: { report: LegacyReportRecord } = await res.json();
      setReport(data.report);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const loadReport = useCallback((record: LegacyReportRecord) => {
    setReport(record);
  }, []);

  const downloadExport = useCallback(async (format: "pdf" | "json") => {
    if (!report) return;
    try {
      const res = await fetch(`/api/legacy/export?format=${format}&reportId=${report.id}`);
      if (!res.ok) throw new Error("Failed to export report");
      
      if (format === "json") {
        const data: LegacyReportData = await res.json();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `legacy-report-${report.id}.json`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `legacy-report-${report.id}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to download export");
    }
  }, [report]);

  return { report, isGenerating, error, generate, loadReport, downloadExport };
}