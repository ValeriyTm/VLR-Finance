# Схемы БД VLR Finance

## 1. PostgreSQL - Auth Service

### Таблица: users

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Уникальный идентификатор пользователя |
| username | VARCHAR(30) | UNIQUE, NOT NULL | Имя пользователя (3-30 символов) |
| email | VARCHAR(255) | UNIQUE, NOT NULL | Email пользователя |
| passwordHash | VARCHAR(255) | NOT NULL | Хеш пароля (Argon2id) |
| role | ENUM | NOT NULL, DEFAULT 'USER' | Роль: USER, PREMIUM, ADMIN |
| createdAt | TIMESTAMP | NOT NULL, DEFAULT NOW() | Время создания |
| updatedAt | TIMESTAMP | NOT NULL, DEFAULT NOW() | Время обновления |

**Indexes**:
- UNIQUE INDEX on username
- UNIQUE INDEX on email
- INDEX on role

---

### Таблица: user_sessions

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Уникальный идентификатор сессии |
| userId | UUID | NOT NULL, FOREIGN KEY → users.id | ID пользователя |
| tokenHash | VARCHAR(255) | UNIQUE, NOT NULL | SHA-256 хеш refresh токена |
| tokenFamily | UUID | NOT NULL | UUID для breach detection |
| version | INTEGER | NOT NULL, DEFAULT 1 | Версия токена (инкрементируется при refresh) |
| nonce | VARCHAR(32) | NOT NULL | Случайное значение для защиты от replay |
| rotationAt | TIMESTAMP | NOT NULL, DEFAULT NOW() | Время последней ротации |
| expiresAt | TIMESTAMP | NOT NULL | Время истечения токена |
| userAgent | VARCHAR(500) | | User-Agent заголовок для логирования |
| ipAddress | VARCHAR(45) | | IP адрес для логирования |
| createdAt | TIMESTAMP | NOT NULL, DEFAULT NOW() | Время создания |
| updatedAt | TIMESTAMP | NOT NULL, DEFAULT NOW() | Время обновления |

**Indexes**:
- UNIQUE INDEX on tokenHash
- INDEX on userId
- INDEX on tokenFamily
- INDEX on expiresAt

**Breach Detection Logic**:
- При повторном использовании токена после rotationAt + 10 секунд → отзыв всей token family
- Race condition window: 10 секунд (принимаем старый токен)

---

## 2. PostgreSQL - AI Copilot Service (с pgvector)

### Таблица: documents

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Уникальный идентификатор документа |
| title | VARCHAR(255) | NOT NULL | Название документа |
| content | TEXT | NOT NULL | Текст документа |
| source | VARCHAR(255) | NOT NULL | Источник (PDF URL, файл и т.д.) |
| category | VARCHAR(100) | | Категория (report, whitepaper, news) |
| createdAt | TIMESTAMP | NOT NULL, DEFAULT NOW() | Время загрузки |
| updatedAt | TIMESTAMP | NOT NULL, DEFAULT NOW() | Время обновления |

**Indexes**:
- INDEX on category
- INDEX on createdAt

---

### Таблица: document_chunks

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Уникальный идентификатор чанка |
| documentId | UUID | NOT NULL, FOREIGN KEY → documents.id | ID документа |
| chunkIndex | INTEGER | NOT NULL | Порядковый номер чанка в документе |
| content | TEXT | NOT NULL | Текст чанка |
| embedding | vector(768) | NOT NULL | Векторное представление (nomic-embed-text) |
| createdAt | TIMESTAMP | NOT NULL, DEFAULT NOW() | Время создания |

**Indexes**:
- INDEX on documentId
- INDEX on chunkIndex
- **HNSW INDEX on embedding** (для быстрого семантического поиска)

**HNSW Index Configuration**:
- M: 16
- ef_construction: 64

---

### Таблица: mem0_memories

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Уникальный идентификатор памяти |
| userId | UUID | NOT NULL | ID пользователя |
| content | TEXT | NOT NULL | Содержимое факта |
| metadata | JSONB | | Метаданные (тип факта, контекст) |
| embedding | vector(768) | NOT NULL | Векторное представление |
| createdAt | TIMESTAMP | NOT NULL, DEFAULT NOW() | Время создания |
| updatedAt | TIMESTAMP | NOT NULL, DEFAULT NOW() | Время обновления |

**Indexes**:
- INDEX on userId
- INDEX on createdAt
- **HNSW INDEX on embedding**

---

## 3. PostgreSQL - Portfolio Service

### Таблица: users

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Уникальный идентификатор пользователя |
| balance | DECIMAL(20, 8) | NOT NULL, DEFAULT 0 | Баланс пользователя |
| role | ENUM | NOT NULL, DEFAULT 'USER' | Роль: USER, PREMIUM, ADMIN |
| createdAt | TIMESTAMP | NOT NULL, DEFAULT NOW() | Время создания |
| updatedAt | TIMESTAMP | NOT NULL, DEFAULT NOW() | Время обновления |

