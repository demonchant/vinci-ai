import { resolveViewer } from "@/lib/viewer";
import { getMemoryCategories } from "@/services/dataSource";

export async function GET() {
  const { userId, demo } = await resolveViewer();
  const categories = await getMemoryCategories(userId, demo);
  return Response.json({ categories });
}
