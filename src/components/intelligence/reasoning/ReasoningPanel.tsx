"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { Brain, Eye, Sparkles, ChevronDown, ChevronUp } from "@/components/ui/icons";
import type { ReasoningSynthesis, PerspectiveResult } from "@/types/reasoning";
import { PERSPECTIVE_CONFIG } from "@/types/reasoning";

interface Props {
  synthesis: ReasoningSynthesis;
}

export function ReasoningPanel({ synthesis }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <motion.div
      variants={staggerContainer(0.06)}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      <motion.div variants={fadeUp} className="glass rounded-xl p-5">
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-primary" strokeWidth={2} />
          <h3 className="text-sm font-medium text-gray-300">Multi-Perspective Analysis</h3>
          <span className="ml-auto text-[10px] text-gray-500">
            {synthesis.perspectives.length} perspectives
          </span>
        </div>

        <div className="mt-3 flex items-center gap-1.5">
          <span className="text-[10px] text-gray-500">Consensus</span>
          <div className="h-1.5 flex-1 rounded-full bg-white/[0.06] overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${
                synthesis.consensusScore > 70 ? "bg-emerald-500/60" :
                synthesis.consensusScore > 40 ? "bg-amber-500/60" : "bg-rose-500/60"
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${synthesis.consensusScore}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          <span className="text-[10px] text-gray-400">{synthesis.consensusScore}%</span>
        </div>

        <div className="mt-4 rounded-lg bg-white/[0.03] border border-white/[0.06] p-3">
          <div className="flex items-start gap-2">
            <Sparkles className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" strokeWidth={2} />
            <p className="text-xs text-gray-300 leading-relaxed">{synthesis.finalRecommendation}</p>
          </div>
        </div>
      </motion.div>

      <motion.div variants={fadeUp} className="glass rounded-xl p-5">
        <h4 className="text-xs font-medium text-gray-400 mb-3">Perspectives</h4>
        <div className="space-y-2">
          {synthesis.perspectives.map((p) => (
            <PerspectiveCard
              key={p.perspective}
              result={p}
              isExpanded={expanded === p.perspective}
              onToggle={() => setExpanded(expanded === p.perspective ? null : p.perspective)}
            />
          ))}
        </div>
      </motion.div>

      {synthesis.areasOfUncertainty.length > 0 && (
        <motion.div variants={fadeUp} className="glass rounded-xl p-5">
          <h4 className="text-xs font-medium text-amber-400/80 mb-2">Areas of Uncertainty</h4>
          <ul className="space-y-1">
            {synthesis.areasOfUncertainty.map((u, i) => (
              <li key={i} className="text-[10px] text-gray-400">{u}</li>
            ))}
          </ul>
        </motion.div>
      )}

      {synthesis.missingEvidence.length > 0 && (
        <motion.div variants={fadeUp} className="glass rounded-xl p-5">
          <h4 className="text-xs font-medium text-gray-400 mb-2">Missing Evidence</h4>
          <ul className="space-y-1">
            {synthesis.missingEvidence.map((e, i) => (
              <li key={i} className="text-[10px] text-gray-500">{e}</li>
            ))}
          </ul>
        </motion.div>
      )}
    </motion.div>
  );
}

function PerspectiveCard({
  result,
  isExpanded,
  onToggle,
}: {
  result: PerspectiveResult;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const confColor =
    result.confidence > 0.7 ? "text-emerald-400" :
    result.confidence > 0.4 ? "text-amber-400" : "text-rose-400";

  return (
    <div className="rounded-lg bg-white/[0.03] border border-white/[0.06] overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-2 px-3 py-2.5 text-left hover:bg-white/[0.02] transition-colors"
      >
        <Eye className="h-3 w-3 text-gray-500 shrink-0" strokeWidth={2} />
        <span className="text-xs text-gray-300 flex-1">{result.label}</span>
        <span className={`text-[10px] ${confColor}`}>
          {Math.round(result.confidence * 100)}%
        </span>
        {isExpanded ? (
          <ChevronUp className="h-3 w-3 text-gray-500" />
        ) : (
          <ChevronDown className="h-3 w-3 text-gray-500" />
        )}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 space-y-2 border-t border-white/[0.04]">
              <p className="mt-2 text-[11px] text-gray-300 leading-relaxed">{result.observation}</p>

              {result.evidence.length > 0 && (
                <div>
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider">Evidence</span>
                  <ul className="mt-1 space-y-0.5">
                    {result.evidence.map((e, i) => (
                      <li key={i} className="text-[10px] text-gray-400">{e}</li>
                    ))}
                  </ul>
                </div>
              )}

              {result.limitations.length > 0 && (
                <div>
                  <span className="text-[10px] text-amber-400/60 uppercase tracking-wider">Limitations</span>
                  <ul className="mt-1 space-y-0.5">
                    {result.limitations.map((l, i) => (
                      <li key={i} className="text-[10px] text-gray-500">{l}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
