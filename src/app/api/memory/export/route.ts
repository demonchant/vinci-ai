import { NextRequest } from "next/server";
import { resolveViewer } from "@/lib/viewer";
import { exportMemoryAsJSON, exportMemoryAsMarkdown } from "@/services/memoryService";

export async function GET(req: NextRequest) {
  const { userId, demo } = await resolveViewer();
  if (demo) {
    return Response.json({ error: "Export is disabled in Judge Demo Mode" }, { status: 403 });
  }

  const format = new URL(req.url).searchParams.get("format") ?? "json";
  const body =
    format === "markdown" ? await exportMemoryAsMarkdown(userId) : await exportMemoryAsJSON(userId);

  return new Response(body, {
    headers: {
      "Content-Type": format === "markdown" ? "text/markdown" : "application/json",
      "Content-Disposition": `attachment; filename="collector-memory.${format === "markdown" ? "md" : "json"}"`,
    },
  });
}
