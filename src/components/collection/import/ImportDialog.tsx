"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Upload, X, CircleCheck, AlertCircle } from "@/components/ui/icons";
import { Icon } from "@/components/ui/Icon";
import type { ImportPreviewResult } from "@/services/collectionImport";

export function ImportDialog({ onImported }: { onImported: () => void }) {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState<string | null>(null);
  const [format, setFormat] = useState<"csv" | "json">("csv");
  const [preview, setPreview] = useState<ImportPreviewResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleFile(file: File) {
    const text = await file.text();
    const fmt: "json" | "csv" = file.name.endsWith(".json") ? "json" : "csv";
    setContent(text);
    setFormat(fmt);
    const res = await fetch("/api/collection/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: text, format: fmt }),
    });
    const data = await res.json();
    setPreview(data.preview ?? null);
  }

  async function handleCommit() {
    if (!content) return;
    setIsSubmitting(true);
    await fetch("/api/collection/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, format, commit: true }),
    });
    setIsSubmitting(false);
    setOpen(false);
    setContent(null);
    setPreview(null);
    onImported();
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="flex items-center gap-1.5 rounded-xl bg-white/5 px-3 py-2 text-xs text-gray-300 hover:bg-white/10">
          <Icon icon={Upload} size="button" decorative />
          Import
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[101] w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl glass-strong p-6 shadow-glass">
          <div className="flex items-center justify-between">
            <Dialog.Title className="text-sm font-medium">Import collection</Dialog.Title>
            <Dialog.Close className="text-gray-500 hover:text-gray-300">
              <Icon icon={X} size="button" />
            </Dialog.Close>
          </div>

          {!preview && (
            <label className="mt-4 flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed border-white/10 p-8 text-xs text-gray-400">
              <Icon icon={Upload} size="card" />
              Upload a CSV or JSON file
              <input
                type="file"
                accept=".csv,.json"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              />
            </label>
          )}

          {preview && (
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-1.5 text-xs text-success">
                <Icon icon={CircleCheck} size="button" />
                {preview.validRows.length} items ready to import
              </div>
              {preview.invalidRows.length > 0 && (
                <div className="flex items-start gap-1.5 text-xs text-yellow-400">
                  <Icon icon={AlertCircle} size="button" className="mt-0.5 shrink-0" />
                  <span>
                    {preview.invalidRows.length} rows skipped (row {preview.invalidRows[0]?.row}:{" "}
                    {preview.invalidRows[0]?.errors[0]})
                  </span>
                </div>
              )}
              <button
                onClick={handleCommit}
                disabled={isSubmitting || preview.validRows.length === 0}
                className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-glow disabled:opacity-50"
              >
                {isSubmitting ? "Importing..." : `Import ${preview.validRows.length} items`}
              </button>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
