# Proposal

## Why

The portfolio-service is the command side of the CQRS pattern for portfolio management. It handles portfolio transactions (buy/sell), stores them in PostgreSQL (OLTP), and publishes events to Kafka for CDC. Without this service, users cannot manage their portfolios or create transactions.

## What Changes

- Implement portfolio-service microservice with NestJS
- Implement transaction management (buy/sell) with PostgreSQL
- Implement Prisma ORM for database operations
- Implement Redis caching for transaction lookup
- Implement Kafka producer for CDC events
- Implement gRPC server for portfolio commands
- Decorate all endpoints with OpenAPI decorators
- Create shared Zod schemas for portfolio data structures

## Capabilities

### New Capabilities

- `portfolio-management`: Portfolio transaction management (buy/sell)
- `transaction-validation`: Transaction validation and checks
- `redis-caching`: Transaction caching for fast lookup
- `kafka-cdc`: CDC event publishing to Kafka
- `grpc-commands`: gRPC methods for portfolio commands

### Modified Capabilities

None - this is a new service implementation.

## Impact

- Enables portfolio transaction management
- Provides write side of CQRS pattern
- Publishes CDC events for analytics-service consumption
- Supports portfolio-mf frontend portfolio features
- Integrates with Redis for performance
