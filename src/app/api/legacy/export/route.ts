import { NextRequest } from "next/server";
import { resolveViewer } from "@/lib/viewer";
import { getLegacyReport } from "@/services/legacyReport";
import { exportAsMarkdown, exportAsJSON, exportAsSVGCover } from "@/services/legacyExport";

export async function GET(req: NextRequest) {
  const { userId } = await resolveViewer();
  const params = req.nextUrl.searchParams;
  const format = params.get("format") ?? "markdown";
  const reportId = params.get("reportId");
  if (!reportId) return Response.json({ error: "reportId is required" }, { status: 400 });

  const report = await getLegacyReport(reportId, userId);
  if (!report) return Response.json({ error: "Not found" }, { status: 404 });

  switch (format) {
    case "svg": {
      const svg = exportAsSVGCover(report.reportData);
      return new Response(svg, { headers: { "Content-Type": "image/svg+xml", "Content-Disposition": 'attachment; filename="legacy-cover.svg"' } });
    }
    case "json": {
      const json = exportAsJSON(report.reportData);
      return new Response(json, { headers: { "Content-Type": "application/json", "Content-Disposition": 'attachment; filename="legacy-report.json"' } });
    }
    default: {
      const md = exportAsMarkdown(report.reportData);
      return new Response(md, { headers: { "Content-Type": "text/markdown", "Content-Disposition": 'attachment; filename="legacy-report.md"' } });
    }
  }
}
