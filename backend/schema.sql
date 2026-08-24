-- Run once against Neon PostgreSQL.
CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(128) NOT NULL,
  customer_name VARCHAR(160) NOT NULL,
  phone VARCHAR(32) NOT NULL,
  total NUMERIC(12, 2) NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'Pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  cancelled_at TIMESTAMPTZ NULL,
  cancellation_reason VARCHAR(500) NULL
);
CREATE INDEX IF NOT EXISTS ix_orders_user_id ON orders (user_id);
CREATE INDEX IF NOT EXISTS ix_orders_status ON orders (status);
