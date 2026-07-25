import type { AchievementBadge } from "@/types/dna";

function badge(
  key: string,
  title: string,
  description: string,
  icon: string,
  daysAgo: number
): AchievementBadge {
  return {
    id: `demo-achievement-${key}`,
    key,
    title,
    description,
    icon,

    progress: 100,

    unlockedAt: new Date(
      Date.now() - daysAgo * 86_400_000
    ).toISOString(),

    isUnlocked: true,

    xp: 100,
  };
}

export const demoAchievements: AchievementBadge[] = [
  badge("research_master", "Research Master", "Completed 50+ AI analyses.", "BookOpen", 12),
  badge("authentication_expert", "Authentication Expert", "Maintained 85%+ authentication rate.", "ShieldCheck", 25),
  badge("portfolio_builder", "Portfolio Builder", "Reached $50,000 in estimated collection value.", "Wallet", 60),
  badge("vintage_specialist", "Vintage Specialist", "80% of recent searches involved vintage collectibles.", "Clock", 95),
  badge("collector_veteran", "Collector Veteran", "Active collector for 3+ years.", "Award", 180),
  badge("community_curator", "Community Curator", "50+ AI chat conversations.", "Users", 40),
];
