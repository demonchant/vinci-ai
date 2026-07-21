import { openai, AI_MODELS } from "@/lib/openai";
import { prisma } from "@/lib/prisma";
import { getMemoryProfile } from "./memoryService";

export interface CoachCard {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  recommendations: string[];
  generatedAt: string;
}

export async function generateCoachCard(userId: string): Promise<CoachCard> {
  const [dnaSnap, { facts }] = await Promise.all([
    prisma.dNASnapshot.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } }),
    getMemoryProfile(userId),
  ]);

  const scores = dnaSnap?.scores ?? {};
  const memoryKeys = facts.slice(0, 8).map((f) => ({ label: f.label, value: f.value }));

  const completion = await openai.chat.completions.create({
    model: AI_MODELS.chat,
    temperature: 0.4,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You are an elite collectibles coach for Vinci AI. Given a collector's real DNA trait
scores and key memory facts, write a coaching card. STRICT RULES:
- Every strength, weakness, opportunity, and recommendation must reference a real score or fact given.
- Do NOT cite a trait score not present in the input.
- Keep all items to 1-2 concise sentences.
- Provide exactly 3 of each.
Respond as JSON: { "strengths": string[], "weaknesses": string[], "opportunities": string[], "recommendations": string[] }`,
      },
      {
        role: "user",
        content: JSON.stringify({ dnaScores: scores, memoryFacts: memoryKeys }),
      },
    ],
  });

  const raw = completion.choices[0]?.message?.content;
  const parsed = raw ? JSON.parse(raw) : {};

  return {
    strengths: parsed.strengths ?? [],
    weaknesses: parsed.weaknesses ?? [],
    opportunities: parsed.opportunities ?? [],
    recommendations: parsed.recommendations ?? [],
    generatedAt: new Date().toISOString(),
  };
}
