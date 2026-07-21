import { resolveViewer } from "@/lib/viewer";
import { getMemoryHealth } from "@/services/dataSource";

export async function GET() {
  const { userId, demo } = await resolveViewer();
  const health = await getMemoryHealth(userId, demo);
  return Response.json({ health });
}
