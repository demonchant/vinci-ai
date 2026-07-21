import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const onlyOpportunities = searchParams.get("opportunities") === "true";
  const onlyRisks = searchParams.get("risks") === "true";

  const insights = await prisma.marketInsight.findMany({
    where: {
      category: (category as any) ?? undefined,
      isOpportunity: onlyOpportunities ? true : undefined,
      isRisk: onlyRisks ? true : undefined,
    },
    orderBy: { publishedAt: "desc" },
    take: 50,
  });

  return Response.json({ insights });
}
