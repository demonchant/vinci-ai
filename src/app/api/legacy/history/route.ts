import { NextRequest } from "next/server";
import { resolveViewer } from "@/lib/viewer";
import { listLegacyReports, getLegacyReport, deleteLegacyReport } from "@/services/legacyReport";
import { demoLegacy } from "@/demo/fixtures/demoLegacy";

export async function GET() {
  const { userId, demo } = await resolveViewer();
  if (demo) return Response.json({ reports: [{ id: "demo-report-1", userId: "demo", periodStart: "2024-09-01", periodEnd: "2025-06-30", pdfStoragePath: null, shareCardUrl: null, generatedAt: new Date().toISOString() }], demo: true });
  const reports = await listLegacyReports(userId);
  return Response.json({ reports, demo: false });
}

export async function DELETE(req: NextRequest) {
  const { userId, demo } = await resolveViewer();
  if (demo) return Response.json({ error: "Read-only in Judge Demo Mode" }, { status: 403 });
  const { reportId } = await req.json();
  await deleteLegacyReport(reportId, userId);
  return Response.json({ success: true });
}
