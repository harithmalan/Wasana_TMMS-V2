-- ============================================================
-- WTMMS Database Schema — Supabase PostgreSQL
-- Run this script once in your Supabase SQL Editor
-- (Hibernate ddl-auto=update will also create tables automatically)
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
    id               BIGSERIAL PRIMARY KEY,
    name             VARCHAR(255)        NOT NULL,
    email            VARCHAR(255)        NOT NULL UNIQUE,
    password         VARCHAR(255)        NOT NULL,
    role             VARCHAR(30)         NOT NULL,
    status           VARCHAR(20)         NOT NULL DEFAULT 'Active',
    last_login       TIMESTAMP,
    avatar           VARCHAR(10),
    phone            VARCHAR(50),
    department       VARCHAR(100),
    two_fa_enabled   BOOLEAN             NOT NULL DEFAULT FALSE,
    email_notifications BOOLEAN          NOT NULL DEFAULT TRUE,
    low_stock_alerts    BOOLEAN          NOT NULL DEFAULT TRUE,
    weekly_reports      BOOLEAN          NOT NULL DEFAULT TRUE,
    ai_forecast_updates BOOLEAN          NOT NULL DEFAULT TRUE,
    language         VARCHAR(100)        DEFAULT 'Sinhala / English (Sri Lanka)',
    timezone         VARCHAR(100)        DEFAULT 'Asia/Colombo (UTC+5:30)',
    date_format      VARCHAR(20)         DEFAULT 'DD/MM/YYYY',
    currency         VARCHAR(100)        DEFAULT 'Sri Lankan Rupee (Rs./LKR)',
    created_at       TIMESTAMP           DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS inventory_items (
    id          VARCHAR(20)     PRIMARY KEY,
    type        VARCHAR(255)    NOT NULL,
    grade       VARCHAR(50)     NOT NULL,
    qty         INTEGER         NOT NULL CHECK (qty >= 0),
    unit        VARCHAR(20)     NOT NULL,
    price       NUMERIC(12, 2)  NOT NULL CHECK (price > 0),
    status      VARCHAR(20)     NOT NULL,
    location    VARCHAR(100)    NOT NULL,
    reorder     INTEGER         NOT NULL CHECK (reorder >= 0),
    created_at  TIMESTAMP       DEFAULT NOW(),
    updated_at  TIMESTAMP       DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS customers (
    id           BIGSERIAL PRIMARY KEY,
    name         VARCHAR(255)    NOT NULL,
    contact      VARCHAR(255)    NOT NULL,
    email        VARCHAR(255)    NOT NULL UNIQUE,
    phone        VARCHAR(50)     NOT NULL,
    city         VARCHAR(100)    NOT NULL,
    total_orders INTEGER         NOT NULL DEFAULT 0,
    total_spend  NUMERIC(14, 2)  NOT NULL DEFAULT 0,
    rating       INTEGER         NOT NULL CHECK (rating BETWEEN 1 AND 5),
    segment      VARCHAR(20)     NOT NULL,
    created_at   TIMESTAMP       DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS suppliers (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(255)    NOT NULL,
    country     VARCHAR(100)    NOT NULL,
    contact     VARCHAR(255)    NOT NULL,
    email       VARCHAR(255)    NOT NULL UNIQUE,
    phone       VARCHAR(50)     NOT NULL,
    rating      DOUBLE PRECISION NOT NULL CHECK (rating BETWEEN 0 AND 5),
    on_time     INTEGER         NOT NULL CHECK (on_time BETWEEN 0 AND 100),
    materials   TEXT            NOT NULL,
    last_order  DATE,
    status      VARCHAR(20)     NOT NULL,
    created_at  TIMESTAMP       DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
    id          VARCHAR(20)     PRIMARY KEY,
    customer    VARCHAR(255)    NOT NULL,
    items       TEXT            NOT NULL,
    amount      NUMERIC(14, 2)  NOT NULL CHECK (amount > 0),
    date        DATE            NOT NULL,
    status      VARCHAR(20)     NOT NULL,
    payment     VARCHAR(20)     NOT NULL,
    created_at  TIMESTAMP       DEFAULT NOW(),
    updated_at  TIMESTAMP       DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
    id          BIGSERIAL PRIMARY KEY,
    type        VARCHAR(30)     NOT NULL,
    title       VARCHAR(255)    NOT NULL,
    message     TEXT            NOT NULL,
    read        BOOLEAN         NOT NULL DEFAULT FALSE,
    user_id     BIGINT          REFERENCES users(id) ON DELETE CASCADE,
    created_at  TIMESTAMP       DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_users_email         ON users(email);
CREATE INDEX IF NOT EXISTS idx_inventory_type      ON inventory_items(type);
CREATE INDEX IF NOT EXISTS idx_inventory_status    ON inventory_items(status);
CREATE INDEX IF NOT EXISTS idx_customers_email     ON customers(email);
CREATE INDEX IF NOT EXISTS idx_suppliers_email     ON suppliers(email);
CREATE INDEX IF NOT EXISTS idx_orders_customer     ON orders(customer);
CREATE INDEX IF NOT EXISTS idx_notifications_user  ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read  ON notifications(read);
