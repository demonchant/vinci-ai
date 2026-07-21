import { resolveViewer } from "@/lib/viewer";
import { getDNA } from "@/services/dataSource";

export async function GET() {
  const { userId, demo } = await resolveViewer();
  const dna = await getDNA(userId, demo);
  return Response.json({ dna, demo });
}
