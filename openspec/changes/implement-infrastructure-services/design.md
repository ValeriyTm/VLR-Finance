# Design

## Context

This is a greenfield project with no existing infrastructure. The VLR Finance platform requires a comprehensive foundation to support microservices architecture, micro-frontends, real-time data processing, and AI capabilities. The architecture involves 6 microservices, 5 micro-frontends, multiple databases, message brokers, and observability tools. See proposal.md for motivation.

## Goals / Non-Goals

**Goals:**
- Establish complete Docker-based infrastructure for local development
- Enable incremental vertical development (auth → terminal → portfolio → AI → jobs)
- Provide database infrastructure for all services with migration support
- Set up message brokers for data streaming and event-driven communication
- Configure storage services for file storage, CDC, and logging
- Implement observability stack for monitoring, tracing, and logging
- Ensure all infrastructure is configurable via environment variables

**Non-Goals:**
- Kubernetes deployment (deferred to end of project, currently using docker-compose)
- Production-grade security hardening (basic configuration only)
- High availability or disaster recovery setup
- Performance optimization (functional setup only)
- Cloud provider integration (local development focus)

## Decisions

### Monorepo Management: Turborepo + pnpm

**Decision:** Use Turborepo with pnpm workspaces for monorepo management.

**Rationale:**
- Turborepo provides efficient build caching and task orchestration
- pnpm offers faster installation and better disk space utilization than npm/yarn
- Both tools have strong TypeScript support
- Industry-standard approach for monorepos with Next.js and NestJS

**Alternatives Considered:**
- **Nx:** More powerful but steeper learning curve and heavier setup
- **Lerna:** Less actively maintained, fewer built-in optimizations
- **Yarn Workspaces alone:** No build caching or task orchestration

### Orchestration: Docker Compose with Verticals

**Decision:** Use docker-compose with base + vertical-specific configuration files.

**Rationale:**
- Enables incremental development (start with base, add verticals as needed)
- Simplifies local development without Kubernetes complexity
- Allows developers to run only necessary services for their current work
- Easy to understand and modify

**Alternatives Considered:**
- **Single docker-compose file:** Would require running all services simultaneously, resource-intensive
- **Kubernetes (k3s):** Deferred to end of project, too complex for initial development
- **Docker Swarm:** Less widely adopted, fewer resources available

### Database Strategy: Multiple Specialized Databases

**Decision:** Use 3 PostgreSQL instances (auth, portfolio, AI), 1 ClickHouse, and 1 Redis.

**Rationale:**
- **PostgreSQL x3:** Domain isolation, separate migration strategies, independent scaling
- **ClickHouse:** Optimized for OLAP analytics queries, cannot replace PostgreSQL for transactional workloads
- **Redis:** In-memory caching and queue management, distinct use case from persistent storage
- **pgvector extension:** Required for AI RAG capabilities, only available in PostgreSQL

**Alternatives Considered:**
- **Single PostgreSQL instance:** Would work but violates domain boundaries, makes migrations complex
- **MongoDB instead of PostgreSQL:** Project requires SQL for CQRS with CDC, MongoDB less suitable
- **ClickHouse for everything:** Not ACID-compliant, poor for transactional workloads

### Message Brokers: Kafka + RabbitMQ

**Decision:** Use both Kafka and RabbitMQ for different purposes.

**Rationale:**
- **Kafka:** High-throughput streaming, ideal for market data, CDC, and logs with ksqlDB for CEP
- **RabbitMQ:** Better for events and sagas with simpler routing, DLQ support, and distributed transaction patterns
- Using both allows optimal tool for each use case rather than compromise

**Alternatives Considered:**
- **Kafka only:** Could work but overkill for simple event patterns, sagas more complex to implement
- **RabbitMQ only:** Lacks high-throughput streaming and CEP capabilities via ksqlDB
- **NATS:** Less mature ecosystem, fewer tools and integrations

### Storage: MinIO for S3-Compatible Storage

**Decision:** Use MinIO for S3-compatible object storage.

**Rationale:**
- Fully compatible with AWS S3 API, easy to switch to real S3 later
- Self-hosted, no external dependencies for local development
- Supports encryption and presigned URLs as required
- Proven reliability in production environments

**Alternatives Considered:**
- **Local filesystem:** No encryption, no presigned URLs, not production-like
- **AWS S3 directly:** Requires AWS account, external dependency, costs
- **Wasabi or other providers:** Similar to S3, adds external dependency

### CDC: Debezium with Kafka Connect

**Decision:** Use Debezium for CDC from PostgreSQL to Kafka.

