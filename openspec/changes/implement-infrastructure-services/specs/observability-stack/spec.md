# Spec Delta

## Purpose

Configures Prometheus, Grafana, Tempo, and Loki for monitoring, metrics collection, distributed tracing, and centralized logging.

## ADDED Requirements

### Requirement: Prometheus exists for metrics collection
The system SHALL provide Prometheus instance to collect metrics from all services.

#### Scenario: Prometheus starts successfully
- **WHEN** developer starts docker-compose.base.yaml
- **THEN** Prometheus UI is accessible on port 9090

#### Scenario: Prometheus scrapes service metrics
- **WHEN** services expose metrics endpoints
- **THEN** Prometheus scrapes metrics according to configuration

#### Scenario: Prometheus configuration exists
- **WHEN** Prometheus starts
- **THEN** it loads prometheus.yml with scrape configs for all services

### Requirement: Grafana exists for dashboards
The system SHALL provide Grafana instance with pre-configured dashboards for system monitoring.

#### Scenario: Grafana starts successfully
- **WHEN** developer starts docker-compose.base.yaml
- **THEN** Grafana UI is accessible on port 3000

#### Scenario: Grafana connects to Prometheus
- **WHEN** Grafana starts
- **THEN** it connects to Prometheus as a data source

#### Scenario: Pre-configured dashboards exist
- **WHEN** user views Grafana dashboards
- **THEN** dashboards for services, databases, and message brokers are available

### Requirement: Grafana Tempo exists for distributed tracing
The system SHALL provide Grafana Tempo instance to collect and visualize distributed traces.

#### Scenario: Tempo starts successfully
- **WHEN** developer starts docker-compose.base.yaml
- **THEN** Tempo accepts trace data on configured port

#### Scenario: Tempo receives traces from services
- **WHEN** services send trace data
- **THEN** Tempo stores and indexes traces

#### Scenario: Tempo integrates with Grafana
- **WHEN** user views Grafana
- **THEN** Tempo data source is configured and traces are queryable

### Requirement: Grafana Loki exists for centralized logging
The system SHALL provide Grafana Loki instance to store and query logs from Vector.

#### Scenario: Loki starts successfully
- **WHEN** developer starts docker-compose.base.yaml
- **THEN** Loki accepts log data on configured port

#### Scenario: Loki receives logs from Vector
- **WHEN** Vector sends logs to Loki
- **THEN** Loki stores logs with appropriate labels

#### Scenario: Loki integrates with Grafana
- **WHEN** user views Grafana
- **THEN** Loki data source is configured and logs are queryable

### Requirement: Observability stack is integrated
The system SHALL provide integration between Prometheus, Grafana, Tempo, and Loki for unified observability.

#### Scenario: Grafana dashboard shows metrics and logs
- **WHEN** user views Grafana dashboard
- **THEN** dashboard displays both Prometheus metrics and Loki logs

#### Scenario: Traces link to logs
- **WHEN** user views a trace in Tempo
- **THEN** related logs in Loki are linked and accessible

### Requirement: Observability connections are configurable
The system SHALL allow observability service connection parameters to be configured via environment variables.

#### Scenario: Services export metrics to Prometheus
- **WHEN** services start
- **THEN** they read PROMETHEUS_ENDPOINT from environment variables

#### Scenario: Services send traces to Tempo
- **WHEN** services start
- **THEN** they read TEMPO_ENDPOINT from environment variables
