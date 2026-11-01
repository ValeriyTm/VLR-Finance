# Tasks

## 1. Project Structure Setup

- [ ] 1.1 Create auth-service directory in apps/ with NestJS structure
- [ ] 1.2 Initialize NestJS project with pnpm create nest-app
- [ ] 1.3 Configure tsconfig.json and nest-cli.json
- [ ] 1.4 Create module structure (auth, users, sessions modules)
- [ ] 1.5 Add required dependencies (class-validator, class-transformer, @nestjs/throttler, @nestjs/jwt, @nestjs/passport, argon2, prisma, bcrypt)

## 2. Database Setup

- [ ] 2.1 Copy Prisma schema from infrastructure/migrations/postgres/auth
- [ ] 2.2 Install Prisma Client and initialize Prisma
- [ ] 2.3 Run Prisma generate to generate client
- [ ] 2.4 Create initial migration
- [ ] 2.5 Configure Prisma in NestJS with PrismaService

## 3. Shared Schemas Package

- [ ] 3.1 Create packages/schemas directory if not exists
- [ ] 3.2 Create auth Zod schemas (RegisterDto, LoginDto, UserDto, SessionDto)
- [ ] 3.3 Create auth types (UserRole, etc.)
- [ [ 3.4 Configure packages/schemas package.json
- [ ] 3.5 Export schemas and types from index.ts

## 4. User Module

- [ ] 4.1 Create User entity with Prisma
- [ ] 4.2 Create UsersService with CRUD operations
- [ ] 4.3 Create UsersController with endpoints
- [ ] 4.4 Implement user registration endpoint
- [ ] 4.5 Implement user profile retrieval endpoint
- [ ] 4.6 Decorate endpoints with OpenAPI decorators
- [ ] 4.7 Add validation with class-validator

## 5. Session Module

- [ ] 5.1 Create Session entity with Prisma
- [ ] 5.2 Create SessionsService with CRUD operations
- [ ] 5.3 Create SessionsController with endpoints
- [ ] 5.4 Implement session creation on login
- [ ] 5.5 Implement session listing endpoint
- [ ] 5.6 Implement session deletion (logout)
- [ ] 5.7 Implement all sessions deletion (logout-all)
- [ ] 5.8 Decorate endpoints with OpenAPI decorators

## 6. Authentication Module

- [ ] 6.1 Create AuthService with JWT token generation
- [ ] 6.2 Implement bcrypt password hashing service
- [ ] 6.3 Implement login method with token generation
- 6.4 Implement register method with password hashing
- [ ] 6.5 Implement logout method
- [ ] 6.6 Implement logout-all method
- [ ] 6.7 Implement refresh token rotation
- [ 6.8 Implement breach detection (token reuse)
- [ ] 6.9 Create AuthController with auth endpoints
- [ ] 6.10 Decorate endpoints with OpenAPI decorators

## 7. JWT Strategy

- [ ] 7.1 Configure JwtModule with secret and expiry times
- [ ] 7.2 Create JwtStrategy for passport-jwt
- [ ] 7.3 Implement validate method for access tokens
- [ ] 7.4 Create JwtGuard for protecting routes
- [ ] 7.5 Create PublicGuard for public routes
- [ ] 7.6 Configure guards in auth module

## 8. Rate Limiting

- [ ] 8.1 Install @nestjs/throttler
- 8.2 Configure ThrottlerModule in app module
- [ ] 8.3 Set rate limits for auth endpoints (e.g., 10 req/min)
- [ [ 8.4 Apply @Throttle decorator to login endpoint
- [ ] 8.5 Apply @Throttle decorator to register endpoint
- [ ] 8.6 Configure custom throttler options if needed

## 9. RBAC Implementation

- [ ] 9.1 Create RolesGuard decorator
- [ ] 9.2 Create Roles enum (USER, PREMIUM, ADMIN)
- [ 9.3 Implement role checking logic in guard
- [ ] 9.4 Create @Roles decorator for controllers/methods
- [ 9.5 Apply @Roles to admin-only endpoints
- [ ] 9.6 Test role enforcement

## 10. Security Middleware

- [ ] 10.1 Configure Helmet middleware in main.ts
- [ ] 10.2 Configure CORS middleware
- [ ] 10.3 Configure HPP middleware for HTTP parameter pollution protection
- [ ] 10.4 Configure global exception filter
- [ ] 10.5 Add security headers to responses

## 11. OpenAPI Documentation

- [ ] 11.1 Configure SwaggerModule in app module
- [ ] 11.2 Set API documentation title and version
- [ ] 11.3 Add Swagger UI setup
- [ ] 11.4 Decorate all auth endpoints with @ApiTags, @ApiOperation, @ApiResponse
- [ 11.5 Add request/response schemas with @ApiBody, @ApiResponse
- [ ] 11.6 Verify Swagger UI accessible at /api-docs

## 12. Integration with Infrastructure

- [ ] 12.1 Configure environment variables for DATABASE_URL_AUTH
- [ ] 12.2 Configure environment variables for JWT_SECRET
- [ ] 12.3 Configure environment variables for REDIS_URL
- [ ] 12.4 Configure environment variables for KAFKA_BROKERS
- [ ] 12.5 Configure environment variables for RABBITMQ_URL
- [ ] 12.6 Update Dockerfile for auth-service
- [ ] 12.7 Update docker-compose.v1-auth.yaml with build context

## 13. Testing

- [ ] 13.1 Write unit tests for AuthService
- [ ] 13.2 Write unit tests for UsersService
- [ ] 13.3 Write unit tests for SessionsService
- [ ] 13.4 Write integration tests for auth endpoints
- [ ] 13.5 Test rate limiting functionality
- [ ] 13.6 Test JWT token generation and validation
- [ ] 13.7 Test breach detection
- [ 13.8 Test RBAC enforcement
- [ ] 13.9 Configure test coverage target

## 14. Documentation

- [ ] 14.1 Update README.md with auth-service API documentation
- [ ] 14.2 Document auth endpoints in APIContracts.md
- [ ] 14.3 Document authentication flow in docs
- [ ] 14.4 Document environment variables required
