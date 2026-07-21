import dynamic from "next/dynamic";
import { resolveViewer } from "@/lib/viewer";
import {
  getDNA,
  getCollectionSummary,
  getMemoryFacts,
  getActivityFeed,
  getDNASnapshots,
  getAchievements,
  getGoals,
  getMarketPulse,
} from "@/services/dataSource";
import { generateDailyBrief } from "@/services/dailyBriefService";
import { WelcomeCard, DailyBriefCard } from "@/components/dashboard/TopRowCards";
import { CollectionValueCard } from "@/components/dashboard/CollectionValueCard";
import {
  PortfolioHealthCard,
  MarketPulseCard,
  RecommendationsCard,
  RecentActivityCard,
  MemoryWidgetCard,
  AchievementsCard,
  GoalsCard,
} from "@/components/dashboard/SimpleCards";
import { DashboardEmptyState } from "@/components/dashboard/EmptyAndSkeleton";
import {
  TwinWidgetCard,
  JourneyWidgetCard,
  ConfidenceWidgetCard,
} from "@/components/dashboard/IntelligenceWidgets";

const DNAHeroCard = dynamic(() =>
  import("@/components/dashboard/DNAHeroCard").then((m) => m.DNAHeroCard)
);
const DNAEvolutionCard = dynamic(() =>
  import("@/components/dashboard/DNAEvolutionCard").then((m) => m.DNAEvolutionCard)
);

export default async function DashboardPage() {
  const { userId, demo } = await resolveViewer();

  const [dna, collectionSummary, memory, activity, snapshots, achievements, goals, market] =
    await Promise.all([
      getDNA(userId, demo),
      getCollectionSummary(userId, demo),
      getMemoryFacts(userId, demo),
      getActivityFeed(userId, demo, 6),
      getDNASnapshots(userId, demo),
      getAchievements(userId, demo),
      getGoals(userId, demo),
      getMarketPulse(demo),
    ]);

  const isEmpty = !demo && collectionSummary.total === 0 && activity.length === 0;

  const brief = await generateDailyBrief(
    {
      displayName: demo ? "Alex" : "Collector",
      dna,
      recentActivityDescriptions: activity.map((a) => a.description),
      collectionSize: collectionSummary.total,
    },
    demo
  );

  return (
    <div className="container py-10">
      {isEmpty ? (
        <>
          <h1 className="font-display text-2xl">Let's build your Collector DNA</h1>
          <p className="mt-1 text-sm text-gray-500">
            Vinci AI learns from everything you do here. Start with any of these.
          </p>
          <div className="mt-8">
            <DashboardEmptyState />
          </div>
        </>
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Row 1 */}
          <WelcomeCard
            displayName={demo ? "Alex Morgan" : "Collector"}
            collectorSince={demo ? "2021" : new Date().getFullYear().toString()}
          />
          <DailyBriefCard brief={brief} />

          {/* Row 2 */}
          <CollectionValueCard
            totalValue={collectionSummary.totalValue}
            categoryCounts={collectionSummary.categoryCounts}
            topItemTitle={collectionSummary.mostValuable?.title ?? null}
          />
          <PortfolioHealthCard dna={dna} />
          <MarketPulseCard insights={market} />

          {/* Centerpiece + supporting widgets */}
          <DNAHeroCard dna={dna} />
          <RecommendationsCard recommendations={dna.coach.recommendations} />
          <RecentActivityCard activity={activity} />

          <MemoryWidgetCard facts={memory.facts} />
          <DNAEvolutionCard snapshots={snapshots} projected={dna.compass.projected} />
          <AchievementsCard achievements={achievements} />
          <GoalsCard goals={goals} />

          {/* Intelligence Layer */}
          <TwinWidgetCard />
          <JourneyWidgetCard />
          <ConfidenceWidgetCard />
        </div>
      )}
    </div>
  );
}
