import { openai, AI_MODELS } from "@/lib/openai";
import type {
  LegacyDataBundle,
  EvidenceBundle,
  LegacyNarrativeSection,
} from "@/types/legacy";

const SYSTEM = `You write sections of a premium AI Collector Legacy Report for Vinci AI.
STRICT RULES:
Every sentence must be supported by a fact in allowedFacts.
Never invent achievements, collectibles, memories, dates, or market values.
If evidence is insufficient, say so rather than filling gaps.
Second person ("you", "your"). Past tense for history, present for now.
Plain prose, 2-4 sentences. No markdown, no emoji.`;

async function narrateParagraph(section: string, evidence: EvidenceBundle, context: string): Promise<string> {
  const res = await openai.chat.completions.create({
    model: AI_MODELS.chat,
    temperature: 0.45,
    messages: [
      { role: "system", content: SYSTEM },
      {
        role: "user",
        content: `Section: ${section}\nAllowed facts: ${evidence.allowedFacts.join(" | ")}\nForbidden: ${evidence.forbiddenAssumptions.join(" | ")}\nContext: ${context}`,
      },
    ],
  });
  return res.choices[0]?.message?.content?.trim() ?? "Insufficient data to generate this section.";
}

export interface GeneratedNarrative {
  story: LegacyNarrativeSection[];
  executiveSummary: string;
  aiLetter: string;
  nextChapter: string[];
  dnaEvolutionSummary: string;
}

export async function generateNarrative(bundle: LegacyDataBundle): Promise<GeneratedNarrative> {
  const { dna, facts, portfolio, achievements, snapshotCount, cover } = bundle;
  const unlocked = achievements.filter((a) => a.isUnlocked);
  const baseFacts = [
    `DNA Score: ${dna.dnaScore}`,
    `Primary archetype: ${dna.primaryType}`,
    `Collection size: ${portfolio.totalItems}`,
    `Authentication rate: ${portfolio.authenticationRatePct}%`,
    `Achievements unlocked: ${unlocked.length}`,
    `Memory facts: ${facts.length}`,
  ];

  const baseEvidence: EvidenceBundle = {
    allowedFacts: baseFacts,
    forbiddenAssumptions: ["specific purchase prices not provided", "market trends not verified"],
    dataSourceIds: [bundle.userId],
  };

  const [executiveSummary, dnaEvolutionSummary] = await Promise.all([
    narrateParagraph("Executive Summary", baseEvidence, baseFacts.join("; ")),
    narrateParagraph(
      "DNA Evolution",
      {
        allowedFacts: [`Score: ${dna.dnaScore}`, `Archetype: ${dna.primaryType}`, `${snapshotCount} snapshots`],
        forbiddenAssumptions: ["exact dates without snapshot data"],
        dataSourceIds: [bundle.userId],
      },
      `snapshots=${snapshotCount} score=${dna.dnaScore} type=${dna.primaryType}`
    ),
  ]);

  const storyDefs = [
    {
      heading: "The Beginning",
      facts: [`Collecting since ${new Date(cover.collectorSince).toLocaleDateString()}`, `Started as ${dna.primaryType}`, `${portfolio.totalItems} items today`],
      ctx: `since=${cover.collectorSince} type=${dna.primaryType}`,
    },
    {
      heading: "Growth",
      facts: [`${snapshotCount} DNA snapshots`, `${facts.length} memory facts`, `${unlocked.length} achievements`],
      ctx: `snapshots=${snapshotCount} facts=${facts.length} achievements=${unlocked.length}`,
    },
    {
      heading: "Today",
      facts: [`DNA score: ${dna.dnaScore}`, `Authentication: ${portfolio.authenticationRatePct}%`, `Diversification: ${portfolio.diversificationScore}`],
      ctx: `score=${dna.dnaScore} auth=${portfolio.authenticationRatePct}`,
    },
  ];

  const story: LegacyNarrativeSection[] = await Promise.all(
    storyDefs.map(async (s) => {
      const ev: EvidenceBundle = {
        allowedFacts: s.facts,
        forbiddenAssumptions: ["invented events", "unverified prices"],
        dataSourceIds: [bundle.userId],
      };
      const body = await narrateParagraph(s.heading, ev, s.ctx);
      return { heading: s.heading, body, evidence: ev };
    })
  );

  const [letterRes, recRes] = await Promise.all([
    openai.chat.completions.create({
      model: AI_MODELS.chat,
      temperature: 0.5,
      messages: [
        {
          role: "system",
          content: `${SYSTEM}\nWrite a personal letter from Vinci AI. Format: "Dear Collector,\n[3-4 sentences]\n\nWith respect,\nVinci AI"`,
        },
        { role: "user", content: `Allowed facts: ${baseFacts.join(" | ")}` },
      ],
    }),
    openai.chat.completions.create({
      model: AI_MODELS.chat,
      temperature: 0.4,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `${SYSTEM}\nRespond as JSON: { "recommendations": string[] } — 3-4 items, 1 sentence each, grounded only in allowed facts.`,
        },
        {
          role: "user",
          content: `Allowed facts: diversification=${portfolio.diversificationScore}% auth=${portfolio.authenticationRatePct}% near-achievements=${achievements.filter((a) => !a.isUnlocked && a.progress > 50).length}`,
        },
      ],
    }),
  ]);

  const aiLetter =
    letterRes.choices[0]?.message?.content?.trim() ??
    "Dear Collector,\n\nYour journey with Vinci AI reflects genuine growth.\n\nWith respect,\nVinci AI";

  const recRaw = recRes.choices[0]?.message?.content;
  const nextChapter: string[] = recRaw ? (JSON.parse(recRaw).recommendations ?? []) : [];

  return { story, executiveSummary, aiLetter, nextChapter, dnaEvolutionSummary };
}