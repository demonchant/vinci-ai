"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, AlertCircle, Lightbulb, Plus, Bookmark, Archive, FileText, Info } from "@/components/ui/icons";
import { Icon } from "@/components/ui/Icon";
import { EvidencePanel } from "./evidence/EvidencePanel";
import { COLLECTIBLE_CATEGORY_LABELS } from "@/types/common";
import type { LabAnalysisResult } from "@/types/imageAnalysis";

function ConfidenceMeter({ value, label }: { value: number; label: string }) {
  const tone = value >= 80 ? "bg-success" : value >= 60 ? "bg-accent" : "bg-yellow-400";
  return (
    <div>
      <div className="flex justify-between text-xs text-gray-400">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="mt-1 h-1.5 rounded-full bg-white/5">
        <motion.div
          className={`h-1.5 rounded-full ${tone}`}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8 }}
        />
      </div>
    </div>
  );
}

export function AnalysisPanel({
  result,
  onAddToCollection,
  memoryNote,
}: {
  result: LabAnalysisResult;
  onAddToCollection?: () => void;
  memoryNote?: string | null;
}) {
  const [showAllEvidence, setShowAllEvidence] = useState(false);

  return (
    <div className="space-y-6 p-4">
      <div>
        <p className="text-xs text-gray-500">Identification</p>
        <p className="mt-1 text-lg font-medium">{result.identification}</p>
        <div className="mt-1 flex flex-wrap gap-1.5 text-xs text-gray-400">
          {result.category && <span>{COLLECTIBLE_CATEGORY_LABELS[result.category]}</span>}
          {result.estimatedEra && <span>· {result.estimatedEra}</span>}
        </div>
      </div>

      <div>
        <ConfidenceMeter value={result.overallConfidence} label="Overall Confidence" />
        <div className="mt-3 space-y-2">
          {result.sectionConfidences.map((s) => (
            <ConfidenceMeter key={s.section} value={s.confidence} label={s.section} />
          ))}
        </div>
      </div>

      {result.conflictingSignals.length > 0 && (
        <div className="rounded-xl border border-yellow-400/20 bg-yellow-400/5 p-3">
          <div className="flex items-center gap-1.5 text-xs font-medium text-yellow-400">
            <Icon icon={AlertCircle} size="button" />
            Conflicting signals
          </div>
          <ul className="mt-1.5 space-y-1 text-xs text-gray-400">
            {result.conflictingSignals.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <p className="text-xs text-gray-500">Condition</p>
        <p className="mt-1 text-sm text-gray-200">{result.estimatedCondition ?? "Not determined"}</p>
        {result.visibleWear.length > 0 && (
          <ul className="mt-1.5 space-y-1 text-xs text-gray-400">
            {result.visibleWear.map((w, i) => (
              <li key={i}>· {w}</li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <div className="flex items-center gap-1.5">
          <Icon icon={ShieldCheck} size="button" className="text-success" />
          <p className="text-xs text-gray-500">Authenticity Indicators</p>
        </div>
        <ul className="mt-1.5 space-y-1 text-xs text-gray-400">
          {result.authenticityIndicators.length === 0 && <li>No specific indicators noted.</li>}
          {result.authenticityIndicators.map((a, i) => (
            <li key={i}>· {a}</li>
          ))}
        </ul>
      </div>

      <div>
        <p className="text-xs text-gray-500">Estimated Value</p>
        <p className="mt-1 text-2xl font-display">
          {result.valueRangeLow !== null ? `$${result.valueRangeLow}–$${result.valueRangeHigh}` : "—"}
        </p>
        <p className="mt-1 flex items-start gap-1 text-[11px] text-gray-500">
          <Icon icon={Info} size={12} className="mt-0.5 shrink-0" />
          {result.disclaimer}
        </p>
      </div>

      <div>
        <button
          onClick={() => setShowAllEvidence(!showAllEvidence)}
          className="text-xs font-medium text-gray-300"
        >
          Evidence ({result.evidence.length})
        </button>
        {showAllEvidence && (
          <div className="mt-2">
            <EvidencePanel evidence={result.evidence} />
          </div>
        )}
      </div>

      {result.historicalBackground && (
        <div>
          <p className="text-xs text-gray-500">Historical Background</p>
          <p className="mt-1 text-xs text-gray-400">{result.historicalBackground}</p>
        </div>
      )}

      {result.suggestedNextSteps.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5">
            <Icon icon={Lightbulb} size="button" className="text-accent" />
            <p className="text-xs text-gray-500">Suggested Next Steps</p>
          </div>
          <ul className="mt-1.5 space-y-1 text-xs text-gray-400">
            {result.suggestedNextSteps.map((s, i) => (
              <li key={i}>· {s}</li>
            ))}
          </ul>
        </div>
      )}

      {memoryNote && <div className="rounded-xl bg-secondary/10 p-3 text-xs text-gray-300">{memoryNote}</div>}

      <div className="flex flex-wrap gap-2 border-t border-white/5 pt-4">
        <ActionButton icon={Plus} label="Add to Collection" onClick={onAddToCollection} primary />
        <ActionButton icon={Bookmark} label="Wishlist" />
        <ActionButton icon={Archive} label="Archive" />
        <ActionButton icon={FileText} label="Report" />
      </div>
    </div>
  );
}

function ActionButton({
  icon,
  label,
  onClick,
  primary,
}: {
  icon: typeof Plus;
  label: string;
  onClick?: () => void;
  primary?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
        primary
          ? "bg-primary text-white shadow-glow hover:bg-primary/90"
          : "bg-white/5 text-gray-300 hover:bg-white/10"
      }`}
    >
      <Icon icon={icon} size="button" decorative />
      {label}
    </button>
  );
}
