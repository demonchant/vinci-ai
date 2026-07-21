import { openai, AI_MODELS } from "@/lib/openai";
import type { ReplayFrame, ReplayMilestone, MilestoneType } from "@/types/replay";

export function detectMilestones(frames: ReplayFrame[]): ReplayMilestone[] {
  const milestones: ReplayMilestone[] = [];
  let largestDelta = 0;
  let largestDeltaIndex = -1;
  const seenTypes = new Set<MilestoneType>();

  for (let i = 0; i < frames.length; i++) {
    const frame = frames[i]!;
    const prev = i > 0 ? frames[i - 1]! : null;

    if (!seenTypes.has("FIRST_COLLECTIBLE") && frame.collectionSize >= 1) {
      seenTypes.add("FIRST_COLLECTIBLE");
      milestones.push({
        id: "m-first-collectible",
        frameIndex: i,
        type: "FIRST_COLLECTIBLE",
        label: "First Collectible",
        description: "Your collecting journey began.",
        dnaScore: frame.dnaScore,
        createdAt: frame.createdAt,
      });
    }

    if (!seenTypes.has("FIRST_ANALYSIS") && frame.trigger.toLowerCase().includes("analyz")) {
      seenTypes.add("FIRST_ANALYSIS");
      milestones.push({
        id: "m-first-analysis",
        frameIndex: i,
        type: "FIRST_ANALYSIS",
        label: "First Image Analysis",
        description: "Vinci AI analyzed your first collectible image.",
        dnaScore: frame.dnaScore,
        createdAt: frame.createdAt,
      });
    }

    if (prev && Math.floor(frame.dnaScore / 10) > Math.floor(prev.dnaScore / 10)) {
      milestones.push({
        id: `m-levelup-${i}`,
        frameIndex: i,
        type: "DNA_LEVEL_UP",
        label: `Level ${Math.floor(frame.dnaScore / 10) + 1} Collector`,
        description: `Your Collector DNA reached score ${frame.dnaScore}.`,
        dnaScore: frame.dnaScore,
        createdAt: frame.createdAt,
      });
    }

    if (frame.delta !== null && frame.delta > largestDelta) {
      largestDelta = frame.delta;
      largestDeltaIndex = i;
    }

    if (prev && frame.primaryType !== prev.primaryType) {
      milestones.push({
        id: `m-archetype-${i}`,
        frameIndex: i,
        type: "ARCHETYPE_SHIFT",
        label: `Became ${frame.primaryType}`,
        description: `Primary archetype shifted from ${prev.primaryType} to ${frame.primaryType}.`,
        dnaScore: frame.dnaScore,
        createdAt: frame.createdAt,
      });
    }
  }

  if (largestDeltaIndex >= 0 && largestDelta >= 3) {
    milestones.push({
      id: "m-largest-increase",
      frameIndex: largestDeltaIndex,
      type: "LARGEST_INCREASE",
      label: `Largest Single Increase (+${largestDelta})`,
      description: `DNA score increased by ${largestDelta} points in a single session.`,
      dnaScore: frames[largestDeltaIndex]!.dnaScore,
      createdAt: frames[largestDeltaIndex]!.createdAt,
    });
  }

  return milestones.sort((a, b) => a.frameIndex - b.frameIndex);
}

export async function generateReplayStory(
  frames: ReplayFrame[],
  milestones: ReplayMilestone[]
): Promise<string> {
  if (frames.length < 2) {
    return frames.length === 0
      ? "Your Collector DNA journey hasn't started yet."
      : `Your journey began on ${new Date(frames[0]!.createdAt).toLocaleDateString()}.`;
  }

  const first = frames[0]!;
  const last = frames[frames.length - 1]!;

  const completion = await openai.chat.completions.create({
    model: AI_MODELS.chat,
    temperature: 0.5,
    messages: [
      {
        role: "system",
        content: `Write a 3-5 sentence story narrating a collector's DNA evolution for their replay page.
Use ONLY the real events in the input. Never invent a date, fact, or percentage not present. Plain prose, past tense, no markdown.`,
      },
      {
        role: "user",
        content: JSON.stringify({
          startDate: first.createdAt,
          endDate: last.createdAt,
          startScore: first.dnaScore,
          endScore: last.dnaScore,
          totalGrowth: last.dnaScore - first.dnaScore,
          totalFrames: frames.length,
          startType: first.primaryType,
          endType: last.primaryType,
          milestones: milestones.slice(0, 6).map((m) => ({ label: m.label, date: m.createdAt })),
        }),
      },
    ],
  });

  return (
    completion.choices[0]?.message?.content?.trim() ??
    `Your Collector DNA grew from ${first.dnaScore} to ${last.dnaScore} across ${frames.length} snapshots.`
  );
}
