import { openai, AI_MODELS } from "@/lib/openai";
import type { CollectorDNA } from "@/types/dna";

interface BriefInputs {
  displayName: string;
  dna: CollectorDNA;
  recentActivityDescriptions: string[];
  collectionSize: number;
}

const DEMO_BRIEF =
  'Good morning. Your vintage collection continues to outperform your modern collection. A recently analyzed sports card shares characteristics with three items you already own. You are close to unlocking the "Research Master" achievement.';

export async function generateDailyBrief(inputs: BriefInputs, demo: boolean): Promise<string> {
  if (demo) return DEMO_BRIEF;

  if (inputs.collectionSize === 0 && inputs.recentActivityDescriptions.length === 0) {
    return "Good morning. Your collection is empty so far — add a collectible or analyze a photo to get your first personalized briefing.";
  }

  const completion = await openai.chat.completions.create({
    model: AI_MODELS.chat,
    temperature: 0.5,
    messages: [
      {
        role: "system",
        content: `You write a short, warm, 2-3 sentence "Good morning" briefing for a collectibles collector,
grounded ONLY in the real signals provided — never invent specific items, numbers, or events not given.
Natural language, no bullet points, no markdown.`,
      },
      { role: "user", content: JSON.stringify(inputs) },
    ],
  });

  return (
    completion.choices[0]?.message?.content?.trim() ??
    `Good morning. Your Collector DNA score is ${inputs.dna.dnaScore} and trending with your recent activity.`
  );
}
