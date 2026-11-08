# Design

## Context

This is a greenfield service implementation. The portfolio-service is the command side of CQRS for portfolio management, using PostgreSQL for OLTP. See proposal.md for motivation.

## Goals / Non-Goals

**Goals:**
- Implement PostgreSQL client with Prisma ORM
- Implement transaction management (buy/sell)
- Implement transaction validation
- Implement Redis caching
- Implement Kafka producer for CDC events
- Implement gRPC server for portfolio commands
- Provide health check endpoint
- Create shared Zod schemas for portfolio data

**Non-Goals:**
- Real-time portfolio value (handled by analytics-service)
- Complex trading strategies - deferred to future
- Order types beyond market orders - deferred to future
- Margin trading - not in scope

## Decisions

### Framework: NestJS

**Decision:** Use NestJS framework for portfolio-service.

**Rationale:**
- Consistent with other microservices
- Built-in support for gRPC
- Easy integration with Prisma and Redis
- TypeScript support

**Alternatives Considered:**
- **Express.js:** Less structured
- **Fastify:** Faster but less ecosystem support

### Database: PostgreSQL with Prisma

**Decision:** Use PostgreSQL with Prisma ORM.

**Rationale:**
- Prisma provides type-safe database access
- Automatic migrations
- ACID guarantees for transaction integrity
- Consistent with database setup from infrastructure

**Alternatives Considered:**
- **TypeORM:** Less active development
- **Raw SQL:** More boilerplate

### Redis Caching

**Decision:** Use Redis for transaction caching.

**Rationale:**
- Fast lookup for recent transactions
- Reduces database load
- Simple TTL-based cache invalidation
- Already in infrastructure

**Alternatives Considered:**
- **No caching:** Slower performance
- **In-memory:** Not scalable

### Kafka CDC

**Decision:** Publish CDC events to Kafka on transaction changes.

**Rationale:**
- Enables real-time sync to analytics-service
- Event-driven architecture
- Debezium already configured
- Consistent with CQRS pattern

**Alternatives Considered:**
- **Direct queries:** Breaks CQRS
- **Polling:** Less efficient

## Risks / Trade-offs

### Transaction Consistency

**Risk:** High concurrent transactions may cause consistency issues.

**Mitigation:**
- Use PostgreSQL transactions
- Use database constraints
- Implement optimistic locking if needed
- Monitor for race conditions

### Cache Invalidation

**Risk:** Cache may become stale after updates.

**Mitigation:**
- Use short TTL (e.g., 5 minutes)
- Invalidate cache on updates
- Document cache freshness policy
- Monitor cache hit rate

### Kafka Message Ordering

**Risk:** CDC events may arrive out of order.

**Mitigation:**
- Use Kafka partitions with consistent key (user_id)
- Debezium handles ordering within partitions
- Analytics-service can handle reordering
- Document ordering guarantees

### gRPC Method Complexity

**Risk:** gRPC methods may become complex with many features.

**Mitigation:**
- Keep methods focused on specific operations
- Use streaming for large datasets
- Implement pagination
- Document method contracts clearly
