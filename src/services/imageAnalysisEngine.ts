import { openai, AI_MODELS, AI_VALUATION_DISCLAIMER } from "@/lib/openai";
import { z } from "zod";
import type { LabAnalysisResult } from "@/types/imageAnalysis";

const labSchema = z.object({
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
  estimatedEra: z.string().nullable(),
  estimatedCondition: z.string().nullable(),
  visibleWear: z.array(z.string()),
  authenticityIndicators: z.array(z.string()),
  possibleConcerns: z.array(z.string()),
  estimatedRarity: z.string().nullable(),
  valueRangeLow: z.number().nullable(),
  valueRangeHigh: z.number().nullable(),
  overallConfidence: z.number().min(0).max(100),
  sectionConfidences: z.array(
    z.object({
      section: z.enum(["identification", "condition", "authenticity", "rarity", "value"]),
      confidence: z.number().min(0).max(100),
      note: z.string(),
    })
  ),
  evidence: z.array(
    z.object({
      text: z.string(),
      category: z.enum(["authenticity", "condition", "identification", "concern"]),
      confidence: z.number().min(0).max(100),
    })
  ),
  keyObservations: z.array(z.string()),
  historicalBackground: z.string().nullable(),
  suggestedNextSteps: z.array(z.string()),
  conflictingSignals: z.array(z.string()),
});

const LAB_SYSTEM_PROMPT = `You are Vinci AI's professional collectible authentication and appraisal lab.
Given an image, produce a rigorous, evidence-based analysis. CRITICAL RULES:
- Never state certainty an image alone cannot support. If something is ambiguous, say so in conflictingSignals.
- Every claim in "evidence" must point to something actually visible (a label, wear pattern, printing detail, etc).
- overallConfidence and every sectionConfidence must be lower when the image is cropped, blurry, low-res, or shows
  only one angle. A single photo can rarely support >90% confidence on authenticity specifically.
- valueRangeLow/High are AI estimates only, never asserted as market fact.
- suggestedNextSteps should be concrete (e.g. "Photograph the back/serial number", "Get a professional grading opinion").
Respond ONLY as JSON matching the documented schema.`;

export async function runLabAnalysis(
  imageUrl: string
): Promise<Omit<LabAnalysisResult, "id" | "createdAt">> {
  const completion = await openai.chat.completions.create({
    model: AI_MODELS.vision,
    temperature: 0.2,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: LAB_SYSTEM_PROMPT },
      {
        role: "user",
        content: [
          { type: "text", text: "Analyze this collectible in full lab detail." },
          { type: "image_url", image_url: { url: imageUrl } },
        ],
      },
    ],
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) throw new Error("No response from vision model");

  const parsed = labSchema.parse(JSON.parse(raw));

  return {
    imageUrl,
    identification: parsed.identification,
    category: parsed.category,
    estimatedEra: parsed.estimatedEra,
    estimatedCondition: parsed.estimatedCondition,
    visibleWear: parsed.visibleWear,
    authenticityIndicators: parsed.authenticityIndicators,
    possibleConcerns: parsed.possibleConcerns,
    estimatedRarity: parsed.estimatedRarity,
    valueRangeLow: parsed.valueRangeLow,
    valueRangeHigh: parsed.valueRangeHigh,
    overallConfidence: parsed.overallConfidence,
    sectionConfidences: parsed.sectionConfidences,
    evidence: parsed.evidence,
    keyObservations: parsed.keyObservations,
    historicalBackground: parsed.historicalBackground,
    suggestedNextSteps: parsed.suggestedNextSteps,
    conflictingSignals: parsed.conflictingSignals,
    disclaimer: AI_VALUATION_DISCLAIMER,
  };
}
