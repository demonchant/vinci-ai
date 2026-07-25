import { resolveViewer } from "@/lib/viewer";
import { getCollection } from "@/services/dataSource";
import { valuatePortfolio } from "@/services/marketValuation";
import { computePortfolioRisk, computeDiversificationAnalysis } from "@/services/marketRisk";
import type { Collectible } from "@/types/collectible";

type CollectionResponse = {
  items: Collectible[];
};

export async function GET() {
  const { userId, demo } = await resolveViewer();
  const collectiblesRaw = await getCollection(userId, demo);
  
  const collectibles: Collectible[] = Array.isArray(collectiblesRaw)
    ? collectiblesRaw
    : (collectiblesRaw as CollectionResponse).items ?? [];

  const valuation = await valuatePortfolio(collectibles);
  const risk = computePortfolioRisk(collectibles);
  const diversification = computeDiversificationAnalysis(collectibles);

  return Response.json({ valuation, risk, diversification, demo });
}