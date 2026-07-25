import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client"; // ✅ FIX: Added Prisma import for typing
import type { RelatedCollectibleSuggestion } from "@/types/collection";

export async function findRelatedCollectibles(
  userId: string,
  collectibleId: string
): Promise<RelatedCollectibleSuggestion[]> {
  const item = await prisma.collectible.findFirst({ where: { id: collectibleId, userId } });
  if (!item) return [];

  // ✅ FIX: Replaced `.filter(Boolean) as any` with a properly typed array using spread syntax
  const orConditions: Prisma.CollectibleWhereInput[] = [
    { category: item.category },
    ...(item.brand ? [{ brand: item.brand }] : []),
    ...(item.franchise ? [{ franchise: item.franchise }] : []),
    ...(item.year ? [{ year: item.year }] : []),
  ];

  const candidates = await prisma.collectible.findMany({
    where: {
      userId,
      id: { not: collectibleId },
      OR: orConditions,
    },
    include: { images: true },
    take: 6,
  });

  return candidates.map((c) => {
    const reasons: string[] = [];
    if (c.category === item.category) reasons.push(`shared category (${item.category})`);
    if (item.brand && c.brand === item.brand) reasons.push(`shared brand (${item.brand})`);
    if (item.franchise && c.franchise === item.franchise)
      reasons.push(`shared franchise (${item.franchise})`);
    if (item.year && c.year === item.year) reasons.push(`same year (${item.year})`);

    return {
      collectible: {
        id: c.id,
        userId: c.userId,
        collectionId: c.collectionId,
        title: c.title,
        category: c.category,
        status: c.status,
        brand: c.brand,
        franchise: c.franchise,
        artist: c.artist,
        year: c.year,
        condition: c.condition,
        gradingCompany: c.gradingCompany,
        grade: c.grade,
        purchasePrice: c.purchasePrice ? Number(c.purchasePrice) : null,
        estimatedValue: c.estimatedValue ? Number(c.estimatedValue) : null,
        currency: c.currency,
        rarityScore: c.rarityScore,
        isAuthenticated: c.isAuthenticated,
        notes: c.notes,
        tags: c.tags,
        purchasedAt: c.purchasedAt?.toISOString() ?? null,
        soldAt: c.soldAt?.toISOString() ?? null,
        createdAt: c.createdAt.toISOString(),
        updatedAt: c.updatedAt.toISOString(),
        images: c.images.map((img) => ({
          id: img.id,
          publicUrl: img.publicUrl,
          isPrimary: img.isPrimary,
          width: img.width,
          height: img.height,
        })),
      },
      reason: reasons.length > 0 ? `Related by ${reasons.join(", ")}.` : "In your collection.",
    };
  });
}