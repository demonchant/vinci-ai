export interface DemoActivityEntry {
  id: string;
  type:
    | "COLLECTIBLE_ADDED"
    | "IMAGE_ANALYZED"
    | "CHAT_MESSAGE"
    | "MEMORY_UPDATED"
    | "DNA_SNAPSHOT_CREATED"
    | "REPORT_GENERATED";
  description: string;
  createdAt: string;
}

function entry(
  id: string,
  type: DemoActivityEntry["type"],
  description: string,
  hoursAgo: number
): DemoActivityEntry {
  return { id, type, description, createdAt: new Date(Date.now() - hoursAgo * 3_600_000).toISOString() };
}

export const demoActivity: DemoActivityEntry[] = [
  entry("a1", "IMAGE_ANALYZED", "Analyzed 1986 Fleer Michael Jordan Rookie", 2),
  entry("a2", "MEMORY_UPDATED", "Learned: Recent Interests include Luxury Watches", 6),
  entry("a3", "DNA_SNAPSHOT_CREATED", "Collector DNA Score increased to 92", 6),
  entry("a4", "CHAT_MESSAGE", "Asked Vinci AI about Apollo 11 patch hold/sell strategy", 26),
  entry("a5", "COLLECTIBLE_ADDED", "Added Air Jordan 1 'Chicago' (1985, deadstock)", 48),
  entry("a6", "REPORT_GENERATED", "Generated Collector Legacy Report", 96),
  entry("a7", "COLLECTIBLE_ADDED", "Added 1969 Apollo 11 Mission Patch", 120),
  entry("a8", "MEMORY_UPDATED", "Learned: Preferred Grading is PSA 10", 200),
];
