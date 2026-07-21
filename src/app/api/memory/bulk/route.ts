import { NextRequest } from "next/server";
import { resolveViewer } from "@/lib/viewer";
import {
  verifyAll,
  recalculateAllConfidence,
  forgetCategory,
  type MemoryCategory,
} from "@/services/memoryService";

export async function POST(req: NextRequest) {
  const { userId, demo } = await resolveViewer();
  if (demo) {
    return Response.json({ error: "Bulk actions are disabled in Judge Demo Mode" }, { status: 403 });
  }

  const { action, category } = await req.json();

  switch (action) {
    case "verify_all": {
      const count = await verifyAll(userId);
      return Response.json({ affected: count });
    }
    case "recalculate_confidence": {
      const count = await recalculateAllConfidence(userId);
      return Response.json({ affected: count });
    }
    case "forget_category": {
      if (!category) return Response.json({ error: "category is required" }, { status: 400 });
      const count = await forgetCategory(userId, category as MemoryCategory);
      return Response.json({ affected: count });
    }
    default:
      return Response.json({ error: "Unknown action" }, { status: 400 });
  }
}
