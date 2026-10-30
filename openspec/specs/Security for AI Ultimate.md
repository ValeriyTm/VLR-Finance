## Архитектура Auth

- На фронтенде 4 клиента: веб-клиент (Next.js в виде микрофронтендов), PWA-клиент (Next.js), мобильный клиент (React Native) и десктоп-клиент (Electron). Бэкенд - микросервисы на NestJS.
- Фронтенд взаимодействует с бэкендом через промежуточный слой BFF. Единой точкой входа в бэкенд служит API Gateway, в роли которого выступает Nginx (в самом конце проекта, когда будет происходить упаковка проекта в k3s, то Nginx будет заменен на Ingress Controller).

- На бэкенде реализована единая логика Auth.
- За Auth логику (регистрация, логин, logout, logoutAll, refresh, авторизация) на бэкенде отвечает Auth Service.
- Auth Service на основе данных от клиента генерирует пару jwt-токенов - access (5 мин живет) и refresh (7 дней живет).
- Между фронтендом и бэкендом на Next.js сервере реализуется 4 BFF.
- BFF в случае веб-клиента и PWA-клиента действует так: пользователь отправляет форму логина (POST-запрос с email/password в JSON-теле) на BFF; BFF принимает этот запрос и перенаправляет его через API Gateway в Auth Service; Auth Service проверяет пароль и возвращает на BFF JSON-ответ с access и refresh токенами внутри; BFF записывает эти оба токена в две разные куки (HttpOnly, Secure, SameSite=strict) и отправляет их в браузер клиента.
- В случае мобильного клиента и десктоп-клиента общение между клиентом и бэкендом идет путем обмена токенами, а BFF просто проксирует запрос (параллельно декодируя access токен для оценки срока его жизни, чтобы, не нагружая бэкенд, вернуть 401 ошибку клиенту при устаревшем токене). Мобильные и десктопные приложения передают Refresh Token при запросе обновления в теле запроса.

## Авторизация

- Роли в проекте: USER, PREMIUM, ADMIN.
- Роли USER и PREMIUM на бэкенде проверяем путем декодирования токена ключом бэкенда. Роль ADMIN проверяем так же, но дополнительно осуществляем запрос к БД для уточнения, не была ли она отозвана.
- Создать файл auth-policy в общих пакетах: матрица прав RBAC.

## Подробности реализации Auth и Security

### Фронтенд

- Добавлять "access"-куку к стандатным запросам.
- Чтобы не тащить в проект axios, но задействовать функционал наподобие axios-auth-refresh (если сервер вернул 401, то все следующие запросы ставить на паузу), следует написать кастомную обертку над базовым запросом RTK Query. Для mobile/desktop аналогично: при 401 клиент вызывает refresh endpoint, реализовать queue запросов во время refresh (чтобы не дублировать запросы), после успешного refresh — retry всех поставленных на паузу запросов с новым access токеном, при неудачном refresh — очистка storage + редирект на экран логина.
- Запрет рекурсии для /refresh.
- Публичные формы (регистрация, логин) не триггерят refresh.
- При неудачном refresh: очистка состояния + редирект на форму логина.
- Не рендерить защищённые страницы.
- Формы реализовать через React Hook Form и валидировать через Zod.
- Никакого dangerouslySetInnerHTML без DOMPurify.
- noindex на служебных страницах.
- Хранение refresh токена: React Native — использовать expo-secure-store для iOS/Android secure storage; Electron — использовать electron-store с шифрованием или keytar для системного keychain. Never хранить в plain text AsyncStorage/localStorage. Refresh токен должен быть зашифрован при хранении.

### BFF

