# Tasks

## 1. Monorepo Setup

- [x] 1.1 Initialize Turborepo configuration with turbo.json and verify `turbo run build` command is available
- [x] 1.2 Initialize pnpm workspace with pnpm-workspace.yaml and verify `pnpm install` installs root dependencies
- [x] 1.3 Create directory structure (apps/, packages/, infrastructure/, proto/) and verify all directories exist
- [x] 1.4 Create root package.json with workspace configuration and verify pnpm recognizes workspaces
- [x] 1.5 Create .env.example with all required environment variables and verify file exists with all variables documented

## 2. Base Infrastructure Services

- [x] 2.1 Create docker-compose.base.yaml with PostgreSQL, Redis, Kafka, RabbitMQ, MinIO, ClickHouse, and Nginx services and verify file is valid YAML
- [x] 2.2 Configure PostgreSQL service with 3 databases (auth, portfolio, ai) and verify container starts successfully
- [x] 2.3 Configure Redis service and verify container is accessible on port 6379
- [x] 2.4 Configure Kafka service with Zookeeper and verify broker is accessible on port 9092
- [x] 2.5 Configure RabbitMQ service with management UI and verify UI is accessible on port 15672
- [x] 2.6 Configure MinIO service with console and verify console is accessible on port 9001
- [x] 2.7 Configure ClickHouse service and verify container starts successfully
- [x] 2.8 Configure Nginx service and verify container starts successfully
- [x] 2.9 Configure Docker network for service communication and verify services can communicate using container names
- [ ] 2.10 Test docker-compose.base.yaml startup with `docker-compose -f docker-compose.base.yaml up -d` and verify all containers are healthy

## 3. Database Setup

- [ ] 3.1 Create infrastructure/migrations/postgres directory structure and verify directory exists
- [ ] 3.2 Create Prisma schema template for auth-service with users and sessions tables and verify schema is valid Prisma
- [ ] 3.3 Create Prisma schema template for portfolio-service with transactions table and verify schema is valid Prisma
- [ ] 3.4 Create Prisma schema template for ai-copilot-service with documents and memories tables and verify schema is valid Prisma
- [ ] 3.5 Configure pgvector extension in ai-copilot-service Prisma schema and verify extension is included
- [ ] 3.6 Create infrastructure/migrations/clickhouse directory structure and verify directory exists
- [ ] 3.7 Create init-clickhouse.sh script for ClickHouse table initialization and verify script is executable
- [ ] 3.8 Create ClickHouse migration SQL for market_data table with ReplacingMergeTree engine and verify SQL is valid
- [ ] 3.9 Create ClickHouse migration SQL for portfolio_analytics table and verify SQL is valid
- [ ] 3.10 Test PostgreSQL initialization by starting docker-compose and verifying all 3 databases exist
- [ ] 3.11 Test ClickHouse initialization by running init-clickhouse.sh and verifying tables are created

## 4. Message Brokers

- [x] 4.1 Create Kafka topic initialization script and verify script creates market-ticks, portfolio-cdc, market-alerts, and logs topics
- [x] 4.2 Configure Kafka topic settings (replication factor, partition count) in initialization script and verify settings are applied
- [x] 4.3 Create ksqlDB initialization SQL script (init-ksqldb.sql) and verify script is valid SQL
- [x] 4.4 Configure ksqlDB streams for market data in init-ksqldb.sql and verify streams are defined
- [x] 4.5 Configure ksqlDB tables for anomaly detection in init-ksqldb.sql and verify tables are defined
- [x] 4.6 Configure ksqlDB alert generation logic in init-ksqldb.sql and verify alert query is correct
- [x] 4.7 Create RabbitMQ exchange and queue initialization script and verify script creates premium.exchange and saga queues
- [x] 4.8 Configure RabbitMQ dead letter queue in initialization script and verify DLQ is created
- [ ] 4.9 Test Kafka topic creation by running initialization script and verifying topics exist
- [ ] 4.10 Test ksqlDB initialization by running init-ksqldb.sql and verifying streams and tables are created
- [ ] 4.11 Test RabbitMQ initialization by running script and verifying exchanges and queues exist

## 5. Storage Services

