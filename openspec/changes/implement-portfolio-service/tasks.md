# Tasks

## 1. Project Structure Setup

- [x] 1.1 Create portfolio-service directory in apps/ with NestJS structure
- [x] 1.2 Initialize NestJS project with pnpm create nest-app
- [x] 1.3 Configure tsconfig.json and nest-cli.json
- [x] 1.4 Create module structure (portfolio, prisma, redis, kafka modules)
- [x] 1.5 Add required dependencies (@prisma/client, ioredis, kafkajs, @nestjs/microservices, @vlr-finance/schemas)

## 2. Prisma Setup

- [x] 2.1 Copy Prisma schema from infrastructure/migrations/postgres/portfolio
- [x] 2.2 Install Prisma Client and initialize Prisma
- [x] 2.3 Configure Prisma in NestJS with PrismaService
- [x] 2.4 Create initial migration

## 3. Shared Schemas for Portfolio

- [x] 3.1 Add portfolio Zod schemas to packages/schemas
- [x] 3.2 Create Transaction schema (type, symbol, quantity, price)
- [x] 3.3 Create CreateTransactionDto schema
- [x] 3.4 Export schemas from packages/schemas

## 4. Redis Module

- [x] 4.1 Create RedisService (reuse or create new)
- [x] 4.2 Implement transaction caching
- [x] 4.3 Implement cache invalidation
- [x] 4.4 Configure RedisModule

## 5. Kafka Module

- [x] 5.1 Create KafkaService for CDC events
- [x] 5.2 Configure Kafka producer
- [x] 5.3 Implement publish method for CDC events
- [x] 5.4 Configure KafkaModule

## 6. Portfolio Module

- [x] 6.1 Create PortfolioService for transaction management
- [x] 6.2 Implement create transaction (buy/sell)
- [x] 6.3 Implement transaction validation
- [x] 6.4 Implement holdings check for sell
- [x] 6.5 Implement transaction retrieval
- [x] 6.6 Implement CDC event publishing

## 7. gRPC Service

- [x] 7.1 Create proto/portfolio/portfolio.proto
- [x] 7.2 Create PortfolioGrpcController
- [x] 7.3 Implement CreateTransaction method
- [x] 7.4 Implement GetTransactions method
- [x] 7.5 Configure gRPC in app module

## 8. Health Check

- [x] 8.1 Create HealthController
- [x] 8.2 Implement /health endpoint
- [x] 8.3 Return PostgreSQL connection state
- [x] 8.4 Return Redis connection state
- [x] 8.5 Return transaction statistics
- [x] 8.6 Decorate with OpenAPI decorators

## 9. Security Middleware

- [x] 9.1 Configure Helmet middleware in main.ts
- [x] 9.2 Configure CORS middleware
- [x] 9.3 Configure global exception filter
- [x] 9.4 Add security headers

## 10. OpenAPI Documentation

- [x] 10.1 Configure SwaggerModule in app module
- [x] 10.2 Set API documentation title and version
- [x] 10.3 Add Swagger UI setup
- [x] 10.4 Decorate endpoints with OpenAPI decorators

## 11. Integration with Infrastructure

- [x] 11.1 Configure environment variables for DATABASE_URL_PORTFOLIO
- [x] 11.2 Configure environment variables for REDIS_URL
- [x] 11.3 Configure environment variables for KAFKA_BROKERS
- [x] 11.4 Update Dockerfile for portfolio-service
- [x] 11.5 Update docker-compose.v3-portfolio.yaml with build context

## 12. Testing (SKIPPED - deferred)

- [~] 12.1 Write unit tests for PortfolioService (SKIPPED)
- [~] 12.2 Write unit tests for transaction validation (SKIPPED)
- [~] 12.3 Test Redis caching (SKIPPED)
- [~] 12.4 Test Kafka CDC publishing (SKIPPED)
- [~] 12.5 Test gRPC methods (SKIPPED)

## 13. Documentation (SKIPPED - deferred)

- [~] 13.1 Update README.md with portfolio-service documentation (SKIPPED)
- [~] 13.2 Document transaction flow in docs (SKIPPED)
- [~] 13.3 Document environment variables required (SKIPPED)
