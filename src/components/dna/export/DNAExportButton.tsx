"use client";

import { useState } from "react";
import { Download } from "@/components/ui/icons";
import { Icon } from "@/components/ui/Icon";

export function DNAExportButton() {
  const [downloading, setDownloading] = useState(false);

  async function handleDownload() {
    setDownloading(true);
    const res = await fetch("/api/dna/share");
    if (res.ok) {
      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "collector-dna-card.svg";
      a.click();
      URL.revokeObjectURL(a.href);
    }
    setDownloading(false);
  }

  return (
    <button
      onClick={handleDownload}
      disabled={downloading}
      className="flex items-center gap-1.5 rounded-xl bg-white/5 px-3 py-2 text-xs text-gray-300 hover:bg-white/10 disabled:opacity-50"
    >
      <Icon icon={Download} size="button" decorative />
      {downloading ? "Generating..." : "Export DNA Card"}
    </button>
  );
}
