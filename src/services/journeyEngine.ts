import type { Collectible } from "@/types/collectible";
import type { CollectorMemoryFact } from "@/types/memory";
import type { CollectorDNA, CollectorArchetype } from "@/types/dna";
import type {
  CollectorJourney,
  JourneyMilestone,
  JourneyMilestoneType,
  JourneyChapter,
  JourneyStats,
} from "@/types/journey";
import { COLLECTIBLE_CATEGORY_LABELS } from "@/types/common";

export function buildCollectorJourney(
  collectibles: Collectible[],
  memories: CollectorMemoryFact[],
  dna: CollectorDNA,
  achievements: { title: string; unlockedAt: string | null }[]
): CollectorJourney {
  const milestones = detectMilestones(collectibles, memories, dna, achievements);
  const sortedMilestones = milestones.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const chapters = buildChapters(sortedMilestones, dna);
  const startDate = sortedMilestones[0]?.date ?? new Date().toISOString();

  const narrative = generateNarrative(chapters, dna);
  const nextHint = generateNextMilestoneHint(collectibles, memories, achievements);

  const totalMilestones = milestones.length;
  const journeyProgress = Math.min(100, Math.round(totalMilestones * 8));

  return {
    userId: "",
    startDate,
    totalMilestones,
    chapters,
    currentChapter: chapters[chapters.length - 1] ?? emptyChapter(dna),
    storyNarrative: narrative,
    journeyProgress,
    nextMilestoneHint: nextHint,
    computedAt: new Date().toISOString(),
  };
}

function detectMilestones(
  collectibles: Collectible[],
  memories: CollectorMemoryFact[],
  dna: CollectorDNA,
  achievements: { title: string; unlockedAt: string | null }[]
): JourneyMilestone[] {
  const milestones: JourneyMilestone[] = [];
  let idCounter = 0;
  const mkId = () => `jm-${++idCounter}`;

  const sorted = [...collectibles].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  if (sorted.length > 0) {
    const first = sorted[0]!;
    milestones.push({
      id: mkId(),
      type: "first_collectible",
      title: "First Collectible Added",
      description: `You added "${first.title}" — the beginning of your collection.`,
      date: new Date(first.createdAt).toISOString(),
      dnaScoreAtTime: 10,
      archetypeAtTime: dna.primaryType as CollectorArchetype,
      category: first.category,
      linkedConversationId: null,
      linkedCollectibleId: first.id,
      linkedMemoryKey: null,
      linkedReplayFrame: null,
      impact: "transformative",
    });
  }

  const firstAuth = sorted.find((c) => c.isAuthenticated);
  if (firstAuth) {
    milestones.push({
      id: mkId(),
      type: "first_authentication",
      title: "First Authentication",
      description: `"${firstAuth.title}" was authenticated — establishing trust in your collection.`,
      date: new Date(firstAuth.createdAt).toISOString(),
      dnaScoreAtTime: 20,
      archetypeAtTime: dna.primaryType as CollectorArchetype,
      category: firstAuth.category,
      linkedConversationId: null,
      linkedCollectibleId: firstAuth.id,
      linkedMemoryKey: null,
      linkedReplayFrame: null,
      impact: "major",
    });
  }

  if (memories.length > 0) {
    const sortedMems = [...memories].sort((a, b) => new Date(a.learnedAt).getTime() - new Date(b.learnedAt).getTime());
    milestones.push({
      id: mkId(),
      type: "first_memory",
      title: "First Memory Formed",
      description: `Vinci learned "${sortedMems[0]!.label}" — the start of understanding your collecting identity.`,
      date: new Date(sortedMems[0]!.learnedAt).toISOString(),
      dnaScoreAtTime: 15,
      archetypeAtTime: dna.primaryType as CollectorArchetype,
      category: null,
      linkedConversationId: null,
      linkedCollectibleId: null,
      linkedMemoryKey: sortedMems[0]!.key,
      linkedReplayFrame: null,
      impact: "major",
    });
  }

  for (const ach of achievements) {
    if (!ach.unlockedAt) continue;
    milestones.push({
      id: mkId(),
      type: "first_achievement",
      title: `Achievement: ${ach.title}`,
      description: `You unlocked "${ach.title}".`,
      date: ach.unlockedAt,
      dnaScoreAtTime: dna.dnaScore,
      archetypeAtTime: dna.primaryType as CollectorArchetype,
      category: null,
      linkedConversationId: null,
      linkedCollectibleId: null,
      linkedMemoryKey: null,
      linkedReplayFrame: null,
      impact: "moderate",
    });
  }

  const categoryCounts = new Map<string, number>();
  for (const c of sorted) {
    const count = (categoryCounts.get(c.category) || 0) + 1;
    categoryCounts.set(c.category, count);
    if (count === 5) {
      milestones.push({
        id: mkId(),
        type: "category_mastery",
        title: `${COLLECTIBLE_CATEGORY_LABELS[c.category]} Milestone`,
        description: `You reached 5 items in ${COLLECTIBLE_CATEGORY_LABELS[c.category]} — establishing real depth.`,
        date: new Date(c.createdAt).toISOString(),
        dnaScoreAtTime: dna.dnaScore,
        archetypeAtTime: dna.primaryType as CollectorArchetype,
        category: c.category,
        linkedConversationId: null,
        linkedCollectibleId: c.id,
        linkedMemoryKey: null,
        linkedReplayFrame: null,
        impact: "moderate",
      });
    }
  }

  const totalValue = collectibles.reduce((s, c) => s + (c.estimatedValue ?? 0), 0);
  if (totalValue > 10000) {
    milestones.push({
      id: mkId(),
      type: "portfolio_milestone",
      title: "Portfolio Surpassed $10,000",
      description: "Your collection's estimated value crossed the $10,000 mark.",
      date: new Date().toISOString(),
      dnaScoreAtTime: dna.dnaScore,
      archetypeAtTime: dna.primaryType as CollectorArchetype,
      category: null,
      linkedConversationId: null,
      linkedCollectibleId: null,
      linkedMemoryKey: null,
      linkedReplayFrame: null,
      impact: "major",
    });
  }

  return milestones;
}