**Indexes**:
- UNIQUE INDEX on id
- INDEX on role

---

### Таблица: portfolio_transactions

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Уникальный идентификатор транзакции |
| userId | UUID | NOT NULL, FOREIGN KEY → users.id | ID пользователя |
| asset | VARCHAR(50) | NOT NULL | Актив (BTC, AAPL и т.д.) |
| type | ENUM | NOT NULL | Тип: BUY, SELL |
| amount | DECIMAL(20, 8) | NOT NULL | Количество актива |
| price | DECIMAL(20, 8) | NOT NULL | Цена за единицу |
| status | ENUM | NOT NULL, DEFAULT 'COMPLETED' | Статус: PENDING, COMPLETED, REJECTED |
| sagaId | UUID | | ID саги (для компенсирующих транзакций) |
| idempotencyKey | VARCHAR(255) | UNIQUE | Ключ для дедупликации |
| createdAt | TIMESTAMP | NOT NULL, DEFAULT NOW() | Время создания |
| updatedAt | TIMESTAMP | NOT NULL, DEFAULT NOW() | Время обновления |

**Indexes**:
- INDEX on userId
- INDEX on asset
- INDEX on createdAt
- INDEX on sagaId
- UNIQUE INDEX on idempotencyKey

---

## 4. ClickHouse - Analytics

### Таблица: portfolio_transactions_cdc

**Engine**: ReplacingMergeTree
**Order By**: (userId, asset, createdAt)
**Primary Key**: (userId, asset, createdAt)

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Уникальный идентификатор транзакции |
| userId | UUID | ID пользователя |
| asset | String | Актив |
| type | String | Тип: BUY, SELL |
| amount | Decimal(20, 8) | Количество актива |
| price | Decimal(20, 8) | Цена за единицу |
| createdAt | DateTime | Время создания |
| __op | String | Операция Debezium: c, u, d |

**Назначение**: Хранение транзакций из CDC для аналитики
**ReplacingMergeTree**: Автоматическая дедупликация по Primary Key

---

### Таблица: market_ticks

**Engine**: MergeTree
**Order By**: (symbol, timestamp)
**Partition By**: toYYYYMM(timestamp)

| Column | Type | Description |
|--------|------|-------------|
| symbol | String | Символ (BTCUSDT) |
| price | Decimal(20, 8) | Цена |
| quantity | Decimal(20, 8) | Количество |
| timestamp | DateTime | Время тика |

**Назначение**: Хранение рыночных тиков для анализа

---

### Таблица: market_alerts

**Engine**: MergeTree
**Order By**: (symbol, timestamp)
**Partition By**: toYYYYMM(timestamp)

| Column | Type | Description |
|--------|------|-------------|
| symbol | String | Символ |
| price | Decimal(20, 8) | Цена |
| sma | Decimal(20, 8) | Скользящая средняя |
| deviation | Decimal(10, 4) | Отклонение в % |
| timestamp | DateTime | Время алерта |

**Назначение**: Хранение аномалий от ksqlDB

---

### Таблица: system_logs

**Engine**: MergeTree
**Order By**: (service, timestamp)
**Partition By**: (service, toYYYYMMDD(timestamp))

| Column | Type | Description |
|--------|------|-------------|
| timestamp | DateTime | Время лога |
| level | String | Уровень: INFO, ERROR, WARN |
| service | String | Имя сервиса |
| message | String | Сообщение |
| userId | Nullable(UUID) | ID пользователя (если есть) |
| requestId | Nullable(UUID) | ID запроса (если есть) |
| statusCode | Nullable(UInt16) | HTTP статус код (если есть) |
| responseTimeMs | Nullable(UInt32) | Время ответа в мс (если есть) |

**Назначение**: Структурированные логи для метрик и аналитики

---

## 5. ClickHouse - ksqlDB Streams/Tables

### Stream: market_ticks_stream

**Генерируется ksqlDB** из топика Kafka market-ticks

```sql
CREATE STREAM market_ticks_stream (
  symbol VARCHAR,
  price DOUBLE,
  quantity DOUBLE,
  timestamp VARCHAR
) WITH (
  KAFKA_TOPIC='market-ticks',
  VALUE_FORMAT='JSON'
);
```

---

### Table: market_ticks_1m_agg

**Генерируется ksqlDB** - агрегация по 1 минуте

```sql
CREATE TABLE market_ticks_1m_agg AS
SELECT
  symbol,
  WINDOWSTART AS window_start,
  AVG(price) AS avg_price,
  COUNT(*) AS tick_count
FROM
  TUMBLE(market_ticks_stream, EMIT CHANGES, INTERVAL 1 MINUTE)
GROUP BY
  symbol,
  WINDOWSTART;
```

---

### Stream: market_alerts_stream

**Генерируется ksqlDB** - CEP анализ

