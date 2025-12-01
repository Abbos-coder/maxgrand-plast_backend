# 🚀 Landing Backend API

Production-ready backend для управления контентом landing page на **NestJS + TypeScript + PostgreSQL + Docker**.

---

## 📋 Содержание

- [Возможности](#-возможности)
- [Технологический стек](#-технологический-стек)
- [Структура проекта](#-структура-проекта)
- [Быстрый старт](#-быстрый-старт)
- [Переменные окружения](#-переменные-окружения)
- [API Endpoints](#-api-endpoints)
- [Примеры запросов](#-примеры-запросов)
- [Docker](#-docker)
- [Разработка](#-разработка)

---

## ✨ Возможности

- ✅ **CRUD операции** для всех сущностей (Hero Section, About Section, Products, Partners)
- ✅ **Загрузка файлов** с валидацией типов и размеров
- ✅ **TypeORM** с миграциями и entities
- ✅ **Строгая типизация** TypeScript + DTO валидация
- ✅ **Swagger документация** из коробки
- ✅ **Docker** поддержка для production
- ✅ **Логирование** всех HTTP запросов
- ✅ **Обработка ошибок** через global exception filter
- ✅ **Архитектура** по best practices (modules, services, repositories, DTOs)

---

## 🛠 Технологический стек

- **Framework:** NestJS 10.x
- **Language:** TypeScript 5.x
- **Database:** PostgreSQL 16
- **ORM:** TypeORM 0.3.x
- **Validation:** class-validator + class-transformer
- **File Upload:** Multer
- **Documentation:** Swagger (OpenAPI)
- **Containerization:** Docker + Docker Compose

---

## 📁 Структура проекта

```
backend/
├── src/
│   ├── main.ts                      # Точка входа
│   ├── app.module.ts                # Главный модуль
│   ├── config/                      # Конфигурация
│   │   ├── database.config.ts
│   │   └── multer.config.ts
│   ├── common/                      # Общие компоненты
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts
│   │   ├── middleware/
│   │   │   └── logger.middleware.ts
│   │   └── decorators/
│   │       └── api-file.decorator.ts
│   ├── modules/                     # Бизнес-модули
│   │   ├── hero-section/
│   │   ├── about-section/
│   │   ├── products/
│   │   ├── partners/
│   │   └── files/
│   └── database/
│       ├── data-source.ts
│       └── migrations/
├── uploads/                         # Загруженные файлы
├── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## 🚀 Быстрый старт

### 1️⃣ Клонирование и установка зависимостей

```bash
# Клонируйте репозиторий
git clone <your-repo-url>
cd backend

# Установите зависимости
yarn install
```

### 2️⃣ Настройка переменных окружения

Создайте файл `.env` на основе `.env.example`:

```bash
cp .env.example .env
```

Отредактируйте `.env` под ваши нужды.

### 3️⃣ Запуск с Docker (рекомендуется)

```bash
# Запуск всех сервисов
docker-compose up -d

# Просмотр логов
docker-compose logs -f backend

# Остановка
docker-compose down
```

Приложение будет доступно:
- **API:** http://localhost:3000/api
- **Swagger:** http://localhost:3000/api/docs
- **pgAdmin:** http://localhost:5050

### 4️⃣ Запуск локально (без Docker)

```bash
# Убедитесь что PostgreSQL запущен локально

# Запуск миграций
yarn migration:run

# Development режим
yarn start:dev

# Production build
yarn build
yarn start:prod
```

---

## 🔐 Переменные окружения

| Переменная | Описание | По умолчанию |
|-----------|----------|--------------|
| `NODE_ENV` | Режим работы | `development` |
| `PORT` | Порт приложения | `3000` |
| `DB_HOST` | Хост PostgreSQL | `localhost` |
| `DB_PORT` | Порт PostgreSQL | `5432` |
| `DB_USERNAME` | Пользователь БД | `postgres` |
| `DB_PASSWORD` | Пароль БД | `postgres` |
| `DB_DATABASE` | Имя БД | `landing_db` |
| `MAX_FILE_SIZE` | Макс. размер файла (байты) | `5242880` (5MB) |
| `UPLOAD_PATH` | Путь для загрузок | `./uploads` |
| `ALLOWED_FILE_TYPES` | Разрешённые типы файлов | `jpg,jpeg,png,webp` |
| `API_PREFIX` | Префикс API | `api` |
| `SWAGGER_ENABLED` | Включить Swagger | `true` |
| `SWAGGER_PATH` | Путь к Swagger | `api/docs` |

---

## 📡 API Endpoints

### 🦸 Hero Section
- `POST /api/hero-sections` - Создать hero section
- `GET /api/hero-sections` - Получить все hero sections
- `GET /api/hero-sections/:id` - Получить hero section по ID
- `PATCH /api/hero-sections/:id` - Обновить hero section
- `DELETE /api/hero-sections/:id` - Удалить hero section

### 📖 About Section
- `POST /api/about-sections` - Создать about section
- `GET /api/about-sections` - Получить все about sections
- `GET /api/about-sections/:id` - Получить about section по ID
- `PATCH /api/about-sections/:id` - Обновить about section
- `DELETE /api/about-sections/:id` - Удалить about section

### 🛍️ Products
- `POST /api/products` - Создать продукт
- `GET /api/products` - Получить все продукты
- `GET /api/products/:id` - Получить продукт по ID
- `PATCH /api/products/:id` - Обновить продукт
- `DELETE /api/products/:id` - Удалить продукт

### 🤝 Partners
- `POST /api/partners` - Создать партнёра
- `GET /api/partners` - Получить всех партнёров
- `GET /api/partners/:id` - Получить партнёра по ID
- `PATCH /api/partners/:id` - Обновить партнёра
- `DELETE /api/partners/:id` - Удалить партнёра

### 📂 Files
- `POST /api/files/upload` - Загрузить один файл
- `POST /api/files/upload-multiple` - Загрузить несколько файлов

---

## 💡 Примеры запросов

### Создание Hero Section

```bash
curl -X POST http://localhost:3000/api/hero-sections \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Welcome to Our Platform",
    "subtitle": "Build amazing things with us",
    "backgroundVideo": "/uploads/hero-video.mp4"
  }'
```

### Загрузка изображения

```bash
curl -X POST http://localhost:3000/api/files/upload \
  -F "file=@/path/to/image.jpg"
```

### Создание продукта

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Premium Laptop",
    "description": "High-performance laptop",
    "images": ["/uploads/product-1.jpg", "/uploads/product-2.jpg"]
  }'
```

### Получение всех партнёров

```bash
curl -X GET http://localhost:3000/api/partners
```

---

## 🐳 Docker

### Сборка образа

```bash
docker build -t landing-backend .
```

### Запуск с docker-compose

```bash
# Запуск
docker-compose up -d

# Остановка
docker-compose down

# Просмотр логов
docker-compose logs -f

# Пересборка
docker-compose up -d --build
```

### Docker Compose сервисы

1. **postgres** - PostgreSQL 16
2. **backend** - NestJS приложение
3. **pgadmin** - Веб-интерфейс для БД (опционально)

---

## 💻 Разработка

### Миграции

```bash
# Создать миграцию
yarn migration:generate src/database/migrations/CreateTables

# Запустить миграции
yarn migration:run

# Откатить миграцию
yarn migration:revert
```

### Линтинг и форматирование

```bash
# Линтинг
yarn lint

# Форматирование
yarn format
```

### Тестирование

```bash
# Unit тесты
yarn test

# E2E тесты
yarn test:e2e

# Покрытие
yarn test:cov
```

---

## 📝 Swagger документация

После запуска приложения, Swagger UI доступен по адресу:

**http://localhost:3000/api/docs**

Там вы найдёте:
- Все доступные endpoints
- Схемы DTOs
- Возможность тестировать API прямо из браузера

---

## 🔒 Безопасность

- ✅ Валидация всех входных данных через `class-validator`
- ✅ Проверка типов и размеров файлов
- ✅ Строгая типизация TypeScript
- ✅ Environment variables для конфиденциальных данных
- ✅ CORS настроен
- ✅ Helmet для security headers (можно добавить)

---

## 📦 Production Deployment

### Checklist перед деплоем:

1. ✅ Установите `NODE_ENV=production`
2. ✅ Настройте безопасные пароли БД
3. ✅ Отключите Swagger в продакшене (`SWAGGER_ENABLED=false`)
4. ✅ Настройте CORS для вашего фронтенда
5. ✅ Используйте HTTPS
6. ✅ Настройте backup для PostgreSQL
7. ✅ Настройте мониторинг и логирование

---

## 🤝 Контрибьюция

Pull requests приветствуются! Для крупных изменений, пожалуйста, сначала откройте issue.

---

## 📄 Лицензия

MIT

---

## 👨‍💻 Автор

Ваше имя - [GitHub](https://github.com/yourusername)

---

## 🆘 Поддержка

Если у вас возникли проблемы:

1. Проверьте логи: `docker-compose logs -f backend`
2. Убедитесь что PostgreSQL запущен
3. Проверьте переменные окружения
4. Откройте issue на GitHub

---

**Спасибо за использование! 🚀**