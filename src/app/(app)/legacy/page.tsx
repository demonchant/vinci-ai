"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { FileText, Loader2, Sparkles } from "@/components/ui/icons";
import { Icon } from "@/components/ui/Icon";
import { useLegacy } from "@/hooks/useLegacy";
import { LegacyCover } from "@/components/legacy/cover/LegacyCover";
import { LegacyStory } from "@/components/legacy/story/LegacyStory";
import { AILetter } from "@/components/legacy/story/AILetter";
import { CollectionHighlights } from "@/components/legacy/collection/CollectionHighlights";
import { MemoryHighlights } from "@/components/legacy/memory/MemoryHighlights";
import { AchievementsShowcase } from "@/components/legacy/achievements/AchievementsShowcase";
import { NextChapter } from "@/components/legacy/goals/NextChapter";
import { ReportHistory } from "@/components/legacy/history/ReportHistory";
import { LegacyExportToolbar } from "@/components/legacy/export/LegacyExportToolbar";
import { LegacyIntelligenceSection } from "@/components/legacy/intelligence/LegacyIntelligenceSection";
import type { LegacyReportData } from "@/types/legacy";

const LegacyScorePanel = dynamic(
  () => import("@/components/legacy/portfolio/LegacyScorePanel").then((m) => m.LegacyScorePanel),
  { loading: () => <div className="h-64 animate-pulse rounded-2xl bg-white/5" /> }
);

type ReportSection = { id: string; label: string };

const SECTIONS: ReportSection[] = [
  { id: "cover", label: "Cover" },
  { id: "summary", label: "Summary" },
  { id: "story", label: "Story" },
  { id: "score", label: "Legacy Score" },
  { id: "intelligence", label: "Intelligence" },
  { id: "collection", label: "Collection" },
  { id: "memory", label: "Memory" },
  { id: "achievements", label: "Achievements" },
  { id: "letter", label: "AI Letter" },
  { id: "next", label: "Next Chapter" },
];

