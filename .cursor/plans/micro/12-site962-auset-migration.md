# Epic 12: Site962 Migration into Auset Platform

**Priority:** HIGH
**Platform:** QuikNation (Auset)
**Source:** /Volumes/X10-Pro/Native-Projects/Quik-Nation/site962 (Next.js 14, MongoDB, 778 TS files)
**Target:** Auset boilerplate monorepo (backend: Express+GraphQL+PostgreSQL, frontend: Next.js 16)
**Description:** Migrate the production Site962 app from a standalone Next.js+MongoDB stack into the Auset Platform monorepo pattern (Express backend + Next.js frontend + PostgreSQL). Preserve ALL existing features.

---

## Current Site962 Architecture (What Exists)

```
site962/ (Standalone Next.js 14 monolith)
├── app/           # 257 TS files — pages, API routes, server actions
├── components/    # 339 TS files — React components
├── lib/           # 182 TS files — business logic, 30+ Mongoose models, 40+ server actions
├── e2e/           # Playwright tests
├── __tests__/     # Jest tests
├── public/        # Static assets
```

**Stack:** Next.js 14, MongoDB (Atlas), Mongoose, Clerk, Stripe Connect, Stripe Terminal, SendGrid, Twilio, PassKit, UploadThing, S3, Sentry, shadcn/ui

**Features Built:** Events, Venues, POS, Tickets (PassKit), Orders, CRM, Admin Dashboard, DocuSign, Analytics, RBAC, Promo Codes, RSVP

---

## Story 12.1: Site962 Auset Product Config

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Auset Platform core (ausar-engine)

### Description
Create the `.auset.ts` product config for Site962, mapping its existing features to Ausar Engine features.

### Acceptance Criteria
- [ ] Create `backend/src/features/products/site962.auset.ts`
- [ ] Map existing features:
  - core: auth, payments, notifications, crm, file-storage, analytics, search, reviews, webhooks
  - commerce: checkout, product-catalog
  - services: booking (events/venues), document-signatures (DocuSign)
  - engagement: messaging
  - logistics: qr-codes, mobile-wallet (PassKit)
  - ai: chat (Clara), recommendations
  - enterprise: multi-tenant, reporting
- [ ] Payment config: Stripe (platformFeePercent, connectEnabled, terminalEnabled) + Yapit (yapitEnabled, yapitMerchantId, yapitGlobalPayments)
- [ ] Define which features are ACTIVE vs available

### Files to Create
```
backend/src/features/products/site962.auset.ts
```

---

## Story 12.2: Database Migration — MongoDB to PostgreSQL Schema

**Agent-Executable:** YES
**Estimated Scope:** Multi-session (large — 30+ models)
**Dependencies:** Story 12.1

### Description
Migrate 30+ MongoDB/Mongoose models to PostgreSQL/Sequelize schema. Site962 currently uses MongoDB Atlas — the Auset Platform standardizes on PostgreSQL.

### Acceptance Criteria
- [ ] Map all 30+ Mongoose models to Sequelize models:
  - **Core:** User, Organization, OrganizationInvitation, Role, Permission, RolePermission
  - **Events:** Event, EventDocument, EventCollaborator, EventCustomerFollowup, EventAttendant
  - **Venues:** Venue (multi-space support)
  - **Commerce:** Order, Product, ProductOrder, ProductCategory, ProductTemplate, ProductVendor, ProductProvider, ProductTypes
  - **Tickets:** Ticket, TicketIssuanceLog
  - **Financial:** Transaction, OrganizerWallet, TwilioWallet, FeeTemplate, Dispute
  - **CRM:** Campaign, EmailTemplate, EmailDomain, EmailCampaign, AdminCampaign, OrganizerCampaign
  - **POS:** POSDevice
  - **Other:** RSVP, PromoCode, Promoter, PromoterRequests, SMSCampaign, SMSRevenue, APIKeys
  - **Settings:** HomepageSettings, SEOSettings
- [ ] All tables include `tenant_id` for multi-tenant isolation
- [ ] Create Sequelize migrations for each model
- [ ] Create seed data for development
- [ ] Data migration script: MongoDB → PostgreSQL (one-time)

### Files to Create
```
backend/src/database/models/site962/
  (30+ model files)
backend/src/database/migrations/site962/
  (30+ migration files)
backend/src/database/seeds/site962/
  seed-data.ts
backend/scripts/migrate-mongodb-to-postgres.ts
```

---

## Story 12.3: GraphQL Schema — Events & Venues Module

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Story 12.2

### Description
Create GraphQL schema and resolvers for Site962's event and venue management. Currently these are Next.js server actions — migrate to Apollo Server GraphQL.

