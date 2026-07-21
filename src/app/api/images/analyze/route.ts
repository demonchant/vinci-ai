import { NextRequest } from "next/server";
import { createSupabaseServerClient, createSupabaseAdminClient } from "@/lib/supabase/server";
import { runLabAnalysis } from "@/services/imageAnalysisEngine";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/services/activityLogService";
import { extractMemoryFacts, commitMemoryFacts, getMemoryProfile } from "@/services/memoryService";
import { computeCollectorDNA } from "@/services/dnaEngine";
import { createDNASnapshot } from "@/services/dnaSnapshotService";
import { maybeCreateCheckpoint } from "@/services/checkpointService";
import { appendTimelineEvent } from "@/services/timelineEvents";
import { AI_VALUATION_DISCLAIMER } from "@/lib/openai";

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET_COLLECTIBLES ?? "collectible-images";
const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic"];

export async function POST(req: NextRequest) {
  // ── Step 1: Validate file ──────────────────────────────────
  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const userId = auth.user.id;

  const formData = await req.formData();
  const file = formData.get("file");
  const collectibleId = formData.get("collectibleId") as string | null;

  if (!(file instanceof File)) {
    return Response.json({ error: "No file provided" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return Response.json({ error: "Unsupported file type" }, { status: 415 });
  }
  if (file.size > MAX_BYTES) {
    return Response.json({ error: "File too large (max 10MB)" }, { status: 413 });
  }

  // ── Step 2: Store in Supabase Storage ──────────────────────
  const admin = createSupabaseAdminClient();
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${userId}/${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await admin.storage
    .from(BUCKET)
    .upload(path, await file.arrayBuffer(), { contentType: file.type });
  if (uploadError) {
    return Response.json({ error: `Upload failed: ${uploadError.message}` }, { status: 500 });
  }
  const { data: publicUrlData } = admin.storage.from(BUCKET).getPublicUrl(path);
  const imageUrl = publicUrlData.publicUrl;

  try {
    // ── Step 3-5: Vision analysis, structured observations, confidence ──
    const lab = await runLabAnalysis(imageUrl);

    const analysisRecord = await prisma.imageAnalysis.create({
      data: {
        userId,
        collectibleId: collectibleId ?? undefined,
        imageUrl,
        identification: lab.identification,
        category: lab.category ?? undefined,
        estimatedRarity: lab.estimatedRarity,
        condition: lab.estimatedCondition,
        authenticity: lab.authenticityIndicators.join("; ") || "No specific indicators noted",
        historicalNote: lab.historicalBackground,
        valueRangeLow: lab.valueRangeLow,
        valueRangeHigh: lab.valueRangeHigh,
        confidenceScore: lab.overallConfidence,
        interestingFact: lab.keyObservations[0] ?? null,
        similarItems: [],
        rawModelOutput: lab as any,
      },
    });

    await logActivity(userId, "IMAGE_ANALYZED", { analysisId: analysisRecord.id, collectibleId });

    // ── Step 6: Compare against existing collection (if linked) ──
    let comparisonNote: string | null = null;
    if (collectibleId) {
      const existing = await prisma.collectible.findFirst({ where: { id: collectibleId, userId } });
      if (existing && existing.lastAnalysisConfidence !== null) {
        const delta = lab.overallConfidence - existing.lastAnalysisConfidence;
        comparisonNote =
          delta > 0
            ? `Confidence increased ${delta} points since the last analysis.`
            : delta < 0
              ? `Confidence decreased ${Math.abs(delta)} points since the last analysis.`
              : "Confidence unchanged since the last analysis.";
      }
      await prisma.collectible.update({
        where: { id: collectibleId },
        data: { lastAnalysisConfidence: lab.overallConfidence },
      });
    }

    // ── Step 7: Append Visual Provenance Timeline event ──
    if (collectibleId) {
      const isFirst = !comparisonNote;
      await appendTimelineEvent({
        collectibleId,
        userId,
        eventType: isFirst ? "FIRST_UPLOAD" : "IMAGE_REANALYSIS",
        eventTitle: isFirst ? "First image analyzed" : "Re-analyzed with new image",
        eventDescription: comparisonNote ?? `Identified as: ${lab.identification}`,
        imageId: undefined,
        analysisId: analysisRecord.id,
        confidence: lab.overallConfidence,
        estimatedValueMin: lab.valueRangeLow ?? undefined,
        estimatedValueMax: lab.valueRangeHigh ?? undefined,
      });
    }

    // ── Step 8: Suggest Collector Memory updates ──
    const { facts: existingFacts } = await getMemoryProfile(userId);
    const dnaBefore = await computeCollectorDNA(userId);
    const extracted = await extractMemoryFacts(
      `Analyzed a collectible: ${lab.identification}. Category: ${lab.category}. Era: ${lab.estimatedEra}.`,
      existingFacts.map((f) => f.key)
    );

    let checkpointResult = null;
    if (extracted.length > 0) {
      await commitMemoryFacts(userId, extracted, "IMAGE_ANALYSIS");
      // ── Step 9: Update Collector DNA when justified ──
      await createDNASnapshot(userId, `Analyzed collectible: ${lab.identification}`);
      const memoryAfter = await getMemoryProfile(userId);
      const dnaAfter = await computeCollectorDNA(userId);

      // ── Step 10: Create Conversation Checkpoint if meaningful ──
      // Image analyses outside chat aren't tied to a chat thread, so we
      // only create a checkpoint when one is explicitly tied to a chat.
      const chatId = formData.get("chatId") as string | null;
      if (chatId) {
        checkpointResult = await maybeCreateCheckpoint({
          chatId,
          userId,
          memoryBefore: existingFacts,
          memoryAfter: memoryAfter.facts,
          dnaBefore,
          dnaAfter,
          activitySummary: `Image analyzed: ${lab.identification}`,
          triggerReason: "Image analysis revealed new collector preferences",
          sources: [`Image Analysis: ${analysisRecord.id}`],
        });
      }

      if (collectibleId && checkpointResult) {
        await appendTimelineEvent({
          collectibleId,
          userId,
          eventType: "MEMORY_IMPACT",
          eventTitle: "Influenced Collector Memory",
          eventDescription: checkpointResult.reasoning.reason,
          checkpointId: checkpointResult.checkpoint.id,
          confidence: checkpointResult.reasoning.confidence,
        });
      }
    }

    // ── Step 11/12 done above (history saved, actions returned to client) ──
    return Response.json({
      analysis: { ...lab, id: analysisRecord.id, createdAt: analysisRecord.createdAt, disclaimer: AI_VALUATION_DISCLAIMER },
      imageUrl,
      comparisonNote,
      memoryUpdated: extracted.length > 0,
    });
  } catch (err) {
    return Response.json(
      { error: "Analysis failed", details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
