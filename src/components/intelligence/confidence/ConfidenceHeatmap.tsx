"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { Grid2X2, Search, ShieldCheck, Lightbulb } from "@/components/ui/icons";
import type { ConfidenceHeatmapData, CategoryConfidence, ResearchRecommendation } from "@/types/heatmap";

interface Props {
  heatmap: ConfidenceHeatmapData;
}

function confColor(c: number): string {
  if (c > 0.7) return "bg-emerald-500/40 border-emerald-500/30";
  if (c > 0.4) return "bg-amber-500/30 border-amber-500/20";
  if (c > 0.1) return "bg-rose-500/20 border-rose-500/15";
  return "bg-white/[0.03] border-white/[0.06]";
}

function confTextColor(c: number): string {
  if (c > 0.7) return "text-emerald-400";
  if (c > 0.4) return "text-amber-400";
  if (c > 0.1) return "text-rose-400";
  return "text-gray-500";
}

export function ConfidenceHeatmap({ heatmap }: Props) {
  const withItems = heatmap.categories.filter((c) => c.evidenceCount > 0);

  return (
    <motion.div
      variants={staggerContainer(0.06)}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      <motion.div variants={fadeUp} className="glass rounded-xl p-5">
        <div className="flex items-center gap-2">
          <Grid2X2 className="h-4 w-4 text-primary" strokeWidth={2} />
          <h3 className="text-sm font-medium text-gray-300">Memory Confidence Heatmap</h3>
        </div>

        <div className="mt-3 flex items-center gap-1.5">
          <span className="text-[10px] text-gray-500">Overall Confidence</span>
          <div className="h-1.5 flex-1 rounded-full bg-white/[0.06] overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
              initial={{ width: 0 }}
              animate={{ width: `${Math.round(heatmap.overallConfidence * 100)}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          <span className="text-[10px] text-gray-400">
            {Math.round(heatmap.overallConfidence * 100)}%
          </span>
        </div>

        {heatmap.strongestCategory && (
          <p className="mt-2 text-[10px] text-emerald-400/60">
            Strongest: {withItems.find((c) => c.category === heatmap.strongestCategory)?.label}
          </p>
        )}
        {heatmap.weakestCategory && (
          <p className="text-[10px] text-rose-400/60">
            Weakest: {withItems.find((c) => c.category === heatmap.weakestCategory)?.label}
          </p>
        )}
      </motion.div>

      <motion.div variants={fadeUp} className="glass rounded-xl p-5">
        <h4 className="text-xs font-medium text-gray-400 mb-3">Category Confidence</h4>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {withItems.map((cat) => (
            <CategoryCell key={cat.category} category={cat} />
          ))}
        </div>
        {withItems.length === 0 && (
          <p className="text-xs text-gray-500">No categories with data yet.</p>
        )}
      </motion.div>

      {heatmap.researchRecommendations.length > 0 && (
        <motion.div variants={fadeUp} className="glass rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="h-3.5 w-3.5 text-primary" strokeWidth={2} />
            <h4 className="text-xs font-medium text-gray-400">Research Recommendations</h4>
          </div>
          <div className="space-y-2">
            {heatmap.researchRecommendations.map((rec) => (
              <RecommendationCard key={rec.id} recommendation={rec} />
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

function CategoryCell({ category }: { category: CategoryConfidence }) {
  const conf = category.confidence;
  return (
    <div className={`rounded-lg border p-3 ${confColor(conf)}`}>
      <p className="text-xs text-gray-200 font-medium truncate">{category.label}</p>
      <div className="mt-1.5 flex items-center justify-between">
        <span className={`text-sm font-semibold ${confTextColor(conf)}`}>
          {Math.round(conf * 100)}%
        </span>
        <span className="text-[10px] text-gray-500">{category.evidenceCount} pts</span>
      </div>
      <div className="mt-1.5 space-y-1">
        <MetricBar label="Knowledge" value={category.knowledge} />
        <MetricBar label="Coverage" value={category.coverage} />
        <MetricBar label="Freshness" value={category.freshness} />
      </div>
      {category.missingAreas.length > 0 && (
        <p className="mt-2 text-[10px] text-gray-500 truncate">{category.missingAreas[0]}</p>
      )}
    </div>
  );
}

function MetricBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[9px] text-gray-500 w-14 shrink-0">{label}</span>
      <div className="h-1 flex-1 rounded-full bg-white/[0.06] overflow-hidden">
        <div
          className="h-full rounded-full bg-primary/40"
          style={{ width: `${Math.round(value * 100)}%` }}
        />
      </div>
    </div>
  );
}

function RecommendationCard({ recommendation }: { recommendation: ResearchRecommendation }) {
  const priorityColors: Record<string, string> = {
    high: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    medium: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    low: "text-gray-400 bg-white/[0.04] border-white/[0.08]",
  };

  const actionIcons: Record<string, typeof Search> = {
    read_more: Search,
    authenticate: ShieldCheck,
    upload_images: Grid2X2,
    expand_category: Lightbulb,
    diversify: Lightbulb,
    complete_goals: Lightbulb,
  };

  const Icon = actionIcons[recommendation.action] ?? Lightbulb;

  return (
    <div className="rounded-lg bg-white/[0.03] border border-white/[0.06] p-3">
      <div className="flex items-start gap-2">
        <Icon className="h-3.5 w-3.5 text-gray-400 mt-0.5 shrink-0" strokeWidth={2} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-xs text-gray-200 font-medium">{recommendation.title}</p>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${priorityColors[recommendation.priority]}`}>
              {recommendation.priority}
            </span>
          </div>
          <p className="mt-0.5 text-[10px] text-gray-400">{recommendation.explanation}</p>
        </div>
      </div>
    </div>
  );
}
