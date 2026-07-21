import { NextRequest } from "next/server";
import { resolveViewer } from "@/lib/viewer";
import { generateLegacyReport } from "@/services/legacyReport";

export const maxDuration = 60; // generation can take up to 60s with multiple LLM calls

export async function POST(_req: NextRequest) {
  const { userId, demo } = await resolveViewer();
  if (demo) {
    return Response.json({ error: "Report generation is disabled in Judge Demo Mode. Demo report data is pre-loaded." }, { status: 403 });
  }
  const report = await generateLegacyReport(userId);
  return Response.json({ report }, { status: 201 });
}
