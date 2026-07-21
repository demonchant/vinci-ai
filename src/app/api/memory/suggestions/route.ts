import { NextRequest } from "next/server";
import { resolveViewer } from "@/lib/viewer";
import { getMemorySuggestions } from "@/services/dataSource";
import { generateSuggestions, resolveSuggestion } from "@/services/memorySuggestionService";

export async function GET() {
  const { userId, demo } = await resolveViewer();
  let suggestions = await getMemorySuggestions(userId, demo);
  if (!demo && suggestions.length === 0) {
    // Lazily generate on read — keeps this real-time without a cron job.
    suggestions = await generateSuggestions(userId);
  }
  return Response.json({ suggestions, demo });
}

export async function POST(req: NextRequest) {
  const { userId, demo } = await resolveViewer();
  if (demo) {
    return Response.json({ error: "Suggestions are read-only in Judge Demo Mode" }, { status: 403 });
  }
  const { suggestionId, action } = await req.json();
  const result = await resolveSuggestion(userId, suggestionId, action);
  if (!result) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ suggestion: result });
}
