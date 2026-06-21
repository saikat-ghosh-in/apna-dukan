-- Idempotent patch for existing databases created before the 2026 feature batch.
-- Hibernate ddl-auto=update cannot add NOT NULL columns to populated tables without a DEFAULT.
-- Fresh databases: @ColumnDefault on Order entity lets ddl-auto handle this automatically.

ALTER TABLE order_snapshot
    ADD COLUMN IF NOT EXISTS shipment_email_sent_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE order_snapshot
    ADD COLUMN IF NOT EXISTS tax_amount NUMERIC(15, 2) NOT NULL DEFAULT 0;

ALTER TABLE order_snapshot
    ADD COLUMN IF NOT EXISTS inventory_finalization_failed BOOLEAN NOT NULL DEFAULT FALSE;
