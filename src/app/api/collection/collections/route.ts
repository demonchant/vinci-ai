import { NextRequest } from "next/server";
import { resolveViewer } from "@/lib/viewer";
import { listNamedCollections, createNamedCollection } from "@/services/collectionManager";

export async function GET() {
  const { userId, demo } = await resolveViewer();
  if (demo) {
    return Response.json({
      collections: [
        {
          id: "demo-collection",
          name: "My Collection",
          description: null,
          coverImageUrl: null,
          isDefault: true,
          aiSummary: null,
          itemCount: 14,
          createdAt: new Date().toISOString(),
        },
      ],
      demo: true,
    });
  }
  const collections = await listNamedCollections(userId);
  return Response.json({ collections, demo: false });
}

export async function POST(req: NextRequest) {
  const { userId, demo } = await resolveViewer();
  if (demo) return Response.json({ error: "Read-only in Judge Demo Mode" }, { status: 403 });
  const { name, description } = await req.json();
  if (!name) return Response.json({ error: "name is required" }, { status: 400 });
  const collection = await createNamedCollection(userId, { name, description });
  return Response.json({ collection }, { status: 201 });
}
