# API Контракты VLR Finance

## REST API (через BFF)

### BFF: Web (работа с куками)

#### Auth Endpoints

**POST /api/bff/web/auth/register**
- Описание: Регистрация нового пользователя
- Request Body:
  ```json
  {
    "username": "string (3-30 chars)",
    "email": "string (email format)",
    "password": "string (min 8 chars)"
  }
  ```
- Response (201):
  ```json
  {
    "user": {
      "id": "uuid",
      "username": "string",
      "email": "string",
      "role": "USER",
      "createdAt": "ISO8601"
    }
  }
  ```
- Cookies: не устанавливаются (пользователь должен явно залогиниться)
- Errors: 400 (невалидные данные), 409 (пользователь уже существует)

---

**POST /api/bff/web/auth/login**
- Описание: Вход в систему
- Request Body:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- Response (200):
  ```json
  {
    "user": {
      "id": "uuid",
      "username": "string",
      "email": "string",
      "role": "USER|PREMIUM|ADMIN",
      "createdAt": "ISO8601"
    }
  }
  ```
- Cookies:
  - access_token: HttpOnly, Secure, SameSite=strict, path=/api/bff/web/auth, TTL=5 min
  - refresh_token: HttpOnly, Secure, SameSite=strict, path=/api/bff/web/auth, TTL=7 days
- Errors: 401 (неверные данные), 429 (rate limit exceeded)

---

**POST /api/bff/web/auth/refresh**
- Описание: Обновление токенов
- Request Body: пустое (токены берутся из кук)
- Response (200):
  ```json
  {
    "user": {
      "id": "uuid",
      "username": "string",
      "email": "string",
      "role": "USER|PREMIUM|ADMIN"
    }
  }
  ```
- Cookies: обновляются access_token и refresh_token
- Errors: 401 (токен невалиден или отозван), 403 (reuse detection)

---

**POST /api/bff/web/auth/logout**
- Описание: Выход из текущей сессии
- Request Body: пустое
- Response (204): No Content
- Cookies: удаляются access_token и refresh_token
- Errors: 401 (не авторизован)

---

**POST /api/bff/web/auth/logout-all**
- Описание: Выход из всех сессий
- Request Body: пустое
- Response (204): No Content
- Cookies: удаляются access_token и refresh_token
- Side effect: все сессии пользователя в Redis удаляются
- Errors: 401 (не авторизован)

---

### BFF: Mobile/Desktop (работа с токенами)

#### Auth Endpoints

**POST /api/bff/mobile/auth/register** (аналогично для /desktop)
- Request Body: тот же, что и для web
- Response (201): тот же, что и для web
- Difference: токены НЕ возвращаются (пользователь должен явно залогиниться)

---

**POST /api/bff/mobile/auth/login**
- Request Body: тот же, что и для web
- Response (200):
  ```json
  {
    "user": { ... },
    "access_token": "string (JWT)",
    "refresh_token": "string (JWT)"
  }
  ```
- Difference: токены возвращаются в JSON теле, не в куках

---

**POST /api/bff/mobile/auth/refresh**
- Request Body:
  ```json
  {
    "refreshToken": "string"
  }
  ```
- Response (200):
  ```json
  {
    "access_token": "string",
    "refresh_token": "string"
  }
  ```

---

**POST /api/bff/mobile/auth/logout**
- Headers: Authorization: Bearer <access_token>
- Response (204): No Content

---

**POST /api/bff/mobile/auth/logout-all**
- Headers: Authorization: Bearer <access_token>
- Response (204): No Content

---

### BFF: Terminal (Web)

**GET /api/bff/web/terminal/stream**
- Описание: SSE поток для реального времени котировок и алертов
- Headers: Cookie: access_token (для web)
- Response: Server-Sent Events stream
- Event types:
  - tick: данные котировки
  - alert: событие аномалии
- Example tick event:
  ```json
  {
    "type": "tick",
    "data": {
      "symbol": "BTCUSDT",
      "price": 50000.0,
      "timestamp": "ISO8601"
    }
  }
  ```
- Example alert event:
  ```json
  {
    "type": "alert",
    "data": {
      "symbol": "BTCUSDT",
      "price": 50000.0,
      "sma": 49000.0,
      "deviation": 2.04,
      "timestamp": "ISO8601"
    }
  }
  ```

---

### BFF: Portfolio (Web)

**POST /api/bff/web/portfolio/transactions**
- Описание: Добавление транзакции
- Headers: Cookie: access_token
- Request Body:
  ```json
  {
    "asset": "string (e.g., BTC, AAPL)",
    "type": "BUY|SELL",
    "amount": "number",
    "price": "number"
  }
  ```
