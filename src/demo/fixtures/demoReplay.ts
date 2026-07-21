const baseDate = new Date("2024-09-01T00:00:00Z");
const day = (n: number) => new Date(baseDate.getTime() + n * 86_400_000).toISOString();

export const demoReplay = {
  storyNarration:
    "This collector's journey began with a focus on vintage Pokémon cards and quickly expanded into luxury watches. Authentication expertise grew steadily as image analysis became a regular habit. By month three, the Historian archetype had solidified, driven by deep research conversations and consistent engagement with Collector Memory.",
  milestones: [
    { id: "m-1", frameIndex: 0, type: "FIRST_COLLECTIBLE", label: "First Collectible", description: "Your collecting journey began.", dnaScore: 52, createdAt: day(0) },
    { id: "m-2", frameIndex: 2, type: "FIRST_ANALYSIS", label: "First Image Analysis", description: "Analyzed your first collectible image.", dnaScore: 57, createdAt: day(14) },
    { id: "m-3", frameIndex: 4, type: "DNA_LEVEL_UP", label: "Level 7 Collector", description: "Collector DNA reached score 61.", dnaScore: 61, createdAt: day(28) },
    { id: "m-4", frameIndex: 7, type: "ARCHETYPE_SHIFT", label: "Became HISTORIAN", description: "Primary archetype shifted from EXPLORER to HISTORIAN.", dnaScore: 71, createdAt: day(55) },
    { id: "m-5", frameIndex: 9, type: "LARGEST_INCREASE", label: "Largest Single Increase (+8)", description: "DNA score increased by 8 points in a single session.", dnaScore: 84, createdAt: day(75) },
    { id: "m-6", frameIndex: 11, type: "DNA_LEVEL_UP", label: "Level 9 Collector", description: "Collector DNA reached score 91.", dnaScore: 91, createdAt: day(90) },
  ],
  snapshots: [
    { timestamp: day(0),  score: 52, primaryType: "EXPLORER",  trigger: "First collectible added", scores: { dnaScore: 52, knowledge: 48, research: 50, authentication: 45, diversification: 55, marketAwareness: 40, longTermVision: 50 } },
    { timestamp: day(7),  score: 55, primaryType: "EXPLORER",  trigger: "Three conversations with Vinci AI", scores: { dnaScore: 55, knowledge: 52, research: 55, authentication: 48, diversification: 57, marketAwareness: 43, longTermVision: 52 } },
    { timestamp: day(14), score: 57, primaryType: "EXPLORER",  trigger: "Image analysis completed", scores: { dnaScore: 57, knowledge: 55, research: 58, authentication: 52, diversification: 58, marketAwareness: 44, longTermVision: 53 } },
    { timestamp: day(21), score: 59, primaryType: "EXPLORER",  trigger: "Memory updated", scores: { dnaScore: 59, knowledge: 58, research: 60, authentication: 55, diversification: 59, marketAwareness: 46, longTermVision: 55 } },
    { timestamp: day(28), score: 61, primaryType: "EXPLORER",  trigger: "Collection grew to 4 items", scores: { dnaScore: 61, knowledge: 60, research: 62, authentication: 57, diversification: 62, marketAwareness: 48, longTermVision: 57 } },
    { timestamp: day(35), score: 64, primaryType: "HISTORIAN", trigger: "Vintage Pokémon research conversation", scores: { dnaScore: 64, knowledge: 65, research: 66, authentication: 60, diversification: 63, marketAwareness: 50, longTermVision: 60 } },
    { timestamp: day(42), score: 67, primaryType: "HISTORIAN", trigger: "PSA grading confirmed", scores: { dnaScore: 67, knowledge: 68, research: 69, authentication: 65, diversification: 64, marketAwareness: 52, longTermVision: 62 } },
    { timestamp: day(49), score: 69, primaryType: "HISTORIAN", trigger: "Memory verified", scores: { dnaScore: 69, knowledge: 70, research: 71, authentication: 68, diversification: 65, marketAwareness: 54, longTermVision: 64 } },
    { timestamp: day(55), score: 71, primaryType: "HISTORIAN", trigger: "Goal completed", scores: { dnaScore: 71, knowledge: 72, research: 73, authentication: 70, diversification: 66, marketAwareness: 56, longTermVision: 67 } },
    { timestamp: day(62), score: 76, primaryType: "HISTORIAN", trigger: "Major image analysis session", scores: { dnaScore: 76, knowledge: 75, research: 78, authentication: 76, diversification: 67, marketAwareness: 60, longTermVision: 70 } },
    { timestamp: day(75), score: 84, primaryType: "HISTORIAN", trigger: "Authentication Expert achievement", scores: { dnaScore: 84, knowledge: 82, research: 84, authentication: 89, diversification: 68, marketAwareness: 64, longTermVision: 76 } },
    { timestamp: day(82), score: 88, primaryType: "HISTORIAN", trigger: "Legacy Report generated", scores: { dnaScore: 88, knowledge: 85, research: 86, authentication: 91, diversification: 70, marketAwareness: 66, longTermVision: 79 } },
    { timestamp: day(90), score: 91, primaryType: "HISTORIAN", trigger: "Portfolio milestone reached", scores: { dnaScore: 91, knowledge: 88, research: 88, authentication: 93, diversification: 72, marketAwareness: 68, longTermVision: 82 } },
  ],
};
