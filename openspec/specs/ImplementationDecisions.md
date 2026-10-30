# Решения по реализации

## 1. Миграции ClickHouse

**Выбранное решение**: SQL-скрипты + кастомный Node.js скрипт

**Обоснование**:
- **Простота**: Нет дополнительных зависимостей (dbt требует Python, clickhouse-migrate менее популярный)
- **Контроль**: Полный контроль над процессом миграций
- **Отладка**: Легко отладить и модифицировать при необходимости
- **Навыки**: Демонстрирует навык написания инфраструктурного кода
- **Пет-проект**: Для пет-проекта не нужен промышленный инструмент вроде dbt

**Реализация**:
- Папка: `infrastructure/migrations/clickhouse/`
- SQL файлы: `001_create_portfolio_transactions_cdc.sql`, `002_create_market_ticks.sql` и т.д.
- Скрипт: `infrastructure/scripts/migrate-clickhouse.js`
- Версионирование: таблица `schema_migrations` в ClickHouse

---

## 2. PDF генерация

**Выбранное решение**: Puppeteer

**Обоснование** (ваш выбор):
- Позволяет рендерить HTML в PDF (проще верстка)
- Можно использовать существующие CSS стили из проекта
- Более мощный инструмент для сложных отчетов

**Минусы**:
- Тяжелая библиотека (~300MB)
- Требует Chrome/Chromium

**Реализация**:
- Docker контейнер с Chromium для background-jobs-service
- Генерация HTML шаблона → рендер в PDF через Puppeteer

---

## 3. Mem0

**Выбранное решение**: Отдельный Docker контейнер

**Обоснование** (ваш выбор):
- Более масштабируемо
- Промышленный подход
- Изолированность сервиса

**Реализация**:
- Отдельный контейнер в docker-compose
- API доступен через HTTP
- Хранение данных в отдельной БД (Redis или PostgreSQL)

---

## 4. Langfuse

**Выбранное решение**: Langfuse Cloud

**Обоснование** (ваш выбор):
- Не нужно хостить
- Автоматические обновления
- Доступ к расширенным функциям Cloud версии

**Минусы**:
- Требует интернета
- Зависимость от внешнего сервиса

**Реализация**:
- Использование cloud SDK
- API ключи в .env
- UI доступен через cloud.langfuse.com

---

## 5. Ollama

**Выбранное решение**: Уже запущен на ПК, подключение через localhost:11434

**Обоснование**:
- Уже есть на вашей машине
- Не нужно запускать отдельный контейнер
- Экономия ресурсов

**Реализация**:
- ai-copilot-service подключается к http://host.docker.internal:11434
- В docker-compose: `extra_hosts: - "host.docker.internal:host-gateway"`

---

## 6. Обработка ошибок транзакций

**Выбранное решение**: Cockateil Retry

**Обоснование**:
- **Стандарт экосистемы**: Cockateil - популярная библиотека в Node.js для resilience patterns
- **Единый подход**: Уже используется в проекте для gRPC resilience (см. KeyDecisions.md пункт 17)
- **Функциональность**: Поддерживает все нужные паттерны (Retry, Timeout, Circuit Breaker, Bulkhead)
- **Документация**: Хорошо документирован, много примеров
- **TypeScript**: Полная поддержка TypeScript

**Реализация**:
```typescript
import { Retry } from 'cockatiel';

const retryPolicy = Retry.handle()
  .attempts(3)
  .delay(500)
  .retryIf((error) => {
    // Retry только на временные ошибки
    return error.code === 'P503' || // Service unavailable
           error.code === 'P500' || // Connection error
           error.code === 'P08P1' || // Connection timeout
           error.code === 'P2002';  // Unique constraint (race condition)
  });
```

**Альтернативы (отклонены)**:
- **Вручную через try-catch**: Слишком много кода, нет экспоненциальной задержки
- ** библиотеки (opossum, resilience)**: Cockateil лучше поддерживается и документирован

---

## 7. WebSocket Reconnect

**Варианты**:

### Вариант A: Exponential Backoff + Circuit Breaker (рекомендуется)
- **Как работает**: При разрыве соединения - reconnect с задержкой 1s, 2s, 4s, 8s, ... до максимума. Circuit Breaker размыкается после N неудач в течение времени T.
- **Плюсы**: Защита от бесконечных реконнектов, стандартный подход
- **Минусы**: Требует реализации Circuit Breaker

### Вариант B: Простой retry с фиксированной задержкой
- **Как работает**: При разрыве - reconnect каждые 5 секунд
- **Плюсы**: Простой в реализации
- **Минусы**: Может спамить сервер, нет защиты от каскадных сбоев

### Вариант C: Встроенный reconnect библиотеки ws
- **Как работает**: Использовать встроенный reconnect библиотеки ws
- **Плюсы**: Не нужно писать код
- **Минусы**: Меньше контроля, не все библиотеки поддерживают

**Выбранное решение**: Вариант A (Exponential Backoff + Circuit Breaker)

**Обоснование**:
- **Защита**: Предотвращает бесконечные реконнекты
- **Стандарт**: Индустриальный стандарт для WebSocket reconnect
- **Единый подход**: Уже используется Cockateil в проекте для resilience
- **Контроль**: Полный контроль над поведением reconnect

**Реализация**:
```typescript
import { CircuitBreaker } from 'cockatiel';

const circuitBreaker = CircuitBreaker.handle()
  .threshold(5) // 5 неудачных попыток
  .duration(60000); // 1 минута

class LiveMarketStrategy {
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private baseDelay = 1000; // 1s

  private reconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnect attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.baseDelay * Math.pow(2, this.reconnectAttempts - 1);

    setTimeout(() => {
      circuitBreaker.execute(() => this.connect());
    }, delay);
  }
}
```

---

## Итоговая таблица решений

| Пункт | Решение | Обоснование |
|-------|---------|-------------|
| 1. Миграции ClickHouse | SQL-скрипты + кастомный скрипт | Простота, контроль, навыки |
| 2. PDF генерация | Puppeteer | HTML в PDF, проще верстка |
| 3. Mem0 | Docker контейнер | Масштабируемость, промышленный подход |
| 4. Langfuse | Cloud | Не нужно хостить, автообновления |
| 5. Ollama | localhost:11434 | Уже есть на ПК |
| 6. Ошибки транзакций | Cockateil Retry | Стандарт экосистемы, единый подход |
| 7. WebSocket Reconnect | Exponential Backoff + Circuit Breaker | Защита, стандарт, контроль |

---

## Обновление KeyDecisions.md

Нужно обновить пункты в KeyDecisions.md согласно выбранным решениям:

- Пункт 19: Миграции ClickHouse - SQL-скрипты + кастомный скрипт
- Пункт 22: PDF генерация - Puppeteer
- Пункт 12: Mem0 - Docker контейнер
- Пункт 13: Langfuse - Cloud
- Пункт 14: Ollama - localhost:11434 (уже на ПК)
- Пункт 25: Дедупликация транзакций - Cockateil Retry
- Пункт 23: WebSocket Reconnect - Exponential Backoff + Circuit Breaker
