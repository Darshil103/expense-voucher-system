-- Expense Voucher Management System — PostgreSQL schema
-- This mirrors the Sequelize models in backend/src/models and is provided
-- for reference / manual setup. Running `npm run migrate` (Sequelize sync)
-- creates these tables automatically.

CREATE TYPE user_role AS ENUM ('employee', 'director', 'accounts');
CREATE TYPE voucher_status AS ENUM ('draft', 'pending_approval', 'approved', 'rejected');

CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(100)  NOT NULL,
    email           VARCHAR(255)  NOT NULL UNIQUE,
    password        VARCHAR(255)  NOT NULL,          -- bcrypt hash
    role            user_role     NOT NULL DEFAULT 'employee',
    employee_code   VARCHAR(50),
    department      VARCHAR(100),
    is_active       BOOLEAN       NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ   NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ   NOT NULL DEFAULT now()
);

CREATE TABLE vouchers (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    voucher_number       VARCHAR(50)    NOT NULL UNIQUE,   -- e.g. EV-2026-000001
    voucher_date         DATE           NOT NULL DEFAULT CURRENT_DATE,
    expense_date         DATE           NOT NULL,
    department_name      VARCHAR(100)   NOT NULL,
    expense_title        VARCHAR(200)   NOT NULL,
    expense_category     VARCHAR(100)   NOT NULL,
    expense_description  TEXT,
    amount               NUMERIC(12,2)  NOT NULL CHECK (amount > 0),

    employee_id          UUID           NOT NULL REFERENCES users(id),
    employee_name        VARCHAR(100)   NOT NULL,          -- denormalized snapshot at creation time
    employee_code        VARCHAR(50),
    employee_signature   VARCHAR(255),                     -- relative path under /uploads

    status               voucher_status NOT NULL DEFAULT 'draft',

    director_signature   VARCHAR(255),
    approved_by          UUID           REFERENCES users(id),
    approval_date        TIMESTAMPTZ,
    rejection_reason     TEXT,
    submitted_at         TIMESTAMPTZ,

    created_at           TIMESTAMPTZ    NOT NULL DEFAULT now(),
    updated_at           TIMESTAMPTZ    NOT NULL DEFAULT now()
);

CREATE INDEX idx_vouchers_status ON vouchers(status);
CREATE INDEX idx_vouchers_employee_id ON vouchers(employee_id);
CREATE INDEX idx_vouchers_voucher_number ON vouchers(voucher_number);
CREATE INDEX idx_vouchers_department ON vouchers(department_name);
CREATE INDEX idx_vouchers_category ON vouchers(expense_category);

-- Business rule notes:
--   * A voucher must be 'draft' to be edited or deleted by its owning employee.
--   * Submitting moves 'draft' -> 'pending_approval' and requires employee_signature.
--   * Only a director can move 'pending_approval' -> 'approved' (requires director_signature)
--     or -> 'rejected' (requires rejection_reason).
--   * Approved/rejected vouchers are permanently read-only via the API.
