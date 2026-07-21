"use client";

import { useState } from "react";
import { Download, ChevronDown } from "@/components/ui/icons";
import { Icon } from "@/components/ui/Icon";

const FORMATS = [
  { format: "csv", label: "Export as CSV" },
  { format: "json", label: "Export as JSON" },
  { format: "markdown", label: "Export as Catalog" },
] as const;

export function ExportButton() {
  const [open, setOpen] = useState(false);
  const [exporting, setExporting] = useState(false);

  async function handleExport(format: "csv" | "json" | "markdown") {
    setOpen(false);
    setExporting(true);
    const res = await fetch(`/api/collection/export?format=${format}`);
    if (res.ok) {
      const blob = await res.blob();
      const ext = format === "markdown" ? "md" : format;
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `collection.${ext}`;
      a.click();
    }
    setExporting(false);
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        disabled={exporting}
        className="flex items-center gap-1.5 rounded-xl bg-white/5 px-3 py-2 text-xs text-gray-300 hover:bg-white/10 disabled:opacity-50"
      >
        <Icon icon={Download} size="button" decorative />
        Export
        <Icon icon={ChevronDown} size="button" decorative />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-20 mt-1 w-44 overflow-hidden rounded-xl glass-strong shadow-glass">
          {FORMATS.map((f) => (
            <button
              key={f.format}
              onClick={() => handleExport(f.format)}
              className="w-full px-4 py-2.5 text-left text-xs text-gray-300 hover:bg-white/10"
            >
              {f.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
