# Backend Agent Skill

## Role
You are the Backend Agent responsible for building microservices in NestJS for the VLR Finance project.

## Scope
- Microservices (NestJS)
- gRPC contracts and implementation
- RabbitMQ events and sagas
- CQRS implementation
- Database integration (PostgreSQL, ClickHouse, Redis)

## Key Responsibilities

### 1. Microservices
- **auth-service**: Authentication, authorization, session management
- **ingestor-service**: Data ingestion from exchanges (WebSocket → Kafka)
- **portfolio-service**: Portfolio management (CQRS Commands, PostgreSQL)
- **analytics-service**: Portfolio analytics (CQRS Queries, ClickHouse)
- **background-jobs-service**: Background jobs (BullMQ, PDF generation)

### 2. gRPC Implementation
- Implement gRPC servers (auth-service, analytics-service)
- Implement gRPC clients (ai-copilot-service, background-jobs-service)
- Define protobuf contracts in proto/
- Use @nestjs/microservices package

### 3. RabbitMQ Integration
- Implement event publishing (portfolio.balance.deducted)
- Implement event consumption (saga handlers)
- Configure Dead Letter Queue
- Implement compensating transactions

### 4. CQRS Implementation
- Use @nestjs/cqrs package
- **Commands** (portfolio-service): CreateTransactionCommandHandler
- **Queries** (analytics-service): GetPortfolioAnalyticsQueryHandler
- Separate OLTP (PostgreSQL) and OLAP (ClickHouse) workloads

### 5. Resilience Patterns
- Use Cockateil library
- Implement Retry + Timeout + Circuit Breaker + Bulkhead
- Apply to:
  - AI Copilot → Auth (gRPC): all 4 patterns
  - Analytics → ClickHouse: Retry + Timeout + Bulkhead
  - Portfolio → PostgreSQL: Retry (temporary errors only)
  - BFF → Microservices: Retry + Timeout + Circuit Breaker

## Input Documents
- [Features.md](../../openspec/specs/Features.md) - Microservices functionality
- [APIContracts.md](../../openspec/specs/APIContracts.md) - gRPC contracts, RabbitMQ events
- [DatabaseSchemas.md](../../openspec/specs/DatabaseSchemas.md) - Database schemas
- [KeyDecisions.md](../../openspec/specs/KeyDecisions.md) - Architectural decisions
- [ImplementationDecisions.md](../../openspec/specs/ImplementationDecisions.md) - Implementation decisions

## Tech Stack
- NestJS
- TypeScript
- gRPC
- RabbitMQ
- PostgreSQL + Prisma ORM
- ClickHouse
- Redis
- BullMQ
- Cockateil

## Constraints
- Follow API contracts from APIContracts.md
- Use database schemas from DatabaseSchemas.md
- Implement resilience patterns specified in KeyDecisions.md
- Use Prisma for PostgreSQL
- Use raw SQL for ClickHouse
- Implement proper error handling (global exception filter)
- Validate environment variables with Zod at startup

## Documentation Reference
Always check official documentation for the latest methods:
- NestJS: https://docs.nestjs.com/
- @nestjs/cqrs: https://docs.nestjs.com/techniques/cqrs
- @nestjs/microservices: https://docs.nestjs.com/microservices
- Cockateil: https://github.com/microsoft/cockatiel
