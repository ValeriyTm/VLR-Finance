#!/bin/bash

set -e

echo "Initializing RabbitMQ exchanges and queues..."

# Wait for RabbitMQ to be ready
until rabbitmqadmin list exchanges > /dev/null 2>&1; do
  echo "Waiting for RabbitMQ..."
  sleep 5
done

# Create premium exchange
rabbitmqadmin declare exchange name=premium.exchange type=direct

# Create saga queues
rabbitmqadmin declare queue name=saga-premium-purchase durable=true
rabbitmqadmin declare queue name=saga-premium-purchase-dlq durable=true

# Bind queues to exchange
rabbitmqadmin declare binding source=premium.exchange destination=saga-premium-purchase routing_key=purchase
rabbitmqadmin declare binding source=premium.exchange destination=saga-premium-purchase-dlq routing_key=purchase-dlq

# Set dead letter exchange for saga queue
rabbitmqadmin set policy name=dlq pattern=saga-.* apply-to=queues \
  arguments='{"dead-letter-exchange":"premium.exchange","dead-letter-routing-key":"purchase-dlq"}'

echo "RabbitMQ initialization complete!"
