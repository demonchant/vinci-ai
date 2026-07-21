"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp } from "@/lib/motion";
import { MessageSquare, Send, Loader2 } from "@/components/ui/icons";
import type { TwinAnswer } from "@/types/collectorTwin";

interface Props {
  onAsk: (question: string) => Promise<TwinAnswer | null>;
}

const alignmentColors: Record<string, string> = {
  aligned: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  partially_aligned: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  misaligned: "text-rose-400 bg-rose-500/10 border-rose-500/20",
};

const alignmentLabels: Record<string, string> = {
  aligned: "Aligned",
  partially_aligned: "Partially Aligned",
  misaligned: "Misaligned",
};

export function AskTwin({ onAsk }: Props) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<TwinAnswer | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleAsk() {
    if (!question.trim() || loading) return;
    setLoading(true);
    setAnswer(null);
    const result = await onAsk(question.trim());
    setAnswer(result);
    setLoading(false);
  }

  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible" className="glass rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="h-4 w-4 text-primary" strokeWidth={2} />
        <h3 className="text-sm font-medium text-gray-300">Ask My Twin</h3>
      </div>

      <div className="flex gap-2">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAsk()}
          placeholder="Would I buy this? Does this fit my collection?"
          className="flex-1 rounded-lg bg-white/[0.04] border border-white/[0.08] px-3 py-2 text-xs text-gray-200 placeholder:text-gray-600 focus:outline-none focus:border-primary/40"
        />
        <button
          onClick={handleAsk}
          disabled={!question.trim() || loading}
          className="rounded-lg bg-primary/20 border border-primary/30 px-3 py-2 text-xs text-primary hover:bg-primary/30 transition-colors disabled:opacity-40"
        >
          {loading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Send className="h-3.5 w-3.5" />
          )}
        </button>
      </div>

      <AnimatePresence>
        {answer && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mt-4 rounded-lg bg-white/[0.03] border border-white/[0.06] p-4 space-y-3"
          >
            <div className="flex items-center gap-2">
              <span className={`text-[10px] px-2 py-0.5 rounded-full border ${alignmentColors[answer.alignment]}`}>
                {alignmentLabels[answer.alignment]}
              </span>
              <span className="text-[10px] text-gray-500">
                {answer.alignmentScore}% alignment
              </span>
              <span className="ml-auto text-[10px] text-gray-500">
                {Math.round(answer.confidence * 100)}% confidence
              </span>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">{answer.answer}</p>

            {answer.dnaFactors.length > 0 && (
              <div>
                <span className="text-[10px] text-gray-500 uppercase tracking-wider">DNA Factors</span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {answer.dnaFactors.map((f, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary/70 border border-primary/20">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {answer.memoryFactors.length > 0 && (
              <div>
                <span className="text-[10px] text-gray-500 uppercase tracking-wider">Memory Factors</span>
                <div className="mt-1 space-y-1">
                  {answer.memoryFactors.map((f, i) => (
                    <p key={i} className="text-[10px] text-gray-400">{f}</p>
                  ))}
                </div>
              </div>
            )}

            <p className="text-[10px] text-gray-600 italic">{answer.disclaimer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