- BFF в количестве 4 штук реализуется на Next.js-сервере в виде Route Handlers (/api/bff/web/, /api/bff/mobile/, /api/bff/desktop/, /api/bff/pwa).
- Через middleware Next.js-сервера написать "RouteGuard" и "RoleGuard".
- BFF использует тот же JWT_ACCESS_SECRET, что и Auth Service (хранится в .env каждого BFF). BFF декодирует access токен для оценки срока его жизни (проверка только exp, без полной валидации подписи для производительности).
- Передача токенов в Auth Service: BFF всегда использует Authorization header для access токена. Для web/PWA: BFF читает access_token из куки и ставит Authorization: Bearer <token> в запрос к Auth Service. Для mobile/desktop: BFF проксирует Authorization header от клиента. Refresh токен для web/PWA: BFF читает из куки и передает в теле запроса как { "refreshToken": "..." }. Refresh токен для mobile/desktop: проксируется из тела запроса клиента.

## Бэкенд

- Реализовать валидацю переменных окружения при старте приложения на основе схемы Zod. Для этого ысздать `serverEnvSchema` с валидацией всех секретов (JWT_ACCESS_SECRET, JWT_REFRESH_SECRET и т.д.) При старте сервера следует загрузить .env, провалидировать схемой, а при ошибке — `process.exit(1)`.
- Написать кастомное middleware для логирования HTTP-запросов (входящий запрос с методом, URL, статус-код, время ответа). Логирование осуществлять строго в стандартные потоки вывода (stdout и stderr). При логировании следует маскировать query-параметры и path-сегменты с токенами (маскировать через [REDACTED]), маскировать заголовки authorization и cookie (также через [REDACTED]), не логировать тела auth-роутов, логировать события безопасности (неудачные логины, reuse refresh-токена).
- Подключить пакет Helmet с подобной настройкой: helmet({ crossOriginResourcePolicy: { policy: "cross-origin" }, contentSecurityPolicy: { directives: { ...helmet.contentSecurityPolicy.getDefaultDirectives(), "img-src": ["'self'"], "require-trusted-types-for": ["'script'"], "trusted-types": ["default", "dompurify"], "frame-ancestors": ["'none'"] } }, xFrameOptions: { action: "deny" }, xContentTypeOptions: true, xXssProtection: false }). Если будет CDN для статических файлов (аватарки, изображения), добавить домен в img-src: "img-src": ["'self'", "https://cdn.example.com"].
- Настроить CORS с опциями "corsOptions = {
  origin: process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : [],
  credentials: true,
  optionsSuccessStatus: 200,
  }".