### Acceptance Criteria
- [ ] Events schema: queries (events, eventById, eventsByVenue, searchEvents), mutations (createEvent, updateEvent, approveEvent, rejectEvent)
- [ ] Venues schema: queries (venues, venueById, venuesNearMe), mutations (createVenue, updateVenue)
- [ ] Event approval workflow: draft → submitted → approved/rejected (with stipulations)
- [ ] Multi-day event support with dynamic pricing
- [ ] Online & physical venue support
- [ ] Multi-space venue configuration
- [ ] Seating chart management
- [ ] All resolvers use `context.auth?.userId` pattern
- [ ] DataLoader for N+1 prevention

### Files to Create
```
backend/src/graphql/schema/modules/site962-events.graphql
backend/src/graphql/schema/modules/site962-venues.graphql
backend/src/graphql/resolvers/site962/
  events-queries.ts
  events-mutations.ts
  venues-queries.ts
  venues-mutations.ts
  dataloaders.ts
```

---

## Story 12.4: GraphQL Schema — POS System Module

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Story 12.2

### Description
Migrate Site962's full POS system to GraphQL. Currently a REST API — convert to Apollo Server with Stripe Terminal integration.

### Acceptance Criteria
- [ ] POS schema: queries (posProducts, posOrders, posDevices, posTransactions)
- [ ] Mutations: createPOSOrder, processPayment (cash, card, terminal), refundOrder
- [ ] Stripe Terminal integration: registerDevice, connectReader, collectPayment
- [ ] Product catalog CRUD with inventory tracking
- [ ] Real-time inventory updates (subscriptions)
- [ ] Multiple payment methods: cash, Stripe card, Stripe Terminal
- [ ] Transaction history and reporting
- [ ] Device management and archival

### Files to Create
```
backend/src/graphql/schema/modules/site962-pos.graphql
backend/src/graphql/resolvers/site962/
  pos-queries.ts
  pos-mutations.ts
  pos-subscriptions.ts
  stripe-terminal.ts
```

---

## Story 12.5: GraphQL Schema — Tickets & PassKit Module

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Story 12.3

### Description
Migrate Site962's PassKit digital ticket system to GraphQL.

### Acceptance Criteria
- [ ] Tickets schema: queries (tickets, ticketById, ticketsByEvent), mutations (issueTicket, reissueTicket, cancelTicket)
- [ ] Multiple price bands per event
- [ ] PassKit integration: Apple Wallet + Google Pay digital passes
- [ ] QR code and PDF417 barcode generation
- [ ] Ticket issuance queue with retry logic
- [ ] Admin ticket reissue functionality
- [ ] Ticket customer tracking and follow-ups

### Files to Create
```
backend/src/graphql/schema/modules/site962-tickets.graphql
backend/src/graphql/resolvers/site962/
  tickets-queries.ts
  tickets-mutations.ts
  passkit-service.ts
```

---

## Story 12.6: GraphQL Schema — Orders & Payments Module

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Story 12.2

### Description
Migrate order management and Stripe Connect payment processing to GraphQL.

### Acceptance Criteria
- [ ] Orders schema: queries (orders, orderById, ordersByUser), mutations (createOrder, refundOrder, updateOrderStatus)
- [ ] Stripe Connect: payment intents, webhook handling, multi-party splits
- [ ] Fee templates: configurable platform fees per event/venue
- [ ] Payment status tracking: pending → processing → completed → refunded
- [ ] Dispute management
- [ ] Revenue reporting per organizer and per venue
- [ ] Yapit payment integration alongside Stripe Connect
- [ ] Payment provider field on all orders/transactions: 'stripe' | 'yapit'
- [ ] Yapit webhook handling for payment confirmations
- [ ] Provider-agnostic payment interface: same API, different providers underneath

### Files to Create
```
backend/src/graphql/schema/modules/site962-orders.graphql
backend/src/graphql/resolvers/site962/
  orders-queries.ts
  orders-mutations.ts
  stripe-webhooks.ts
  yapit-webhooks.ts
  payment-provider-router.ts
  fee-calculator.ts
```

---

## Story 12.7: GraphQL Schema — CRM & Marketing Module

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Story 12.2

### Description
Migrate Site962's CRM tools — campaigns, email templates, customer follow-ups.

### Acceptance Criteria
- [ ] CRM schema: queries (campaigns, templates, followups), mutations (createCampaign, sendCampaign)
- [ ] Email template system with database-stored templates
- [ ] Campaign management: create, schedule, send, track
- [ ] Customer follow-up tracking
- [ ] SMS campaigns via Twilio
- [ ] Admin campaign orchestration
- [ ] Email domain management
- [ ] Open/click tracking metrics

### Files to Create
```
backend/src/graphql/schema/modules/site962-crm.graphql
backend/src/graphql/resolvers/site962/
  crm-queries.ts
  crm-mutations.ts
  campaign-service.ts
  email-template-service.ts
```

---

## Story 12.8: Frontend Migration — Event Pages

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Story 12.3

