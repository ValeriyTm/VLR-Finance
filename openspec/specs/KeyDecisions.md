# Ключевые архитектурные решения VLR Finance

## 1. Архитектура микрофронтов

**Решение**: Module Federation 2.0 + FSD

**Детали**:
- Host App (Next.js) - контейнер для загрузки микрофронтов
- Микрофронты: auth-profile-mf, terminal-mf, portfolio-mf, ai-copilot-mf
- Каждый микрофронт изолирован, можно запускать отдельно
- Внутри каждого микрофронта - FSD методология (app/entities/features/shared/widgets)
- Shared packages (ui, types, schemas, api-client, utils) вынесены в корень монорепо

**Причина**: Демонстрация навыков работы с микрофронтами, возможность запускать вертикали отдельно

---

## 2. Монорепо

**Решение**: Turborepo + pnpm workspaces

**Структура**:
- apps/ - микрофронты (Next.js) и микросервисы (NestJS)
- packages/ - общие пакеты
- infrastructure/ - docker, k8s, скрипты, миграции
- proto/ - gRPC прото-файлы

**Причина**: Современный подход к монорепо, оптимизация сборки через Turborepo

---

## 3. API Gateway и BFF

**Решение**: Двойной слой

- **BFF (Backend for Frontend)**: Реализован в Next.js (Route Handlers)
  - 4 BFF: web, mobile, desktop, pwa
  - web/pwa: работа с куками (HttpOnly, Secure, SameSite=strict)
  - mobile/desktop: проксирование токенов в JSON

- **API Gateway**: Nginx (в docker-compose)
  - В конце проекта заменится на Ingress Controller при переходе в k3s
  - Единственная точка входа в бэкенд

**Причина**: Разделение логики для разных клиентов, защита токенов

---

## 4. Общение между сервисами

**Решение**: gRPC + RabbitMQ

- **gRPC**: Синхронные вызовы между сервисами
  - Auth Service ↔ AI Copilot Service (ValidateUserTariff)
  - Analytics Service ↔ Background Jobs Service (getPortfolioAnalytics)
  - Используется Protobuf для контрактов

- **RabbitMQ**: Асинхронные события и саги
  - Сага Premium purchase: portfolio.balance.deducted → ai.resources.allocated → ai.role.updated
  - Компенсирующие транзакции при сбоях

**Причина**: gRPC для быстрого синхронного обмена, RabbitMQ для надежных асинхронных событий

---

## 5. Брокеры сообщений

**Решение**: Два брокера для разных задач

- **Kafka**: Стриминг и CEP
  - market-ticks (котировки с биржи)
  - market-alerts (аномалии от ksqlDB)
  - portfolio-cdc (CDC из PostgreSQL)
  - system-logs (логи)

- **RabbitMQ**: События и саги
  - portfolio.balance.deducted
  - ai.resources.allocated
  - ai.resources.allocation_failed

**Причина**: Kafka оптимизирован для стриминга (ksqlDB требует Kafka), RabbitMQ проще для саг

---

## 6. CQRS

**Решение**: Разделение на Commands и Queries в Portfolio Service

- **Commands (Write)**: portfolio-service
  - PostgreSQL (OLTP)
  - Prisma ORM
  - ACID транзакции
  - CDC через Debezium в Kafka

- **Queries (Read)**: analytics-service
  - ClickHouse (OLAP)
  - Raw SQL запросы
  - FIFO алгоритм для PnL расчета (O(N) complexity)

**Причина**: Разделение нагрузок, оптимизация производительности аналитики

---

## 7. CDC (Change Data Capture)

**Решение**: Debezium + Kafka Connect

- Debezium слушает WAL-логи PostgreSQL (portfolio-service)
- Перехватывает изменения в таблице транзакций
- Отправляет в топик Kafka portfolio-cdc
- Приемник: ClickHouse (ReplacingMergeTree для дедупликации)

**Причина**: Реальное время синхронизации между OLTP и OLAP

---

## 8. CEP (Complex Event Processing)

**Решение**: ksqlDB

- ksqlDB читает топик Kafka market-ticks
- Вычисляет скользящую среднюю (SMA) в 1-минутном окне
- При отклонении цены > 2% от SMA генерирует событие в market-alerts
- Гарантия Exactly-Once

**Причина**: Мощный инструмент для стриминг-аналитики

---

## 9. Логирование

**Решение**: stdout → Vector → Kafka → ClickHouse/Loki

- Все сервисы пишут логи в stdout/stderr
- Vector перехватывает stdout, парсит JSON, отправляет в Kafka
- Kafka разделяет поток:
  - В ClickHouse: структурированные данные (для метрик и аналитики)
  - В Loki: текстовые логи (для поиска)
