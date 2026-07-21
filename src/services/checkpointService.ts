import { prisma } from "@/lib/prisma";
import type { CollectorDNA } from "@/types/dna";
import type { CollectorMemoryFact } from "@/types/memory";
import { generateReasoning } from "./reasoningEngine";

function dnaLite(dna: CollectorDNA) {
  return {
    dnaScore: dna.dnaScore,
    primaryType: dna.primaryType,
    secondaryType: dna.secondaryType,
    wheel: dna.wheel,
  };
}

function memoryLite(facts: CollectorMemoryFact[]) {
  return facts.map((f) => ({ key: f.key, label: f.label, value: f.value }));
}

/**
 * Diffs two memory snapshots and returns only the keys that actually
 * changed. A checkpoint is only "meaningful" if this (or the DNA score)
 * is non-empty — most chat turns produce neither, and correctly create
 * no checkpoint at all, per the spec ("not every message creates a
 * checkpoint, only meaningful changes").
 */
function diffMemory(before: ReturnType<typeof memoryLite>, after: ReturnType<typeof memoryLite>) {
  const beforeMap = new Map(before.map((f) => [f.key, f.value]));
  const changed: { key: string; label: string; before: unknown; after: unknown }[] = [];
  for (const fact of after) {
    const prev = beforeMap.get(fact.key);
    if (JSON.stringify(prev) !== JSON.stringify(fact.value)) {
      changed.push({ key: fact.key, label: fact.label, before: prev ?? null, after: fact.value });
    }
  }
  return changed;
}

function diffDNA(before: ReturnType<typeof dnaLite>, after: ReturnType<typeof dnaLite>) {
  const changed: { metric: string; before: number; after: number }[] = [];
  if (before.dnaScore !== after.dnaScore) {
    changed.push({ metric: "DNA Score", before: before.dnaScore, after: after.dnaScore });
  }
  for (const axis of after.wheel) {
    const prevAxis = before.wheel.find((w) => w.axis === axis.axis);
    if (prevAxis && prevAxis.score !== axis.score) {
      changed.push({ metric: axis.axis, before: prevAxis.score, after: axis.score });
    }
  }
  return changed;
}

interface CheckpointInputs {
  chatId: string;
  userId: string;
  messageId?: string;
  memoryBefore: CollectorMemoryFact[];
  memoryAfter: CollectorMemoryFact[];
  dnaBefore: CollectorDNA;
  dnaAfter: CollectorDNA;
  activitySummary: string;
  triggerReason: string;
  sources: string[];
}

/**
 * Call this after every chat turn that touched memory or DNA. It diffs
 * before/after, and ONLY creates a checkpoint (+ its reasoning record) if
 * something actually changed. Returns null otherwise — that's the common
 * case and is correct, not a failure.
 */
export async function maybeCreateCheckpoint(inputs: CheckpointInputs) {
  const memBefore = memoryLite(inputs.memoryBefore);
  const memAfter = memoryLite(inputs.memoryAfter);
  const dnaBeforeLite = dnaLite(inputs.dnaBefore);
  const dnaAfterLite = dnaLite(inputs.dnaAfter);

  const memoryChanges = diffMemory(memBefore, memAfter);
  const dnaChanges = diffDNA(dnaBeforeLite, dnaAfterLite);

  if (memoryChanges.length === 0 && dnaChanges.length === 0) {
    return null;
  }

  const title =
    memoryChanges.length > 0
      ? `Collector Memory updated: ${memoryChanges.map((c) => c.label).join(", ")}`
      : `Collector DNA updated: ${dnaChanges.map((c) => c.metric).join(", ")}`;

  const checkpoint = await prisma.conversationCheckpoint.create({
    data: {
      chatId: inputs.chatId,
      userId: inputs.userId,
      messageId: inputs.messageId,
      checkpointTitle: title,
      checkpointDescription: inputs.activitySummary,
      memoryBefore: memBefore,
      memoryAfter: memAfter,
      dnaBefore: dnaBeforeLite,
      dnaAfter: dnaAfterLite,
      activitySummary: inputs.activitySummary,
      aiSummary: "", // filled in below once reasoning is generated
      confidence: 0,
      sources: inputs.sources,
      reason: inputs.triggerReason,
    },
  });

  // Generate the Why-I-Changed explanation immediately — grounded only in
  // the diffs computed above, never invented.
  const reasoning = await generateReasoning({
    checkpointId: checkpoint.id,
    memoryChanges,
    dnaChanges,
    sources: inputs.sources,
    activitySummary: inputs.activitySummary,
  });

  const updated = await prisma.conversationCheckpoint.update({
    where: { id: checkpoint.id },
    data: { aiSummary: reasoning.reason, confidence: reasoning.confidence },
  });

  return { checkpoint: updated, reasoning };
}

export async function listCheckpoints(chatId: string, userId: string) {
  return prisma.conversationCheckpoint.findMany({
    where: { chatId, userId },
    orderBy: { createdAt: "desc" },
  });
}

/** All checkpoints for a user across every conversation — powers the Memory Timeline. */
export async function listCheckpointsForUser(userId: string, limit = 100) {
  return prisma.conversationCheckpoint.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getCheckpoint(id: string, userId: string) {
  return prisma.conversationCheckpoint.findFirst({
    where: { id, userId },
    include: { reasoning: true },
  });
}
