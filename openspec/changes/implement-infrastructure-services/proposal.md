# Proposal

## Why

The VLR Finance project requires a complete infrastructure foundation to support its microservices architecture, micro-frontends, and AI-first approach. This change establishes the base infrastructure layer including Docker containers, databases, message brokers, storage services, and observability stack. Without this foundation, no service or frontend can be developed or tested.

## What Changes

- Create monorepo structure with Turborepo and pnpm workspaces
- Set up Docker infrastructure for all services (6 microservices, 5 micro-frontends)
- Configure docker-compose base and vertical-specific configurations
- Set up PostgreSQL databases with Prisma migrations for auth, portfolio, and AI services
- Set up ClickHouse with SQL migrations for analytics
- Configure Redis for caching and BullMQ queues
- Set up Kafka for data streaming with ksqlDB for CEP analysis
- Set up RabbitMQ for events and sagas
- Configure MinIO for S3-compatible storage
- Set up Debezium for CDC from PostgreSQL to Kafka
- Configure Vector for centralized logging
- Set up observability stack (Prometheus, Grafana, Tempo, Loki)
- Create initialization scripts for ClickHouse, ksqlDB, and seed data
- Set up Nginx as API Gateway

## Capabilities

### New Capabilities

- `infrastructure-base`: Base project structure, Docker containerization, and docker-compose orchestration
- `database-setup`: PostgreSQL, ClickHouse, and Redis database configuration with migrations
- `message-brokers`: Kafka and RabbitMQ message broker configuration
- `storage-services`: MinIO, ksqlDB, Debezium, and Vector infrastructure services
- `observability-stack`: Prometheus, Grafana, Tempo, and Loki monitoring and logging stack

### Modified Capabilities

None - this is a greenfield infrastructure setup.

## Impact

- Enables development of all microservices and micro-frontends
- Provides database infrastructure for auth, portfolio, analytics, and AI services
- Establishes communication channels (Kafka, RabbitMQ, gRPC) between services
- Enables real-time data processing and analytics
- Provides observability for system health and performance
- Serves as foundation for all subsequent development phases
