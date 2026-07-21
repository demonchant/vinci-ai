import { NextRequest } from "next/server";
import { resolveViewer } from "@/lib/viewer";
import { getAlerts, updateAlertStatus } from "@/services/watchlist";
import type { AlertStatus } from "@/types/market";

export async function GET() {
  const { userId, demo } = await resolveViewer();
  const alerts = await getAlerts(userId, demo);
  return Response.json({ alerts, demo });
}

export async function PATCH(req: NextRequest) {
  const { userId, demo } = await resolveViewer();
  const body = await req.json();
  const { alertId, status } = body as { alertId: string; status: AlertStatus };

  if (!alertId || !status) {
    return Response.json({ error: "alertId and status required" }, { status: 400 });
  }

  const updated = await updateAlertStatus(userId, alertId, status, demo);
  if (!updated) return Response.json({ error: "Alert not found" }, { status: 404 });

  return Response.json({ alert: updated });
}
