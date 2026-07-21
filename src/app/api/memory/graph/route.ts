import { resolveViewer } from "@/lib/viewer";
import { getMemoryGraph } from "@/services/dataSource";

export async function GET() {
  const { userId, demo } = await resolveViewer();
  const graph = await getMemoryGraph(userId, demo);
  return Response.json(graph);
}
