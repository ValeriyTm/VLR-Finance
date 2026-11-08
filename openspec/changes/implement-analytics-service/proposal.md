# Proposal

## Why

The analytics-service is the query side of the CQRS pattern for portfolio management. It reads portfolio data from ClickHouse (OLAP) and provides optimized analytics queries for portfolio performance, PnL calculations, and market data analysis. Without this service, users cannot view portfolio analytics, performance charts, or insights.

## What Changes

- Implement analytics-service microservice with NestJS
- Implement ClickHouse client for OLAP queries
- Implement portfolio analytics queries (PnL, asset allocation, performance metrics)
- Implement FIFO algorithm for PnL calculation
- Implement market data analytics queries
- Implement gRPC server for portfolio analytics methods
- Decorate all endpoints with OpenAPI decorators
- Create shared Zod schemas for analytics data structures

## Capabilities

### New Capabilities

- `portfolio-analytics`: Portfolio performance analytics and PnL calculations
- `clickhouse-queries`: Optimized OLAP queries on ClickHouse
- `fifo-calculation`: FIFO algorithm for accurate PnL calculation
- `market-analytics`: Market data analysis and insights
- `grpc-analytics`: gRPC methods for portfolio analytics

### Modified Capabilities

None - this is a new service implementation.

## Impact

- Enables portfolio analytics and performance tracking
- Provides PnL calculations with FIFO algorithm
- Provides market data insights
- Integrates with Debezium CDC for real-time OLAP updates
- Supports portfolio-mf frontend analytics features
