export interface DemoGoal {
  id: string;
  title: string;
  description: string | null;
  status: "IN_PROGRESS" | "COMPLETED";
  progress: number;
}

export const demoGoals: DemoGoal[] = [
  { id: "g1", title: "Complete Vintage Pokémon Base Set", description: "16 of 16 holo rares", status: "IN_PROGRESS", progress: 81 },
  { id: "g2", title: "Reach 90%+ authentication rate", description: null, status: "COMPLETED", progress: 100 },
  { id: "g3", title: "Diversify beyond 5 categories", description: "Currently at 7", status: "COMPLETED", progress: 100 },
  { id: "g4", title: "Document provenance for all $5,000+ items", description: "2 of 5 documented", status: "IN_PROGRESS", progress: 40 },
  { id: "g5", title: "Add a vintage comic to the collection", description: "Recommended next goal", status: "IN_PROGRESS", progress: 0 },
];
