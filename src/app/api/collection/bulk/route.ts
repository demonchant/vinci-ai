import { NextRequest } from "next/server";
import { resolveViewer } from "@/lib/viewer";
import {
  bulkUpdateStatus,
  bulkMoveToCollection,
  bulkDelete,
  bulkTag,
} from "@/services/collectionManager";

export async function POST(req: NextRequest) {
  const { userId, demo } = await resolveViewer();
  if (demo) {
    return Response.json({ error: "Bulk actions are disabled in Judge Demo Mode" }, { status: 403 });
  }

  const { action, ids, status, collectionId, tagId } = await req.json();
  if (!Array.isArray(ids) || ids.length === 0) {
    return Response.json({ error: "ids is required" }, { status: 400 });
  }

  switch (action) {
    case "set_status": {
      if (!status) return Response.json({ error: "status is required" }, { status: 400 });
      const affected = await bulkUpdateStatus(userId, ids, status);
      return Response.json({ affected, action });
    }
    case "move_collection": {
      const affected = await bulkMoveToCollection(userId, ids, collectionId ?? null);
      return Response.json({ affected, action });
    }
    case "delete": {
      const affected = await bulkDelete(userId, ids);
      return Response.json({ affected, action });
    }
    case "tag": {
      if (!tagId) return Response.json({ error: "tagId is required" }, { status: 400 });
      const affected = await bulkTag(userId, ids, tagId);
      return Response.json({ affected, action });
    }
    default:
      return Response.json({ error: "Unknown action" }, { status: 400 });
  }
}
