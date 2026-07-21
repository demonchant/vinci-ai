import { NextRequest } from "next/server";
import { resolveViewer } from "@/lib/viewer";
import { getMemoryFacts } from "@/services/dataSource";
import {
  editMemory,
  pinMemory,
  archiveMemory,
  resetMemory,
  verifyMemory,
  unverifyMemory,
  setMemoryLock,
  correctMemory,
  getMemoryProfile,
} from "@/services/memoryService";

export async function GET() {
  const { userId, demo } = await resolveViewer();
  const profile = await getMemoryFacts(userId, demo);
  return Response.json({ ...profile, demo });
}

export async function PATCH(req: NextRequest) {
  const { userId, demo } = await resolveViewer();

  if (demo) {
    // Demo data is read-only — editing it would mislead the judge into
    // thinking their changes are real. Just echo the fixture back.
    const profile = await getMemoryFacts(userId, true);
    return Response.json({ ...profile, demo: true });
  }

  const { memoryId, action, value } = await req.json();

  switch (action) {
    case "edit":
      await editMemory(userId, memoryId, value);
      break;
    case "correct":
      await correctMemory(userId, memoryId, value);
      break;
    case "pin":
      await pinMemory(userId, memoryId, true);
      break;
    case "unpin":
      await pinMemory(userId, memoryId, false);
      break;
    case "verify":
      await verifyMemory(userId, memoryId);
      break;
    case "unverify":
      await unverifyMemory(userId, memoryId);
      break;
    case "lock":
      await setMemoryLock(userId, memoryId, true);
      break;
    case "unlock":
      await setMemoryLock(userId, memoryId, false);
      break;
    case "archive":
      await archiveMemory(userId, memoryId);
      break;
    case "reset_all":
      await resetMemory(userId);
      break;
    default:
      return Response.json({ error: "Unknown action" }, { status: 400 });
  }

  const profile = await getMemoryProfile(userId);
  return Response.json({ ...profile, demo: false });
}
