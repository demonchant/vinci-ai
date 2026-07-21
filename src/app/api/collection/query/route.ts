import { NextRequest } from "next/server";
import { resolveViewer } from "@/lib/viewer";
import { queryCollectibles } from "@/services/collectionManager";
import { getCollection } from "@/services/dataSource";
import type { CollectionFilters } from "@/types/collection";

export async function GET(req: NextRequest) {
  const { userId, demo } = await resolveViewer();
  const params = req.nextUrl.searchParams;

  if (demo) {
    // Demo data is a fixed fixture array — apply lightweight client-side-style
    // filtering here instead of a real query, so the page still feels live.
    let items = await getCollection(userId, true);
    const category = params.get("category");
    const status = params.get("status");
    const query = params.get("query");
    if (category) items = items.filter((i) => i.category === category);
    if (status) items = items.filter((i) => i.status === status);
    if (query) items = items.filter((i) => i.title.toLowerCase().includes(query.toLowerCase()));
    return Response.json({ items, demo: true });
  }

  const filters: CollectionFilters = {
    category: (params.get("category") as any) ?? undefined,
    status: (params.get("status") as any) ?? undefined,
    collectionId: params.get("collectionId") ?? undefined,
    tagIds: params.get("tagIds")?.split(",").filter(Boolean),
    condition: params.get("condition") ?? undefined,
    isAuthenticated: params.has("isAuthenticated")
      ? params.get("isAuthenticated") === "true"
      : undefined,
    minValue: params.has("minValue") ? Number(params.get("minValue")) : undefined,
    maxValue: params.has("maxValue") ? Number(params.get("maxValue")) : undefined,
    minConfidence: params.has("minConfidence") ? Number(params.get("minConfidence")) : undefined,
    yearFrom: params.has("yearFrom") ? Number(params.get("yearFrom")) : undefined,
    yearTo: params.has("yearTo") ? Number(params.get("yearTo")) : undefined,
    query: params.get("query") ?? undefined,
    sortBy: (params.get("sortBy") as any) ?? undefined,
    sortDir: (params.get("sortDir") as any) ?? undefined,
  };

  const rows = await queryCollectibles(userId, filters);
  const items = rows.map((r) => ({
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

  return Response.json({ items, demo: false });
}
