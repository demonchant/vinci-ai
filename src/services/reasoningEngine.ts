import { prisma } from "@/lib/prisma";
import { openai, AI_MODELS } from "@/lib/openai";

interface ReasoningInputs {
  checkpointId: string;
  memoryChanges: { key: string; label: string; before: unknown; after: unknown }[];
  dnaChanges: { metric: string; before: number; after: number }[];
  sources: string[];
  activitySummary: string;
}

/**
 * Confidence is computed, not guessed: more independent corroborating
 * signals (multiple memory facts + DNA shifts agreeing, multiple sources)
 * means higher confidence. This keeps "Why I Changed" honest — it can't
 * claim high confidence off a single weak signal.
 */
function computeConfidence(inputs: ReasoningInputs): number {
  const signalCount = inputs.memoryChanges.length + inputs.dnaChanges.length;
  const sourceCount = inputs.sources.length;
  const base = 50 + signalCount * 8 + sourceCount * 4;
  return Math.max(30, Math.min(97, base));
}

export async function generateReasoning(inputs: ReasoningInputs) {
  const confidence = computeConfidence(inputs);

  const completion = await openai.chat.completions.create({
    model: AI_MODELS.chat,
    temperature: 0.3,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You explain why an AI collectibles assistant just updated a user's Collector Memory
and/or Collector DNA, for a "Why I Changed" transparency panel. You are given the ACTUAL diffs —
never invent a change, number, or source that isn't in the input. Write in plain, human language.
Respond as JSON:
{
  "reason": string (2-3 sentences, human-readable, references the actual changes given),
  "evidence": [{ "text": string, "source": string, "confidence": number }] (derived only from the sources/activitySummary given, 1-4 items)
}`,
      },
      { role: "user", content: JSON.stringify(inputs) },
    ],
  });

  const raw = completion.choices[0]?.message?.content;
  const parsed = raw
    ? JSON.parse(raw)
    : {
        reason: "Collector Memory and/or Collector DNA were updated based on this conversation.",
        evidence: [],
      };

  const evidence = (parsed.evidence ?? []).map(
    (e: { text: string; source: string; confidence?: number }) => ({
      text: e.text,
      source: e.source,
      timestamp: new Date().toISOString(),
      confidence: e.confidence ?? confidence,
    })
  );

  const record = await prisma.aIReasoning.create({
    data: {
      checkpointId: inputs.checkpointId,
      reason: parsed.reason,
      evidence,
      confidence,
      memoryImpact: inputs.memoryChanges,
      dnaImpact: inputs.dnaChanges,
      sources: inputs.sources,
      modelVersion: AI_MODELS.chat,
    },
  });

  return {
    id: record.id,
    reason: record.reason,
    confidence: record.confidence,
    evidence,
    memoryImpact: inputs.memoryChanges,
    dnaImpact: inputs.dnaChanges,
  };
}
