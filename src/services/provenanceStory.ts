import { openai, AI_MODELS } from "@/lib/openai";
import type { ProvenanceEvent } from "@/types/provenance";

/**
 * Writes the "AI Story" paragraph for a collectible's timeline. The model
 * is given ONLY the real event list — titles, dates, confidence deltas —
 * and instructed never to state a fact, date, or number not present in
 * that list. If there are too few events for a meaningful story, returns
 * a short honest line instead of padding with invented narrative.
 */
export async function generateProvenanceStory(
  collectibleTitle: string,
  events: ProvenanceEvent[]
): Promise<string> {
  if (events.length === 0) {
    return `No history yet for ${collectibleTitle}.`;
  }
  if (events.length === 1) {
    return `${collectibleTitle} was added on ${new Date(
      events[0]!.createdAt
    ).toLocaleDateString()}. Its story will grow as Vinci AI learns more about it.`;
  }

  const completion = await openai.chat.completions.create({
    model: AI_MODELS.chat,
    temperature: 0.4,
    messages: [
      {
        role: "system",
        content: `You write a short (3-5 sentence) natural-language history of a collector's item for a
"Visual Provenance Timeline." You are given the REAL chronological event list — never invent a date,
percentage, or fact not present in it. If confidence increased, say by how much, using only the given
numbers. Plain language, no markdown, no bullet points.`,
      },
      {
        role: "user",
        content: JSON.stringify({
          title: collectibleTitle,
          events: events.map((e) => ({
            date: e.createdAt,
            type: e.eventType,
            title: e.eventTitle,
            confidence: e.confidence,
          })),
        }),
      },
    ],
  });

  return (
    completion.choices[0]?.message?.content?.trim() ??
    `${collectibleTitle} has ${events.length} recorded events in its timeline.`
  );
}