- При работе с Nginx указать app.set("trust proxy", 1).
- Настроить Rate Limiting на двух уровнях: 1. На входе (т.е. в Nginx); 2. На чувствительных роутах каждого микросервиса. Ограничения здесь привязываются не к IP, а к конкретному User ID (из JWT). Внедрить его точечно в двух местах с помощью @nestjs/throttler (с общим хранилищем в Redis) - в Auth Service (POST /api/v1/auth/login: 5 попыток в минуту на IP для неавторизованных, 10 попыток в минуту на userId для авторизованных; POST /api/v1/auth/register: 3 попытки в минуту на IP; POST /api/v1/auth/refresh: 20 попыток в минуту на userId) и в AI Copilot Service (Guard считывает из JWT роль пользователя. Если роль USER — лимит 5 запросов в минуту к ИИ. Если роль PREMIUM — лимит 30 запросов в минуту. Для неавторизованных эндпоинтов использовать IP-адрес (из X-Forwarded-For) с ограничениями. Данные о текущих счетчиках пишутся в Redis).
- Написать интерцептор для отказа от XML-типов с выдачей 415 ошибки.
- Явно зафиксировать лимит тела сообщения для стандартных эндпоинтов (которые не принимают файлы) в коде (express.json({ limit: "100kb" })). Для эндпоинтов, которые принимают файлы, лимит должен до 15mb. Ограничение применять точечно через middleware на конкретных роутах, а не глобально.
- Валидацию всех входящих данных осуществлять при помощи Zod. Где это возможно, использовать общие схемы с фронтендом (проект монорепо). Общие схемы хранить в пакете packages/shared/src/schemas (например, packages/shared/src/schemas/auth.ts, packages/shared/src/schemas/user.ts). Импорт: import { loginSchema } from '@shared/schemas/auth'.
- Если где-то в проекте бэкенд начинает принимать пользовательский ввод для сохранения в БД, то следует подключить бибилотеку DOMPurify и написать рекурсивную функцию для глубокой очистки объектов и массивов.
- Подключить app.use(hpp()).
- Подключить cookie-parser.
- Сгенерировать .env (добавить в .gitignore) с переменными внутри: JWT_ACCESS_SECRET (для генерации использовать команду "openssl rand -base64 32"), JWT_REFRESH_SECRET (для генерации использовать команду "openssl rand -base64 32"), ALLOWED_ORIGINS (ALLOWED_ORIGINS=http://localhost:5173,http://localhost,http://localhost:4173), POSTGRES_USER + POSTGRES_PASSWORD + POSTGRES_DB + POSTGRES_PORT (PostgreSQL для Docker), DATABASE_URL (PosgreSQL для Prisma ORM), NODE_ENV, PORT, REDIS_PORT + REDIS_HOST, LOKI_URL и прочие по необходимости.
- Role в БД: использовать ENUM в Prisma: enum Role { USER, PREMIUM, ADMIN }. Это дает type-safety и валидацию на уровне БД.
- Реализовать хеширование паролей с Argon2id: memoryCost 2^16, timeCost 3, parallelism 4.
- В БД хранить только хеш, никогда не возвращать пароль в ответах.
- Для работы с jwt-форматом использовать @nestjs/jwt. Использовать разные секреты (JWT_ACCESS_SECRET, JWT_REFRESH_SECRET). Payload access токена: `{ sub: userId, jti: randomUUID, role: USER|PREMIUM|ADMIN, iat: timestamp, exp: timestamp (текущее + 5 мин) }`. Payload refresh токена: `{ sub: userId, jti: randomUUID, family: randomUUID (tokenFamily для breach detection), iat: timestamp, exp: timestamp (текущее + 7 дней) }`. Refresh токен НЕ содержит роль. Верифицировать с `{ algorithms: ["HS256"] }`. Отклонять токены с `alg: none`.
- Реализация сессий в БД (PostgreSQL + Prisma ORM): 1. Создать таблицу `UserSession` с полями: `id`, `userId` `tokenHash` (SHA-256), `tokenFamily` (UUID для breach detection), `version` (инкрементируется при каждом refresh), `nonce` (случайное значение для защиты от replay атак), `rotationAt` (timestamp последней ротации, используется для breach detection), `expiresAt`, `userAgent` (User-Agent заголовок для логирования), `ipAddress` (IP клиента для логирования), `createdAt`, `updatedAt`. 2. Реализовать ротацию в одной транзакции: старый refresh токен помечается как отозванный (обновляется expiresAt на текущее время), создается новая запись с новым jti, version++, тем же tokenFamily, обновленным rotationAt и новым expiresAt. 3. Добавить breach detection: при повторном использовании старого токена (> 10 сек после rotationAt) — отзыв всей token family. 4. Обрабатывать race condition (10-секундное окно для параллельных refresh, т.е. принимать старый токен, если он был выдан в течение 10 секунд до начала ротации). 5. Хранить отозванные сессии до expiresAt (не удалять сразу). 6. Для быстрой проверки активных сессий использовать кэш в Redis: ключ `session:{jti}` с TTL до expiresAt. При logout/logout-all удалять запись из Redis (мгновенный отзыв), PostgreSQL остается источником истины для истории сессий.
- При обновлении refresh-токена следует указать `httpOnly: true`, `secure: NODE_ENV === "production"`, `sameSite: "strict"`, `path: "/api/bff/web/auth"` (для web BFF), `path: "/api/bff/pwa/auth"` (для pwa BFF). Для mobile/desktop BFF куки не используются. Создать единую функцию `setRefreshCookie/clearRefreshCookie` для одинаковых параметров.
- Для защиты от IDOR следует во всех сервисах фильтровать по id юзера (убеждаться, что запрашиваемый ресурс принадлежит текущему пользователю), а для чужих ресурсов возвращать не 403 ошибку, а 404.
- Создать глобальный фильтр исключений, в котором реализовать логику сокрытия стека для продакшена и маппинг ошибок Prisma ((P2025 и т.п.) в 404/409/401).
- Для работы с БД код должен использовать юзера с уровнем привелегий, не позволяющим менять структуру таблиц (принцип минимальных привилегий).
- Для защиты от Prototype Pollution следут отбрасывать ключи "**proto**", "constructor" и "prototype" от юзеров.
- Для защиты от инъекций использовать только Prisma API или tagged templates ($queryRaw/$executeRaw). Никогда не использовать $queryRawUnsafe с конкатенацией.
- Отказ XML (415)
- Для защиты от ReDoS, если нужна проверка через регулярные выражения, то не писать её в бизнес-коде сервиса, а внедрить внутрь схем Zod.
- BullMQ + Redis в фоновом режиме по cron: ежедневная задача по удалению отозванных сессий из PostgreSQL, у которых expiresAt < now (очистка истории). В будущем можно добавить отправку email уведомлений о подозрительной активности и агрегацию статистики использования для аналитики.

## Роуты в BFF:

### Web/PWA (работают с куками)
- POST /api/bff/web/auth/register — Принимает JSON формы, шлет на бэк, при успехе отдает в браузер { "user": {...} }. Токены не возвращает — пользователь должен явно залогиниться.
- POST /api/bff/web/auth/login — Принимает учетные данные, шлет на бэк, превращает токены в куки, возвращает данные юзера.
- POST /api/bff/web/auth/refresh — Не принимает тела. Браузер автоматически прикрепляет куку refresh_token. BFF шлет её на бэк, обновляет куки в браузере.
- POST /api/bff/web/auth/logout — Очищает (стирает) куки access_token и refresh_token в браузере, а также шлет сигнал на бэк для инвалидации сессии в Redis.
- POST /api/bff/web/auth/logout-all — Очищает куки в браузере, шлет сигнал на бэк для инвалидации всех сессий пользователя в Redis.

### Mobile/Desktop (работают с токенами)
- POST /api/bff/mobile/auth/register (и /api/bff/desktop/...) — Возвращает 201 с данными юзера в JSON-теле. Токены не возвращает — пользователь должен явно залогиниться.
- POST /api/bff/mobile/auth/login — Возвращает токены и юзера прямо в JSON-теле.
- POST /api/bff/mobile/auth/refresh — Принимает { "refreshToken": "..." } в теле запроса, возвращает новые токены в JSON.
- POST /api/bff/mobile/auth/logout — Принимает Authorization: Bearer `<Access>` для идентификации пользователя и удаления сессии на бэкенде.
- POST /api/bff/mobile/auth/logout-all — Принимает Authorization: Bearer `<Access>` для идентификации пользователя и удаления всех сессий на бэкенде.


## Роуты на бэкенде (Auth Service):
Сюда запросы перенаправляются от BFF через API Gateway (Nginx). Этот сервис работает только с JSON. Протокол между BFF и Auth Service: HTTP/1.1 или HTTP/2. Nginx rewrite rules: location /api/bff/web/ { proxy_pass http://auth-service/api/v1/; }. Токены передаются как Authorization: Bearer для access, в теле JSON для refresh.
- POST /api/v1/auth/register — Бизнес-логика регистрации (проверка дубликатов, хэширование Argon2, запись в PostgreSQL). Возвращает 201 Created с body { user: { id, username, role, createdAt } }. Не возвращает токены — пользователь должен явно залогиниться после регистрации.
- POST /api/v1/auth/login — Валидация пароля, проверка Rate Limiting (Throttler + Redis), генерация токенов. Для борьбы с Timing Attack: если пользователь не найден в БД — генерируем dummy hash с теми же параметрами Argon2 (memoryCost 2^16, timeCost 3, parallelism 4), сравниваем dummy hash с dummy hash (всегда false), возвращаем одинаковый ответ "Invalid credentials" независимо от того, существует пользователь или нет. Время выполнения должно быть одинаковым для обоих случаев.
- POST /api/v1/auth/refresh — Принимает Refresh-токен, проверяет его валидность. Здесь же срабатывает Breach Detection (проверка jti токена в Redis на предмет повторного использования).
- POST /api/v1/auth/logout — Принимает Authorization: Bearer <Access>, из токена извлекается userId и jti, удаляет соответствующую запись сессии из Redis (отзыв токенов).
- POST /api/v1/auth/logout-all — Принимает Authorization: Bearer <Access>, из токена извлекается userId, удаляет все сессии пользователя из Redis (отзыв всех токенов).


Внутренний gRPC-интерфейс Auth Service (Слушает другие микросервисы):
- gRPC сервис слушает на порту 50051. AI Copilot Service получает адрес через env переменную AUTH_GRPC_URL=auth-service:50051. TLS для gRPC обязателен в production, в development можно без TLS. Рекомендуется mTLS между микросервисами.
- rpc ValidateUserTariff (ValidateUserTariffRequest) returns (ValidateUserTariffResponse) — gRPC-метод, который вызывает AI Copilot Service для проверки лимитов и токена пользователя перед запуском Ollama. Protobuf контракт: message ValidateUserTariffRequest { string access_token = 1; }, message ValidateUserTariffResponse { bool is_valid = 1; string user_id = 2; string role = 3; int32 remaining_limits = 4; }. Auth Service выполняет: 1) криптографическую верификацию токена через @nestjs/jwt, 2) проверку статуса отзыва через Redis (EXISTS session:{jti}), 3) проверку и декремент бизнес-лимитов в Redis (ключ user:limits:{userId}).


