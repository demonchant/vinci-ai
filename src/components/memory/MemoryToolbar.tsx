"use client";

import { useState } from "react";
import { Search, BadgeCheck, RefreshCw, Download } from "@/components/ui/icons";
import { Icon } from "@/components/ui/Icon";

export function MemoryToolbar({
  query,
  onQueryChange,
  demo,
  onVerifyAll,
  onRecalculate,
}: {
  query: string;
  onQueryChange: (q: string) => void;
  demo: boolean;
  onVerifyAll: () => void;
  onRecalculate: () => void;
}) {
  const [exporting, setExporting] = useState(false);

  async function handleExport(format: "json" | "markdown") {
    setExporting(true);
    const res = await fetch(`/api/memory/export?format=${format}`);
    if (res.ok) {
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `collector-memory.${format === "markdown" ? "md" : "json"}`;
      a.click();
      URL.revokeObjectURL(url);
    }
    setExporting(false);
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative min-w-[200px] flex-1">
        <Icon
          icon={Search}
          size="button"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
        />
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search memories by keyword, category, or source"
          className="w-full rounded-xl bg-white/5 border border-white/10 py-2 pl-9 pr-3 text-sm outline-none focus:border-primary"
        />
      </div>
      {!demo && (
        <>
          <button
            onClick={onVerifyAll}
            className="flex items-center gap-1.5 rounded-xl bg-white/5 px-3 py-2 text-xs text-gray-300 hover:bg-white/10"
          >
            <Icon icon={BadgeCheck} size="button" /> Verify all
          </button>
          <button
            onClick={onRecalculate}
            className="flex items-center gap-1.5 rounded-xl bg-white/5 px-3 py-2 text-xs text-gray-300 hover:bg-white/10"
          >
            <Icon icon={RefreshCw} size="button" /> Recalculate confidence
          </button>
          <button
            onClick={() => handleExport("json")}
            disabled={exporting}
            className="flex items-center gap-1.5 rounded-xl bg-white/5 px-3 py-2 text-xs text-gray-300 hover:bg-white/10 disabled:opacity-50"
          >
            <Icon icon={Download} size="button" /> Export JSON
          </button>
          <button
            onClick={() => handleExport("markdown")}
            disabled={exporting}
            className="flex items-center gap-1.5 rounded-xl bg-white/5 px-3 py-2 text-xs text-gray-300 hover:bg-white/10 disabled:opacity-50"
          >
            <Icon icon={Download} size="button" /> Export Markdown
          </button>
        </>
      )}
    </div>
  );
}
