# AGENTS.md - Агентная архитектура генерации проекта VLR Finance

## Обзор

Этот файл определяет архитектуру агентов для генерации проекта VLR Finance. Каждый агент имеет соответствующий skill в `.devin/skills/` и следует глобальным правилам в `.devin/rules/project-rules.md`.

## Структура агентов

### Обязательные агенты

| Агент | Skill | Профиль | Область ответственности |
|-------|-------|---------|-------------------------|
| Frontend Agent | `.devin/skills/frontend-agent/SKILL.md` | subagent_general | Микрофронты (Next.js, Module Federation, FSD) |
| Backend Agent | `.devin/skills/backend-agent/SKILL.md` | subagent_general | Микросервисы (NestJS, gRPC, RabbitMQ, CQRS) |
| Tests Agent | `.devin/skills/tests-agent/SKILL.md` | subagent_general | Все уровни тестирования |
| Auth/Security Agent | `.devin/skills/auth-security-agent/SKILL.md` | subagent_general | Auth-service, безопасность, JWT, RBAC |
| AI Agent | `.devin/skills/ai-agent/SKILL.md` | subagent_general | AI Copilot Service, LangGraph, RAG, Mem0 |
| Infrastructure Agent | `.devin/skills/infrastructure-agent/SKILL.md` | subagent_general | Docker, docker-compose, миграции, инфраструктура |

### Опциональные агенты

| Агент | Skill | Профиль | Область ответственности |
|-------|-------|---------|-------------------------|
| Design Agent | `.devin/skills/design-agent/SKILL.md` | subagent_general | Дизайн-система (Shadcn), адаптивный дизайн |
| API/Docs Agent | - | subagent_general | OpenAPI декораторы, документация |
| Database Agent | - | subagent_general | Prisma схемы, SQL миграции ClickHouse |

### Координация

| Роль | Профиль | Область ответственности |
|------|---------|-------------------------|
| Coordinator | - | subagent_general (или пользователь) | Оркестрация, проверка интеграции, разрешение конфликтов |

---

## Порядок запуска агентов

### Этап 1: Инфраструктура

**Цель**: Создать базовую структуру проекта, настроить Docker, базы данных.

**Запуск агентов**:
```bash
# Запуск Infrastructure Agent
skill invoke infrastructure-agent
```

**Задачи**:
- Создать структуру папок (apps/, packages/, infrastructure/, proto/)
- Создать Dockerfile для всех сервисов
- Создать docker-compose конфигурации (base + verticals)
- Настроить Nginx (API Gateway)
- Настроить MinIO (S3 бакеты)
- Настроить ksqlDB (скрипты инициализации)
- Настроить Debezium (Kafka Connect)
- Настроить Vector (логирование)
- Создать миграции PostgreSQL (Prisma)
- Создать миграции ClickHouse (SQL скрипты + Node.js скрипт)
- Настроить Observability stack (Prometheus, Grafana, Tempo, Loki)

**Проверка**:
- docker-compose.base.yaml должен запускаться без ошибок
- Все контейнеры должны подключаться к нужным БД
- Миграции должны применяться успешно

---

### Этап 2: Бэкенд - Auth и Security

**Цель**: Реализовать auth-service и безопасность всех сервисов.

**Запуск агентов**:
```bash
# Запуск Auth/Security Agent
skill invoke auth-security-agent
```

**Задачи**:
- Реализовать auth-service (регистрация, логин, logout, logout-all)
- Реализовать JWT токены (access, refresh) с rotation
- Реализовать breach detection
- Реализовать rate limiting
- Реализовать RBAC (USER, PREMIUM, ADMIN)
- Реализовать gRPC ValidateUserTariff метод
- Настроить Helmet, CORS, HPP middleware
- Реализовать глобальный exception filter
- Задекорировать все роуты OpenAPI
- Создать RBAC матрицу в packages/schemas

**Проверка**:
- Все Auth API контракты из APIContracts.md должны работать
- gRPC ValidateUserTariff должен работать
- Rate limiting должен работать
- OpenAPI декораторы должны быть на всех роутах

---

### Этап 3: Бэкенд - Основные микросервисы

**Цель**: Реализовать остальные микросервисы.

**Запуск агентов**:
```bash
# Запуск Backend Agent
skill invoke backend-agent
```

