# Mercato — build and deploy notes

Operational reference for running the monorepo locally and on the Oracle VM. Not required reading for understanding the architecture — see [README.md](README.md) for that.

## Ports

| Profile | Config file | Port |
|---------|-------------|------|
| `local` | `backend/src/main/resources/application-local.properties` | **8080** (HTTP) |
| `prod` | `backend/src/main/resources/application-prod.properties` | **8443** (HTTPS, PKCS12 keystore) |

There is no `6099` in backend configuration. The Vite dev proxy in `frontend/vite.config.js` targets `http://localhost:8080` to match the `local` profile.

## Backend

From `backend/`:

```bash
mvnw.cmd clean package -DskipTests   # Windows
./mvnw clean package -DskipTests     # Unix
```

Output: `backend/target/mercato-backend.jar` (`finalName` in `pom.xml`).

Run locally (with `backend/.env` or equivalent env vars loaded):

```bash
java -jar target/mercato-backend.jar
```

Production: copy the JAR to the Oracle VM, set `SPRING_PROFILES_ACTIVE=prod` and the env vars referenced in `application-prod.properties`, then register a Windows service (NSSM or `sc create`) running `java -jar mercato-backend.jar`.

### Environment variables (main)

- `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DDL_AUTO`
- `FILE_UPLOAD_DIR` — **absolute path** on the host (e.g. `C:\mercato\uploads` or `/opt/mercato/uploads`). Not relative to the repo or JAR location.
- `FILE_BASE_URL` — public URL prefix for uploaded images
- `CASHFREE_*`, `JWT_SECRET`, `BREVO_*`, `FRONTEND_BASE_URL`, `SSL_KEYSTORE_PATH` (prod)

### Existing database schema (order_snapshot)

Commits after the initial deploy added `shipment_email_sent_at`, `tax_amount`, and `inventory_finalization_failed` on `order_snapshot`. With `ddl-auto=update`, Hibernate adds them automatically on **empty** databases. On a database that already has orders, PostgreSQL rejects `ADD COLUMN ... NOT NULL` without a default — Hibernate logs a warning and the column is never created.

**Fresh clone:** no action needed after the `@ColumnDefault` entity fix (ddl-auto emits `DEFAULT`).

**Existing populated DB:** run once against the target database:

```bash
psql "$DB_URL" -f backend/scripts/patch-order-snapshot-columns.sql
```

## Frontend

From `frontend/`:

```bash
npm install
npm run dev      # local dev, proxies /api → localhost:8080
npm run build    # output in frontend/dist/
```

Deploy `frontend/dist/` to Netlify (or any static host). Set `VITE_API_BASE_URL` to the backend URL the browser should call (prod HTTPS endpoint).

## Tests

From `backend/`:

```bash
mvnw.cmd test
```
