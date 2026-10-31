#!/bin/bash

set -e

echo "Creating Kafka topics..."

# Wait for Kafka to be ready
until kafka-topics --bootstrap-server kafka:9092 --list; do
  echo "Waiting for Kafka..."
  sleep 5
done

# Create topics
kafka-topics --bootstrap-server kafka:9092 --create --topic market-ticks --partitions 3 --replication-factor 1 --if-not-exists
kafka-topics --bootstrap-server kafka:9092 --create --topic portfolio-cdc --partitions 3 --replication-factor 1 --if-not-exists
kafka-topics --bootstrap-server kafka:9092 --create --topic market-alerts --partitions 3 --replication-factor 1 --if-not-exists
kafka-topics --bootstrap-server kafka:9092 --create --topic logs --partitions 3 --replication-factor 1 --if-not-exists

echo "Kafka topics created successfully!"
