import { resolveViewer } from "@/lib/viewer";
import { getMarketPulse, getCollection } from "@/services/dataSource";
import { computeCategoryPerformance } from "@/services/marketAnalytics";
import { generateRecommendations, detectOpportunities } from "@/services/marketRecommendation";

export async function GET() {
  const { userId, demo } = await resolveViewer();

  const [insights, collectiblesRaw] = await Promise.all([
    getMarketPulse(demo),
    getCollection(userId, demo),
  ]);

  const collectibles = Array.isArray(collectiblesRaw)
    ? collectiblesRaw
    : (collectiblesRaw as any)?.items ?? [];

  const categoryPerformance = await computeCategoryPerformance(collectibles);
  const recommendations = await generateRecommendations(collectibles, categoryPerformance);
  const opportunities = await detectOpportunities(collectibles, categoryPerformance);

  return Response.json({ recommendations, opportunities, demo });
}
