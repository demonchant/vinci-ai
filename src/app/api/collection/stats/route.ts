import { resolveViewer } from "@/lib/viewer";
import { computePortfolioStats, generatePortfolioInsights } from "@/services/collectionAnalytics";
import { demoCollection } from "@/demo/fixtures/demoCollection";
import { demoProfile } from "@/demo/fixtures/demoProfile";

export async function GET() {
  const { userId, demo } = await resolveViewer();

  if (demo) {
    const categoryCounts: Record<string, number> = {};
    for (const item of demoCollection) {
      categoryCounts[item.category] = (categoryCounts[item.category] ?? 0) + 1;
    }
    return Response.json({
      stats: {
        totalItems: demoProfile.collectionSize,
        totalValue: demoProfile.collectionValue,
        averageConditionLabel: "Near Mint",
        authenticationRatePct: 89,
        averageConfidence: 91,
        diversificationScore: 68,
        portfolioHealthScore: 89,
        growth: [
          { period: "2024-01", value: 8000 },
          { period: "2024-06", value: 56300 },
          { period: "2025-06", value: 84200 },
        ],
        categoryDistribution: Object.entries(categoryCounts).map(([category, count]) => ({
          category,
          count,
          value: 0,
        })),
        conditionDistribution: [
          { condition: "Near Mint", count: 9 },
          { condition: "Mint", count: 5 },
        ],
        authenticationDistribution: [
          { label: "Authenticated", count: 12 },
          { label: "Unverified", count: 2 },
        ],
        valueDistribution: [
          { bucket: "$0–100", count: 2 },
          { bucket: "$100–500", count: 4 },
          { bucket: "$500–2,000", count: 3 },
          { bucket: "$2,000–10,000", count: 3 },
          { bucket: "$10,000+", count: 2 },
        ],
      },
      insights: [
        "Vintage Pokémon and watches make up over half your portfolio value.",
        "Authentication confidence has improved alongside your grading habits.",
      ],
      demo: true,
    });
  }

  const stats = await computePortfolioStats(userId);
  const insights = await generatePortfolioInsights(stats);
  return Response.json({ stats, insights, demo: false });
}