- Response (201):
  ```json
  {
    "id": "uuid",
    "userId": "uuid",
    "asset": "string",
    "type": "BUY|SELL",
    "amount": "number",
    "price": "number",
    "status": "COMPLETED",
    "createdAt": "ISO8601"
  }
  ```

---

**GET /api/bff/web/portfolio/analytics**
- Описание: Получение аналитики портфеля
- Headers: Cookie: access_token
- Response (200):
  ```json
  {
    "totalPnL": "number",
    "roi": "number",
    "assetAllocation": [
      {
        "asset": "string",
        "percentage": "number",
        "value": "number"
      }
    ],
    "transactions": [
      {
        "id": "uuid",
        "asset": "string",
        "type": "BUY|SELL",
        "amount": "number",
        "price": "number",
        "createdAt": "ISO8601"
      }
    ]
  }
  ```

---

**POST /api/bff/web/portfolio/reports**
- Описание: Запуск генерации PDF отчета
- Headers: Cookie: access_token
- Request Body:
  ```json
  {
    "reportType": "YEARLY|MONTHLY|CUSTOM",
    "startDate": "ISO8601 (optional)",
    "endDate": "ISO8601 (optional)"
  }
  ```
- Response (202):
  ```json
  {
    "taskId": "uuid",
    "status": "PENDING"
  }
  ```

---

**GET /api/bff/web/portfolio/reports/:taskId**
- Описание: Проверка статуса задачи
- Headers: Cookie: access_token
- Response (200):
  ```json
  {
    "taskId": "uuid",
    "status": "PENDING|PROCESSING|COMPLETED|FAILED",
    "downloadUrl": "string (presigned URL, только при status=COMPLETED)",
    "error": "string (при status=FAILED)"
  }
  ```

---

### BFF: AI Copilot (Web)

**POST /api/bff/web/ai/chat**
- Описание: Отправка сообщения в AI чат
- Headers: Cookie: access_token
- Request Body:
  ```json
  {
    "message": "string"
  }
  ```
- Response: Server-Sent Events stream
- Event types:
  - content: часть ответа (streaming)
  - component: метаданные Generative UI компонента
  - done: конец ответа
- Example content event:
  ```json
  {
    "type": "content",
    "data": "часть ответа"
  }
  ```
- Example component event:
  ```json
  {
    "type": "component",
    "data": {
      "component": "MarketAlertsTable",
      "props": {
        "ticker": "BTC"
      }
    }
  }
  ```

---

## gRPC Contracts

### Auth Service → AI Copilot Service

**Service**: AuthService
**Method**: ValidateUserTariff

**Request**:
```protobuf
message ValidateUserTariffRequest {
  string access_token = 1;
}
```

**Response**:
```protobuf
message ValidateUserTariffResponse {
  bool is_valid = 1;
  string user_id = 2;
  string role = 3;  // USER|PREMIUM|ADMIN
  int32 remaining_limits = 4;  // количество оставшихся запросов к ИИ
}
```

**Поведение**:
- Криптографическая верификация access токена
- Проверка статуса отзыва в Redis (session:{jti})
- Проверка и декремент бизнес-лимитов в Redis (user:limits:{userId})
- При истечении лимитов: remaining_limits = 0

---

### Analytics Service → Background Jobs Service

**Service**: AnalyticsService
**Method**: GetPortfolioAnalytics

**Request**:
```protobuf
message GetPortfolioAnalyticsRequest {
  string user_id = 1;
}
```

**Response**:
```protobuf
message GetPortfolioAnalyticsResponse {
  double total_pnl = 1;
  double roi = 2;
  repeated AssetAllocation asset_allocation = 3;
  repeated Transaction transactions = 4;
}

message AssetAllocation {
  string asset = 1;
  double percentage = 2;
  double value = 3;
}

message Transaction {
  string id = 1;
  string asset = 2;
  string type = 3;  // BUY|SELL
  double amount = 4;
  double price = 5;
  string created_at = 6;
}
```

**Поведение**:
- Raw SQL запрос в ClickHouse
- FIFO алгоритм для PnL расчета (в памяти Node.js)
- Возвращает хронологический массив транзакций и рассчитанные метрики

---

## RabbitMQ Events

### Premium Purchase Saga

**Event 1: portfolio.balance.deducted**
```json
{
  "userId": "uuid",
  "amount": 50.0,
  "sagaId": "uuid",
  "timestamp": "ISO8601"
}
```
- Published by: Portfolio Service
- Consumed by: AI Copilot Service

