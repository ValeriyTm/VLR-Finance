# Design

## Context

This is a greenfield service implementation. The auth-service will be the first microservice implemented, establishing the authentication foundation for the entire platform. See proposal.md for motivation.

## Goals / Non-Goals

**Goals:**
- Implement secure user authentication with JWT tokens
- Implement session management with multi-device support
- Implement RBAC for role-based access control
- Implement security best practices (rate limiting, breach detection, secure password hashing)
- Provide OpenAPI documentation for all endpoints
- Create shared Zod schemas for auth data structures

**Non-Goals:**
- Social login (Google, GitHub, etc.) - deferred to future
- MFA/2FA - deferred to future
- Email verification - deferred to future
- Password reset flow - deferred to future
- Account recovery - deferred to future

## Decisions

### Framework: NestJS

**Decision:** Use NestJS framework for auth-service with modern versions (November 2026).

**Rationale:**
- Built-in support for decorators, pipes, guards, and modules
- Excellent TypeScript support
- Easy integration with OpenAPI/Swagger
- Consistent with other microservices in the architecture
- Built-in validation with class-validator and class-transformer

**Versions (November 2026):**
- NestJS: ^12.0.0
- @nestjs/jwt: ^11.0.0
- @nestjs/throttler: ^6.0.0
- @nestjs/swagger: ^8.0.0
- passport: ^0.8.0
- passport-jwt: ^5.0.0
- argon2: ^0.40.0
- TypeScript: ^5.7.0

**Alternatives Considered:**
- **Express.js:** More boilerplate, less structured
- **Fastify:** Faster but less ecosystem support

### Authentication: JWT with Refresh Tokens

**Decision:** Use JWT access tokens (5 min) + refresh tokens (7 days) with rotation.

**Rationale:**
- Short-lived access tokens limit exposure if compromised
- Refresh tokens allow seamless user experience
- Token rotation mitigates token theft
- Industry-standard approach for stateless authentication

**Alternatives Considered:**
- **Session cookies:** Stateless API design requires tokens
- **Long-lived access tokens:** Higher security risk if compromised

### Password Hashing: Argon2id

**Decision:** Use Argon2id for password hashing.

**Rationale:**
- Memory-hard algorithm resistant to GPU/ASIC attacks
- Current industry recommendation (OWASP)
- Built-in resistance to brute-force and rainbow table attacks
- Configurable work factor to adapt to hardware improvements

**Alternatives Considered:**
- **bcrypt:** Also good but Argon2id is OWASP's current recommendation
- **scrypt:** Similar to Argon2id but less widely recommended

### Rate Limiting: NestJS Throttler

**Decision:** Use NestJS @nestjs/throttler package for rate limiting.

**Rationale:**
- Built-in NestJS integration
- Easy decorator-based configuration
- Supports multiple strategies (fixed window, sliding window, token bucket)
- Can be applied at route or global level

**Alternatives Considered:**
- **express-rate-limit:** Requires Express-specific middleware
- **Redis-based rate limiting:** Overkill for initial implementation

### RBAC: Role-based Guards

**Decision:** Implement RBAC using NestJS Guards with custom decorators.

**Rationale:**
- NestJS guards integrate seamlessly with the framework
- Custom decorators provide clean syntax: @Roles('ADMIN')
- Can be applied at controller, method, or parameter level
- Easy to extend with additional roles or permissions

**Alternatives Considered:**
- **Casbin:** More powerful but overkill for simple role-based access
- **ACL middleware:** Less flexible than guards

### Database: PostgreSQL with Prisma

**Decision:** Use PostgreSQL with Prisma ORM managed by auth-service.

**Rationale:**
- Prisma provides type-safe database access
- Automatic migrations
- PostgreSQL ACID guarantees for transaction integrity
- Consistent with database setup from infrastructure change

**Alternatives Considered:**
- **TypeORM:** Less active development, less type-safe
- **Raw SQL:** More boilerplate, error-prone

## Risks / Trade-offs

### Token Storage Trade-off

**Risk:** Refresh tokens stored in database can be compromised in breach.

**Mitigation:** 
- Hash refresh tokens before storage
- Implement token rotation to limit exposure window
- Consider implementing short-lived refresh tokens in future

### Rate Limiting False Positives

**Risk:** Legitimate users may be rate-limited during normal usage.

**Mitigation:**
- Set reasonable rate limits (e.g., 10 requests per minute)
- Provide clear error messages
- Allow users to retry after cooldown
- Monitor and adjust limits based on usage patterns

### Session Invalidation Latency

**Risk:** Session invalidation may have slight delay due to distributed nature.

**Mitigation:**
- Use Redis for session storage for faster invalidation
- Implement cache invalidation when possible
- Document slight delay as acceptable trade-off

### OpenAPI Maintenance Overhead

**Risk:** Keeping OpenAPI decorators in sync with implementation adds maintenance overhead.

**Mitigation:**
- Make decorators part of the API contract
- Use automated tools to generate documentation from decorators
- Include API documentation in code review process
