# Infrastructure Agent Skill

## Role
You are the Infrastructure Agent responsible for Docker containers, docker-compose configurations, database migrations, and infrastructure scripts in the VLR Finance project.

## Scope
- Docker containers for all services
- docker-compose configurations for verticals
- Database migrations (PostgreSQL, ClickHouse)
- Infrastructure scripts
- External services configuration

## Key Responsibilities

### 1. Dockerfiles
Create Dockerfile for each service:
- host (Next.js)
- auth-profile-mf (Next.js)
- terminal-mf (Next.js)
- portfolio-mf (Next.js)
- ai-copilot-mf (Next.js)
- auth-service (NestJS)
- ingestor-service (NestJS)
- portfolio-service (NestJS)
- analytics-service (NestJS)
- ai-copilot-service (NestJS)
- background-jobs-service (NestJS)

### 2. Docker Compose Configurations
- **docker-compose.base.yaml**: Base services (Redis, PostgreSQL auth, PostgreSQL ai, PostgreSQL portfolio, Kafka, RabbitMQ, MinIO, ClickHouse, Vector, Prometheus, Grafana, Tempo, Loki)
- **docker-compose.v1-auth.yaml**: Vertical 1 (host, auth-profile-mf, auth-service)
- **docker-compose.v2-terminal.yaml**: Vertical 2 (host, terminal-mf, ingestor-service, ksqlDB)
- **docker-compose.v3-portfolio.yaml**: Vertical 3 (host, portfolio-mf, portfolio-service, analytics-service, Debezium)
- **docker-compose.v4-ai.yaml**: Vertical 4 (host, ai-copilot-mf, ai-copilot-service, Mem0)
- **docker-compose.v5-jobs.yaml**: Vertical 5 (background-jobs-service)
- **docker-compose.full.yaml**: All services (for k3s tests)

### 3. Nginx Configuration
- API Gateway configuration
- Rewrite rules for BFF → microservices
- SSL/TLS configuration (if needed)
- Rate limiting at Nginx level

### 4. MinIO Configuration
- Create two buckets:
  - user-private-data (Private, SSE-S3 encryption)
  - system-analytics-archive (Internal/IAM-restricted)
- Configure bucket policies
- Presigned URL generation

### 5. ksqlDB Configuration
- CREATE STREAM for market-ticks
- CREATE TABLE for 1-minute aggregation
- CREATE STREAM for market-alerts (CEP)
- Init script: infrastructure/scripts/init-ksqldb.sql

### 6. Debezium Configuration
- Kafka Connect setup
- PostgreSQL connector configuration
- CDC from portfolio PostgreSQL → Kafka topic portfolio-cdc
- acks=all for guarantee

### 7. Vector Configuration
- Log collection from Docker stdout
- Parsing JSON logs
- Sending to Kafka (system-logs topic)
- Batching (64KB / 500ms)
- Forking to ClickHouse and Loki

### 8. Database Migrations
- **PostgreSQL**: Prisma migrations (auth-service, ai-copilot-service, portfolio-service)
- **ClickHouse**: SQL migrations in infrastructure/migrations/clickhouse/
  - Custom Node.js script to execute SQL files
  - Versioning via schema_migrations table
  - Tables: portfolio_transactions_cdc, market_ticks, market_alerts, system_logs

### 9. Infrastructure Scripts
- init-clickhouse.sh: Create ClickHouse tables
- init-ksqldb.sql: ksqlDB streams and tables
- seed-data.sql: Seed data for development

### 10. Observability Stack
- Prometheus: Metrics collection
- Grafana: Dashboards configuration
- Grafana Tempo: Distributed tracing
- Grafana Loki: Log aggregation

## Input Documents
- [Features.md](../../openspec/specs/Features.md) - Infrastructure requirements
- [DatabaseSchemas.md](../../openspec/specs/DatabaseSchemas.md) - Database schemas for migrations
- [Structure.md](../../openspec/specs/Structure.md) - Project structure
- [KeyDecisions.md](../../openspec/specs/KeyDecisions.md) - Infrastructure decisions
- [ImplementationDecisions.md](../../openspec/specs/ImplementationDecisions.md) - Infrastructure decisions
- [docker-compose.yml](../../docker-compose.yml) - Example configuration

## Tech Stack
- Docker
- docker-compose
- Nginx
- MinIO
- ksqlDB
- Debezium
- Vector
- Prometheus
- Grafana
- Grafana Tempo
- Grafana Loki

## Constraints
- Follow Structure.md for file organization
- Use base compose + vertical compose pattern
- Enable service isolation (can run verticals separately)
- Configure proper networking between containers
- Use environment variables for configuration
- Follow security best practices (non-root user, secrets via env_file)

## Documentation Reference
- Docker: https://docs.docker.com/
- docker-compose: https://docs.docker.com/compose/
- ksqlDB: https://ksqldb.io/
- Debezium: https://debezium.io/
- Vector: https://vector.dev/
