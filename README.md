# Expense Voucher Management System

A full-stack web application that digitizes the employee expense voucher lifecycle — creation, submission, Director approval/rejection, and Accounts Team reimbursement tracking — built as a Full Stack Developer Internship assignment for **Prachay Securities Private Limited (PSPL)**.

## 🎥 Application Walkthrough



https://github.com/user-attachments/assets/b8cf8a46-561d-4050-a860-50a6504488d0

<img width="1600" height="820" alt="WhatsApp Image 2026-08-01 at 12 31 15" src="https://github.com/user-attachments/assets/26bf916d-c0b0-4982-94d8-a09d88e87a68" />
<img width="1600" height="819" alt="WhatsApp Image 2026-08-01 at 12 31 47" src="https://github.com/user-attachments/assets/f778476c-c83b-4ff1-9126-f9f5d0d493bb" />
<img width="1600" height="809" alt="WhatsApp Image 2026-08-01 at 12 32 07" src="https://github.com/user-attachments/assets/963d1b2f-a0a2-4c00-acf9-a6d3ef000c05" />
<img width="1600" height="818" alt="WhatsApp Image 2026-08-01 at 12 32 51" src="https://github.com/user-attachments/assets/9c887818-4608-45c5-9966-60c24e96963c" />
<img width="1600" height="818" alt="WhatsApp Image 2026-08-01 at 12 32 51" src="https://github.com/user-attachments/assets/2764efb8-9af9-4674-9fec-cc36c63ba033" />
<img width="1600" height="825" alt="WhatsApp Image 2026-08-01 at 12 33 44" src="https://github.com/user-attachments/assets/28980cb4-11ee-4557-b3fd-5cd9836aec6d" />
<img width="1600" height="822" alt="WhatsApp Image 2026-08-01 at 12 34 01" src="https://github.com/user-attachments/assets/b476ca9b-95bb-40b0-b769-4c2060d3895f" />
<img width="1600" height="809" alt="WhatsApp Image 2026-08-01 at 12 34 32" src="https://github.com/user-attachments/assets/4bf29fd2-d935-40dc-aa17-b3fd4241cc56" />
<img width="1600" height="821" alt="WhatsApp Image 2026-08-01 at 12 37 11" src="https://github.com/user-attachments/assets/b6fc6852-164e-4fab-a357-dffbab49a10b" />
<img width="1600" height="809" alt="WhatsApp Image 2026-08-01 at 12 37 27" src="https://github.com/user-attachments/assets/86fd5bc1-0169-413d-bdd1-4b9d1434d0b0" />
<img width="1600" height="818" alt="WhatsApp Image 2026-08-01 at 12 37 57" src="https://github.com/user-attachments/assets/5c4f0470-344e-4fc7-aa94-0da56d66822f" />
<img width="1600" height="818" alt="WhatsApp Image 2026-08-01 at 12 37 57" src="https://github.com/user-attachments/assets/21cbcd57-33ef-47a0-a3f8-f52f667df80c" />
<img width="1600" height="820" alt="WhatsApp Image 2026-08-01 at 12 38 16" src="https://github.com/user-attachments/assets/82dabfa1-b9f7-469d-b949-d0e011844c80" />
<img width="1600" height="815" alt="WhatsApp Image 2026-08-01 at 12 39 19" src="https://github.com/user-attachments/assets/c2401c9c-9272-45b8-8cb0-a17cb47dfc9e" />
<img width="1600" height="818" alt="WhatsApp Image 2026-08-01 at 12 40 02" src="https://github.com/user-attachments/assets/70210fd7-9b80-46b2-bc7c-b62a8b52afa7" />

## Tech Stack

| Layer      | Technology |
|------------|------------|
| Frontend   | React 19 (Vite), React Router, Tailwind CSS, Axios, lucide-react |
| Backend    | Node.js, Express.js, Sequelize ORM |
| Database   | PostgreSQL |
| Auth       | JWT (access + refresh tokens), bcrypt password hashing |
| File Upload| Multer (signature images) |
| Validation | express-validator |
| Other      | Helmet, CORS, express-rate-limit, Winston logging, Docker & Docker Compose |

