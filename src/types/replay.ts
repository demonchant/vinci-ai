export interface ReplayFrame {
  index: number;
  snapshotId: string;
  createdAt: string;
  dnaScore: number;
  primaryType: string;
  secondaryType: string | null;
  trigger: string;
  scores: Record<string, number>;
  conversationCount: number;
  memoryCount: number;
  collectionSize: number;
  checkpointCount: number;
  delta: number | null;
}

export type CompassAxis =
  | "Historian"
  | "Investor"
  | "Explorer"
  | "Completionist"
  | "Curator"
  | "Researcher"
  | "Preservationist"
  | "Minimalist"
  | "Flipper";

export interface CompassPosition {
  snapshotId: string;
  createdAt: string;
  axes: Record<CompassAxis, number>;
  dominantAxis: CompassAxis;
  dnaScore: number;
}

export type MilestoneType =
  | "FIRST_COLLECTIBLE"
  | "FIRST_AUTHENTICATION"
  | "FIRST_ANALYSIS"
  | "DNA_LEVEL_UP"
  | "LARGEST_INCREASE"
  | "ACHIEVEMENT_UNLOCKED"
  | "ARCHETYPE_SHIFT"
  | "PORTFOLIO_DIVERSIFIED";

export interface ReplayMilestone {
  id: string;
  frameIndex: number;
  type: MilestoneType;
  label: string;
  description: string;
  dnaScore: number;
  createdAt: string;
}

export interface ReplayBookmark {
  id: string;
  frameIndex: number;
  label: string;
  note: string | null;
  createdAt: string;
}

export interface ReplayManifest {
  userId: string;
  frames: ReplayFrame[];
  milestones: ReplayMilestone[];
  compass: CompassPosition[];
  bookmarks: ReplayBookmark[];
  storyNarration: string;
  totalFrames: number;
  dateRange: { from: string; to: string } | null;
}

export interface PredictionResult {
  available: boolean;
  reason?: string;
  snapshotsRequired: number;
  snapshotsPresent: number;
  traitForecasts: { trait: string; predictedChange: number; confidence: number }[];
  archetypeShiftProbability: { type: string; probability: number }[];
  forecastHorizonDays: number;
  disclaimer: string;
}
