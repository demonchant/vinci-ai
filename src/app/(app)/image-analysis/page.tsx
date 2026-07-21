"use client";

import { useState } from "react";
import { useImageAnalysis } from "@/hooks/useImageAnalysis";
import { UploadQueue } from "@/components/image-analysis/UploadQueue";
import { ImageViewer } from "@/components/image-viewer/ImageViewer";
import { AnalysisPanel } from "@/components/image-analysis/AnalysisPanel";
import { AnalysisHistory } from "@/components/image-analysis/history/AnalysisHistory";
import { ComparisonView } from "@/components/image-analysis/compare/ComparisonView";
import { Columns } from "@/components/ui/icons";
import { Icon } from "@/components/ui/Icon";

export default function ImageAnalysisLabPage() {
  const { queue, addFiles, retry, cancel } = useImageAnalysis();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [compareIds, setCompareIds] = useState<[string, string] | null>(null);
  const [leftTab, setLeftTab] = useState<"queue" | "history">("queue");

  const selected = queue.find((q) => q.id === selectedId);
  const doneItems = queue.filter((q) => q.status === "done");

  async function handleAddToCollection() {
    if (!selected?.result) return;
    await fetch("/api/collectibles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: selected.result.identification,
        category: selected.result.category ?? "OTHER",
        condition: selected.result.estimatedCondition,
        estimatedValue: selected.result.valueRangeHigh ?? undefined,
        imageUrls: selected.imageUrl ? [selected.imageUrl] : [],
      }),
    });
  }

  return (
    <div className="flex h-screen">
      <div className="w-72 shrink-0 border-r border-white/5">
        <div className="flex gap-1 border-b border-white/5 p-3">
          <button
            onClick={() => setLeftTab("queue")}
            className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-medium ${
              leftTab === "queue" ? "bg-primary text-white" : "text-gray-400"
            }`}
          >
            Upload Queue
          </button>
          <button
            onClick={() => setLeftTab("history")}
            className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-medium ${
              leftTab === "history" ? "bg-primary text-white" : "text-gray-400"
            }`}
          >
            History
          </button>
        </div>
        {leftTab === "queue" ? (
          <UploadQueue
            queue={queue}
            onAddFiles={addFiles}
            onRetry={retry}
            onCancel={cancel}
            onSelect={setSelectedId}
            selectedId={selectedId}
          />
        ) : (
          <div className="p-4">
            <AnalysisHistory />
          </div>
        )}
      </div>

      <div className="flex-1 border-r border-white/5">
        {compareIds ? (
          <div className="h-full overflow-y-auto p-6">
            <ComparisonView
              left={queue.find((q) => q.id === compareIds[0])!.result!}
              right={queue.find((q) => q.id === compareIds[1])!.result!}
            />
          </div>
        ) : (
          <ImageViewer imageUrl={selected?.imageUrl ?? null} alt={selected?.result?.identification ?? "Collectible"} />
        )}

        {doneItems.length >= 2 && (
          <div className="absolute bottom-4 right-4">
            <button
              onClick={() =>
                setCompareIds(
                  compareIds ? null : [doneItems[doneItems.length - 2]!.id, doneItems[doneItems.length - 1]!.id]
                )
              }
              className="flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-2 text-xs text-gray-200 hover:bg-white/20"
            >
              <Icon icon={Columns} size="button" />
              {compareIds ? "Exit Compare" : "Compare Last Two"}
            </button>
          </div>
        )}
      </div>

      <div className="w-96 shrink-0 overflow-y-auto scrollbar-thin">
        {selected?.result ? (
          <AnalysisPanel result={selected.result} onAddToCollection={handleAddToCollection} />
        ) : (
          <div className="flex h-full items-center justify-center p-6 text-center text-sm text-gray-600">
            Upload a collectible image to see the full AI analysis here.
          </div>
        )}
      </div>
    </div>
  );
}
