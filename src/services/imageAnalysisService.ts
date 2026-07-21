import { prisma } from "@/lib/prisma";
import { openai, AI_MODELS, AI_VALUATION_DISCLAIMER } from "@/lib/openai";
import { logActivity } from "./activityLogService";
import { z } from "zod";

const analysisSchema = z.object({
  identification: z.string(),
  category: z
    .enum([
      "TRADING_CARD",
      "SPORTS_CARD",
      "COMIC",
      "WATCH",
      "SNEAKER",
      "COIN",
      "NFT",
      "FIGURE",
      "MEMORABILIA",
      "OTHER",
    ])
    .nullable(),
  estimatedRarity: z.string().nullable(),
  condition: z.string().nullable(),
  authenticity: z.string(),
  historicalNote: z.string().nullable(),
  valueRangeLow: z.number().nullable(),
  valueRangeHigh: z.number().nullable(),
  confidenceScore: z.number().min(0).max(100),
  interestingFact: z.string().nullable(),
  similarItems: z.array(z.object({ title: z.string(), note: z.string() })),
});

const SYSTEM_PROMPT = `You are Vinci AI's collectible vision analyst. Given an image of a collectible
(Pokemon/trading card, sports card, watch, sneaker, coin, NFT screenshot, comic, figure, or memorabilia),
identify it and assess it. Be honest about uncertainty — lower the confidenceScore when the image is
unclear, cropped, or the item is hard to verify. Never claim certainty about authenticity from a photo alone;
describe only what visual cues support or undermine authenticity.
Respond ONLY as JSON matching this shape:
{
  "identification": string,
  "category": "TRADING_CARD"|"SPORTS_CARD"|"COMIC"|"WATCH"|"SNEAKER"|"COIN"|"NFT"|"FIGURE"|"MEMORABILIA"|"OTHER"|null,
  "estimatedRarity": string|null,
  "condition": string|null,
  "authenticity": string,
  "historicalNote": string|null,
  "valueRangeLow": number|null,
  "valueRangeHigh": number|null,
  "confidenceScore": number,
  "interestingFact": string|null,
  "similarItems": [{ "title": string, "note": string }]
}`;

export async function analyzeCollectibleImage(
  userId: string,
  imageUrl: string,
  collectibleId?: string
) {
  const completion = await openai.chat.completions.create({
    model: AI_MODELS.vision,
    temperature: 0.2,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: [
          { type: "text", text: "Analyze this collectible." },
          { type: "image_url", image_url: { url: imageUrl } },
        ],
      },
    ],
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) throw new Error("No response from vision model");

  const parsed = analysisSchema.parse(JSON.parse(raw));

  const record = await prisma.imageAnalysis.create({
    data: {
      userId,
      collectibleId,
      imageUrl,
      identification: parsed.identification,
      category: parsed.category ?? undefined,
      estimatedRarity: parsed.estimatedRarity,
      condition: parsed.condition,
      authenticity: parsed.authenticity,
      historicalNote: parsed.historicalNote,
      valueRangeLow: parsed.valueRangeLow,
      valueRangeHigh: parsed.valueRangeHigh,
      confidenceScore: parsed.confidenceScore,
      interestingFact: parsed.interestingFact,
      similarItems: parsed.similarItems,
      rawModelOutput: parsed,
    },
  });

  await logActivity(userId, "IMAGE_ANALYZED", { analysisId: record.id, collectibleId });

  return { ...record, disclaimer: AI_VALUATION_DISCLAIMER };
}

export async function getAnalysisHistory(userId: string, limit = 20) {
  return prisma.imageAnalysis.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}
