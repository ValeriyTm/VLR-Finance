-- Create stream for market ticks
CREATE STREAM IF NOT EXISTS market_ticks_stream (
  timestamp BIGINT,
  symbol VARCHAR,
  price DOUBLE,
  volume DOUBLE
) WITH (
  KAFKA_TOPIC='market-ticks',
  VALUE_FORMAT='JSON'
);

-- Create table for moving average calculation
CREATE TABLE IF NOT EXISTS market_moving_avg AS
SELECT
  symbol,
  WINDOW_START AS timestamp,
  AVG(price) AS moving_avg
FROM TUMBLE(
  market_ticks_stream,
  timestamp,
  60 SECONDS
)
GROUP BY
  symbol,
  WINDOW_START;

-- Create stream for market alerts
CREATE STREAM IF NOT EXISTS market_alerts_stream WITH (
  KAFKA_TOPIC='market-alerts',
  VALUE_FORMAT='JSON'
) AS
SELECT
  symbol,
  price,
  moving_avg,
  (price - moving_avg) / moving_avg * 100 AS deviation_percentage
FROM market_ticks_stream
LEFT JOIN market_moving_avg
ON market_ticks_stream.symbol = market_moving_avg.symbol
WHERE ABS((price - moving_avg) / moving_avg * 100) > 2;