```sql
CREATE STREAM market_alerts_stream AS
SELECT
  symbol,
  price,
  avg_price AS sma,
  ABS((price - avg_price) / avg_price * 100) AS deviation
FROM
  market_ticks_1m_agg
WHERE
  ABS((price - avg_price) / avg_price * 100) > 2
EMIT CHANGES;
```

---

## 6. Redis - Key Structure

### Сессии

**Key**: `session:{jti}`
**Type**: Hash
**TTL**: expiresAt токена
**Fields**:
- userId: UUID
- tokenFamily: UUID
- version: INTEGER

**Использование**: Быстрая проверка активных сессий, мгновенный отзыв

---

### Rate Limiting

**Key**: `ratelimit:{userId}:{endpoint}`
**Type**: String (counter)
**TTL**: 60 секунд
**Value**: Количество запросов

**Использование**: Rate limiting на уровне пользователя

---

### AI Limits

**Key**: `user:limits:{userId}`
**Type**: String (counter)
**TTL**: 24 часа
**Value**: Оставшееся количество запросов к ИИ

**Использование**: Бизнес-лимиты на ИИ запросы

---

### BullMQ Jobs

**Key**: `bull:pdf-reports`
**Type**: List (queue)
**Sub-keys**:
- `bull:pdf-reports:waiting` - задачи в очереди
- `bull:pdf-reports:active` - выполняющиеся задачи
- `bull:pdf-reports:completed` - завершенные задачи
- `bull:pdf-reports:failed` - проваленные задачи

**Job Data**:
```json
{
  "userId": "uuid",
  "reportType": "YEARLY",
  "startDate": "ISO8601",
  "endDate": "ISO8601"
}
```

**Job Result**:
```json
{
  "presignedUrl": "string",
  "s3Key": "string"
}
```

---

### Chat Sessions (LangGraph)

**Key**: `chat:session:{sessionId}`
**Type**: List
**TTL**: 24 часа
**Value**: Array из 10 последних сообщений

**Использование**: Краткосрочный контекст для AI агента

---

## 7. MinIO - S3 Buckets

### Bucket: user-private-data

**Access**: Private
**Encryption**: SSE-S3 (AES256)

**Object Structure**:
```
reports/
  {userId}/
    {reportType}-{timestamp}.pdf
```

**Presigned URL**: Генерируется на 15 минут

---

### Bucket: system-analytics-archive

**Access**: Internal/IAM-restricted
**Encryption**: Опционально (можно отключить для экономии)

**Object Structure**:
```
logs/
  {service}/
    {YYYY}/
      {MM}/
      {DD}/
        {service}-{timestamp}.log.gz
```

---

## 8. Langfuse - PostgreSQL

### Таблицы (автоматически создаются Langfuse)

- **observations**: шаги выполнения графа
- **traces**: трейсы сессий
- **users**: пользователи
- **scores**: оценки качества ответов

**Использование**: Observability для AI агента

---

## Миграции

### PostgreSQL (Prisma)

Миграции находятся в `infrastructure/migrations/postgres/`
- Управляются через Prisma CLI
- Автоматически применяются при старте контейнера

### ClickHouse

Миграции находятся в `infrastructure/migrations/clickhouse/`
- SQL файлы с CREATE TABLE
- Выполняются кастомным Node.js скриптом
- Версионирование через таблицу schema_migrations

### ksqlDB

Скрипты инициализации в `infrastructure/scripts/init-ksqldb.sql`
- CREATE STREAM и CREATE TABLE команды
- Автоматически применяются при старте контейнера ksqlDB

---

## DDL Примеры

### PostgreSQL - users (Prisma schema)

```prisma
model User {
  id           String        @id @default(uuid())
  username     String        @unique @db.VarChar(30)
  email        String        @unique @db.VarChar(255)
  passwordHash String        @db.VarChar(255)
  role         Role          @default(USER)
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
  sessions     UserSession[]
}

enum Role {
  USER
  PREMIUM
  ADMIN
}
```

### PostgreSQL - document_chunks (с pgvector)

```sql
CREATE TABLE document_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  documentId UUID NOT NULL REFERENCES documents(id),
  chunkIndex INTEGER NOT NULL,
  content TEXT NOT NULL,
  embedding vector(768) NOT NULL,
  createdAt TIMESTAMP DEFAULT NOW()
);

CREATE INDEX ON document_chunks(documentId);
CREATE INDEX ON document_chunks(chunkIndex);
CREATE INDEX ON document_chunks USING hnsw (embedding vector_cosine_ops) WITH (m = 16, ef_construction = 64);
```

### ClickHouse - portfolio_transactions_cdc

```sql
CREATE TABLE portfolio_transactions_cdc (
  id UUID,
  userId UUID,
  asset String,
  type String,
  amount Decimal(20, 8),
  price Decimal(20, 8),
  createdAt DateTime,
  __op String
) ENGINE = ReplacingMergeTree()
ORDER BY (userId, asset, createdAt)
PRIMARY KEY (userId, asset, createdAt);
```