function buildChapters(milestones: JourneyMilestone[], dna: CollectorDNA): JourneyChapter[] {
  if (milestones.length === 0) return [emptyChapter(dna)];

  const chapterSize = Math.max(3, Math.ceil(milestones.length / 3));
  const chapters: JourneyChapter[] = [];

  for (let i = 0; i < milestones.length; i += chapterSize) {
    const chunk = milestones.slice(i, i + chapterSize);
    const chapterIndex = Math.floor(i / chapterSize);
    const titles = ["The Beginning", "Growth", "Mastery"];

    chapters.push({
      title: titles[chapterIndex] ?? `Chapter ${chapterIndex + 1}`,
      startDate: chunk[0]!.date,
      endDate: chunk[chunk.length - 1]?.date ?? null,
      milestones: chunk,
      narrative: chunk.map((m) => m.description).join(" "),
      dominantArchetype: dna.primaryType as CollectorArchetype,
      dnaGrowth: chunk.length * 8,
    });
  }

  return chapters;
}

function generateNarrative(chapters: JourneyChapter[], dna: CollectorDNA): string {
  if (chapters.length === 0) return "Your collector journey is just beginning.";

  const parts: string[] = [];
  const first = chapters[0]!;
  parts.push(`Your journey began when ${first.milestones[0]?.description ?? "you started exploring collectibles"}.`);

  if (chapters.length > 1) {
    const growth = chapters[1]!;
    parts.push(`As you grew, ${growth.narrative.split(". ")[0]}.`);
  }

  parts.push(`Today, you are a ${dna.primaryType} with a DNA score of ${dna.dnaScore}.`);

  return parts.join(" ");
}

function generateNextMilestoneHint(
  collectibles: Collectible[],
  memories: CollectorMemoryFact[],
  achievements: { title: string; unlockedAt: string | null }[]
): string | null {
  const unauthenticated = collectibles.filter((c) => !c.isAuthenticated && (c.estimatedValue ?? 0) > 200);
  if (unauthenticated.length > 0) {
    return `Authenticate "${unauthenticated[0]!.title}" to unlock your next milestone.`;
  }

  const categories = new Set(collectibles.map((c) => c.category));
  if (categories.size < 4) {
    return "Explore a new category to diversify your journey.";
  }

  return null;
}

export function computeJourneyStats(
  collectibles: Collectible[],
  memories: CollectorMemoryFact[],
  achievements: { title: string; unlockedAt: string | null }[]
): JourneyStats {
  const sorted = [...collectibles].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  const firstDate = sorted[0]?.createdAt ? new Date(sorted[0].createdAt) : new Date();
  const daysActive = Math.max(1, Math.ceil((Date.now() - firstDate.getTime()) / (1000 * 60 * 60 * 24)));

  return {
    totalDaysActive: daysActive,
    totalConversations: 0,
    totalCollectibles: collectibles.length,
    totalMemories: memories.length,
    totalAchievements: achievements.filter((a) => a.unlockedAt).length,
    archetypeShifts: 0,
    largestDNAGrowth: { date: new Date().toISOString(), growth: 0 },
    categoriesExplored: new Set(collectibles.map((c) => c.category)).size,
    journeyScore: Math.min(100, collectibles.length * 3 + memories.length * 5 + achievements.filter((a) => a.unlockedAt).length * 10),
  };
}

function emptyChapter(dna: CollectorDNA): JourneyChapter {
  return {
    title: "The Beginning",
    startDate: new Date().toISOString(),
    endDate: null,
    milestones: [],
    narrative: "Your collector journey is about to begin.",
    dominantArchetype: dna.primaryType as CollectorArchetype,
    dnaGrowth: 0,
  };
}