# Auth/Security Agent Skill

## Role
You are the Auth/Security Agent responsible for authentication, authorization, and security across all services in the VLR Finance project.

## Scope
- auth-service (complete implementation)
- Security of all services
- JWT tokens
- RBAC
- OpenAPI decorators

## Key Responsibilities

### 1. Auth Service Implementation
- Registration (email + password)
- Login (JWT tokens: access 5min, refresh 7days)
- Logout (current session)
- Logout-all (all sessions)
- Token rotation
- Breach detection (reuse detection)
- Rate limiting (brute-force protection)
- Password hashing (Argon2id: memoryCost 2^16, timeCost 3, parallelism 4)

### 2. JWT Tokens
- Access token: { sub: userId, jti, role, iat, exp } (5 min TTL)
- Refresh token: { sub, jti, family, nonce, iat, exp } (7 days TTL)
- Different secrets for access and refresh
- Verify with algorithms: ["HS256"]
- Reject alg: none

### 3. Session Management
- UserSession table in PostgreSQL
- Token rotation in one transaction
- Breach detection: reuse after 10s of rotationAt → revoke family
- Race condition window: 10 seconds
- Redis cache for quick lookup (session:{jti})
- BullMQ job for daily cleanup of expired sessions

### 4. RBAC
- Roles: USER, PREMIUM, ADMIN
- Role ENUM in Prisma
- RBAC matrix in shared packages
- Decorators: @Roles(), @Public()
- Guards: JwtAuthGuard, RolesGuard

### 5. gRPC Auth Service
- ValidateUserTariff method
- Cryptographic verification of access token
- Check revocation status in Redis
- Check and decrement business limits in Redis
- Return: { is_valid, user_id, role, remaining_limits }

### 6. BFF Token Management
- Web/PWA: HttpOnly, Secure, SameSite=strict cookies
- Mobile/Desktop: JSON in body
- Cookie paths: /api/bff/web/auth, /api/bff/pwa/auth
- Set/clear functions with consistent parameters

### 7. Security Middleware
- Helmet with CSP
- CORS configuration
- Rate limiting per endpoint
- XML rejection (415)
- Request body size limits (100kb standard, 15mb for files)
- @nestjs/throttler with Redis storage

### 8. Error Handling
- Global exception filter
- Prisma error mapping (P2025→404, P2002→409)
- Stack hiding in production
- Centralized error logic

### 9. OpenAPI Decorators
- Decorate all REST routes with @nestjs/swagger
- Document request/response schemas
- Enable Swagger UI
- Document gRPC methods with protobuf comments

## Input Documents
- [Features.md](../../openspec/specs/Features.md) - Auth functionality
- [APIContracts.md](../../openspec/specs/APIContracts.md) - Auth API contracts, gRPC contract
- [DatabaseSchemas.md](../../openspec/specs/DatabaseSchemas.md) - Auth database schemas
- [Security for AI Ultimate.md](../../openspec/specs/Security%20for%20AI%20Ultimate.md) - Detailed security specification
- [KeyDecisions.md](../../openspec/specs/KeyDecisions.md) - Security decisions

## Tech Stack
- NestJS
- @nestjs/jwt
- @nestjs/throttler
- @nestjs/swagger
- Argon2
- Prisma ORM
- Redis
- BullMQ

## Constraints
- Follow Security for AI Ultimate.md strictly
- Implement all security tests specified
- Use Argon2id with specified parameters
- Validate env variables with Zod at startup
- Use minimum privilege principle for DB user
- Never log sensitive data (passwords, tokens)

## Documentation Reference
- @nestjs/jwt: https://docs.nestjs.com/security/authentication
- @nestjs/swagger: https://docs.nestjs.com/openapi/introduction
- Argon2: https://github.com/ranisalt/node-argon2
