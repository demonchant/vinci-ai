import { NextRequest } from "next/server";
import { resolveViewer } from "@/lib/viewer";
import { getWatchlists, getWatchlist } from "@/services/watchlist";

export async function GET(req: NextRequest) {
  const { userId, demo } = await resolveViewer();
  const { searchParams } = new URL(req.url);
  const watchlistId = searchParams.get("id");

  if (watchlistId) {
    const watchlist = await getWatchlist(userId, watchlistId, demo);
    if (!watchlist) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json({ watchlist, demo });
  }

  const watchlists = await getWatchlists(userId, demo);
  return Response.json({ watchlists, demo });
}