## Project Structure

```
expense-voucher-system/
├── backend/
│   ├── src/
│   │   ├── config/          # env config, Sequelize connection
│   │   ├── models/          # User, Voucher (+ associations)
│   │   ├── controllers/     # auth, voucher, dashboard business logic
│   │   ├── routes/          # Express route definitions
│   │   ├── middleware/      # auth (JWT), role guard, upload, validation, error handler
│   │   ├── validators/      # express-validator rule sets
│   │   ├── utils/           # logger, JWT helpers, voucher-number generator, query builder
│   │   ├── seeders/         # seed.js — demo users + sample voucher
│   │   ├── app.js           # Express app (middleware pipeline)
│   │   └── server.js        # entrypoint — connects DB, starts HTTP server
│   ├── uploads/signatures/  # uploaded signature images (served at /uploads)
│   ├── .env.example
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/             # axios client (with token refresh), auth/voucher/dashboard API calls
│   │   ├── context/         # AuthContext
│   │   ├── components/      # Layout, ProtectedRoute, VoucherTable, FilterBar, StatusStamp, etc.
│   │   ├── pages/
│   │   │   ├── auth/        # Login
│   │   │   ├── employee/    # Dashboard, VoucherForm (create/edit), MyVouchers
│   │   │   ├── director/    # Dashboard, PendingApprovals, AllVouchers
│   │   │   ├── accounts/    # Dashboard, AllVouchers
│   │   │   └── VoucherDetails.jsx  # shared, role-aware detail/approval view
│   │   └── App.jsx          # routes, role-based route guards
│   ├── .env.example
│   └── package.json
├── database/
│   └── schema.sql           # reference PostgreSQL DDL (Sequelize creates this automatically)
├── docker-compose.yml
└── README.md
```

## Getting Started

### Option A — Docker (Postgres + Backend)

```bash
docker compose up --build
```

This starts PostgreSQL and the backend API on `http://localhost:5000`. Then, in a separate terminal, run the frontend locally (see below) since it's not containerized in this setup.

### Option B — Manual Setup

**Prerequisites:** Node.js ≥ 18, PostgreSQL ≥ 13.

#### 1. Database

Create a database (matches `.env` defaults):

```bash
createdb expense_voucher_db
```

#### 2. Backend

```bash
cd backend
cp .env.example .env      # edit DB credentials / JWT secrets if needed
npm install
npm run migrate           # creates tables (Sequelize sync)
npm run seed               # creates one demo user per role + a sample voucher
npm run dev                # starts API on http://localhost:5000
```

**Seeded demo accounts** (password for all: `Password@123`):

| Role     | Email                |
|----------|-----------------------|
| Employee | employee@pspl.com     |
| Director | director@pspl.com     |
| Accounts | accounts@pspl.com     |

#### 3. Frontend

```bash
cd frontend
cp .env.example .env       # points VITE_API_BASE_URL at the backend
npm install
npm run dev                 # starts on http://localhost:5173
```

Open `http://localhost:5173` and log in with any of the seeded accounts above.

## Database Schema

See [`database/schema.sql`](./database/schema.sql) for full DDL. Summary:

- **`users`** — `id (UUID)`, `name`, `email (unique)`, `password (bcrypt hash)`, `role (employee|director|accounts)`, `employee_code`, `department`, `is_active`, timestamps.
- **`vouchers`** — voucher number (auto-generated, format `EV-<year>-<sequence>`), voucher/expense dates, department, title, category, description, amount, employee reference + denormalized name/code/signature, status (`draft|pending_approval|approved|rejected`), director signature, approver reference, approval date, rejection reason, submitted-at timestamp, audit timestamps.
- One-to-many: a `User` (employee) has many `Vouchers`; a `User` (director) can be the `approver` of many `Vouchers`.

## API Documentation

All endpoints are prefixed with `/api`. Protected routes require `Authorization: Bearer <accessToken>`.

