"use client";
import { useState, useCallback } from "react";
import type { LegacyReportRecord } from "@/types/legacy";

export function useLegacy() {
  const [report, setReport] = useState<LegacyReportRecord | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async () => {
    setIsGenerating(true);
    setError(null);
    const res = await fetch("/api/legacy/generate", { method: "POST" });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Generation failed");
    } else {
      setReport(data.report);
    }
    setIsGenerating(false);
  }, []);

  const loadReport = useCallback((r: LegacyReportRecord) => setReport(r), []);

  async function downloadExport(format: "markdown" | "json" | "svg") {
    if (!report) return;
    const res = await fetch(`/api/legacy/export?format=${format}&reportId=${report.id}`);
    if (res.ok) {
      const blob = await res.blob();
      const ext = format === "markdown" ? "md" : format;
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `legacy-report.${ext}`;
      a.click();
    }
  }

  return { report, isGenerating, error, generate, loadReport, downloadExport };
}
