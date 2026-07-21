"use client";

import { FileText, Trash2, RefreshCw } from "@/components/ui/icons";
import { Icon } from "@/components/ui/Icon";
import { useReportHistory } from "@/hooks/useReportHistory";

export function ReportHistory({ onOpen }: { onOpen: (reportId: string) => void }) {
  const { reports, isLoading, refresh, deleteReport } = useReportHistory();

  if (isLoading) return <p className="text-xs text-gray-500">Loading history...</p>;
  if (reports.length === 0) {
    return (
      <p className="text-xs text-gray-500">
        No previous reports. Generate your first one above.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500">
          {reports.length} report{reports.length !== 1 ? "s" : ""}
        </p>
        <button onClick={refresh} className="text-gray-500 hover:text-gray-300">
          <Icon icon={RefreshCw} size="button" aria-label="Refresh" decorative={false} />
        </button>
      </div>
      {reports.map((r) => (
        <div
          key={r.id}
          className="flex items-center gap-3 rounded-xl bg-white/[0.02] px-3 py-2.5"
        >
          <Icon icon={FileText} size="button" className="shrink-0 text-gray-500" decorative />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-gray-200">
              {new Date(r.generatedAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
            <p className="text-[11px] text-gray-600">
              {new Date(r.periodStart).getFullYear()} —{" "}
              {new Date(r.periodEnd).getFullYear()}
            </p>
          </div>
          <button onClick={() => onOpen(r.id)} className="text-xs text-accent hover:underline">
            Open
          </button>
          <button
            onClick={() => deleteReport(r.id)}
            className="text-gray-600 hover:text-red-400"
            aria-label="Delete report"
          >
            <Icon icon={Trash2} size="button" decorative />
          </button>
        </div>
      ))}
    </div>
  );
}
