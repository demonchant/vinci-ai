"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import { OverviewCounters } from "@/components/memory/OverviewCounters";
import { KnowledgeCategoryGrid } from "@/components/memory/KnowledgeCategoryGrid";
import { MemoryTimeline } from "@/components/memory/MemoryTimeline";
import { SuggestionsPanel } from "@/components/memory/SuggestionsPanel";
import { MemoryHealthPanel } from "@/components/memory/MemoryHealthPanel";
import { MemoryToolbar } from "@/components/memory/MemoryToolbar";
import type { CollectorMemoryFact } from "@/types/memory";
import type { CategoryGroup, MemoryOverviewStats, MemoryHealth } from "@/services/memoryAnalyticsService";
import type { GraphNode, GraphEdge } from "@/services/memoryGraphService";

const MemoryGraphView = dynamic(
  () => import("@/components/memory/MemoryGraphView").then((m) => m.MemoryGraphView),
  { loading: () => <div className="h-[420px] animate-pulse rounded-2xl bg-white/5" /> }
);

export default function MemoryPage() {
  const [demo, setDemo] = useState(false);
  const [stats, setStats] = useState<MemoryOverviewStats | null>(null);
  const [categories, setCategories] = useState<CategoryGroup[]>([]);
  const [health, setHealth] = useState<MemoryHealth | null>(null);
  const [graph, setGraph] = useState<{ nodes: GraphNode[]; edges: GraphEdge[] }>({ nodes: [], edges: [] });
  const [timeline, setTimeline] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"categories" | "graph" | "timeline">("categories");

  const refreshAll = useCallback(async () => {
    const [factsRes, statsRes, catRes, healthRes, graphRes, timelineRes, suggestionsRes] = await Promise.all([
      fetch("/api/memory").then((r) => r.json()),
      fetch("/api/memory/stats").then((r) => r.json()),
      fetch("/api/memory/categories").then((r) => r.json()),
      fetch("/api/memory/health").then((r) => r.json()),
      fetch("/api/memory/graph").then((r) => r.json()),
      fetch("/api/memory/timeline").then((r) => r.json()),
      fetch("/api/memory/suggestions").then((r) => r.json()),
    ]);
    setDemo(Boolean(factsRes.demo));
    setStats(statsRes.stats);
    setCategories(catRes.categories ?? []);
    setHealth(healthRes.health);
    setGraph(graphRes);
    setTimeline(timelineRes.timeline ?? []);
    setSuggestions(suggestionsRes.suggestions ?? []);
  }, []);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  async function handleMutate(memoryId: string, action: string, value?: string) {
    await fetch("/api/memory", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ memoryId, action, value }),
    });
    refreshAll();
  }

  async function handleSuggestion(id: string, action: "accept" | "ignore" | "never_ask") {
    await fetch("/api/memory/suggestions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ suggestionId: id, action }),
    });
    setSuggestions((prev) => prev.filter((s) => s.id !== id));
    if (action === "accept") refreshAll();
  }

  async function handleBulk(action: string) {
    await fetch("/api/memory/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    refreshAll();
  }

  const filteredCategories = useMemo(() => {
    if (!query.trim()) return categories;
    const q = query.toLowerCase();
    return categories
      .map((g) => ({
        ...g,
        facts: g.facts.filter(
          (f: CollectorMemoryFact) =>
            f.label.toLowerCase().includes(q) ||
            String(f.value).toLowerCase().includes(q) ||
            g.category.toLowerCase().includes(q) ||
            f.source.toLowerCase().includes(q)
        ),
      }))
      .filter((g) => g.facts.length > 0);
  }, [categories, query]);

  if (!stats || !health) {
    return (
      <div className="container py-10">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-white/5" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl">Collector Memory</h1>
          <p className="mt-1 text-sm text-gray-500">
            What Vinci AI knows about you, why it knows it, and how confident it is.
          </p>
        </div>
      </div>

      <div className="mt-6">
        <OverviewCounters stats={stats} />
      </div>

      <div className="mt-6">
        <MemoryToolbar
          query={query}
          onQueryChange={setQuery}
          demo={demo}
          onVerifyAll={() => handleBulk("verify_all")}
          onRecalculate={() => handleBulk("recalculate_confidence")}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div>
          <div className="mb-4 flex gap-1 rounded-lg bg-white/5 p-1 w-fit">
            {(["categories", "graph", "timeline"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium capitalize transition ${
                  tab === t ? "bg-primary text-white" : "text-gray-400"
                }`}
              >
                {t === "graph" ? "Knowledge Graph" : t}
              </button>
            ))}
          </div>

          {tab === "categories" && (
            <KnowledgeCategoryGrid groups={filteredCategories} demo={demo} onMutate={handleMutate} />
          )}
          {tab === "graph" && <MemoryGraphView nodes={graph.nodes} edges={graph.edges} />}
          {tab === "timeline" && <MemoryTimeline entries={timeline} />}
        </div>

        <div className="space-y-6">
          <div className="glass rounded-2xl p-5">
            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-500">
              AI Suggestions
            </p>
            <SuggestionsPanel suggestions={suggestions} demo={demo} onResolve={handleSuggestion} />
          </div>

          <div className="glass rounded-2xl p-5">
            <MemoryHealthPanel health={health} />
          </div>
        </div>
      </div>
    </div>
  );
}
