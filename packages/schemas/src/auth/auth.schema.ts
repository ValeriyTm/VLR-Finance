import { z } from 'zod';

export enum UserRole {
  USER = 'USER',
  PREMIUM = 'PREMIUM',
  ADMIN = 'ADMIN',
}

// Auth Schemas
export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const refreshTokensSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export const logoutSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

// Token Payload Schemas
export const accessTokenPayloadSchema = z.object({
  sub: z.string(),
  jti: z.string(),
  role: z.nativeEnum(UserRole),
  iat: z.number(),
  exp: z.number(),
});

export const refreshTokenPayloadSchema = z.object({
  sub: z.string(),
  jti: z.string(),
  family: z.string(),
  nonce: z.string(),
  iat: z.number(),
  exp: z.number(),
});

// User Schemas
export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().nullable(),
  role: z.nativeEnum(UserRole),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const sessionSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  tokenFamily: z.string(),
  deviceInfo: z.string().nullable(),
  ipAddress: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  expiresAt: z.date(),
  rotationAt: z.date().nullable(),
});

// Auth Response Schemas
export const tokensSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

export const authResponseSchema = z.object({
  user: userSchema,
  tokens: tokensSchema,
});

// RBAC Matrix
export const rbacMatrix = {
  // Public endpoints
  public: ['/auth/register', '/auth/login', '/auth/refresh'],

  // USER role endpoints
  user: [
    '/auth/logout',
    '/auth/logout-all',
    '/users/profile',
    '/sessions',
  ],

  // PREMIUM role endpoints (includes all USER endpoints)
  premium: [
    ...rbacMatrix.user,
    '/analytics/premium',
  ],

  // ADMIN role endpoints (includes all USER endpoints)
  admin: [
    ...rbacMatrix.user,
    '/users/:id',
    '/admin/*',
  ],
} as const;

export type RegisterDto = z.infer<typeof registerSchema>;
export type LoginDto = z.infer<typeof loginSchema>;
export type RefreshTokensDto = z.infer<typeof refreshTokensSchema>;
export type LogoutDto = z.infer<typeof logoutSchema>;
export type AccessTokenPayload = z.infer<typeof accessTokenPayloadSchema>;
export type RefreshTokenPayload = z.infer<typeof refreshTokenPayloadSchema>;
export type User = z.infer<typeof userSchema>;
export type Session = z.infer<typeof sessionSchema>;
export type Tokens = z.infer<typeof tokensSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