- [x] 5.1 Create MinIO initialization script to create buckets (reports, logs, assets) and verify script is executable
- [x] 5.2 Configure MinIO bucket policies in initialization script and verify policies are applied
- [x] 5.3 Configure Debezium with Kafka Connect in docker-compose.base.yaml and verify Debezium container starts
- [x] 5.4 Create Debezium connector configuration for auth PostgreSQL database and verify configuration is valid JSON
- [x] 5.5 Create Debezium connector configuration for portfolio PostgreSQL database and verify configuration is valid JSON
- [x] 5.6 Create Debezium connector configuration for ai PostgreSQL database and verify configuration is valid JSON
- [x] 5.7 Configure Vector service in docker-compose.base.yaml and verify Vector container starts
- [x] 5.8 Create Vector configuration file (vector.toml) with stdout source and verify configuration is valid TOML
- [x] 5.9 Configure Vector Kafka sink for structured logs in vector.toml and verify sink configuration is correct
- [x] 5.10 Configure Vector Loki sink for text logs in vector.toml and verify sink configuration is correct
- [ ] 5.11 Test MinIO initialization by running script and verifying buckets are created
- [ ] 5.12 Test Debezium CDC by writing to PostgreSQL and verifying change appears in Kafka topic
- [ ] 5.13 Test Vector log routing by sending test logs and verifying they appear in Kafka and Loki

## 6. Observability Stack

- [x] 6.1 Add Prometheus service to docker-compose.base.yaml and verify container starts on port 9090
- [x] 6.2 Create prometheus.yml configuration with scrape configs for all services and verify configuration is valid YAML
- [x] 6.3 Add Grafana service to docker-compose.base.yaml and verify container starts on port 3000
- [x] 6.4 Configure Grafana data source for Prometheus and verify connection succeeds
- [x] 6.5 Create Grafana dashboard for services monitoring and verify dashboard is importable
- [x] 6.6 Create Grafana dashboard for databases monitoring and verify dashboard is importable
- [x] 6.7 Create Grafana dashboard for message brokers monitoring and verify dashboard is importable
- [x] 6.8 Add Grafana Tempo service to docker-compose.base.yaml and verify container accepts trace data
- [x] 6.9 Configure Tempo data source in Grafana and verify traces are queryable
- [x] 6.10 Add Grafana Loki service to docker-compose.base.yaml and verify container accepts log data
- [x] 6.11 Configure Loki data source in Grafana and verify logs are queryable
- [ ] 6.12 Test Prometheus metrics collection by querying metrics endpoint and verifying data appears in Prometheus
- [ ] 6.13 Test Grafana dashboards by accessing UI and verifying dashboards display data
- [ ] 6.14 Test Tempo tracing by sending test trace and verifying it appears in Grafana
- [ ] 6.15 Test Loki logging by sending test log and verifying it appears in Grafana

## 7. Nginx API Gateway

