import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { gatherLegacyBundle } from "./legacyAnalytics";
import type {
  LegacyReportRecord,
  LegacyReportData,
} from "@/types/legacy";

export async function generateLegacyReport(
  userId: string
): Promise<LegacyReportRecord> {
  const bundle = await gatherLegacyBundle(userId);

  const reportData: LegacyReportData = {
    cover: bundle.cover,
    executiveSummary: `You are a ${bundle.dna.primaryType} collector with a DNA score of ${bundle.dna.dnaScore}. Your collection contains ${bundle.cover.collectionSize} items with an estimated value of ${
      bundle.cover.portfolioValue
        ? `$${bundle.cover.portfolioValue.toLocaleString()}`
        : "unknown"
    }.`,
    story: [],
    dnaEvolutionSummary: "Your collector DNA has remained consistent.",
    collectionHighlights: bundle.collectionHighlights,
    memoryHighlights: bundle.memoryHighlights,
    conversationHighlights: bundle.conversationHighlights,
    achievements: bundle.achievements,
    goals: bundle.goals,
    portfolio: bundle.portfolio,
    legacyScore: bundle.legacyScore,
    aiLetter: "Dear Collector, your journey has been remarkable...",
    nextChapter: [
      "Authenticate your high-value items",
      "Explore a new category",
    ],
    provenanceHighlights: bundle.provenanceHighlights,
    marketNote: bundle.marketNote,
  };

  const record = await prisma.legacyReport.create({
    data: {
      userId,
      periodStart: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      periodEnd: new Date(),
      reportData: reportData as unknown as Prisma.InputJsonValue,
      pdfStoragePath: null,
      shareCardUrl: null,
      generatedAt: new Date(),
    },
  });

  return {
    id: record.id,
    userId: record.userId,
    periodStart: record.periodStart.toISOString(),
    periodEnd: record.periodEnd.toISOString(),

    // ✅ FIX
    reportData: record.reportData as unknown as LegacyReportData,

    pdfStoragePath: record.pdfStoragePath,
    shareCardUrl: record.shareCardUrl,
    generatedAt: record.generatedAt.toISOString(),
  };
}

export async function getLegacyReport(
  reportId: string,
  userId: string
): Promise<LegacyReportRecord | null> {
  const record = await prisma.legacyReport.findFirst({
    where: { id: reportId, userId },
  });

  if (!record) return null;

  return {
    id: record.id,
    userId: record.userId,
    periodStart: record.periodStart.toISOString(),
    periodEnd: record.periodEnd.toISOString(),

    // ✅ FIX
    reportData: record.reportData as unknown as LegacyReportData,

    pdfStoragePath: record.pdfStoragePath,
    shareCardUrl: record.shareCardUrl,
    generatedAt: record.generatedAt.toISOString(),
  };
}

export async function listLegacyReports(
  userId: string
): Promise<LegacyReportRecord[]> {
  const records = await prisma.legacyReport.findMany({
    where: { userId },
    orderBy: { generatedAt: "desc" },
  });

  return records.map((record) => ({
    id: record.id,
    userId: record.userId,
    periodStart: record.periodStart.toISOString(),
    periodEnd: record.periodEnd.toISOString(),

    // ✅ FIX
    reportData: record.reportData as unknown as LegacyReportData,

    pdfStoragePath: record.pdfStoragePath,
    shareCardUrl: record.shareCardUrl,
    generatedAt: record.generatedAt.toISOString(),
  }));
}

export async function deleteLegacyReport(
  reportId: string,
  userId: string
): Promise<void> {
  await prisma.legacyReport.deleteMany({
    where: {
      id: reportId,
      userId,
    },
  });
}