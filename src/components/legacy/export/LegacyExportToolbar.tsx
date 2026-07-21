"use client";

import { useState } from "react";
import { Download, ChevronDown } from "@/components/ui/icons";
import { Icon } from "@/components/ui/Icon";

const FORMATS = [
  { label: "Markdown", format: "markdown", ext: "md" },
  { label: "JSON", format: "json", ext: "json" },
  { label: "SVG Cover", format: "svg", ext: "svg" },
] as const;

export function LegacyExportToolbar({ reportId }: { reportId: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function download(format: string, ext: string) {
    setOpen(false);
    setLoading(true);
    const res = await fetch(`/api/legacy/export?format=${format}&reportId=${reportId}`);
    if (res.ok) {
      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `legacy-report.${ext}`;
      a.click();
      URL.revokeObjectURL(a.href);
    }
    setLoading(false);
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        disabled={loading}
        className="flex items-center gap-1.5 rounded-xl bg-white/5 px-3 py-2 text-xs text-gray-300 hover:bg-white/10 disabled:opacity-50"
      >
        <Icon icon={Download} size="button" decorative />
        {loading ? "Exporting..." : "Export"}
        <Icon icon={ChevronDown} size="button" decorative />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-20 mt-1 w-40 overflow-hidden rounded-xl glass-strong shadow-glass">
          {FORMATS.map((f) => (
            <button
              key={f.format}
              onClick={() => download(f.format, f.ext)}
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