### Auth
| Method | Endpoint            | Access | Description |
|--------|----------------------|--------|--------------|
| POST   | `/auth/register`     | Public | Create a user account |
| POST   | `/auth/login`        | Public | Returns `{ user, accessToken, refreshToken }` |
| POST   | `/auth/refresh`      | Public | Exchanges a refresh token for a new access token |
| GET    | `/auth/me`           | Any authenticated user | Current user profile |

### Vouchers
| Method | Endpoint                     | Access             | Description |
|--------|-------------------------------|---------------------|--------------|
| POST   | `/vouchers`                   | Employee            | Create voucher (multipart, `employeeSignature` file) — saved as Draft |
| PUT    | `/vouchers/:id`                | Employee (owner)    | Edit — only while Draft |
| DELETE | `/vouchers/:id`                | Employee (owner)    | Delete — only while Draft |
| POST   | `/vouchers/:id/submit`         | Employee (owner)    | Draft → Pending Approval (requires signature already uploaded) |
| GET    | `/vouchers/mine`               | Employee            | List own vouchers — search/filter/sort/paginate |
| GET    | `/vouchers`                    | Director, Accounts  | List all vouchers — search/filter/sort/paginate |
| GET    | `/vouchers/pending`            | Director            | List vouchers with status `pending_approval` |
| GET    | `/vouchers/:id`                | Role-scoped         | Voucher detail (employee restricted to own) |
| POST   | `/vouchers/:id/approve`        | Director            | Pending → Approved (multipart, `directorSignature` file) |
| POST   | `/vouchers/:id/reject`         | Director            | Pending → Rejected (`rejectionReason` required) |

**List query params:** `voucherNumber`, `employeeName`, `department`, `category`, `status`, `startDate`, `endDate`, `minAmount`, `maxAmount`, `sortBy`, `sortOrder`, `page`, `limit`.

### Dashboard
| Method | Endpoint               | Access   | Description |
|--------|-------------------------|----------|--------------|
| GET    | `/dashboard/employee`   | Employee | Own voucher counts + total approved amount |
| GET    | `/dashboard/director`   | Director | Pending count, approved/rejected today, pending amount, recent activity |
| GET    | `/dashboard/accounts`   | Accounts | Org-wide counts, total approved amount, recently approved vouchers |

## Role-Based Access Control

Enforced server-side (not just hidden in the UI) via JWT + a role-check middleware:

- **Employee** — full CRUD on own Draft vouchers only; read-only once submitted; cannot see other employees' vouchers or approve/reject anything.
- **Director** — full read access to all vouchers, can approve/reject only vouchers in `pending_approval`, cannot edit voucher content.
- **Accounts Team** — read-only access to all vouchers; cannot create, edit, delete, approve, or reject.

## Validation & Business Rules Implemented

- Department, Expense Title, Expense Date, and Amount (> 0) are mandatory on create/update.
- Employee signature required before submission; Director signature required before approval; rejection reason required before rejection.
- Voucher numbers are unique and auto-generated (`EV-<year>-<sequence>`).
- Only Draft vouchers are editable/deletable by their owner; Approved vouchers are permanently read-only.
- Only a Director can transition a voucher out of `pending_approval`.

## Assumptions

1. Since the assignment did not specify a user-management/onboarding screen, `POST /auth/register` is left open for creating accounts of any role for demo/evaluation purposes. In a real deployment this endpoint would be restricted to an admin.
2. "Submitted" and "Pending Approval" from the workflow diagram are modeled as a single status (`pending_approval`), since a voucher becomes pending the moment it's submitted — there's no separate observable state between the two.
3. Employee ID is optional, per the spec; when omitted it's simply left blank on the voucher.
4. Only image files (jpg/jpeg/png/webp) up to 2MB are accepted for signatures.
5. "Download/print vouchers" for Accounts was listed as optional and was not implemented in this pass, in favor of covering every mandatory requirement first — the voucher detail view is print-friendly via the browser's native print (Ctrl/Cmd+P).

## Running Tests / Verifying the Build

The backend was manually smoke-tested end-to-end during development (register/login → create voucher with signature upload → submit → Director approve with signature → appears correctly in Accounts' filtered list), and the frontend was built with `npm run build` to confirm a clean production bundle.