**Rationale:**
- Industry-standard solution for CDC
- Reliable change capture from PostgreSQL WAL
- Integrates seamlessly with Kafka
- Supports multiple database instances

**Alternatives Considered:**
- **Custom CDC implementation:** High complexity, maintenance burden
- **Logical replication in PostgreSQL:** More complex to set up, less flexible
- **Change Data Capture via application triggers:** Tightly coupled to application, performance impact

### Logging: Vector for Centralized Aggregation

**Decision:** Use Vector to collect logs and route to Kafka, ClickHouse, and Loki.

**Rationale:**
- High-performance log collector with minimal overhead
- Flexible routing to multiple destinations
- Supports both structured (JSON) and text logs
- Integrates with Kafka for structured logs and Loki for text logs

**Alternatives Considered:**
- **Fluentd:** More complex configuration, higher resource usage
- **Filebeat:** Less flexible routing, primarily for Elasticsearch
- **Direct logging to Loki:** No structured log splitting, loses Kafka integration

### Observability: Full Grafana Stack

**Decision:** Use Prometheus, Grafana, Tempo, and Loki for complete observability.

**Rationale:**
- **Prometheus:** Industry standard for metrics collection
- **Grafana:** Unified UI for metrics, logs, and traces
- **Tempo:** Distributed tracing for microservices debugging
- **Loki:** Cost-effective log aggregation and querying
- Full integration between all components via Grafana

**Alternatives Considered:**
- **ELK Stack (Elasticsearch, Logstash, Kibana):** Higher resource requirements, more complex
- **Jaeger instead of Tempo:** Tempo simpler to deploy with Grafana integration
- **Cloud-hosted solutions (Datadog, New Relic):** Cost and external dependency

### API Gateway: Nginx

**Decision:** Use Nginx as API Gateway for initial deployment.

**Rationale:**
- Lightweight, high-performance reverse proxy
- Simple configuration for routing rules
- Industry-standard with extensive documentation
- Will be replaced with Ingress Controller when migrating to Kubernetes

**Alternatives Considered:**
- **Kong:** More features but heavier setup, overkill for current needs
- **Traefik:** Auto-discovery is nice but adds complexity
- **Envoy:** Powerful but complex configuration, steeper learning curve

## Risks / Trade-offs

### Resource Consumption

**Risk:** Running all infrastructure services simultaneously requires significant CPU and memory.

**Mitigation:**
- Vertical-based docker-compose allows running only necessary services
- Resource limits configured in docker-compose for each service
- Developers can disable non-essential services (observability) during development

### Network Complexity

**Risk:** Complex network topology between 11+ services increases debugging difficulty.

**Mitigation:**
- Docker Compose network isolation by default
- Service discovery via container names
- Health checks ensure services start in correct order
- Clear documentation of service dependencies

### Database Migration Coordination

**Risk:** Managing 3 separate PostgreSQL databases with Prisma migrations can be error-prone.

**Mitigation:**
- Each service has its own Prisma schema and migration directory
- Migration scripts clearly labeled with service name
- Documentation provides migration order and rollback procedures

### Topic and Queue Management

**Risk:** Manual configuration of Kafka topics and RabbitMQ exchanges/queues is error-prone.

**Mitigation:**
- Initialization scripts create all required topics/exchanges/queues on startup
- Scripts idempotent, safe to run multiple times
- Documentation lists all required resources

### Observability Overhead

**Risk:** Full observability stack adds significant infrastructure complexity.

**Mitigation:**
- Observability services are optional in docker-compose (can be disabled)
- Default configurations tuned for development, not production
- Clear separation between base infrastructure and observability

### Environment Variable Management

**Risk:** Large number of environment variables across services increases configuration error risk.

**Mitigation:**
- .env.example file with all required variables
- Validation scripts check for required variables on startup
- Default values provided where safe
- Documentation explains each variable's purpose

### ClickHouse vs PostgreSQL Data Consistency

**Risk:** CDC lag between PostgreSQL and ClickHouse can cause analytics inconsistencies.

**Mitigation:**
- Debezium configured for low-latency CDC
- ReplacingMergeTree engine in ClickHouse handles duplicates
- Monitoring dashboards track CDC lag
- Acceptable lag documented in system requirements

### MinIO to S3 Migration

**Risk:** Migration from MinIO to AWS S3 may require application changes.

**Mitigation:**
- Using @aws-sdk/client-s3 ensures API compatibility
- Configuration via environment variables, no code changes needed
- Presigned URL generation works identically
- Migration primarily DNS and credential changes
