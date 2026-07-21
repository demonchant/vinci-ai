"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { useMarket } from "@/hooks/useMarket";
import { useAlerts } from "@/hooks/useAlerts";
import { useWatchlists } from "@/hooks/useWatchlists";
import { usePortfolio } from "@/hooks/usePortfolio";
import {
  MarketStats,
  SentimentIndicator,
  CategoryHeatmap,
  RecommendationPanel,
  RiskPanel,
  MarketTimeline,
  AlertsPanel,
  WatchlistPanel,
  OpportunitiesPanel,
  PriceChart,
  DiversificationChart,
  MarketExportButton,
} from "@/components/market";
import { RefreshCw, TrendingUp } from "@/components/ui/icons";

export default function MarketPage() {
  const { dashboard, isLoading, error, demo, refresh } = useMarket();
  const { alerts, updateStatus } = useAlerts();
  const { watchlists } = useWatchlists();
  const { diversification } = usePortfolio();

  if (isLoading) {
    return <MarketSkeleton />;
  }

  if (error) {
    return (
      <div className="container py-10">
        <div className="glass rounded-xl p-8 text-center">
          <p className="text-sm text-red-400">{error}</p>
          <button onClick={refresh} className="mt-3 text-xs text-primary hover:text-primary/80">
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!dashboard) return null;

  return (
    <div className="container max-w-[1600px] py-6">
      {/* Header */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="flex items-center justify-between"
      >
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" strokeWidth={2} />
            <h1 className="font-display text-2xl font-semibold text-gradient">
              Market Intelligence
            </h1>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            AI-powered market analysis and recommendations for your collection.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {dashboard && <MarketExportButton dashboard={dashboard} />}
          <button
            onClick={refresh}
            className="flex items-center gap-1.5 rounded-xl bg-white/5 px-3 py-2 text-xs font-medium text-gray-400 transition hover:bg-white/10 hover:text-gray-300"
          >
            <RefreshCw className="h-3.5 w-3.5" strokeWidth={2} />
            Refresh
          </button>
        </div>
      </motion.div>

      {demo && (
        <div className="mt-3 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2">
          <p className="text-xs text-primary/80">
            Viewing demonstration data. Connect a market data provider for live intelligence.
          </p>
        </div>
      )}

      {/* Stats Row */}
      <div className="mt-6">
        <MarketStats valuation={dashboard.valuation} />
      </div>

      {/* Three-column layout */}
      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        {/* LEFT COLUMN */}
        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          animate="visible"
          className="space-y-4 lg:col-span-3"
        >
          <WatchlistPanel watchlists={watchlists} />
          <AlertsPanel alerts={alerts} onMarkRead={(id) => updateStatus(id, "read")} />
        </motion.div>

        {/* CENTER COLUMN */}
        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          animate="visible"
          className="space-y-4 lg:col-span-5"
        >
          <SentimentIndicator sentiment={dashboard.sentiment} />
          <CategoryHeatmap categories={dashboard.categoryPerformance} />
          {dashboard.categoryPerformance.length > 0 && (
            <PriceChart
              history={generateDemoHistory(dashboard.valuation.totalEstimatedValue)}
              title="Portfolio Value Trend"
            />
          )}
          {diversification && <DiversificationChart analysis={diversification} />}
        </motion.div>

        {/* RIGHT COLUMN */}
        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          animate="visible"
          className="space-y-4 lg:col-span-4"
        >
          <RecommendationPanel recommendations={dashboard.topRecommendations} />
          <RiskPanel risk={dashboard.risk} />
          <OpportunitiesPanel opportunities={dashboard.opportunities} />
          <MarketTimeline events={dashboard.recentTimeline} />
        </motion.div>
      </div>
    </div>
  );
}

function generateDemoHistory(baseValue: number) {
  const points = [];
  for (let i = 11; i >= 0; i--) {
    const date = new Date(Date.now() - i * 30 * 24 * 60 * 60 * 1000);
    const growth = 1 + (11 - i) * 0.015 + Math.sin(i * 0.8) * 0.03;
    points.push({
      date: date.toISOString(),
      value: Math.round(baseValue * growth * 0.85),
      source: "Portfolio",
      confidence: 0.7,
    });
  }
  return points;
}

function MarketSkeleton() {
  return (
    <div className="container max-w-[1600px] py-6">
      <div className="h-8 w-64 animate-pulse rounded-lg bg-white/5" />
      <div className="mt-2 h-4 w-96 animate-pulse rounded bg-white/5" />
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-20 animate-pulse rounded-xl bg-white/5" />
        ))}
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-3">
          <div className="h-48 animate-pulse rounded-xl bg-white/5" />
          <div className="h-36 animate-pulse rounded-xl bg-white/5" />
        </div>
        <div className="space-y-4 lg:col-span-5">
          <div className="h-24 animate-pulse rounded-xl bg-white/5" />
          <div className="h-48 animate-pulse rounded-xl bg-white/5" />
          <div className="h-40 animate-pulse rounded-xl bg-white/5" />
        </div>
        <div className="space-y-4 lg:col-span-4">
          <div className="h-64 animate-pulse rounded-xl bg-white/5" />
          <div className="h-48 animate-pulse rounded-xl bg-white/5" />
        </div>
      </div>
    </div>
  );
}
