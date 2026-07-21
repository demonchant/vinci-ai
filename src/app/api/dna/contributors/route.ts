import { resolveViewer } from "@/lib/viewer";
import { rankDNAContributors, computeDNAStability } from "@/services/dnaAnalytics";

export async function GET() {
  const { userId, demo } = await resolveViewer();
  if (demo) {
    return Response.json({
      contributors: [
        { kind: "collectible", id: "demo-7", label: "1986 Fleer Michael Jordan Rookie", dimension: "Collection Quality", impact: 100 },
        { kind: "memory", id: "demo-memory-favorite_category", label: "Favorite Category", dimension: "Knowledge", impact: 90 },
        { kind: "conversation", id: "demo-chat-1", label: "Pokémon Card Valuation", dimension: "Research", impact: 80 },
      ],
      stability: { label: "Stable", score: 88, explanation: "Your Collector DNA has remained consistent over the past 12 snapshots." },
      demo: true,
    });
  }
  const [contributors, stability] = await Promise.all([
    rankDNAContributors(userId),
    computeDNAStability(userId),
  ]);
  return Response.json({ contributors, stability, demo: false });
}
