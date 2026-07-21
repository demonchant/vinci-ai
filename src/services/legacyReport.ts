import { prisma } from "@/lib/prisma";
import { gatherLegacyBundle } from "./legacyAnalytics";
import { generateNarrative } from "./legacyNarrative";
import type { LegacyReportData, LegacyReportRecord } from "@/types/legacy";

export async function generateLegacyReport(userId: string): Promise<LegacyReportRecord> {
  const bundle = await gatherLegacyBundle(userId);
  const { story, executiveSummary, aiLetter, nextChapter, dnaEvolutionSummary } =
    await generateNarrative(bundle);

  const reportData: LegacyReportData = {
    cover: bundle.cover,
    executiveSummary,
    story,
    dnaEvolutionSummary,
    collectionHighlights: bundle.collectionHighlights,
    memoryHighlights: bundle.memoryHighlights,
    conversationHighlights: bundle.conversationHighlights,
    achievements: bundle.achievements,
    goals: bundle.goals,
    portfolio: bundle.portfolio,
    legacyScore: bundle.legacyScore,
    aiLetter,
    nextChapter,
    provenanceHighlights: bundle.provenanceHighlights,
    marketNote: bundle.marketNote,
  };

  const now = new Date();
  const row = await prisma.legacyReport.create({
    data: {
      userId,
      periodStart: bundle.user.createdAt,
      periodEnd: now,
      reportData: reportData as any,
    },
  });

  return {
    id: row.id,
    userId: row.userId,
    periodStart: row.periodStart.toISOString(),
    periodEnd: row.periodEnd.toISOString(),
    reportData,
    pdfStoragePath: null,
    shareCardUrl: null,
    generatedAt: row.generatedAt.toISOString(),
  };
}

export async function getLegacyReport(
  reportId: string,
  userId: string
): Promise<LegacyReportRecord | null> {
  const row = await prisma.legacyReport.findFirst({ where: { id: reportId, userId } });
  if (!row) return null;
  return {
    id: row.id,
    userId: row.userId,
    periodStart: row.periodStart.toISOString(),
    periodEnd: row.periodEnd.toISOString(),
    reportData: row.reportData as unknown as LegacyReportData,
    pdfStoragePath: row.pdfStoragePath,
    shareCardUrl: row.shareCardUrl,
    generatedAt: row.generatedAt.toISOString(),
  };
}

export async function listLegacyReports(userId: string) {
  const rows = await prisma.legacyReport.findMany({
    where: { userId },
    orderBy: { generatedAt: "desc" },
    select: {
      id: true,
      userId: true,
      periodStart: true,
      periodEnd: true,
      pdfStoragePath: true,
      shareCardUrl: true,
      generatedAt: true,
    },
  });
  return rows.map((r) => ({
    id: r.id,
    userId: r.userId,
    periodStart: r.periodStart.toISOString(),
    periodEnd: r.periodEnd.toISOString(),
    pdfStoragePath: r.pdfStoragePath,
    shareCardUrl: r.shareCardUrl,
    generatedAt: r.generatedAt.toISOString(),
  }));
}

export async function deleteLegacyReport(reportId: string, userId: string) {
  return prisma.legacyReport.delete({ where: { id: reportId, userId } });
}
