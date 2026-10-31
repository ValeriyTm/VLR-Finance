#!/bin/bash

set -e

echo "Initializing MinIO buckets..."

# Wait for MinIO to be ready
until curl -f http://minio:9000/minio/health/live > /dev/null 2>&1; do
  echo "Waiting for MinIO..."
  sleep 5
done

# Install mc if not available
if ! command -v mc &> /dev/null; then
  echo "Installing MinIO client..."
  wget -q https://dl.min.io/client/mc/release/linux-amd64/mc -O /usr/local/bin/mc
  chmod +x /usr/local/bin/mc
fi

# Configure mc alias
mc alias set minio http://minio:9000 minioadmin minioadmin

# Create buckets
mc mb minio/reports --ignore-existing
mc mb minio/logs --ignore-existing
mc mb minio/assets --ignore-existing

# Set bucket policies (public read for reports, private for others)
mc anonymous set download minio/reports
mc anonymous set none minio/logs
mc anonymous set download minio/assets

echo "MinIO initialization complete!"
