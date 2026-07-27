import { RefreshToken } from '@prisma/client';
import prisma from '../database/prisma';

export class RefreshTokenRepository {
  async create(userId: string, token: string, expiresAt: Date): Promise<RefreshToken> {
    return prisma.refreshToken.create({
      data: {
        userId,
        token,
        expiresAt,
      },
    });
  }

  async findByToken(token: string): Promise<any | null> {
    return prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true },
    });
  }

  async deleteByToken(token: string): Promise<RefreshToken | null> {
    try {
      return await prisma.refreshToken.delete({
        where: { token },
      });
    } catch {
      return null;
    }
  }

  async deleteByUserId(userId: string): Promise<void> {
    await prisma.refreshToken.deleteMany({
      where: { userId },
    });
  }

  async deleteExpiredTokens(): Promise<void> {
    await prisma.refreshToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
  }
}
export const refreshTokenRepository = new RefreshTokenRepository();
