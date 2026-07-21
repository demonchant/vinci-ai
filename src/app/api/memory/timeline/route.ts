import { resolveViewer } from "@/lib/viewer";
import { getMemoryTimeline } from "@/services/dataSource";

export async function GET() {
  const { userId, demo } = await resolveViewer();
  const timeline = await getMemoryTimeline(userId, demo);
  return Response.json({ timeline });
}
