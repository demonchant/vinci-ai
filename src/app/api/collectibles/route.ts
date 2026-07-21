import { NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createCollectible, listCollectibles } from "@/services/collectibleService";
import { createDNASnapshot } from "@/services/dnaSnapshotService";
import { z } from "zod";

const createSchema = z.object({
  title: z.string().min(1),
  category: z.enum([
    "TRADING_CARD",
    "SPORTS_CARD",
    "COMIC",
    "WATCH",
    "SNEAKER",
    "COIN",
    "NFT",
    "FIGURE",
    "MEMORABILIA",
    "OTHER",
  ]),
  status: z.enum(["OWNED", "WISHLIST", "FAVORITE", "SOLD", "PURCHASED"]).optional(),
  collectionId: z.string().uuid().optional(),
  brand: z.string().optional(),
  franchise: z.string().optional(),
  artist: z.string().optional(),
  year: z.number().optional(),
  condition: z.string().optional(),
  gradingCompany: z.string().optional(),
  grade: z.string().optional(),
  purchasePrice: z.number().optional(),
  estimatedValue: z.number().optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
  imageUrls: z.array(z.string().url()).optional(),
});

async function requireUser() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  return data.user;
}

export async function GET(req: NextRequest) {
  const user = await requireUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const items = await listCollectibles(user.id, {
    status: (searchParams.get("status") as any) ?? undefined,
    category: searchParams.get("category") ?? undefined,
    collectionId: searchParams.get("collectionId") ?? undefined,
  });
  return Response.json({ items });
}

export async function POST(req: NextRequest) {
  const user = await requireUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = createSchema.safeParse(await req.json());
  if (!parsed.success) {
    return Response.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
  }

  const collectible = await createCollectible(user.id, parsed.data);
  await createDNASnapshot(user.id, `Added "${collectible.title}" to collection`);

  return Response.json({ collectible }, { status: 201 });
}
