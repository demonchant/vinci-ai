"use client";

import { useCallback, useState } from "react";
import type { LabAnalysisResult } from "@/types/imageAnalysis";

export interface QueuedAnalysis {
  id: string;
  file: File;
  status: "pending" | "uploading" | "analyzing" | "done" | "error";
  result?: LabAnalysisResult;
  imageUrl?: string;
  error?: string;
}

export function useImageAnalysis() {
  const [queue, setQueue] = useState<QueuedAnalysis[]>([]);

  const runAnalysis = useCallback(async (item: QueuedAnalysis) => {
    setQueue((prev) => prev.map((q) => (q.id === item.id ? { ...q, status: "uploading" } : q)));
    try {
      const formData = new FormData();
      formData.append("file", item.file);
      setQueue((prev) => prev.map((q) => (q.id === item.id ? { ...q, status: "analyzing" } : q)));

      const res = await fetch("/api/images/analyze", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Analysis failed");

      setQueue((prev) =>
        prev.map((q) =>
          q.id === item.id ? { ...q, status: "done", result: data.analysis, imageUrl: data.imageUrl } : q
        )
      );
    } catch (e) {
      setQueue((prev) =>
        prev.map((q) =>
          q.id === item.id
            ? { ...q, status: "error", error: e instanceof Error ? e.message : "Upload failed" }
            : q
        )
      );
    }
  }, []);

  const addFiles = useCallback(
    (files: FileList | File[]) => {
      const items: QueuedAnalysis[] = Array.from(files).map((file) => ({
        id: crypto.randomUUID(),
        file,
        status: "pending",
      }));
      setQueue((prev) => [...prev, ...items]);
      items.forEach(runAnalysis);
    },
    [runAnalysis]
  );

  const retry = useCallback(
    (id: string) => {
      setQueue((prev) => {
        const item = prev.find((q) => q.id === id);
        if (item) runAnalysis(item);
        return prev;
      });
    },
    [runAnalysis]
  );

  const cancel = useCallback((id: string) => {
    setQueue((prev) => prev.filter((q) => q.id !== id));
  }, []);

  return { queue, addFiles, retry, cancel };
}
