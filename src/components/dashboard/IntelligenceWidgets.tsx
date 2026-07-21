"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";
import { Brain, Clock, Grid2X2, ArrowRight } from "@/components/ui/icons";
import Link from "next/link";
import type { CollectorTwinProfile } from "@/types/collectorTwin";
import type { CollectorJourney } from "@/types/journey";
import type { ConfidenceHeatmapData } from "@/types/heatmap";

export function TwinWidgetCard() {
  const [twin, setTwin] = useState<CollectorTwinProfile | null>(null);

  useEffect(() => {
    fetch("/api/twin")
      .then((r) => r.json())
      .then((d) => setTwin(d.twin))
      .catch(() => {});
  }, []);

  if (!twin) {
    return (
      <div className="glass rounded-xl p-5 animate-pulse h-32" />
    );
  }

  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible" className="glass rounded-xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <Brain className="h-4 w-4 text-primary" strokeWidth={2} />
        <h3 className="text-sm font-medium text-gray-300">Collector Twin</h3>
        <Link href="/twin" className="ml-auto text-gray-500 hover:text-primary transition-colors">
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
        {twin.philosophy.value}
      </p>
      <div className="mt-3 flex items-center gap-2">
        <span className="text-[10px] uppercase tracking-wider text-primary/70">{twin.archetype}</span>
        <span className="text-[10px] text-gray-600">|</span>
        <span className="text-[10px] text-gray-500">DNA {twin.dnaScore}</span>
      </div>
      <div className="mt-2 flex items-center gap-1.5">
        <div className="h-1 flex-1 rounded-full bg-white/[0.06] overflow-hidden">
          <div
            className="h-full rounded-full bg-primary/50"
            style={{ width: `${Math.round(twin.confidence * 100)}%` }}
          />
        </div>
        <span className="text-[10px] text-gray-500">{Math.round(twin.confidence * 100)}%</span>
      </div>
    </motion.div>
  );
}

export function JourneyWidgetCard() {
  const [journey, setJourney] = useState<CollectorJourney | null>(null);

  useEffect(() => {
    fetch("/api/journey")
      .then((r) => r.json())
      .then((d) => setJourney(d.journey))
      .catch(() => {});
  }, []);

  if (!journey) {
    return (
      <div className="glass rounded-xl p-5 animate-pulse h-32" />
    );
  }

  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible" className="glass rounded-xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <Clock className="h-4 w-4 text-primary" strokeWidth={2} />
        <h3 className="text-sm font-medium text-gray-300">Journey</h3>
        <Link href="/journey" className="ml-auto text-gray-500 hover:text-primary transition-colors">
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
        {journey.storyNarrative}
      </p>
      <div className="mt-3 flex items-center gap-1.5">
        <div className="h-1 flex-1 rounded-full bg-white/[0.06] overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
            style={{ width: `${journey.journeyProgress}%` }}
          />
        </div>
        <span className="text-[10px] text-gray-500">{journey.journeyProgress}%</span>
      </div>
      <p className="mt-1 text-[10px] text-gray-500">
        {journey.totalMilestones} milestone{journey.totalMilestones !== 1 ? "s" : ""}
      </p>
    </motion.div>
  );
}

export function ConfidenceWidgetCard() {
  const [heatmap, setHeatmap] = useState<ConfidenceHeatmapData | null>(null);

  useEffect(() => {
    fetch("/api/confidence")
      .then((r) => r.json())
      .then((d) => setHeatmap(d.heatmap))
      .catch(() => {});
  }, []);

  if (!heatmap) {
    return (
      <div className="glass rounded-xl p-5 animate-pulse h-32" />
    );
  }

  const withItems = heatmap.categories.filter((c) => c.evidenceCount > 0);

  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible" className="glass rounded-xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <Grid2X2 className="h-4 w-4 text-primary" strokeWidth={2} />
        <h3 className="text-sm font-medium text-gray-300">Knowledge Confidence</h3>
        <Link href="/twin" className="ml-auto text-gray-500 hover:text-primary transition-colors">
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      <div className="flex items-center gap-1.5 mb-2">
        <div className="h-1.5 flex-1 rounded-full bg-white/[0.06] overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
            style={{ width: `${Math.round(heatmap.overallConfidence * 100)}%` }}
          />
        </div>
        <span className="text-[10px] text-gray-400">{Math.round(heatmap.overallConfidence * 100)}%</span>
      </div>
      <div className="flex flex-wrap gap-1">
        {withItems.slice(0, 4).map((cat) => (
          <span
            key={cat.category}
            className={`text-[10px] px-2 py-0.5 rounded-full border ${
              cat.confidence > 0.7
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                : cat.confidence > 0.4
                  ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
                  : "bg-rose-500/10 border-rose-500/15 text-rose-400"
            }`}
          >
            {cat.label} {Math.round(cat.confidence * 100)}%
          </span>
        ))}
      </div>
    </motion.div>
  );
}