- Grafana строит дашборды на основе ClickHouse, поиск логов через Loki

**Причина**: Централизованное логирование, разделение аналитики и поиска

---

## 10. AI Agent (LangGraph)

**Решение**: LangGraph с ветвлением

**Ноды графа**:
1. Redis Memory: последние 10 сообщений сессии
2. Mem0 Memory: долгосрочные факты о пользователе
3. Router: LLM решает (RAG / Tools / Text)
4. RAG pgvector: семантический поиск по документам
5. Generative UI Builder: добавление JSON-маркеров компонентов
6. Mem0 Update: асинхронное извлечение фактов

**LLM**: qwen2.5:3b (через Ollama)
**Embeddings**: nomic-embed-text (через Ollama)

**Причина**: Современный подход к AI агентам, демонстрация навыков

---

## 11. RAG (Retrieval-Augmented Generation)

**Решение**: pgvector + HNSW индекс

- Отдельная БД PostgreSQL с расширением pgvector (ai-copilot-service)
- Хранение: векторные представления PDF документов (финансовые отчеты, whitepapers)
- Поиск: HNSW индекс для O(log N) сложности
- Векторизация: nomic-embed-text через Ollama

**Причина**: Локальный RAG без облачных сервисов

---

## 12. Долгосрочная память (Mem0)

**Решение**: Mem0 как отдельный Docker контейнер

- Отдельный контейнер с API на http://localhost:8000
- Хранение данных в отдельной БД (Redis или PostgreSQL)
- Использование: запоминание фактов о пользователе (инвестиционные цели, этические ограничения)

**Причина**: Более масштабируемо, промышленный подход, изолированность сервиса

---

## 13. LLM Observability (Langfuse)

**Решение**: Langfuse Cloud

- Использование cloud SDK
- API ключи в .env
- UI доступен через cloud.langfuse.com
- Трейсинг шагов LangGraph
- Метрики качества ответов

**Причина**: Не нужно хостить, автоматические обновления, доступ к расширенным функциям Cloud версии

---

## 14. LLM Models (Ollama)

**Решение**: Ollama уже запущен на ПК, подключение через localhost:11434

- Подключение ai-copilot-service к http://host.docker.internal:11434
- В docker-compose: extra_hosts: - "host.docker.internal:host-gateway"
- Модели: qwen2.5:3b, nomic-embed-text

**Причина**: Уже есть на машине, не нужно запускать отдельный контейнер, экономия ресурсов

---

## 15. S3 Хранилище (MinIO)

**Решение**: Два бакета с разной конфигурацией

**Бакет 1: user-private-data**
- PDF отчеты пользователей
- Private доступ
- Шифрование: SSE-S3 (AES256)
- Выдача через Presigned URL (15 минут TTL)

**Бакет 2: system-analytics-archive**
- Архив логов из Kafka (через Vector)
- Internal/IAM-restricted доступ
- Доступ только у Vector и админа

**Причина**: Безопасность пользовательских данных, разделение доступа

---

## 16. Фоновые задачи (BullMQ)

**Решение**: BullMQ + Redis

- PDF генерация отчетов
- Загрузка в MinIO
- Генерация Presigned URL
- Статус задачи в Redis
- Клиент опрашивает статус через RTK Query

**Причина**: Асинхронная обработка тяжелых задач

---

## 17. Resilience Patterns (Cockateil)

**Решение**: Retry + Timeout + Circuit Breaker + Bulkhead

**Где применяется**:
- AI Copilot → Auth (gRPC): все 4 паттерна
- Analytics → ClickHouse: Retry + Timeout + Bulkhead
- Portfolio → PostgreSQL: Retry (только временные ошибки)
- BFF → Microservices: Retry + Timeout + Circuit Breaker

**Причина**: Защита от каскадных сбоев

---

## 18. Стратегии рендеринга Next.js

**Решение**: Все стратегии (SSR, SSG, CSR, ISR, PPR)

- **SSR**: Profile Settings, Active Sessions, Portfolio Dashboard, Dashboard Layout
- **SSG**: Landing Page, Documentation
- **CSR**: Login, Register, Terminal Dashboard, AI Chat
- **ISR**: Asset Allocation (5 минут revalidate)
- **PPR**: PnL History

**Причина**: Демонстрация всех возможностей Next.js

---

## 19. Миграции ClickHouse

**Решение**: SQL-скрипты + кастомный Node.js скрипт

- Папка infrastructure/migrations/clickhouse/
- SQL файлы с CREATE TABLE
- Node.js скрипт выполняет файлы в алфавитном порядке
- Версионирование через таблицу schema_migrations в ClickHouse

