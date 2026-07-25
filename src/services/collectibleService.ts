import { prisma } from "@/lib/prisma";
import { logActivity } from "./activityLogService";
import { commitMemoryFacts } from "./memoryService";
import { appendTimelineEvent } from "./timelineEvents";
import type { CreateCollectibleInput } from "@/types/collectible";
import type {
  CollectibleStatus,
  CollectibleCategory,
} from "@prisma/client";

export async function createCollectible(userId: string, input: CreateCollectibleInput) {
  const collectible = await prisma.collectible.create({
    data: {
      userId,
      title: input.title,
      category: input.category,
      status: input.status ?? "OWNED",
      collectionId: input.collectionId,
      brand: input.brand,
      franchise: input.franchise,
      artist: input.artist,
      year: input.year,
      condition: input.condition,
      gradingCompany: input.gradingCompany,
      grade: input.grade,
      purchasePrice: input.purchasePrice,
      estimatedValue: input.estimatedValue,
      notes: input.notes,
      tags: input.tags ?? [],
      images: input.imageUrls
        ? {
            create: input.imageUrls.map((url, i) => ({
              storagePath: url,
              publicUrl: url,
              isPrimary: i === 0,
            })),
          }
        : undefined,
    },
    include: { images: true },
  });

  await logActivity(userId, "COLLECTIBLE_ADDED", { collectibleId: collectible.id });

  await appendTimelineEvent({
    collectibleId: collectible.id,
    userId,
    eventType: "COLLECTION_ADDED",
    eventTitle: "Added to collection",
    eventDescription: `${collectible.title} was added to your collection.`,
    ownershipStatus: collectible.status,
  });

  // A new collectible is a strong, structured memory signal — commit it directly
  // rather than going through free-text extraction.
  const facts: Array<{
    key: string;
    label: string;
    value: string;
    confidence: number;
  }> = [];
  
  if (input.category) {
    facts.push({
      key: "favorite_category",
      label: "Favorite Category",
      value: input.category,
      confidence: 60,
    });
  }
  if (input.gradingCompany) {
    facts.push({
      key: "preferred_grading",
      label: "Preferred Grading",
      value: `${input.gradingCompany}${input.grade ? " " + input.grade : ""}`,
      confidence: 70,
    });
  }
  if (facts.length > 0) {
    await commitMemoryFacts(userId, facts, "COLLECTION_ACTION");
  }

  return collectible;
}

export async function listCollectibles(
  userId: string,
  filters?: {
  status?: CollectibleStatus;
  category?: CollectibleCategory;
  collectionId?: string;
}
) {
  const rows = await prisma.collectible.findMany({
    where: {
      userId,
      status: filters?.status,
      // ✅ FIX: Removed `as any` cast. Prisma accepts `string | undefined` natively.
      category: filters?.category,
      collectionId: filters?.collectionId,
    },
    include: { images: true },
    orderBy: { createdAt: "desc" },
  });

  return rows.map((r) => ({
    id: r.id,
    userId: r.userId,
    collectionId: r.collectionId,
    title: r.title,
    category: r.category,
    status: r.status,
    brand: r.brand,
    franchise: r.franchise,
    artist: r.artist,
    year: r.year,
    condition: r.condition,
    gradingCompany: r.gradingCompany,
    grade: r.grade,
    purchasePrice: r.purchasePrice ? Number(r.purchasePrice) : null,
    estimatedValue: r.estimatedValue ? Number(r.estimatedValue) : null,
    currency: r.currency,
    rarityScore: r.rarityScore,
    isAuthenticated: r.isAuthenticated,
    notes: r.notes,
    tags: r.tags,
    purchasedAt: r.purchasedAt?.toISOString() ?? null,
    soldAt: r.soldAt?.toISOString() ?? null,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
    images: r.images.map((img) => ({
      id: img.id,
      publicUrl: img.publicUrl,
      isPrimary: img.isPrimary,
      width: img.width,
      height: img.height,
    })),
  }));
}

export async function getCollectible(userId: string, id: string) {
  return prisma.collectible.findFirst({
    where: { id, userId },
    include: { images: true, analyses: true },
  });
}

export async function updateCollectible(
  userId: string,
  id: string,
  data: Partial<CreateCollectibleInput> & { status?: CollectibleStatus }
) {
  const updated = await prisma.collectible.update({
    where: { id, userId },
    data: {
      ...data,
      images: undefined, // images managed separately
    },
  });
  await logActivity(userId, "COLLECTIBLE_UPDATED", { collectibleId: id });
  return updated;
}

export async function deleteCollectible(userId: string, id: string) {
  await prisma.collectible.delete({ where: { id, userId } });
  await logActivity(userId, "COLLECTIBLE_REMOVED", { collectibleId: id });
}

export async function getCollectionStats(userId: string) {
  const collectibles = await prisma.collectible.findMany({ where: { userId } });

  const totalValue = collectibles.reduce(
    (sum, c) => sum + Number(c.estimatedValue ?? c.purchasePrice ?? 0),
    0
  );
  const categoryCounts = collectibles.reduce<Record<string, number>>((acc, c) => {
    acc[c.category] = (acc[c.category] ?? 0) + 1;
    return acc;
  }, {});
  const authenticatedPct =
    collectibles.length > 0
      ? Math.round(
          (collectibles.filter((c) => c.isAuthenticated).length / collectibles.length) * 100
        )
      : 0;

  return {
    total: collectibles.length,
    totalValue,
    categoryCounts,
    authenticatedPct,
    mostValuable: collectibles.sort(
      (a, b) => Number(b.estimatedValue ?? 0) - Number(a.estimatedValue ?? 0)
    )[0],
  };
}