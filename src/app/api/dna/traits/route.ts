import { resolveViewer } from "@/lib/viewer";
import { explainAllTraits } from "@/services/dnaExplainability";

export async function GET() {
  const { userId, demo } = await resolveViewer();
  if (demo) {
    return Response.json({
      traits: [
        { trait: "knowledge", score: 78, previousScore: 71, trend: "up", confidence: 88, explanation: "Your Knowledge score rose 7 points, driven by 8 verified memory facts and frequent AI chat engagement.", topMemories: ["Favorite Category", "Preferred Grading", "Budget"], topCollectibles: ["1986 Fleer Jordan Rookie", "Rolex Daytona"], evidenceCount: 22 },
        { trait: "research", score: 82, previousScore: 79, trend: "up", confidence: 91, explanation: "Research increased 3 points after 5 new image analyses and 4 conversations.", topMemories: ["Research Style", "Favorite Marketplace"], topCollectibles: ["Charizard Holo", "Action Comics #1"], evidenceCount: 28 },
        { trait: "authentication", score: 89, previousScore: 89, trend: "stable", confidence: 95, explanation: "Authentication Awareness held at 89, reflecting consistently high grading standards.", topMemories: ["Preferred Grading", "Authentication Preferences"], topCollectibles: ["1986 Fleer Jordan Rookie"], evidenceCount: 18 },
        { trait: "diversification", score: 68, previousScore: 62, trend: "up", confidence: 80, explanation: "Diversification improved 6 points as you added items across 2 new categories.", topMemories: ["Favorite Category", "Favorite Brand"], topCollectibles: ["Rolex Daytona", "Signed Jordan Jersey"], evidenceCount: 14 },
        { trait: "marketAwareness", score: 61, previousScore: 58, trend: "up", confidence: 72, explanation: "Market Awareness edged up 3 points based on recent valuation-focused conversations.", topMemories: ["Budget", "Risk Profile"], topCollectibles: ["1986 Fleer Jordan Rookie"], evidenceCount: 10 },
        { trait: "longTermVision", score: 76, previousScore: 74, trend: "up", confidence: 85, explanation: "Long-Term Vision increased 2 points, supported by your pinned goal and locked memory facts.", topMemories: ["Collection Goals", "Long-term Goal"], topCollectibles: [], evidenceCount: 9 },
      ],
      demo: true,
    });
  }
  const traits = await explainAllTraits(userId);
  return Response.json({ traits, demo: false });
}