---

**Event 2: ai.resources.allocated**
```json
{
  "userId": "uuid",
  "sagaId": "uuid",
  "timestamp": "ISO8601"
}
```
- Published by: AI Copilot Service
- Consumed by: Auth Service

---

**Event 3: ai.resources.allocation_failed**
```json
{
  "userId": "uuid",
  "sagaId": "uuid",
  "error": "string",
  "timestamp": "ISO8601"
}
```
- Published by: AI Copilot Service
- Consumed by: Portfolio Service (для компенсирующей транзакции)

---

**Event 4: portfolio.purchase.compensated**
```json
{
  "userId": "uuid",
  "amount": 50.0,
  "sagaId": "uuid",
  "timestamp": "ISO8601"
}
```
- Published by: Portfolio Service
- Consumed by: AI Copilot Service (для освобождения памяти)

---

## Kafka Topics

### Market Data

**Topic: market-ticks**
- Purpose: Сырые тики с биржи
- Format: JSON
- Example:
```json
{
  "symbol": "BTCUSDT",
  "price": 50000.0,
  "quantity": 0.1,
  "timestamp": "ISO8601"
}
```
- Producer: Ingestor Service (Binance WebSocket или Mock)
- Consumers: ksqlDB, Vector
- Guarantees: At-Least-Once (acks=1, enable.idempotence=true)

---

**Topic: market-alerts**
- Purpose: Аномалии от ksqlDB
- Format: JSON
- Example:
```json
{
  "symbol": "BTCUSDT",
  "price": 50000.0,
  "sma": 49000.0,
  "deviation": 2.04,
  "timestamp": "ISO8601"
}
```
- Producer: ksqlDB
- Consumers: Vector (для ClickHouse), BFF (для SSE)
- Guarantees: Exactly-Once (ksqlDB processing.guarantee="exactly_once_v2")

---

### CDC

**Topic: portfolio-cdc**
- Purpose: CDC события из PostgreSQL
- Format: Debezium JSON
- Example:
```json
{
  "before": null,
  "after": {
    "id": "uuid",
    "userId": "uuid",
    "asset": "BTC",
    "type": "BUY",
    "amount": 0.1,
    "price": 50000.0,
    "createdAt": "ISO8601"
  },
  "op": "c",  // c=create, u=update, d=delete
  "ts_ms": 1234567890
}
```
- Producer: Debezium (Kafka Connect)
- Consumers: Vector (для ClickHouse)
- Guarantees: At-Least-Once (acks=all)

---

### Logging

**Topic: system-logs**
- Purpose: Логи всех сервисов
- Format: JSON
- Example:
```json
{
  "timestamp": "ISO8601",
  "level": "INFO|ERROR|WARN",
  "service": "auth-service",
  "message": "string",
  "metadata": {
    "userId": "uuid",
    "requestId": "uuid"
  }
}
```
- Producer: Vector (перехват stdout)
- Consumers: Vector (для ClickHouse), Vector (для Loki)
- Guarantees: At-Most-Once (acks=0, batching)

---

## Rate Limiting

### Auth Service

- POST /api/v1/auth/login: 5 попыток в минуту на IP (неавторизованные)
- POST /api/v1/auth/register: 3 попытки в минуту на IP
- POST /api/v1/auth/refresh: 20 попыток в минуту на userId (авторизованные)

### AI Copilot Service

- POST /api/bff/web/ai/chat:
  - USER роль: 5 запросов в минуту
  - PREMIUM роль: 30 запросов в минуту
  - ADMIN роль: без лимита
  - Неавторизованные: 1 запрос в минуту на IP

---

## Error Codes

### HTTP Status Codes

- 200: OK
- 201: Created
- 204: No Content
- 400: Bad Request (невалидные данные)
- 401: Unauthorized (не авторизован или токен истек)
- 403: Forbidden (недостаточно прав)
- 404: Not Found (ресурс не существует)
- 409: Conflict (ресурс уже существует)
- 415: Unsupported Media Type (XML не поддерживается)
- 429: Too Many Requests (rate limit exceeded)
- 500: Internal Server Error
- 503: Service Unavailable (сервис временно недоступен)

### Prisma Error Codes Mapping

- P2025 → 404 (Record not found)
- P2002 → 409 (Unique constraint violation)
- P2003 → 400 (Foreign key constraint failed)
- P500 → 503 (Connection error)
- P503 → 503 (Service unavailable)
- P08P1 → 503 (Connection timeout)
