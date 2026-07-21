import { prisma } from "@/lib/prisma";
import { logActivity } from "./activityLogService";
import { appendTimelineEvent } from "./timelineEvents";
import { createDNASnapshot } from "./dnaSnapshotService";
import type { CollectionFilters } from "@/types/collection";
import type { CollectibleStatus } from "@prisma/client";

// ──────────────────────────────────────────────────────────────
// FILTERED QUERIES — the single read path every collection view uses
// ──────────────────────────────────────────────────────────────

export async function queryCollectibles(userId: string, filters: CollectionFilters) {
  const where: any = { userId };

  if (filters.category) where.category = filters.category;
  if (filters.status) where.status = filters.status;
  if (filters.collectionId) where.collectionId = filters.collectionId;
  if (filters.condition) where.condition = filters.condition;
  if (filters.isAuthenticated !== undefined) where.isAuthenticated = filters.isAuthenticated;
  if (filters.yearFrom || filters.yearTo) {
    where.year = {};
    if (filters.yearFrom) where.year.gte = filters.yearFrom;
    if (filters.yearTo) where.year.lte = filters.yearTo;
  }
  if (filters.minValue || filters.maxValue) {
    where.estimatedValue = {};
    if (filters.minValue) where.estimatedValue.gte = filters.minValue;
    if (filters.maxValue) where.estimatedValue.lte = filters.maxValue;
  }
  if (filters.minConfidence) {
    where.lastAnalysisConfidence = { gte: filters.minConfidence };
  }
  if (filters.tagIds && filters.tagIds.length > 0) {
    where.collectibleTags = { some: { tagId: { in: filters.tagIds } } };
  }
  if (filters.query) {
    where.OR = [
      { title: { contains: filters.query, mode: "insensitive" } },
      { brand: { contains: filters.query, mode: "insensitive" } },
      { franchise: { contains: filters.query, mode: "insensitive" } },
      { notes: { contains: filters.query, mode: "insensitive" } },
      { tags: { has: filters.query } },
    ];
  }

  const orderBy = filters.sortBy
    ? { [filters.sortBy]: filters.sortDir ?? "desc" }
    : { createdAt: "desc" as const };

  return prisma.collectible.findMany({
    where,
    orderBy,
    include: { images: true, collectibleTags: { include: { tag: true } } },
  });
}

// ──────────────────────────────────────────────────────────────
// NAMED COLLECTIONS
// ──────────────────────────────────────────────────────────────

export async function listNamedCollections(userId: string) {
  const collections = await prisma.collection.findMany({
    where: { userId },
    include: { _count: { select: { collectibles: true } } },
    orderBy: { createdAt: "asc" },
  });
  return collections.map((c) => ({
    id: c.id,
    name: c.name,
    description: c.description,
    coverImageUrl: c.coverImageUrl,
    isDefault: c.isDefault,
    aiSummary: c.aiSummary,
    itemCount: c._count.collectibles,
    createdAt: c.createdAt.toISOString(),
  }));
}

export async function createNamedCollection(
  userId: string,
  data: { name: string; description?: string }
) {
  return prisma.collection.create({ data: { userId, ...data } });
}

export async function updateNamedCollection(
  userId: string,
  id: string,
  data: { name?: string; description?: string; coverImageUrl?: string }
) {
  return prisma.collection.update({ where: { id, userId }, data });
}

export async function deleteNamedCollection(userId: string, id: string) {
  // Items aren't deleted — they just lose their collection assignment
  // (onDelete: SetNull on Collectible.collectionId).
  return prisma.collection.delete({ where: { id, userId } });
}

// ──────────────────────────────────────────────────────────────
// TAGS
// ──────────────────────────────────────────────────────────────

export async function listTags(userId: string) {
  const tags = await prisma.tag.findMany({
    where: { userId },
    include: { _count: { select: { collectibles: true } } },
    orderBy: [{ isPinned: "desc" }, { name: "asc" }],
  });
  return tags.map((t) => ({
    id: t.id,
    name: t.name,
    color: t.color,
    parentId: t.parentId,
    isPinned: t.isPinned,
    isAiSuggested: t.isAiSuggested,
    itemCount: t._count.collectibles,
  }));
}

export async function createTag(
  userId: string,
  data: { name: string; color?: string; parentId?: string }
) {
  return prisma.tag.create({ data: { userId, ...data } });
}

export async function renameTag(userId: string, tagId: string, name: string) {
  return prisma.tag.update({ where: { id: tagId, userId }, data: { name } });
}

