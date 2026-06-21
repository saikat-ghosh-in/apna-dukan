# Mercato

Full-stack e-commerce marketplace built with **Spring Boot** (backend) and **React + Vite** (frontend). Live demo: [mercato-in.netlify.app](https://mercato-in.netlify.app)

## Repository structure

This is a **monorepo**. The React app lives in `frontend/`; the Spring Boot API is at the repo root.

```
mercato-backend/          # Spring Boot API (repo root)
├── src/main/java/        # Backend source
├── frontend/             # React + Vite storefront
│   ├── src/
│   └── package.json
├── Dockerfile
└── pom.xml
```

## Tech stack

| Layer | Technologies |
|-------|----------------|
| Backend | Java 17, Spring Boot 3.5, Spring Security (JWT), JPA/Hibernate, PostgreSQL |
| Payments | Cashfree Payment Gateway (webhooks + sync) |
| Frontend | React 19, Vite, Redux Toolkit, Redux Persist, Tailwind CSS, MUI |
| Auth | JWT (user + guest tokens), email verification, role-based access (customer / seller / admin) |

## Architecture overview

```
Browser (React)
    │
    ├─ Guest cart ──► JWT guest token in localStorage
    ├─ Auth ────────► Bearer JWT on /api/*
    └─ Checkout ────► Order capture → Cashfree session → webhook confirms payment
                              │
                              ▼
                    Spring Boot API
                    ├─ Cart reservations (inventory holds)
                    ├─ Order + payment state machine
                    ├─ Seller fulfillment workflow
                    └─ Scheduled jobs (cart cleanup, abandoned orders)
```

### Key flows

1. **Cart** — Items reserve inventory for 45 minutes. Guest carts merge on login.
2. **Checkout** — Order is created with a price snapshot; cart is kept until payment succeeds.
3. **Payment** — Cashfree handles collection; webhooks confirm payment and transfer reservations to the order.
4. **Fulfillment** — Sellers accept, ship, or cancel line items; refunds flow through Cashfree.

## Local development

### Prerequisites

- Java 17+
- Node.js 18+
- PostgreSQL
- Cashfree sandbox credentials
- SMTP server (or Mailhog) for email features

### Backend

```bash
# From repo root
cp .env.example .env   # if present; configure DB, Cashfree, JWT, mail
./mvnw spring-boot:run -Dspring-boot.run.profiles=local
```

API runs at `http://localhost:8080`. Swagger UI is available in non-prod profiles.

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Set `VITE_BACKEND_BASE_URL=http://localhost:8080` in `frontend/.env`.

### Tests

```bash
./mvnw test
```

Unit tests cover order/payment/inventory state transitions. The legacy `@SpringBootTest` context test is disabled without PostgreSQL.

## Environment variables

### Backend (`.env` or profile properties)

| Variable | Purpose |
|----------|---------|
| `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` | PostgreSQL connection |
| `JWT_SECRET` | Signing key for user/guest tokens |
| `CASHFREE_APP_ID`, `CASHFREE_SECRET_KEY` | Payment gateway |
| `FRONTEND_BASE_URL` | Links in transactional emails |
| `MERCATO_EMAIL_FROM` | Sender address for emails |

### Frontend (`frontend/.env`)

| Variable | Purpose |
|----------|---------|
| `VITE_BACKEND_BASE_URL` | API origin |
| `VITE_CASHFREE_MODE` | `sandbox` or `production` |
| `VITE_FREE_SHIPPING_ABOVE` | Free-shipping threshold (INR) |

## Deployment notes

- Backend: Docker image via root `Dockerfile`; configure prod profile (`application-prod.properties`).
- Frontend: Static build from `frontend/` (`npm run build`); deploy `dist/` to Netlify or similar.
- Point Cashfree return URL to `/payment-confirmation` and webhook URL to `/api/public/cashfree/webhook`.

## Product backlog

See [TODO.md](TODO.md) for planned features not yet implemented (coupons, GST, reviews, RMA, etc.).

## License

Private project — all rights reserved.
