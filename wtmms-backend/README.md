# WTMMS Backend — Spring Boot REST API

Wasana TimberMill Management System — production-ready Spring Boot backend that powers the Angular frontend.

---

## Project Overview

Full REST API backend for a timber mill management system. Covers authentication, user management, inventory, customers, suppliers, sales/orders, notifications, dashboard, reports, and AI demand forecasting.

---

## Requirements

| Tool | Version |
|------|---------|
| Java | 21 (LTS) |
| Maven | 3.9+ |
| IDE | IntelliJ IDEA (recommended) |
| Database | Supabase PostgreSQL |

---

## Configuration

Edit `src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://YOUR_SUPABASE_HOST:5432/postgres
    username: postgres
    password: YOUR_SUPABASE_PASSWORD

jwt:
  secret: 404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
  expiration: 86400000   # 24 hours in milliseconds

server:
  port: 8080
```

### Finding your Supabase connection details

1. Open your Supabase project → **Settings → Database**
2. Copy the **Connection string** (URI format) - postgresql://postgres:[2CDrsdFzk3a0nkoC]@db.hnwlwfsovitvugocisdh.supabase.co:5432/postgres
3. Extract host, port, database name, username, and password
4. The URL format is: `jdbc:postgresql://<host>:<port>/<database>`

> **Important:** Supabase requires SSL. Add `?sslmode=require` to the URL if you get SSL errors:
> `jdbc:postgresql://db.xxxx.supabase.co:5432/postgres?sslmode=require`

---

## Database Setup

### Option A — Automatic (recommended)

`ddl-auto: update` in `application.yml` will create all tables automatically on first startup.

### Option B — Manual SQL

Run `src/main/resources/schema.sql` in your Supabase **SQL Editor** before starting the app.

---

## Running the Project

```bash
# 1. Clone / open the project
cd wtmms-backend

# 2. Configure application.yml with your Supabase credentials

# 3. Build
mvn clean install

# 4. Run
mvn spring-boot:run
```

Or run `WtmmsApplication.java` directly from IntelliJ IDEA.

The application starts on **http://localhost:8080**.

---

## API Documentation (Swagger UI)

Open: **http://localhost:8080/swagger-ui.html**

### Authenticating in Swagger

1. Call `POST /api/auth/login` with your credentials
2. Copy the `token` from the response
3. Click **Authorize** (top right)
4. Enter: `Bearer <your_token>`
5. All secured endpoints are now accessible

### Login Flow

```
POST /api/auth/login
{
  "email": "premasiri@wasana.lk",
  "password": "password"
}
```

Response:
```json
{
  "token": "eyJhbGci...",
  "type": "Bearer",
  "user": { "id": 1, "name": "M.R. Premasiri", "role": "Admin", ... }
}
```

Use the token as `Authorization: Bearer <token>` on all subsequent requests.

---

## Default Accounts

The database is seeded automatically on first startup:

| Name | Email | Password | Role |
|------|-------|----------|------|
| M.R. Premasiri | premasiri@wasana.lk | password | Admin |
| Nuwan Perera | nuwan@wasana.lk | password | BusinessOwner |
| Sandun Jayasinghe | sandun@wasana.lk | password | InventoryManager |
| Isuru Fernando | isuru@wasana.lk | password | SalesManager |
| Malith Rathnayake | malith@wasana.lk | password | InventoryManager |

---

## Role-Based Access Control

| Role | Access |
|------|--------|
| **Admin** | Full access to all endpoints |
| **BusinessOwner** | Read-only: dashboard, inventory, suppliers, customers, orders, reports, AI |
| **InventoryManager** | Full CRUD: inventory, suppliers. Read: dashboard, reports, AI |
| **SalesManager** | Full CRUD: orders, customers. Read: dashboard, reports, AI |

---

## API Endpoints Summary

| Module | Base Path | Methods |
|--------|-----------|---------|
| Auth | `/api/auth` | POST login |
| Users | `/api/users` | GET, POST, PUT, DELETE |
| Profile | `/api/profile` | GET, PUT, PUT password, PUT preferences, PATCH 2fa |
| Inventory | `/api/inventory` | GET, POST, PUT, DELETE + GET alerts |
| Customers | `/api/customers` | GET, POST, PUT, DELETE |
| Suppliers | `/api/suppliers` | GET, POST, PUT, DELETE + GET summary |
| Orders | `/api/orders` | GET, POST, PUT, PATCH status, DELETE + GET summary |
| Notifications | `/api/notifications` | GET, PATCH read, PATCH read-all, GET unread-count |
| Dashboard | `/api/dashboard` | GET |
| Reports | `/api/reports` | GET |
| AI Forecast | `/api/ai/forecast` | GET |

---

## Project Structure

```
src/main/java/com/wasana/wtmms/
├── controller/     REST controllers — one per module
├── service/        Business logic
├── repository/     Spring Data JPA repositories
├── entity/         JPA entities (User, InventoryItem, Customer, Supplier, Order, Notification)
├── dto/            Request/Response DTOs with Bean Validation
├── mapper/         MapStruct mapper (entity ↔ DTO)
├── config/         SecurityConfig, CorsConfig, OpenApiConfig
├── security/       JwtUtil, JwtAuthFilter
├── exception/      GlobalExceptionHandler, custom exceptions
└── util/           DataSeeder (seeds demo data on first run)
```

---

## CORS

Allowed origins (configurable in `CorsConfig.java`):
- `http://localhost:4200` (Angular dev server)
- `http://localhost:3000`

Add your production frontend URL to the list before deploying.

---

## Notes

- Passwords are hashed with **BCrypt**
- JWT tokens expire after **24 hours** (configurable)
- `ddl-auto: update` — safe for development; use `validate` or Flyway in production
- The `DataSeeder` only runs when the `users` table is empty