**Задачи**:
- Реализовать ingestor-service (WebSocket → Kafka)
- Реализовать portfolio-service (CQRS Commands, PostgreSQL)
- Реализовать analytics-service (CQRS Queries, ClickHouse)
- Реализовать background-jobs-service (BullMQ, PDF генерация)
- Реализовать gRPC серверы и клиенты
- Реализовать RabbitMQ события и саги
- Реализовать компенсирующие транзакции
- Интегрировать Cockateil (resilience patterns)
- Реализовать FIFO алгоритм для PnL расчета

**Проверка**:
- Все gRPC контракты из APIContracts.md должны работать
- RabbitMQ события должны публиковаться и потребляться
- Сага Premium purchase должна работать
- Cockateil patterns должны быть интегрированы

---

### Этап 4: Бэкенд - AI

**Цель**: Реализовать ai-copilot-service и AI инфраструктуру.

**Запуск агентов**:
```bash
# Запуск AI Agent
skill invoke ai-agent
```

**Задачи**:
- Реализовать ai-copilot-service
- Реализовать LangGraph с нодами (Router, RAG, Tools, Memory)
- Интегрировать с Ollama (localhost:11434)
- Реализовать RAG через pgvector + HNSW
- Настроить Mem0 (Docker контейнер)
- Реализовать Generative UI
- Реализовать SSE стриминг
- Защитить от Prompt Injection
- Интегрировать с Langfuse Cloud
- Реализовать gRPC клиент к Auth Service

**Проверка**:
- LangGraph должен выполнять все ноды
- RAG должен работать (семантический поиск)
- SSE стриминг должен работать
- Langfuse Cloud должен получать трейсы

---

### Этап 5: Бэкенд - Базы данных (опционально)

**Цель**: Уточнить схемы и миграции.

**Запуск агентов**:
```bash
# Запуск Database Agent (опционально)
skill invoke database-agent
```

**Задачи**:
- Написать Prisma schema для всех PostgreSQL БД
- Написать SQL миграции для ClickHouse
- Написать Node.js скрипт для миграций ClickHouse
- Оптимизировать SQL запросы (индексы, партиционирование)
- Настроить HNSW индексы в pgvector

**Проверка**:
- Prisma миграции должны применяться
- ClickHouse миграции должны применяться
- Индексы должны быть созданы

---

### Этап 6: Фронтенд

**Цель**: Реализовать микрофронты и shared packages.

**Запуск агентов**:
```bash
# Запуск Frontend Agent
skill invoke frontend-agent
```

**Задачи**:
- Создать host app (контейнер для микрофронтов)
- Настроить Module Federation 2.0
- Реализовать auth-profile-mf
- Реализовать terminal-mf
- Реализовать portfolio-mf
- Реализовать ai-copilot-mf
- Создать shared packages (ui, types, schemas, api-client, utils)
- Настроить RTK Query
- Интегрировать Vercel AI SDK (streaming)
- Реализовать все стратегии рендеринга (SSR, SSG, CSR, ISR, PPR)

**Проверка**:
- Module Federation должен загружать микрофронты
- Все REST API контракты должны работать
- SSE стриминг должен работать
- Стратегии рендеринга должны быть реализованы

---

### Этап 7: Дизайн (опционально)

**Цель**: Настроить дизайн-систему и адаптивный дизайн.

**Запуск агентов**:
```bash
# Запуск Design Agent (опционально)
skill invoke design-agent
```

**Задачи**:
- Настроить Shadcn UI в packages/ui
- Создать общие UI компоненты
- Реализовать адаптивный дизайн для брейкпоинтов:
  - desktop: 1599.98px
  - laptop: 1440.98px
  - laptop-s: 1199.92px
  - tablet: 1023.98px
  - mobile: 767.98px
  - mobile-s: 480.98px
- Следовать дизайн-системе во всех микрофронтах
- Реализовать темизацию (light/dark mode)

**Проверка**:
- Дизайн должен быть консистентным
- Адаптивный дизайн должен работать на всех брейкпоинтах

---

### Этап 8: API/Docs (опционально)

**Цель**: Задекорировать все роуты OpenAPI и создать документацию.

**Запуск агентов**:
```bash
# Запуск API/Docs Agent (опционально)
skill invoke api-docs-agent
```

**Задачи**:
- Задекорировать все REST роуты OpenAPI (@nestjs/swagger)
- Задекорировать gRPC методы (protobuf комментарии)
- Сгенерировать OpenAPI спецификацию
- Настроить Swagger UI
- Создать документацию gRPC контрактов

**Проверка**:
- Swagger UI должен быть доступен
- OpenAPI спецификация должна быть валидна

---

### Этап 9: Тестирование

**Цель**: Написать тесты для всех частей проекта.

**Запуск агентов**:
```bash
# Запуск Tests Agent
skill invoke tests-agent
```

