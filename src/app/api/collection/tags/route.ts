import { NextRequest } from "next/server";
import { resolveViewer } from "@/lib/viewer";
import { listTags, createTag } from "@/services/collectionManager";

export async function GET() {
  const { userId, demo } = await resolveViewer();
  if (demo) {
    return Response.json({
      tags: [
        {
          id: "demo-tag-1",
          name: "vintage",
          color: "#6D5DFB",
          parentId: null,
          isPinned: true,
          isAiSuggested: false,
          itemCount: 8,
        },
        {
          id: "demo-tag-2",
          name: "graded",
          color: "#00D4FF",
          parentId: null,
          isPinned: false,
          isAiSuggested: true,
          itemCount: 6,
        },
      ],
      demo: true,
    });
  }
  const tags = await listTags(userId);
  return Response.json({ tags, demo: false });
}

export async function POST(req: NextRequest) {
  const { userId, demo } = await resolveViewer();
  if (demo) return Response.json({ error: "Read-only in Judge Demo Mode" }, { status: 403 });
  const { name, color, parentId } = await req.json();
  if (!name) return Response.json({ error: "name is required" }, { status: 400 });
  const tag = await createTag(userId, { name, color, parentId });
  return Response.json({ tag }, { status: 201 });
}
