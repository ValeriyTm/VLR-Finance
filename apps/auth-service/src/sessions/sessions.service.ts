import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
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
  constructor(private prisma: PrismaService) {}

  async create(createSessionDto: CreateSessionDto): Promise<Session> {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    return this.prisma.session.create({
      data: {
        ...createSessionDto,
        expiresAt,
      },
    });
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
    return this.prisma.session.findUnique({
      where: { refreshToken },
      include: { user: true },
    });
  }

  async findByUserId(userId: string): Promise<Session[]> {
    return this.prisma.session.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async delete(id: string): Promise<Session> {
    return this.prisma.session.delete({
      where: { id },
    });
  }

  async deleteByRefreshToken(refreshToken: string): Promise<void> {
    await this.prisma.session.delete({
      where: { refreshToken },
    });
  }

  async revokeAllUserSessions(userId: string): Promise<void> {
    await this.prisma.session.deleteMany({
      where: { userId },
    });
  }

  async rotateToken(sessionId: string, newRefreshToken: string): Promise<Session> {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    return this.prisma.session.update({
      where: { id: sessionId },
      data: {
        refreshToken: newRefreshToken,
        rotationAt: new Date(),
        expiresAt,
      },
    });
  }

  async cleanupExpiredSessions(): Promise<void> {
    await this.prisma.session.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
  }
}
