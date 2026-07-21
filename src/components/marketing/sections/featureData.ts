import type { LucideIcon } from "@/components/ui/icons";
import {
  MessageSquare,
  ScanSearch,
  Brain,
  Sparkles,
  History,
  ScrollText,
  TrendingUp,
} from "@/components/ui/icons";

export interface FeatureSectionData {
  id: string;
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description: string;
}

export const FEATURE_SECTIONS: FeatureSectionData[] = [
  {
    id: "chat",
    icon: MessageSquare,
    eyebrow: "AI Collector Chat",
    title: "Ask anything about what you collect",
    description:
      "Compare two cards, check if something's worth grading, or ask why a piece is valuable. Vinci AI answers like a collector who's seen your whole collection — because it has.",
  },
  {
    id: "image",
    icon: ScanSearch,
    eyebrow: "Image Analysis",
    title: "Point your camera at it. Get the full picture.",
    description:
      "Identification, condition, rarity signals, and authenticity observations — for trading cards, watches, sneakers, comics, coins, and more. Every estimate is clearly labeled as AI-generated, never a substitute for professional appraisal.",
  },
  {
    id: "memory",
    icon: Brain,
    eyebrow: "Collector Memory",
    title: "The AI that actually remembers you",
    description:
      "Most chatbots forget you the moment the tab closes. Vinci AI learns your budget, your grading preferences, your favorite eras and brands — and gets sharper with every conversation. Fully visible, fully editable, always yours to forget.",
  },
  {
    id: "dna",
    icon: Sparkles,
    eyebrow: "Collector DNA",
    title: "Your collecting style, quantified",
    description:
      "A living profile built from your real activity — what you buy, how long you hold it, how you research. Investor, Historian, Curator, Explorer: see which archetypes actually fit you, and why.",
  },
  {
    id: "replay",
    icon: History,
    eyebrow: "DNA Evolution Replay",
    title: "Watch your collecting style evolve",
    description:
      "Every meaningful action becomes a snapshot. Scrub through your history and watch your DNA score climb, your archetype shift, and your AI recommendations sharpen — with a plain-language reason behind every change.",
  },
  {
    id: "legacy",
    icon: ScrollText,
    eyebrow: "Collector Legacy Report",
    title: "An annual report, written by your AI copilot",
    description:
      "Executive summary, achievements, knowledge growth, a personalized letter, and a forecast — all generated from your real history and exportable as a shareable document.",
  },
  {
    id: "market",
    icon: TrendingUp,
    eyebrow: "Market Insights",
    title: "Know what's moving before you buy",
    description:
      "Trending categories, sentiment, and opportunity alerts — surfaced in the context of what you actually collect, not a generic market feed.",
  },
];