- [x] 7.1 Create Nginx configuration file (nginx.conf) and verify configuration is valid
- [x] 7.2 Configure Nginx upstream for auth-service and verify routing to /api/auth/** works
- [x] 7.3 Configure Nginx upstream for portfolio-service and verify routing to /api/portfolio/** works
- [x] 7.4 Configure Nginx upstream for analytics-service and verify routing to /api/analytics/** works
- [x] 7.5 Configure Nginx upstream for ai-copilot-service and verify routing to /api/ai/** works
- [x] 7.6 Configure Nginx upstream for ingestor-service and verify routing to /api/ingestor/** works
- [x] 7.7 Configure Nginx upstream for background-jobs-service and verify routing to /api/jobs/** works
- [x] 7.8 Configure Nginx routing for auth-profile-mf to /auth-profile/** and verify routing works
- [x] 7.9 Configure Nginx routing for terminal-mf to /terminal/** and verify routing works
- [x] 7.10 Configure Nginx routing for portfolio-mf to /portfolio/** and verify routing works
- [x] 7.11 Configure Nginx routing for ai-copilot-mf to /ai-copilot/** and verify routing works
- [ ] 7.12 Test Nginx configuration with `nginx -t` and verify configuration is valid
- [ ] 7.13 Test Nginx routing by making test requests and verifying correct service receives them

## 8. Docker Containers for Services

- [ ] 8.1 Create infrastructure/docker directory structure and verify directory exists
- [ ] 8.2 Create Dockerfile for auth-service (NestJS) and verify build succeeds
- [ ] 8.3 Create Dockerfile for ingestor-service (NestJS) and verify build succeeds
- [ ] 8.4 Create Dockerfile for portfolio-service (NestJS) and verify build succeeds
- [ ] 8.5 Create Dockerfile for analytics-service (NestJS) and verify build succeeds
- [ ] 8.6 Create Dockerfile for ai-copilot-service (NestJS) and verify build succeeds
- [ ] 8.7 Create Dockerfile for background-jobs-service (NestJS) and verify build succeeds
- [ ] 8.8 Create Dockerfile for host app (Next.js) and verify build succeeds
- [ ] 8.9 Create Dockerfile for auth-profile-mf (Next.js) and verify build succeeds
- [ ] 8.10 Create Dockerfile for terminal-mf (Next.js) and verify build succeeds
- [ ] 8.11 Create Dockerfile for portfolio-mf (Next.js) and verify build succeeds
- [ ] 8.12 Create Dockerfile for ai-copilot-mf (Next.js) and verify build succeeds
- [ ] 8.13 Test all Dockerfiles by building each container and verifying no build errors

## 9. Vertical Configurations

- [ ] 9.1 Create docker-compose.v1-auth.yaml with auth-service and auth-profile-mf and verify file is valid YAML
- [ ] 9.2 Create docker-compose.v2-terminal.yaml with ingestor-service and terminal-mf and verify file is valid YAML
- [ ] 9.3 Create docker-compose.v3-portfolio.yaml with portfolio-service and portfolio-mf and verify file is valid YAML
- [ ] 9.4 Create docker-compose.v4-ai.yaml with ai-copilot-service and ai-copilot-mf and verify file is valid YAML
- [ ] 9.5 Create docker-compose.v5-jobs.yaml with background-jobs-service and verify file is valid YAML
- [ ] 9.6 Create docker-compose.full.yaml combining all verticals and verify file is valid YAML
- [ ] 9.7 Test v1-auth startup with `docker-compose -f docker-compose.base.yaml -f docker-compose.v1-auth.yaml up -d` and verify services start
- [ ] 9.8 Test v2-terminal startup and verify services start
- [ ] 9.9 Test v3-portfolio startup and verify services start
- [ ] 9.10 Test v4-ai startup and verify services start
- [ ] 9.11 Test v5-jobs startup and verify services start
- [ ] 9.12 Test full startup with `docker-compose -f docker-compose.base.yaml -f docker-compose.full.yaml up -d` and verify all services start

## 10. Initialization Scripts

- [ ] 10.1 Create infrastructure/scripts directory and verify directory exists
- [ ] 10.2 Ensure init-clickhouse.sh is in infrastructure/scripts and verify script is executable
- [ ] 10.3 Ensure init-ksqldb.sql is in infrastructure/scripts and verify file exists
- [ ] 10.4 Create seed-data.sql for development seed data and verify file exists
- [ ] 10.5 Document all initialization scripts in README.md and verify documentation is complete
- [ ] 10.6 Test init-clickhouse.sh by running script and verifying ClickHouse tables are created
- [ ] 10.7 Test init-ksqldb.sql by running script and verifying ksqlDB streams and tables are created
- [ ] 10.8 Test seed-data.sql by running script and verifying seed data is inserted

## 11. Environment Configuration

- [ ] 11.1 Create .env.example with all DATABASE_URL variables and verify all database URLs are documented
- [ ] 11.2 Add all CLICKHOUSE_URL variables to .env.example and verify variable is documented
- [ ] 11.3 Add all REDIS_URL variables to .env.example and verify variable is documented
- [ ] 11.4 Add KAFKA_BROKERS to .env.example and verify variable is documented
- [ ] 11.5 Add RABBITMQ_URL to .env.example and verify variable is documented
- [ ] 11.6 Add MINIO_ENDPOINT, MINIO_ACCESS_KEY, MINIO_SECRET_KEY to .env.example and verify variables are documented
- [ ] 11.7 Add PROMETHEUS_ENDPOINT to .env.example and verify variable is documented
- [ ] 11.8 Add TEMPO_ENDPOINT to .env.example and verify variable is documented
- [ ] 11.9 Add LOKI_ENDPOINT to .env.example and verify variable is documented
- [ ] 11.10 Document each environment variable in README.md with purpose and example values and verify documentation is complete
- [ ] 11.11 Test environment variable loading by creating .env file and verifying services read variables correctly

## 12. Documentation

- [ ] 12.1 Update README.md with infrastructure setup instructions and verify instructions are accurate
- [ ] 12.2 Document docker-compose base startup command in README.md and verify command works as documented
- [ ] 12.3 Document vertical startup commands in README.md and verify commands work as documented
- [ ] 12.4 Document service URLs (Nginx, Grafana, MinIO console, etc.) in README.md and verify URLs are correct
- [ ] 12.5 Document migration procedures in README.md and verify procedures are accurate
- [ ] 12.6 Document troubleshooting common issues in README.md and verify solutions work
