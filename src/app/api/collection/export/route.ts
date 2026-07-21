import { NextRequest } from "next/server";
import { resolveViewer } from "@/lib/viewer";
import { exportAsCSV, exportAsJSON, exportAsMarkdownCatalog } from "@/services/collectionExport";

export async function GET(req: NextRequest) {
  const { userId, demo } = await resolveViewer();
  if (demo) return Response.json({ error: "Export is disabled in Judge Demo Mode" }, { status: 403 });

  const format = req.nextUrl.searchParams.get("format") ?? "json";

  let body: string;
  let contentType: string;
  let filename: string;

  switch (format) {
    case "csv":
      body = await exportAsCSV(userId);
      contentType = "text/csv";
      filename = "collection.csv";
      break;
    case "markdown":
      body = await exportAsMarkdownCatalog(userId);
      contentType = "text/markdown";
      filename = "collection-catalog.md";
      break;
    default:
      body = await exportAsJSON(userId);
      contentType = "application/json";
      filename = "collection.json";
  }

  return new Response(body, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