**Задачи**:
- Написать unit тесты (Vitest)
- Написать integration тесты (Supertest + Testcontainers)
- Написать component тесты (RTL + MSW)
- Написать e2e тесты (Playwright)
- Написать security тесты
- Настроить покрытие кода (70%)

**Проверка**:
- Все тесты должны проходить
- Покрытие должно быть >= 70%
- Security тесты должны покрывать все сценарии

---

### Этап 10: Координация и финальная проверка

**Цель**: Проверить интеграцию между частями, разрешить конфликты.

**Запуск**:
- Выполняется Coordinator Agent или пользователем

**Задачи**:
- Проверить соответствие KeyDecisions.md
- Проверить интеграцию между сервисами
- Разрешить конфликты между агентами
- Проверить работу всех вертикалей
- Проверить docker-compose конфигурации
- Финальная проверка проекта

**Проверка**:
- Все вертикали должны запускаться
- Все API контракты должны работать
- Все gRPC контракты должны работать
- Все RabbitMQ события должны работать
- Все Kafka топики должны работать
- Тесты должны проходить

---

## Запуск агентов через Devin CLI

### Запуск одного агента
```bash
# Из корня проекта
skill invoke <agent-name>
```

Примеры:
```bash
skill invoke infrastructure-agent
skill invoke auth-security-agent
skill invoke backend-agent
skill invoke ai-agent
skill invoke frontend-agent
skill invoke tests-agent
```

### Запуск опциональных агентов
```bash
skill invoke design-agent
skill invoke database-agent
skill invoke api-docs-agent
```

---

## Интеграция с .devin/

### Skills
Все агенты используют свои skills из `.devin/skills/`:
- `.devin/skills/frontend-agent/SKILL.md`
- `.devin/skills/backend-agent/SKILL.md`
- `.devin/skills/tests-agent/SKILL.md`
- `.devin/skills/auth-security-agent/SKILL.md`
- `.devin/skills/ai-agent/SKILL.md`
- `.devin/skills/infrastructure-agent/SKILL.md`
- `.devin/skills/design-agent/SKILL.md`

### Rules
Все агенты следуют глобальным правилам из `.devin/rules/project-rules.md`.

---

## Входные данные для агентов

Все агенты читают документы из папки `openspec/specs/`:
- Features.md
- APIContracts.md
- DatabaseSchemas.md
- KeyDecisions.md
- ImplementationDecisions.md
- Structure.md
- Security for AI Ultimate.md
- Details.md
- Architecture.md
- Stack.md

---

## Разрешение конфликтов

### Процесс
1. Если два агента пытаются изменить один и тот же файл → конфликт
2. Coordinator Agent (или пользователь) разрешает конфликт
3. Решение документируется
4. Соответствующий агент вносит изменения

### Примеры конфликтов
- Frontend Agent и Backend Agent изменяют packages/schemas
- Infrastructure Agent и Database Agent изменяют миграции
- Auth/Security Agent и AI Agent изменяют gRPC контракты

---

## Мониторинг прогресса

### Чек-лист для каждого этапа
Для каждого этапа в этом файле есть раздел "Проверка". Используйте его для отслеживания прогресса.

### Логирование
Каждый агент должен логировать свои действия:
- Какие файлы созданы/изменены
- Какие команды выполнены
- Какие ошибки возникли

---

## Примечания

### Параллельная работа
Некоторые агенты могут работать параллельно:
- Backend Agent и AI Agent (после Auth/Security Agent)
- Frontend Agent и Design Agent
- Tests Agent может работать параллельно с другими агентами (для уже написанного кода)

### Итеративный подход
Можно запускать агентов итеративно:
- Сначала Infrastructure Agent (создать структуру)
- Затем Auth/Security Agent (базовый auth)
- Затем Backend Agent (остальные сервисы)
- И так далее

### Откат изменений
Если агент допустил ошибку:
- Откатить изменения через git
- Уточнить инструкцию в skill
- Запустить агента снова

---

## Обновление этого файла

При изменении архитектуры агентов:
1. Обновить этот файл (AGENTS.md)
2. Обновить соответствующие skills в `.devin/skills/`
3. Обновить rules в `.devin/rules/` при необходимости
4. Документировать изменения

---

## Контакты и поддержка

При возникновении проблем:
1. Проверьте соответствие skill и этого файла
2. Проверьте правила в `.devin/rules/project-rules.md`
3. Проверьте входные документы в `openspec/specs/`
4. Обратитесь к Coordinator Agent или пользователю
