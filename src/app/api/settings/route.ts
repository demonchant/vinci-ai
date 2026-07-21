import { NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

async function requireUser() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  return data.user;
}

export async function GET() {
  const user = await requireUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const settings = await prisma.settings.upsert({
    where: { userId: user.id },
    create: { userId: user.id },
    update: {},
  });
  return Response.json({ settings });
}

export async function PATCH(req: NextRequest) {
  const user = await requireUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const settings = await prisma.settings.update({
    where: { userId: user.id },
    data: {
      emailNotifications: body.emailNotifications,
      pushNotifications: body.pushNotifications,
      marketAlerts: body.marketAlerts,
      memoryEnabled: body.memoryEnabled,
    },
  });
  return Response.json({ settings });
}
