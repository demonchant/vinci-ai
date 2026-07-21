import { resolveViewer } from "@/lib/viewer";
import { getMarketPulse, getCollection } from "@/services/dataSource";
import { valuatePortfolio } from "@/services/marketValuation";
import { computeCategoryPerformance, computeMarketSentiment, buildMarketTimeline } from "@/services/marketAnalytics";
import { generateRecommendations, detectOpportunities } from "@/services/marketRecommendation";
import { computePortfolioRisk } from "@/services/marketRisk";
import { getAlerts, getWatchlists } from "@/services/watchlist";
import type { MarketDashboard } from "@/types/market";

export async function GET() {
  const { userId, demo } = await resolveViewer();

  const [insights, collectiblesRaw, alerts, watchlists] = await Promise.all([
    getMarketPulse(demo),
    getCollection(userId, demo),
    getAlerts(userId, demo),
    getWatchlists(userId, demo),
  ]);

  const collectibles = Array.isArray(collectiblesRaw)
    ? collectiblesRaw
    : (collectiblesRaw as any)?.items ?? [];
  const valuation = await valuatePortfolio(collectibles);
  const categoryPerformance = await computeCategoryPerformance(collectibles);
  const sentiment = computeMarketSentiment(insights, categoryPerformance);
  const timeline = buildMarketTimeline(insights, collectibles);
  const recommendations = await generateRecommendations(collectibles, categoryPerformance);
  const opportunities = await detectOpportunities(collectibles, categoryPerformance);
  const risk = computePortfolioRisk(collectibles);

  const unreadAlerts = alerts.filter((a) => a.status === "unread");
  valuation.activeAlerts = unreadAlerts.length;

  const watchlistSummary = {
    total: watchlists.reduce((s, w) => s + w.itemCount, 0),
    withOpportunities: watchlists.reduce(
      (s, w) => s + w.items.filter((i) => (i.opportunityScore ?? 0) > 50).length,
      0
    ),
    highPriority: watchlists.reduce(
      (s, w) => s + w.items.filter((i) => i.priority === "high").length,
      0
    ),
  };

  const dashboard: MarketDashboard = {
    valuation,
    sentiment,
    categoryPerformance,
    recentTimeline: timeline.slice(0, 20),
    topRecommendations: recommendations.slice(0, 5),
    activeAlerts: unreadAlerts.slice(0, 5),
    opportunities: opportunities.slice(0, 5),
    risk,
    watchlistSummary,
  };

  return Response.json({ dashboard, demo });
}
