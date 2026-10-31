# Spec Delta

## Purpose

Configures MinIO, ksqlDB, Debezium, and Vector infrastructure services for storage, CDC, and logging.

## ADDED Requirements

### Requirement: MinIO exists for S3-compatible storage
The system SHALL provide MinIO instance with buckets for PDF reports, logs, and other files.

#### Scenario: MinIO starts successfully
- **WHEN** developer starts docker-compose.base.yaml
- **THEN** MinIO console is accessible on port 9001

#### Scenario: PDF reports bucket exists
- **WHEN** background-jobs-service generates PDF report
- **THEN** reports bucket exists and accepts file uploads

#### Scenario: Logs bucket exists
- **WHEN** Vector writes logs
- **THEN** logs bucket exists and accepts file uploads

### Requirement: MinIO initialization creates buckets
The system SHALL provide MinIO initialization script to create required buckets on startup.

#### Scenario: Buckets are created on startup
- **WHEN** MinIO container starts
- **THEN** reports, logs, and assets buckets are created

#### Scenario: Bucket policies are applied
- **WHEN** buckets are created
- **THEN** appropriate read/write policies are applied

### Requirement: Debezium exists for CDC
The system SHALL provide Debezium with Kafka Connect to capture PostgreSQL changes and publish to Kafka.

#### Scenario: Debezium connects to PostgreSQL
- **WHEN** Debezium starts
- **THEN** it connects to all PostgreSQL databases successfully

#### Scenario: CDC captures changes
- **WHEN** portfolio-service writes to PostgreSQL
- **THEN** Debezium publishes change to portfolio-cdc topic

#### Scenario: CDC configuration exists
- **WHEN** Debezium starts
- **THEN** connector configurations exist for auth, portfolio, and AI databases

### Requirement: Vector exists for centralized logging
The system SHALL provide Vector to collect logs from all services and route to Kafka, ClickHouse, and Loki.

#### Scenario: Vector collects stdout logs
- **WHEN** services write to stdout
- **THEN** Vector captures and processes logs

#### Scenario: Vector routes logs to Kafka
- **WHEN** Vector processes logs
- **THEN** structured logs are sent to Kafka logs topic

#### Scenario: Vector routes logs to Loki
- **WHEN** Vector processes logs
- **THEN** text logs are sent to Loki

### Requirement: Vector configuration exists
The system SHALL provide Vector configuration file with appropriate sources, transforms, and sinks.

#### Scenario: Vector starts with configuration
- **WHEN** Vector container starts
- **THEN** it loads configuration from vector.toml

#### Scenario: Log parsing works
- **WHEN** Vector receives JSON logs
- **THEN** it parses and structures logs correctly

### Requirement: Storage service connections are configurable
The system SHALL allow storage service connection parameters to be configured via environment variables.

#### Scenario: MinIO uses environment variables
- **WHEN** service connects to MinIO
- **THEN** it reads MINIO_ENDPOINT, MINIO_ACCESS_KEY, and MINIO_SECRET_KEY from environment variables

#### Scenario: Vector uses environment variables
- **WHEN** Vector starts
- **THEN** it reads KAFKA_ENDPOINT and LOKI_ENDPOINT from environment variables
