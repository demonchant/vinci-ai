import { prisma } from "@/lib/prisma";
import type { ActivityType } from "@prisma/client";

export async function logActivity(
  userId: string,
  type: ActivityType,
  metadata?: Record<string, unknown>
) {
  return prisma.activityLog.create({
    data: { userId, type, metadata: metadata ?? {} },
  });
}

export async function getRecentActivity(userId: string, limit = 50) {
  return prisma.activityLog.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function countActivityByType(userId: string, type: ActivityType) {
  return prisma.activityLog.count({ where: { userId, type } });
}
