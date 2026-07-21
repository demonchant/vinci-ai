export type ChatRole = "USER" | "ASSISTANT" | "SYSTEM";

export interface ChatMessage {
  id: string;
  chatId: string;
  role: ChatRole;
  content: string;
  imageUrls: string[];
  metadata?: {
    memoryFactsUsed?: string[];
    suggestedPrompts?: string[];
  } | null;
  createdAt: string;
}

export interface AIChatSummary {
  id: string;
  title: string;
  isPinned: boolean;
  lastMessagePreview: string | null;
  updatedAt: string;
}

export interface AIChatDetail extends AIChatSummary {
  messages: ChatMessage[];
}

export const SUGGESTED_PROMPTS: string[] = [
  "Analyze this collectible",
  "Compare these two cards",
  "Estimate rarity",
  "Should I buy this?",
  "Why is this valuable?",
  "Explain authenticity",
  "Summarize market trends",
  "What changed in my Collector DNA?",
];
