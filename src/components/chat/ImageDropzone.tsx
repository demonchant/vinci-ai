"use client";

import { useCallback, useState } from "react";
import { Upload, Loader2 } from "@/components/ui/icons";
import { Icon } from "@/components/ui/Icon";

// ✅ FIX: Added explicit interface to replace `any`
interface ImageAnalysisResult {
  identification?: string;
  category?: string;
  valueRangeLow?: number | null;
  valueRangeHigh?: number | null;
  confidenceScore?: number;
  [key: string]: unknown;
}

export function ImageDropzone({
  onAnalyzed,
}: {
  onAnalyzed: (result: { imageUrl: string; analysis: ImageAnalysisResult }) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = useCallback(
    async (files: FileList) => {
      setError(null);
      setIsUploading(true);
      try {
        for (const file of Array.from(files)) {
          const formData = new FormData();
          formData.append("file", file);
          const res = await fetch("/api/images/analyze", { method: "POST", body: formData });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error ?? "Analysis failed");
          onAnalyzed(data);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Upload failed");
      } finally {
        setIsUploading(false);
      }
    },
    [onAnalyzed]
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
      }}
      className={`flex items-center justify-between rounded-xl border border-dashed px-4 py-2.5 text-xs transition ${
        isDragging ? "border-primary bg-primary/10" : "border-white/10 bg-white/[0.02]"
      }`}
    >
      <label className="flex flex-1 cursor-pointer items-center gap-2 text-gray-400">
        {isUploading ? (
          <Icon icon={Loader2} size="button" className="animate-spin text-primary" />
        ) : (
          <Icon icon={Upload} size="button" />
        )}
        <span>
          {isUploading
            ? "Analyzing image..."
            : "Drag images here, or click to upload (cards, watches, comics, and more)"}
        </span>
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
      </label>
      {error && <span className="text-red-400">{error}</span>}
    </div>
  );
}