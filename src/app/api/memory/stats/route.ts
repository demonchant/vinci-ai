import { resolveViewer } from "@/lib/viewer";
import { getMemoryOverview } from "@/services/dataSource";

export async function GET() {
  const { userId, demo } = await resolveViewer();
  const stats = await getMemoryOverview(userId, demo);
  return Response.json({ stats });
}
