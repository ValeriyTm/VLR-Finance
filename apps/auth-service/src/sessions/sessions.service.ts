import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { Session } from '@prisma/client';

export interface CreateSessionDto {
  userId: string;
  tokenFamily: string;
  refreshToken: string;
  deviceInfo?: string;
  ipAddress?: string;
}

@Injectable()
export class SessionsService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async create(createSessionDto: CreateSessionDto): Promise<Session> {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    const session = await this.prisma.session.create({
      data: {
        ...createSessionDto,
        expiresAt,
      },
    });

    // Cache in Redis for quick lookup
    await this.cacheSession(session);

    return session;
  }

  async findById(id: string): Promise<Session> {
    const session = await this.prisma.session.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    return session;
  }

  async findByRefreshToken(refreshToken: string): Promise<Session | null> {
    // Check Redis cache first
    const cached = await this.redis.get(`session:${refreshToken}`);
    if (cached) {
      return JSON.parse(cached);
    }

    // Fallback to database
    const session = await this.prisma.session.findUnique({
      where: { refreshToken },
      include: { user: true },
    });

    if (session) {
      await this.cacheSession(session);
    }

    return session;
  }

  async findByUserId(userId: string): Promise<Session[]> {
    return this.prisma.session.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async delete(id: string): Promise<Session> {
    const session = await this.prisma.session.delete({
      where: { id },
    });

    // Remove from cache
    await this.redis.del(`session:${session.refreshToken}`);

    return session;
  }

  async deleteByRefreshToken(refreshToken: string): Promise<void> {
    await this.prisma.session.delete({
      where: { refreshToken },
    });

    // Remove from cache
    await this.redis.del(`session:${refreshToken}`);
  }

  async revokeAllUserSessions(userId: string): Promise<void> {
    const sessions = await this.prisma.session.findMany({
      where: { userId },
    });

    // Delete from database
    await this.prisma.session.deleteMany({
      where: { userId },
    });

    // Remove all from cache
    for (const session of sessions) {
      await this.redis.del(`session:${session.refreshToken}`);
    }
  }

  async rotateToken(sessionId: string, newRefreshToken: string): Promise<Session> {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    const session = await this.prisma.session.update({
      where: { id: sessionId },
      data: {
        refreshToken: newRefreshToken,
        rotationAt: new Date(),
        expiresAt,
      },
    });

    // Update cache
    await this.cacheSession(session);

    return session;
  }

  async cleanupExpiredSessions(): Promise<void> {
    const expiredSessions = await this.prisma.session.findMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    // Delete from database
    await this.prisma.session.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    // Remove from cache
    for (const session of expiredSessions) {
      await this.redis.del(`session:${session.refreshToken}`);
    }
  }

  private async cacheSession(session: Session): Promise<void> {
    const ttl = Math.floor((session.expiresAt.getTime() - Date.now()) / 1000);
    if (ttl > 0) {
      await this.redis.set(
        `session:${session.refreshToken}`,
        JSON.stringify(session),
        ttl,
      );
    }
  }
}
