import { ActivityLog } from '@prisma/client';
import prisma from '../database/prisma';

export class ActivityLogRepository {
  async create(userId: string, action: string, description: string): Promise<ActivityLog> {
    return prisma.activityLog.create({
      data: {
        userId,
        action,
        description,
      },
    });
  }

  async findRecentByUserId(userId: string, limit: number = 10): Promise<ActivityLog[]> {
    return prisma.activityLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}
export const activityLogRepository = new ActivityLogRepository();
