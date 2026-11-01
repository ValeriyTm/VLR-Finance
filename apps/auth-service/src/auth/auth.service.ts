import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { SessionsService } from '../sessions/sessions.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { UserRole } from '@prisma/client';
import { randomBytes } from 'crypto';

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface TokenPayload {
  sub: string;
  jti: string;
  role: UserRole;
  iat: number;
  exp: number;
}

export interface RefreshTokenPayload {
  sub: string;
  jti: string;
  family: string;
  nonce: string;
  iat: number;
  exp: number;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private sessionsService: SessionsService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ user: any; tokens: Tokens }> {
    const user = await this.usersService.create(registerDto);
    const tokens = await this.generateTokens(user.id, user.role);
    
    // Create session
    await this.sessionsService.create({
      userId: user.id,
      tokenFamily: tokens.refreshPayload.family,
      refreshToken: tokens.refreshToken,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      tokens,
    };
  }

  async login(loginDto: LoginDto, deviceInfo?: string, ipAddress?: string): Promise<{ user: any; tokens: Tokens }> {
    const user = await this.usersService.findByEmail(loginDto.email);
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.usersService.verifyPassword(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user.id, user.role);
    
    // Create session
    await this.sessionsService.create({
      userId: user.id,
      tokenFamily: tokens.refreshPayload.family,
      refreshToken: tokens.refreshToken,
      deviceInfo,
      ipAddress,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      tokens,
    };
  }

  async refreshTokens(refreshToken: string): Promise<Tokens> {
    try {
      const payload = this.jwtService.verify<RefreshTokenPayload>(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      // Check if session exists
      const session = await this.sessionsService.findByRefreshToken(refreshToken);
      
      if (!session) {
        // Session not found - possible breach (token stolen and used after deletion)
        // Invalidate all sessions for this user
        await this.sessionsService.revokeAllUserSessions(payload.sub);
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Breach detection: check if token was reused after rotation
      if (session.rotationAt && Date.now() - session.rotationAt.getTime() < 10000) {
        // Token reused within 10 seconds of rotation - revoke all sessions
        await this.sessionsService.revokeAllUserSessions(payload.sub);
        throw new UnauthorizedException('Possible token reuse detected - all sessions revoked');
      }

      // Rotate refresh token
      const newTokens = await this.generateTokens(payload.sub, session.user.role);
      
      // Update session with new refresh token
      await this.sessionsService.rotateToken(session.id, newTokens.refreshToken);

      return newTokens;
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(refreshToken: string): Promise<void> {
    await this.sessionsService.deleteByRefreshToken(refreshToken);
  }

  async logoutAll(userId: string): Promise<void> {
    await this.sessionsService.revokeAllUserSessions(userId);
  }

  private async generateTokens(userId: string, role: UserRole): Promise<Tokens & { refreshPayload: RefreshTokenPayload }> {
    const jti = randomBytes(16).toString('hex');
    const family = randomBytes(16).toString('hex');
    const nonce = randomBytes(16).toString('hex');

    const now = Math.floor(Date.now() / 1000);

    // Access token (5 minutes)
    const accessPayload: TokenPayload = {
      sub: userId,
      jti,
      role,
      iat: now,
      exp: now + 5 * 60, // 5 minutes
    };

    // Refresh token (7 days)
    const refreshPayload: RefreshTokenPayload = {
      sub: userId,
      jti,
      family,
      nonce,
      iat: now,
      exp: now + 7 * 24 * 60 * 60, // 7 days
    };

    const accessToken = this.jwtService.sign(accessPayload, {
      secret: process.env.JWT_ACCESS_SECRET,
      algorithm: 'HS256',
    });

    const refreshToken = this.jwtService.sign(refreshPayload, {
      secret: process.env.JWT_REFRESH_SECRET,
      algorithm: 'HS256',
    });

    return {
      accessToken,
      refreshToken,
      refreshPayload,
    };
  }

  async validateAccessToken(token: string): Promise<TokenPayload> {
    try {
      return this.jwtService.verify<TokenPayload>(token, {
        secret: process.env.JWT_ACCESS_SECRET,
        algorithms: ['HS256'],
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid access token');
    }
  }
}
