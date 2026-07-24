import { NextResponse } from "next/server";
import { listLegacyReports, deleteLegacyReport } from "@/services/legacyReport";

export async function GET() {
  const userId = "current-user-id"; // Replace with session.user.id

  try {
    const reports = await listLegacyReports(userId);
    return NextResponse.json({ 
      demo: false,
      reports: reports.map(r => ({ id: r.id, generatedAt: r.generatedAt }))
    });
  } catch (error) {
    console.error("Failed to fetch legacy reports:", error);
    return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const userId = "current-user-id"; // Replace with session.user.id
  const { searchParams } = new URL(req.url);
  const reportId = searchParams.get("reportId");

  if (!reportId) {
    return NextResponse.json({ error: "Missing reportId" }, { status: 400 });
  }

  try {
    await deleteLegacyReport(reportId, userId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete legacy report:", error);
    return NextResponse.json({ error: "Failed to delete report" }, { status: 500 });
  }
}