export async function pinTag(userId: string, tagId: string, pinned: boolean) {
  return prisma.tag.update({ where: { id: tagId, userId }, data: { isPinned: pinned } });
}

export async function deleteTag(userId: string, tagId: string) {
  return prisma.tag.delete({ where: { id: tagId, userId } });
}

/** Merges sourceTag's items into targetTag, then deletes sourceTag. */
export async function mergeTags(userId: string, sourceTagId: string, targetTagId: string) {
  const sourceLinks = await prisma.collectibleTag.findMany({ where: { tagId: sourceTagId } });
  for (const link of sourceLinks) {
    await prisma.collectibleTag.upsert({
      where: { collectibleId_tagId: { collectibleId: link.collectibleId, tagId: targetTagId } },
      create: { collectibleId: link.collectibleId, tagId: targetTagId },
      update: {},
    });
  }
  await prisma.tag.delete({ where: { id: sourceTagId, userId } });
  return sourceLinks.length;
}

export async function tagCollectible(userId: string, collectibleId: string, tagId: string) {
  const owns = await prisma.collectible.findFirst({ where: { id: collectibleId, userId } });
  if (!owns) throw new Error("Not found");
  return prisma.collectibleTag.upsert({
    where: { collectibleId_tagId: { collectibleId, tagId } },
    create: { collectibleId, tagId },
    update: {},
  });
}

export async function untagCollectible(userId: string, collectibleId: string, tagId: string) {
  const owns = await prisma.collectible.findFirst({ where: { id: collectibleId, userId } });
  if (!owns) throw new Error("Not found");
  return prisma.collectibleTag.delete({ where: { collectibleId_tagId: { collectibleId, tagId } } });
}

// ──────────────────────────────────────────────────────────────
// WISHLIST
// ──────────────────────────────────────────────────────────────

export async function updateWishlistDetails(
  userId: string,
  collectibleId: string,
  data: { targetPrice?: number; priority?: number; desiredCondition?: string; notes?: string }
) {
  return prisma.collectible.update({
    where: { id: collectibleId, userId },
    data: {
      wishlistTargetPrice: data.targetPrice,
      wishlistPriority: data.priority,
      wishlistDesiredCondition: data.desiredCondition,
      notes: data.notes,
    },
  });
}

/** Converts a wishlist item into an owned collectible — closes the loop the spec asks for. */
export async function convertWishlistToOwned(
  userId: string,
  collectibleId: string,
  purchasePrice?: number
) {
  const updated = await prisma.collectible.update({
    where: { id: collectibleId, userId },
    data: { status: "OWNED", purchasePrice, purchasedAt: new Date() },
  });

  await appendTimelineEvent({
    collectibleId,
    userId,
    eventType: "OWNERSHIP_CHANGED",
    eventTitle: "Converted from wishlist to owned",
    eventDescription: `${updated.title} was purchased and added to your collection.`,
    ownershipStatus: "OWNED",
  });
  await logActivity(userId, "WISHLIST_UPDATED", { collectibleId, converted: true });
  await createDNASnapshot(userId, `Converted wishlist item "${updated.title}" to owned`);

  return updated;
}

// ──────────────────────────────────────────────────────────────
// BULK ACTIONS
// ──────────────────────────────────────────────────────────────

export async function bulkUpdateStatus(userId: string, ids: string[], status: CollectibleStatus) {
  const result = await prisma.collectible.updateMany({
    where: { id: { in: ids }, userId },
    data: { status },
  });
  for (const id of ids) {
    await appendTimelineEvent({
      collectibleId: id,
      userId,
      eventType: "OWNERSHIP_CHANGED",
      eventTitle: `Status changed to ${status}`,
      eventDescription: `Bulk action updated ownership status to ${status}.`,
      ownershipStatus: status,
    });
  }
  return result.count;
}

export async function bulkMoveToCollection(
  userId: string,
  ids: string[],
  collectionId: string | null
) {
  const result = await prisma.collectible.updateMany({
    where: { id: { in: ids }, userId },
    data: { collectionId },
  });
  return result.count;
}

export async function bulkDelete(userId: string, ids: string[]) {
  const result = await prisma.collectible.deleteMany({ where: { id: { in: ids }, userId } });
  return result.count;
}

export async function bulkTag(userId: string, ids: string[], tagId: string) {
  let count = 0;
  for (const id of ids) {
    const owns = await prisma.collectible.findFirst({ where: { id, userId } });
    if (!owns) continue;
    await prisma.collectibleTag.upsert({
      where: { collectibleId_tagId: { collectibleId: id, tagId } },
      create: { collectibleId: id, tagId },
      update: {},
    });
    count++;
  }
  return count;
}
