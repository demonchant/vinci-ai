import { resolveViewer } from "@/lib/viewer";
import { generateCoachCard } from "@/services/dnaCoach";

export async function GET() {
  const { userId, demo } = await resolveViewer();
  if (demo) {
    return Response.json({
      coach: {
        strengths: [
          "Your authentication rate of 89% is well above average, demonstrating exceptional diligence.",
          "Your Research score of 82 reflects deep engagement with AI chat and image analysis.",
          "Long-Term Vision remains consistently high across the last six snapshots.",
        ],
        weaknesses: [
          "Diversification could be broader — Pokémon dominates at over 40% of collection value.",
          "Market Awareness score of 61 suggests limited engagement with pricing trends.",
          "Selling Habits remain undeveloped — no sold items have been recorded.",
        ],
        opportunities: [
          "Adding one item from an underrepresented category would improve your Diversification score.",
          "Running a market insight session could meaningfully lift Market Awareness.",
          "Verifying remaining unconfirmed memories would push Knowledge confidence above 90.",
        ],
        recommendations: [
          "Analyze 3 more items with the Image Lab to close the gap toward Research Master.",
          "Set a price alert for the Jordan rookie to develop Market Awareness habits.",
          "Add a long-term goal in the Goals section to increase your Discipline score.",
        ],
        generatedAt: new Date().toISOString(),
      },
      demo: true,
    });
  }
  const coach = await generateCoachCard(userId);
  return Response.json({ coach, demo: false });
}
