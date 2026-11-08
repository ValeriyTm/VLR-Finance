# Design

## Context

This is a greenfield service implementation. The analytics-service is the query side of CQRS for portfolio management, using ClickHouse for OLAP analytics. See proposal.md for motivation.

## Goals / Non-Goals

**Goals:**
- Implement ClickHouse client for OLAP queries
- Implement portfolio PnL calculation with FIFO algorithm
- Implement asset allocation calculation
- Implement performance metrics (ROI, Sharpe ratio)
- Implement market data analytics
- Implement gRPC server for analytics methods
- Provide health check endpoint
- Create shared Zod schemas for analytics data

**Non-Goals:**
- Real-time analytics (handled by Debezium CDC)
- Complex ML-based predictions - deferred to AI service
- Backtesting - deferred to future
- Order book analytics - deferred to future

## Decisions

### Framework: NestJS

**Decision:** Use NestJS framework for analytics-service.

**Rationale:**
- Consistent with other microservices
- Built-in support for gRPC
- Easy integration with ClickHouse
- TypeScript support for type-safe queries

**Alternatives Considered:**
- **Express.js:** Less structured
- **Fastify:** Faster but less ecosystem support

### ClickHouse Client: clickhouse-client

**Decision:** Use @clickhouse/client for ClickHouse.

**Rationale:**
- Official ClickHouse client for Node.js
- Good TypeScript support
- Simple API for queries
- Compatible with ClickHouse in KRaft mode

**Alternatives Considered:**
- **Raw HTTP:** More boilerplate
- **node-clickhouse:** Less maintained

### FIFO Algorithm

**Decision:** Implement FIFO algorithm in application layer using ClickHouse queries.

**Rationale:**
- FIFO is O(N) complexity, acceptable for typical portfolios
- ClickHouse ReplacingMergeTree handles deduplication
- Can be optimized with materialized views if needed
- Industry standard for PnL calculation

**Alternatives Considered:**
- **Weighted Average:** Less accurate for tax purposes
- **LIFO:** Not standard for most jurisdictions

### Performance Metrics

**Decision:** Calculate ROI and Sharpe ratio using historical portfolio data.

**Rationale:**
- ROI is standard performance metric
- Sharpe ratio accounts for risk
- Calculated from ClickHouse time-series data
- Can be extended with more metrics later

**Alternatives Considered:**
- **Only ROI:** Too simple
- **Full suite:** Overkill for initial implementation

## Risks / Trade-offs

### ClickHouse Query Performance

**Risk:** Complex analytics queries may be slow on large datasets.

**Mitigation:**
- Use ClickHouse-specific optimizations (materialized views, projections)
- Implement query timeouts
- Use appropriate indexes and partitions
- Monitor query performance
- Implement caching for frequent queries

### FIFO Calculation Complexity

**Risk:** FIFO algorithm may be slow for portfolios with many transactions.

**Mitigation:**
- O(N) complexity is acceptable for typical portfolios (<10k transactions)
- Can optimize with materialized views
- Can implement batch processing if needed
- Document performance characteristics

### Data Freshness

**Risk:** Analytics data may not be perfectly fresh due to CDC lag.

**Mitigation:**
- Document that analytics are near real-time
- Implement data freshness indicator
- Monitor CDC lag
- Provide timestamp of last update

### gRPC Method Complexity

**Risk:** gRPC methods may become complex with many analytics features.

**Mitigation:**
- Keep methods focused on specific analytics
- Use streaming for large datasets
- Implement pagination
- Document method contracts clearly