**Причина**: Prisma не поддерживает ClickHouse, простой подход для пет-проекта

---

## 20. Конфигурация окружений

**Решение**: envs/ папка + Zod-валидация

- Папка infrastructure/envs/ с файлами для каждого сервиса
- docker-compose использует env_file
- Внутри каждого сервиса: Zod-валидация при старте (serverEnvSchema)
- При ошибке конфигурации: process.exit(1)

**Причина**: Type-safety, раннее обнаружение ошибок

---

## 21. Переключение стратегий (Market Data)

**Решение**: MARKET_DATA_STRATEGY env variable

- env variable: MARKET_DATA_STRATEGY=live или mock
- LiveMarketStrategy: WebSocket к Binance
- MockMarketStrategy: генератор фейковых тиков
- Переключение через .env в docker-compose

**Причина**: Локальная разработка без интернета

---

## 22. PDF генерация

**Решение**: Puppeteer

- Рендеринг HTML в PDF через Headless Chrome
- Можно использовать существующие CSS стили из проекта
- Docker контейнер с Chromium для background-jobs-service

**Причина**: Позволяет рендерить HTML в PDF (проще верстка), более мощный инструмент для сложных отчетов

---

## 23. WebSocket Reconnect

**Решение**: Exponential backoff + Circuit Breaker

- При разрыве соединения: reconnect с экспоненциальной задержкой (1s, 2s, 4s, ...)
- Circuit Breaker размыкается после 5 неудач в течение 1 минуты
- Максимальное количество попыток: 10

**Причина**: Защита от бесконечных реконнектов

---

## 24. Race condition в саге

**Решение**: Compensating transactions + Dead Letter Queue

- Если сервис падает в середине саги → компенсирующая транзакция
- DLQ в RabbitMQ для обработки сбойных сообщений
- Timeout: 30 секунд на каждый этап саги

**Причина**: Гарантия консистентности при сбоях

---

## 25. Дедупликация транзакций и Retry

**Решение**: Idempotency key + Cockateil Retry

- **Idempotency key**: userId-asset-type-amount-price
- Проверка на существование перед созданием
- Возврат существующей транзакции при дубликате
- **Cockateil Retry**: 3 попытки с детекцией временных ошибок (P503, P500, P08P1, P2002)
- Retry только на временные ошибки

**Причина**: Защита от повторной обработки при retry, стандарт экосистемы Node.js

---

## 26. Обработка ошибок

**Решение**: Глобальный Exception Filter

- Маппинг ошибок Prisma в HTTP статусы (P2025 → 404, P2002 → 409)
- Скрытие стека в production
- Централизованная логика

**Причина**: Единый подход к обработке ошибок

---

## 27. Тестирование

**Решение**: Все уровни тестирования

- **Unit**: Vitest (бизнес-логика, валидация схем, алгоритмы)
- **Integration**: Supertest + Testcontainers (API, БД, Redis)
- **Component**: RTL + MSW (React компоненты)
- **E2E**: Playwright (полные user flows)

**Причина**: Демонстрация всех уровней тестирования

---

## 28. Мониторинг

**Решение**: Prometheus + Grafana + Tempo + Loki

- **Prometheus**: Сбор метрик
- **Grafana**: Дашборды
- **Tempo**: Distributed tracing
- **Loki**: Логирование

**Причина**: Полный observability stack

---

## 29. Запуск вертикалей

**Решение**: Отдельные docker-compose файлы

- docker-compose.base.yaml: базовые сервисы (Redis, Postgres, Kafka, RabbitMQ, MinIO, ClickHouse, Vector, Prometheus, Grafana, Loki)
- docker-compose.v1-auth.yaml: вертикаль 1 (Auth)
- docker-compose.v2-terminal.yaml: вертикаль 2 (Terminal)
- docker-compose.v3-portfolio.yaml: вертикаль 3 (Portfolio)
- docker-compose.v4-ai.yaml: вертикаль 4 (AI)
- docker-compose.v5-jobs.yaml: вертикаль 5 (Jobs)
- docker-compose.full.yaml: все сервисы (для k3s тестов)

**Запуск**: docker-compose -f base.yaml -f v1-auth.yaml up -d

**Причина**: Возможность запускать только нужные вертикали (экономия ресурсов)

---

## 30. Функционал MVP

**Решение**: Реализация в ширину, а не в глубину

- Каждый сервис имеет минимальный функционал (MVP)
- Архитектура предусматривает расширение
- Главная цель: задействовать все технологии хотя бы по минимуму

**Причина**: Пет-проект для демонстрации навыков, не production
