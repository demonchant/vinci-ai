"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Search, Plus, SlidersHorizontal } from "@/components/ui/icons";
import { Icon } from "@/components/ui/Icon";
import { useCollectionFilters } from "@/hooks/useCollectionFilters";
import { useBulkSelection } from "@/hooks/useBulkSelection";
import { useCollection } from "@/hooks/useCollection";
import { CollectionSidebar } from "@/components/collection/sidebar/CollectionSidebar";
import { ViewSwitcher } from "@/components/collection/ViewSwitcher";
import { GridView } from "@/components/collection/grid/GridView";
import { ListView } from "@/components/collection/list/ListView";
import { TableView } from "@/components/collection/table/TableView";
import { GalleryView } from "@/components/collection/gallery/GalleryView";
import { TimelineView } from "@/components/collection/timeline/TimelineView";
import { BulkActionBar } from "@/components/collection/bulk-actions/BulkActionBar";
import { ImportDialog } from "@/components/collection/import/ImportDialog";
import { ExportButton } from "@/components/collection/export/ExportButton";
import { CollectionDashboard } from "@/components/collection/CollectionDashboard";
import type { PortfolioStats } from "@/types/collection";

const PortfolioAnalyticsCharts = dynamic(
  () =>
    import("@/components/collection/charts/PortfolioAnalyticsCharts").then(
      (m) => m.PortfolioAnalyticsCharts
    ),
  { loading: () => <div className="h-40 animate-pulse rounded-2xl bg-white/5" /> }
);

export default function CollectionPage() {
  const { filters, updateFilter, clearFilters, viewMode, setViewMode } = useCollectionFilters();
  const { items, isLoading, refresh } = useCollection(filters);
  // ✅ FIX: Removed unused 'selectAll'
  const { selected, toggle, clear, count } = useBulkSelection();
  const [stats, setStats] = useState<PortfolioStats | null>(null);
  const [insights, setInsights] = useState<string[]>([]);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    fetch("/api/collection/stats")
      .then((r) => r.json())
      .then((d) => {
        setStats(d.stats ?? null);
        setInsights(d.insights ?? []);
      });
  }, [items.length]);

  async function handleBulkAction(action: string) {
    const statusMap: Record<string, string> = {
      set_status_archived: "set_status",
      set_status_favorite: "set_status",
    };
    const resolvedAction = statusMap[action] ?? action;
    const statusValue =
      action === "set_status_archived" ? "SOLD" : action === "set_status_favorite" ? "FAVORITE" : undefined;

    if (action === "delete" && !window.confirm(`Delete ${count} items? This cannot be undone.`)) return;

    await fetch("/api/collection/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: resolvedAction, ids: selected, status: statusValue }),
    });
    clear();
    refresh();
  }

  const emptyState = !isLoading && items.length === 0;

  return (
    <div className="flex h-screen">
      {sidebarOpen && (
        <CollectionSidebar filters={filters} onUpdate={updateFilter} onClear={clearFilters} />
      )}

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-3 border-b border-white/5 p-4">
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            aria-label="Toggle sidebar"
            className="text-gray-500 hover:text-gray-300"
          >
            <Icon icon={SlidersHorizontal} size="button" />
          </button>
          <div className="relative flex-1">
            <Icon
              icon={Search}
              size="button"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              value={filters.query ?? ""}
              onChange={(e) => updateFilter("query", e.target.value || undefined)}
              placeholder="Search by title, brand, franchise, notes, or tag"
              className="w-full rounded-xl bg-white/5 border border-white/10 py-2 pl-9 pr-3 text-sm outline-none focus:border-primary"
            />
          </div>
          <ViewSwitcher value={viewMode} onChange={setViewMode} />
          <button
            onClick={() => setShowAnalytics((v) => !v)}
            className="rounded-xl bg-white/5 px-3 py-2 text-xs text-gray-300 hover:bg-white/10"
          >
            Analytics
          </button>
          <ImportDialog onImported={refresh} />
          <ExportButton />
          <button className="rounded-xl bg-primary px-3 py-2 text-xs font-medium text-white shadow-glow">
            <Icon icon={Plus} size="button" decorative className="inline mr-1" />
            Add
          </button>
        </div>

        {/* Analytics strip */}
        {showAnalytics && stats && (
          <div className="border-b border-white/5 p-4 space-y-4 overflow-auto">
            <CollectionDashboard stats={stats} />
            <PortfolioAnalyticsCharts stats={stats} />
            {insights.length > 0 && (
              <ul className="space-y-1">
                {insights.map((i, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 text-xs text-gray-400">
                    <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-primary" />
                    {i}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Main content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading && (
            <div className="grid grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-48 animate-pulse rounded-2xl bg-white/5" />
              ))}
            </div>
          )}

          {!isLoading && emptyState && (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="text-gray-400">No items found.</p>
              <p className="mt-1 text-sm text-gray-600">
                {Object.keys(filters).length > 0
                  ? "Try adjusting your filters."
                  : "Add your first collectible or import from CSV / JSON."}
              </p>
            </div>
          )}

          {!isLoading && !emptyState && (
            <>
              {viewMode === "grid" && (
                <GridView items={items} selected={selected} onToggleSelect={toggle} />
              )}
              {viewMode === "list" && (
                <ListView items={items} selected={selected} onToggleSelect={toggle} />
              )}
              {viewMode === "table" && <TableView items={items} />}
              {viewMode === "gallery" && <GalleryView items={items} />}
              {viewMode === "timeline" && <TimelineView items={items} />}
            </>
          )}
        </div>
      </div>

      <BulkActionBar count={count} onAction={handleBulkAction} onClear={clear} />
    </div>
  );
}