export default function LegacyPage() {
  const { report, isGenerating, error, generate, loadReport, downloadExport } = useLegacy();
  const [demo, setDemo] = useState(false);
  const [activeSection, setActiveSection] = useState("cover");

  useEffect(() => {
    fetch("/api/legacy/history")
      .then((r) => r.json())
      .then(async (data: { demo: boolean; reports: { id: string }[] }) => {
        setDemo(Boolean(data.demo));
        const latest = data.reports?.[0];
        if (latest && latest.id !== "demo-report-1") {
          // Real load logic would go here
        }
      })
      .catch(() => {
        /* Ignore fetch errors on mount */
      });
  }, []);

  async function handleOpenReport(reportId: string) {
    const res = await fetch(`/api/legacy/export?format=json&reportId=${reportId}`);
    if (!res.ok) return;
    
    // Explicitly type the JSON response
    const data: LegacyReportData = await res.json();
    
    loadReport({
      id: reportId,
      userId: "",
      periodStart: "",
      periodEnd: "",
      reportData: data,
      pdfStoragePath: null,
      shareCardUrl: null,
      generatedAt: new Date().toISOString(),
    });
  }

  // Explicitly type the report data variable
  const rd: LegacyReportData | undefined = report?.reportData;

  return (
    <div className="flex h-screen">
      <nav className="hidden w-52 shrink-0 flex-col border-r border-white/5 p-4 lg:flex">
        <p className="mb-4 text-[11px] font-medium uppercase tracking-wide text-gray-600">
          Report Sections
        </p>
        <div className="space-y-0.5">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setActiveSection(s.id);
                document.getElementById(`section-${s.id}`)?.scrollIntoView({ behavior: "smooth" });
              }}
              className={`w-full rounded-lg px-2.5 py-2 text-left text-xs transition ${
                activeSection === s.id
                  ? "bg-primary/20 text-primary"
                  : "text-gray-500 hover:bg-white/5 hover:text-gray-300"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
        <div className="mt-auto pt-4 border-t border-white/5">
          <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-gray-600">
            History
          </p>
          <ReportHistory onOpen={handleOpenReport} />
        </div>
      </nav>

      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex shrink-0 items-center justify-between border-b border-white/5 px-6 py-3">
          <div className="flex items-center gap-2">
            <Icon icon={FileText} size="button" className="text-accent" decorative />
            <p className="text-sm font-medium">AI Collector Legacy Report™</p>
            {demo && (
              <span className="rounded-full bg-white/5 px-2 py-0.5 text-[11px] text-gray-500">
                Demo Mode
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {report && <LegacyExportToolbar reportId={report.id} />}
            {!demo && (
              <button
                onClick={generate}
                disabled={isGenerating}
                className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-medium text-white shadow-glow disabled:opacity-70"
              >
                {isGenerating ? (
                  <Icon icon={Loader2} size="button" className="animate-spin" decorative />
                ) : (
                  <Icon icon={Sparkles} size="button" decorative />
                )}
                {isGenerating ? "Generating..." : report ? "Regenerate" : "Generate Report"}
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isGenerating && (
            <div className="flex h-full flex-col items-center justify-center gap-4">
              <Icon icon={Loader2} size="hero" className="animate-spin text-primary" decorative />
              <p className="text-sm text-gray-400">
                Vinci AI is gathering your data and writing your Legacy Report...
              </p>
              <p className="text-xs text-gray-600">This takes about 30-60 seconds.</p>
            </div>
          )}

          {error && !isGenerating && (
            <div className="flex h-full flex-col items-center justify-center gap-3">
              <p className="text-sm text-gray-400">{error}</p>
              {!demo && (
                <button
                  onClick={generate}
                  className="rounded-xl bg-primary px-4 py-2 text-xs text-white"
                >
                  Try again
                </button>
              )}
            </div>
          )}

          {!isGenerating && !error && !rd && (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center px-6">
              <Icon icon={FileText} size="illustration" className="text-gray-700" decorative />
              <p className="text-lg text-gray-300">Your Legacy Report awaits</p>
              <p className="max-w-md text-sm text-gray-500">
                Generate your first AI Collector Legacy Report™ — a museum-quality celebration of
                your collecting journey, grounded entirely in your real data.
              </p>
              {!demo && (
                <button
                  onClick={generate}
                  className="rounded-xl bg-primary px-6 py-3 font-medium text-white shadow-glow"
                >
                  Generate My Legacy Report
                </button>
              )}
              {demo && (
                <p className="text-xs text-gray-600">
                  Sign up to generate your real Legacy Report.
                </p>
              )}
            </div>
          )}

          {!isGenerating && !error && rd && (
            <AnimatePresence>
              <div className="space-y-12 px-6 py-8 max-w-4xl mx-auto">
                <Section id="cover">
                  <LegacyCover cover={rd.cover} legacyScore={rd.legacyScore.overall} />
                </Section>

                <Section id="summary" title="Executive Summary">
                  <p className="text-sm leading-relaxed text-gray-300">{rd.executiveSummary}</p>
                </Section>

                <Section id="story" title="The Collector's Story">
                  <LegacyStory sections={rd.story} />
                </Section>

                <Section id="score" title="Legacy Score">
                  <LegacyScorePanel score={rd.legacyScore} />
                </Section>

                <Section id="intelligence" title="Collector Intelligence">
                  <LegacyIntelligenceSection />
                </Section>

                <Section id="collection" title="Collection Highlights">
                  <CollectionHighlights highlights={rd.collectionHighlights} />
                </Section>

                <Section id="memory" title="Memory Highlights">
                  <MemoryHighlights highlights={rd.memoryHighlights} />
                </Section>

                <Section id="achievements" title="Achievements">
                  <AchievementsShowcase achievements={rd.achievements} />
                </Section>

                {rd.provenanceHighlights.length > 0 && (
                  <Section id="provenance" title="Provenance Highlights">
                    <div className="space-y-2">
                      {/* ✅ Explicitly typed to prevent implicit 'any' error */}
                      {rd.provenanceHighlights.map((h: { label: string; detail: string }, i: number) => (
                        <div key={i} className="rounded-xl bg-white/[0.02] p-3">
                          <p className="text-[11px] uppercase tracking-wide text-gray-600">{h.label}</p>
                          <p className="mt-1 text-sm text-gray-300">{h.detail}</p>
                        </div>
                      ))}
                    </div>
                  </Section>
                )}

                <Section id="letter" title="A Letter from Vinci AI">
                  <AILetter letter={rd.aiLetter} />
                </Section>

                <Section id="next" title="The Next Chapter">
                  <NextChapter recommendations={rd.nextChapter} />
                </Section>

                <div className="pb-4 pt-8 text-center">
                  <p className="text-xs text-gray-600">{rd.marketNote}</p>
                  <p className="mt-2 text-[11px] text-gray-700">
                    Generated{" "}
                    {new Date(rd.cover.generatedAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}{" "}
                    by Vinci AI
                  </p>
                </div>
              </div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      id={`section-${id}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {title && <h2 className="mb-4 font-display text-2xl">{title}</h2>}
      {children}
    </motion.section>
  );
}