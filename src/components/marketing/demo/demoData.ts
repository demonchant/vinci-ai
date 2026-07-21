import type { LucideIcon } from "@/components/ui/icons";
import { MessageSquare, ScanSearch, Database, Fingerprint, Orbit, FileText } from "@/components/ui/icons";

export type DemoTabId = "chat" | "image" | "memory" | "dna" | "replay" | "legacy";

export interface DemoTab {
  id: DemoTabId;
  label: string;
  icon: LucideIcon;
}

export const DEMO_TABS: DemoTab[] = [
  { id: "chat", label: "AI Chat", icon: MessageSquare },
  { id: "image", label: "Image Analysis", icon: ScanSearch },
  { id: "memory", label: "Collector Memory", icon: Database },
  { id: "dna", label: "Collector DNA", icon: Fingerprint },
  { id: "replay", label: "DNA Evolution Replay", icon: Orbit },
  { id: "legacy", label: "Legacy Report", icon: FileText },
];
