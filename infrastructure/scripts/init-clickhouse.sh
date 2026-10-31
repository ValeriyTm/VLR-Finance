#!/bin/bash

set -e

echo "Initializing ClickHouse database..."

clickhouse-client --query "
CREATE DATABASE IF NOT EXISTS vlr_finance;
"

echo "Creating market_data table..."
clickhouse-client --query "
CREATE TABLE IF NOT EXISTS vlr_finance.market_data (
    timestamp DateTime64(3),
    symbol String,
    price Float64,
    volume Float64,
    high Float64,
    low Float64,
    open Float64,
    close Float64
) ENGINE = ReplacingMergeTree()
ORDER BY (symbol, timestamp);
"

echo "Creating portfolio_analytics table..."
clickhouse-client --query "
CREATE TABLE IF NOT EXISTS vlr_finance.portfolio_analytics (
    user_id UInt32,
    symbol String,
    quantity Float64,
    avg_buy_price Float64,
    current_price Float64,
    pnl Float64,
    pnl_percentage Float64,
    timestamp DateTime64(3)
) ENGINE = ReplacingMergeTree()
ORDER BY (user_id, symbol, timestamp);
"

echo "ClickHouse initialization complete!"
