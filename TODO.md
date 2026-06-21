# Mercato — Product Backlog

Items identified during the production-readiness audit that are **not yet implemented**. Prioritize based on business needs.

## Commerce

- [ ] **Promo codes / coupons** — discount engine at cart and checkout
- [ ] **GST / tax line items** — legal compliance for India; tax breakdown on cart, order, and invoice
- [ ] **Product reviews and ratings** — social proof on product pages
- [ ] **Wishlist / save for later** — logged-in user retention
- [ ] **Returns / RMA post-shipment** — return workflow after delivery (currently only pre-fulfillment cancellation)
- [ ] **Invoice / receipt PDF** — downloadable receipts for customers

## Fulfillment & logistics

- [ ] **Shipping carrier integration** — AWB generation, live tracking (currently manual SHIP action only)
- [ ] **Multi-warehouse inventory** — stock per location

## Payments & finance

- [ ] **Multi-refund model** — support multiple partial refunds per payment (`@OneToOne` refund today)
- [ ] **Auto-refund on post-payment inventory failure** — safety net if reservation fails after capture
- [ ] **Fraud checks** — velocity limits, address mismatch signals

## Platform & security

- [ ] **Rate limiting** — auth endpoints and webhooks
- [ ] **Webhook idempotency store** — deduplicate Cashfree event IDs
- [ ] **Admin / security audit log** — immutable trail for sensitive actions
- [ ] **CORS configuration** — explicit allowed origins for browser API calls
- [ ] **Database migrations** — Flyway/Liquibase instead of `ddl-auto=update` in dev

## Frontend

- [ ] **Error boundaries** — graceful fallback when a component crashes
- [ ] **Automated tests** — Vitest + RTL for cart, checkout, auth flows
- [ ] **Route code-splitting** — lazy-load admin/seller dashboards
- [ ] **Analytics events** — funnel tracking (add-to-cart, checkout, payment outcomes)
- [ ] **Password reset flow** — `/reset-password` route (link exists in login UI)
- [ ] **PWA / offline support** — optional service worker

## Observability

- [ ] **Structured metrics** — payment success rate, inventory reconciliation alerts
- [ ] **Full-text product search** — Elasticsearch/OpenSearch beyond keyword filter
