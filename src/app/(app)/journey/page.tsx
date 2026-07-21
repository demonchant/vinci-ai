"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { useJourney } from "@/hooks/useJourney";
import { JourneyTimeline, JourneyStats } from "@/components/intelligence";
import { RefreshCw, Clock } from "@/components/ui/icons";

export default function JourneyPage() {
  const { journey, stats, isLoading, error, demo, refresh } = useJourney();

  if (isLoading) {
    return <JourneySkeleton />;
  }

  if (error) {
    return (
      <div className="container py-10">
        <div className="glass rounded-xl p-8 text-center">
          <p className="text-sm text-red-400">{error}</p>
          <button onClick={refresh} className="mt-3 text-xs text-primary hover:text-primary/80">
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!journey) return null;

  return (
    <motion.div
      variants={staggerContainer(0.08)}
      initial="hidden"
      animate="visible"
      className="container py-6 space-y-6"
    >
      {demo && (
        <motion.div variants={fadeUp} className="rounded-lg bg-primary/10 border border-primary/20 px-4 py-2">
          <p className="text-xs text-primary/80">
            Demo mode — showing sample Journey data
          </p>
        </motion.div>
      )}

      <motion.div variants={fadeUp} className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Clock className="h-5 w-5 text-primary" strokeWidth={2} />
          <div>
            <h1 className="text-lg font-semibold text-gray-100">Collector Journey</h1>
            <p className="text-xs text-gray-500">Your interactive collecting timeline</p>
          </div>
        </div>
        <button
          onClick={refresh}
          className="rounded-lg bg-white/[0.04] border border-white/[0.08] p-2 text-gray-400 hover:text-gray-200 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <JourneyTimeline journey={journey} />
        </div>

        <div className="lg:col-span-4">
          {stats && <JourneyStats stats={stats} />}
        </div>
      </div>
    </motion.div>
  );
}

function JourneySkeleton() {
  return (
    <div className="container py-6">
      <div className="h-8 w-48 rounded bg-white/[0.04] animate-pulse mb-6" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass rounded-xl p-5 h-32 animate-pulse" />
          ))}
        </div>
        <div className="lg:col-span-4">
          <div className="glass rounded-xl p-5 h-48 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
