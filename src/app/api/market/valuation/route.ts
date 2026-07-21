import { resolveViewer } from "@/lib/viewer";
import { getCollection } from "@/services/dataSource";
import { valuatePortfolio } from "@/services/marketValuation";
import { computePortfolioRisk, computeDiversificationAnalysis } from "@/services/marketRisk";

export async function GET() {
  const { userId, demo } = await resolveViewer();
  const collectiblesRaw = await getCollection(userId, demo);
  const collectibles = Array.isArray(collectiblesRaw)
    ? collectiblesRaw
    : (collectiblesRaw as any)?.items ?? [];

  const valuation = await valuatePortfolio(collectibles);
  const risk = computePortfolioRisk(collectibles);
  const diversification = computeDiversificationAnalysis(collectibles);

  return Response.json({ valuation, risk, diversification, demo });
}
