import { prisma } from "@/lib/prisma";
import { Prisma, type ActivityType } from "@prisma/client";

export async function logActivity(
  userId: string,
  type: ActivityType,
  metadata?: Prisma.InputJsonValue
) {
  return prisma.activityLog.create({
    data: {
      userId,
      type,
      metadata: metadata ?? Prisma.JsonNull,
    },
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
  return prisma.activityLog.count({
    where: { userId, type },
  });
}