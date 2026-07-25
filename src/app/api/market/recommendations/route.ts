import { resolveViewer } from "@/lib/viewer";
import { getCollection } from "@/services/dataSource";
import { computeCategoryPerformance } from "@/services/marketAnalytics";
import { generateRecommendations, detectOpportunities } from "@/services/marketRecommendation";
import type { Collectible } from "@/types/collectible";

type CollectionResponse = {
  items: Collectible[];
};

export async function GET() {
  const { userId, demo } = await resolveViewer();

  // Removed unused getMarketPulse call and insights variable
  const collectiblesRaw = await getCollection(userId, demo);

  const collectibles: Collectible[] = Array.isArray(collectiblesRaw)
    ? collectiblesRaw
    : (collectiblesRaw as CollectionResponse).items ?? [];

  const categoryPerformance = await computeCategoryPerformance(collectibles);
  const recommendations = await generateRecommendations(collectibles, categoryPerformance);
  const opportunities = await detectOpportunities(collectibles, categoryPerformance);

  return Response.json({ recommendations, opportunities, demo });
}