"use client";

import { useCallback, useEffect, useState } from "react";
import { Upload, Loader2, AlertCircle, CircleCheck, RefreshCw, X } from "@/components/ui/icons";
import { Icon } from "@/components/ui/Icon";
import type { QueuedAnalysis } from "@/hooks/useImageAnalysis";

export function UploadQueue({
  queue,
  onAddFiles,
  onRetry,
  onCancel,
  onSelect,
  selectedId,
}: {
  queue: QueuedAnalysis[];
  onAddFiles: (files: FileList | File[]) => void;
  onRetry: (id: string) => void;
  onCancel: (id: string) => void;
  onSelect: (id: string) => void;
  selectedId: string | null;
}) {
  const [isDragging, setIsDragging] = useState(false);

  const handlePaste = useCallback(
    (e: ClipboardEvent) => {
      const files = Array.from(e.clipboardData?.items ?? [])
        .filter((i) => i.type.startsWith("image/"))
        .map((i) => i.getAsFile())
        .filter((f): f is File => f !== null);
      if (files.length > 0) onAddFiles(files);
    },
    [onAddFiles]
  );

  useEffect(() => {
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [handlePaste]);

  return (
    <div className="flex h-full flex-col p-4">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files.length) onAddFiles(e.dataTransfer.files);
        }}
        className={`rounded-xl border border-dashed p-4 text-center text-xs transition ${
          isDragging ? "border-primary bg-primary/10" : "border-white/10"
        }`}
      >
        <label className="flex cursor-pointer flex-col items-center gap-1.5 text-gray-400">
          <Icon icon={Upload} size="card" />
          Drag, paste, or click to upload
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && onAddFiles(e.target.files)}
          />
        </label>
      </div>

      <div className="mt-4 flex-1 space-y-2 overflow-y-auto scrollbar-thin">
        {queue.length === 0 && (
          <p className="px-1 text-xs text-gray-600">
            Trading cards, watches, comics, sneakers, coins, figures, memorabilia.
          </p>
        )}
        {queue.map((item) => (
          <button
            key={item.id}
            onClick={() => item.status === "done" && onSelect(item.id)}
            className={`flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left transition ${
              selectedId === item.id ? "bg-white/10" : "hover:bg-white/5"
            }`}
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5">
              {item.status === "analyzing" || item.status === "uploading" ? (
                <Icon icon={Loader2} size="button" className="animate-spin text-primary" />
              ) : item.status === "error" ? (
                <Icon icon={AlertCircle} size="button" className="text-red-400" />
              ) : (
                <Icon icon={CircleCheck} size="button" className="text-success" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs text-gray-300">{item.file.name}</p>
              <p className="text-[11px] text-gray-500">
                {item.status === "uploading" && "Uploading..."}
                {item.status === "analyzing" && "Analyzing..."}
                {item.status === "done" && `${item.result?.overallConfidence}% confidence`}
                {item.status === "error" && item.error}
              </p>
            </div>
            {(item.status === "pending" || item.status === "error") && (
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation();
                  // ✅ FIX: Replaced ternary expression with `if/else` to satisfy `no-unused-expressions`
                  if (item.status === "error") {
                    onRetry(item.id);
                  } else {
                    onCancel(item.id);
                  }
                }}
                className="shrink-0 text-gray-500 hover:text-gray-300"
              >
                <Icon icon={item.status === "error" ? RefreshCw : X} size="button" />
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}