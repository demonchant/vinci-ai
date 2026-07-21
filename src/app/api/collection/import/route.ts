import { NextRequest } from "next/server";
import { resolveViewer } from "@/lib/viewer";
import { previewImport, commitImport } from "@/services/collectionImport";

export async function POST(req: NextRequest) {
  const { userId, demo } = await resolveViewer();
  if (demo) return Response.json({ error: "Import is disabled in Judge Demo Mode" }, { status: 403 });

  const { content, format, commit } = await req.json();
  if (!content || !format) {
    return Response.json({ error: "content and format are required" }, { status: 400 });
  }

  let preview;
  try {
    preview = previewImport(content, format);
  } catch (e) {
    return Response.json(
      { error: "Could not parse file", details: e instanceof Error ? e.message : String(e) },
      { status: 400 }
    );
  }

  if (!commit) {
    return Response.json({ preview });
  }

  const created = await commitImport(userId, preview.validRows);
  return Response.json({ created, skipped: preview.invalidRows.length });
}