### Description
Migrate Site962 frontend event pages from server actions to Apollo Client + GraphQL. Adapt to Auset frontend patterns.

### Acceptance Criteria
- [ ] Migrate event discovery page → Apollo `useQuery(GET_EVENTS)`
- [ ] Migrate event detail page → Apollo `useQuery(GET_EVENT_BY_ID)`
- [ ] Migrate event creation form → Apollo `useMutation(CREATE_EVENT)`
- [ ] Migrate event editing → Apollo `useMutation(UPDATE_EVENT)`
- [ ] Event approval workflow UI
- [ ] Event search with filters
- [ ] Preserve all existing functionality
- [ ] Update to Next.js 16 patterns (Auset standard)

### Files to Modify/Create
```
frontend/src/app/site962/events/
  page.tsx
  [eventId]/page.tsx
  create/page.tsx
  edit/[eventId]/page.tsx
frontend/src/components/site962/events/
  EventDiscovery.tsx
  EventDetail.tsx
  EventForm.tsx
  EventApproval.tsx
  EventSearch.tsx
frontend/src/graphql/site962/
  events.queries.ts
  events.mutations.ts
```

---

## Story 12.9: Frontend Migration — POS System

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Story 12.4

### Description
Migrate the full POS frontend from server actions to Apollo Client.

### Acceptance Criteria
- [ ] POS dashboard with product grid
- [ ] Shopping cart with quantity management
- [ ] Payment processing UI: cash, card, terminal
- [ ] Stripe Terminal reader connection flow
- [ ] Transaction history view
- [ ] Product management CRUD
- [ ] Inventory tracking display
- [ ] Device management

### Files to Create
```
frontend/src/app/site962/pos/
  page.tsx
  products/page.tsx
  transactions/page.tsx
  devices/page.tsx
frontend/src/components/site962/pos/
  POSDashboard.tsx
  ProductGrid.tsx
  ShoppingCart.tsx
  PaymentProcessor.tsx
  TerminalConnection.tsx
  TransactionHistory.tsx
frontend/src/graphql/site962/
  pos.queries.ts
  pos.mutations.ts
```

---

## Story 12.10: Frontend Migration — Admin Dashboard

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Stories 12.3-12.7

### Description
Migrate Site962 admin dashboard — event management, user management, analytics, CRM, POS management, financial reporting.

### Acceptance Criteria
- [ ] Admin layout with sidebar navigation
- [ ] Event management: approve/reject, stipulations
- [ ] User management with RBAC
- [ ] Analytics dashboard with revenue charts (Recharts)
- [ ] CRM tools: campaigns, templates
- [ ] Inventory management
- [ ] Financial reporting
- [ ] Dispute management
- [ ] POS product management
- [ ] Data quality monitoring

### Files to Create
```
frontend/src/app/site962/admin/
  layout.tsx
  page.tsx
  events/page.tsx
  users/page.tsx
  analytics/page.tsx
  crm/page.tsx
  inventory/page.tsx
  financials/page.tsx
  disputes/page.tsx
  pos/page.tsx
```

---

## Story 12.11: Test Migration — Jest & Playwright

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Stories 12.8-12.10

### Description
Migrate existing test suite to work with the new GraphQL-based architecture.

### Acceptance Criteria
- [ ] Migrate Jest unit tests: permissions, orders, admin operations, analytics
- [ ] Update Playwright E2E tests: auth, events, tickets, POS, admin
- [ ] Update test mocks from server actions to GraphQL
- [ ] Maintain >80% coverage threshold
- [ ] Smoke tests for critical paths
- [ ] Regression tests for existing features

### Files to Create/Modify
```
backend/src/__tests__/site962/
  events.spec.ts
  pos.spec.ts
  tickets.spec.ts
  orders.spec.ts
  crm.spec.ts
frontend/e2e/site962/
  events.spec.ts
  pos.spec.ts
  admin.spec.ts
```

---

## Story 12.12: Docker & Deployment Configuration

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** All above stories

### Description
Update Docker and deployment config for Site962 running within the Auset monorepo instead of standalone.

### Acceptance Criteria
- [ ] Docker Compose service for Site962 frontend (port from existing config)
- [ ] Backend shared with Auset backend (GraphQL modules loaded conditionally)
- [ ] MongoDB → PostgreSQL connection swap in all environments
- [ ] Environment variable migration: map existing .env vars to Auset pattern
- [ ] AWS Amplify config update for new frontend structure
- [ ] Health check endpoints preserved
- [ ] Sentry error tracking maintained
- [ ] GA4 tracking maintained
- [ ] Yapit environment variables in .env.example: YAPIT_API_KEY, YAPIT_MERCHANT_ID, YAPIT_ENVIRONMENT

### Files to Modify
```
docker-compose.yml
docker-compose.override.yml
.env.example
infrastructure/amplify/site962.yml
```
