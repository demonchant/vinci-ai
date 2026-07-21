import { resolveViewer } from "@/lib/viewer";
import { listAchievements } from "@/services/achievementService";
import { demoAchievements } from "@/demo/fixtures/demoAchievements";

export async function GET() {
  const { userId, demo } = await resolveViewer();
  if (demo) return Response.json({ achievements: demoAchievements, demo: true });
  const achievements = await listAchievements(userId);
  return Response.json({ achievements, demo: false });
}
