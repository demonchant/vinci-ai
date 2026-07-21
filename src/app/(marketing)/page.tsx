import dynamic from "next/dynamic";
import { MarketingNavbar } from "@/components/marketing/MarketingNavbar";
import { Hero } from "@/components/marketing/Hero";
import { FeatureSections } from "@/components/marketing/sections/FeatureSections";
import { HowVinciThinks } from "@/components/marketing/sections/HowVinciThinks";
import { SocialProof } from "@/components/marketing/sections/SocialProof";
import { FAQ } from "@/components/marketing/sections/FAQ";
import { MarketingFooter } from "@/components/marketing/sections/Footer";

function SectionSkeleton() {
  return (
    <div className="container py-32">
      <div className="mx-auto h-64 max-w-3xl animate-pulse rounded-3xl bg-white/5" />
    </div>
  );
}

// Interactive/chart-heavy sections are code-split and lazy-loaded below the fold.
const DemoPreview = dynamic(
  () => import("@/components/marketing/demo/DemoPreview").then((m) => m.DemoPreview),
  { loading: SectionSkeleton }
);
const DNAShowcase = dynamic(
  () => import("@/components/marketing/sections/DNAShowcase").then((m) => m.DNAShowcase),
  { loading: SectionSkeleton }
);
const ReplayPreview = dynamic(
  () => import("@/components/marketing/sections/ReplayPreview").then((m) => m.ReplayPreview),
  { loading: SectionSkeleton }
);
const LegacyPreview = dynamic(
  () => import("@/components/marketing/sections/LegacyPreview").then((m) => m.LegacyPreview),
  { loading: SectionSkeleton }
);

export default function LandingPage() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <MarketingNavbar />
      <main id="main">
        <Hero />
        <DemoPreview />
        <FeatureSections />
        <HowVinciThinks />
        <DNAShowcase />
        <ReplayPreview />
        <LegacyPreview />
        <SocialProof />
        <FAQ />
      </main>
      <MarketingFooter />
    </>
  );
}