## Функционал

- Регистрация: на фронтенде через React-Hook-Form написана форма для регистрации (ввод логина и пароля). Пользовательский ввод валидируется через Zod. Затем данные уходят на сервер, где снова валидируются той же схемой Zod. Создаётся новый юзер в БД PostgreSQL Auth Service. Поля схемы для User: id, username, passwordHash, role (ENUM), createdAt, updatedAt, sessions (массив сессий). Сервер возвращает 201 с данными юзера, токены не возвращает — пользователь должен явно залогиниться.
- Логин: на фронтенде через React-Hook-Form написана форма для входа (ввод логина и пароля). Пользовательский ввод валидируется через Zod. Затем данные уходят на сервер, где снова валидируются той же схемой Zod. Пользователь проверяется по БД. При успехе генерируется пара токенов (access + refresh) и передается в BFF. Реализовать одинаковые ответы для «нет пользователя» и «неверный пароль». Для борьбы с Timing Attack реализовать хэширование введенного пароля даже при отсутствии пользователя в БД (dummy hash).
- Logout: на фронтенде есть 2 кнопки выхода - из аккаунта и из всех аккаунтов (с выводом модального окна для подтверждения действия в обоих случаях). При нажатии кнопки logout запрос уходит на /logout (удаление текущей сессии). При нажатии logout-all запрос уходит на /logout-all (удаление всех сессий юзера). На фронтенде после логаута следует очистить стор, кэш запросов и все персональные данные.

## Прочее

- Контейнеры: наружу только 80/443; сервисы во внутренней сети; контейнеры от непривилегированного пользователя; секреты через env_file, не в образе.

## Тесты безопасности

### Интеграционные тесты API

**Инструмент:** supertest + Vitest
**Что сделать:**

- Для каждого роута: неавторизован → 401, с недостаточной ролью → 403, чужой ресурс → 404, невалидные данные → 400, превышение лимита → 429.

### Unit-тесты сервисов

**Инструмент:** Vitest
**Что проверить:**

- Генерация и верификация jwt-токенов.
- Сессия: ротация, reuse detection, гонка.
- Функционал: логин, логаут с отзывом сессий.

### E2E тесты

**Инструмент:** Playwright
**Что сделать:**

- Регистрация → логин → refresh → logout/logout-all.
