# Spec Delta

## Purpose

Configures Kafka and RabbitMQ message brokers for data streaming, events, and sagas between services.

## ADDED Requirements

### Requirement: Kafka exists for data streaming
The system SHALL provide Kafka cluster with appropriate topics for market data, CDC, and logs.

#### Scenario: Kafka cluster starts successfully
- **WHEN** developer starts docker-compose.base.yaml
- **THEN** Kafka broker is accessible on port 9092

#### Scenario: Market ticks topic exists
- **WHEN** ingestor-service publishes to market-ticks topic
- **THEN** topic exists and accepts messages

#### Scenario: CDC topic exists
- **WHEN** Debezium publishes to portfolio-cdc topic
- **THEN** topic exists and accepts messages

### Requirement: ksqlDB exists for CEP analysis
The system SHALL provide ksqlDB connected to Kafka for stream processing and anomaly detection.

#### Scenario: ksqlDB connects to Kafka
- **WHEN** ksqlDB container starts
- **THEN** it connects to Kafka successfully

#### Scenario: ksqlDB streams are created
- **WHEN** developer runs init-ksqldb.sql script
- **THEN** streams and tables are created for market data analysis

#### Scenario: ksqlDB generates alerts
- **WHEN** market data deviates from moving average
- **THEN** ksqlDB publishes alert to market-alerts topic

### Requirement: RabbitMQ exists for events and sagas
The system SHALL provide RabbitMQ with appropriate exchanges and queues for service events and distributed sagas.

#### Scenario: RabbitMQ starts successfully
- **WHEN** developer starts docker-compose.base.yaml
- **THEN** RabbitMQ management UI is accessible on port 15672

#### Scenario: Premium purchase exchange exists
- **WHEN** service publishes premium purchase event
- **THEN** exchange routes event to appropriate queues

#### Scenario: Saga queues exist
- **WHEN** distributed saga starts
- **THEN** saga queues exist for each step in the transaction

### Requirement: Kafka topics are pre-configured
The system SHALL provide initialization scripts to create required Kafka topics on startup.

#### Scenario: Required topics are created
- **WHEN** Kafka cluster starts
- **THEN** topics market-ticks, portfolio-cdc, market-alerts, and logs exist

#### Scenario: Topic configurations are applied
- **WHEN** topics are created
- **THEN** appropriate replication factor and partition count are applied

### Requirement: RabbitMQ exchanges and queues are pre-configured
The system SHALL provide initialization scripts to create required exchanges and queues on startup.

#### Scenario: Premium exchange is created
- **WHEN** RabbitMQ starts
- **THEN** premium.exchange exists with appropriate routing keys

#### Scenario: Dead letter queue exists
- **WHEN** message processing fails
- **THEN** failed message is routed to dead letter queue

### Requirement: Message broker connections are configurable
The system SHALL allow message broker connection parameters to be configured via environment variables.

#### Scenario: Kafka uses environment variables
- **WHEN** service connects to Kafka
- **THEN** it reads KAFKA_BROKERS from environment variables

#### Scenario: RabbitMQ uses environment variables
- **WHEN** service connects to RabbitMQ
- **THEN** it reads RABBITMQ_URL from environment variables
