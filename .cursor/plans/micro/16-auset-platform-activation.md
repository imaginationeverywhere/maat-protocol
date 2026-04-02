# Epic 16: Make the Auset Platform Actually Work

**Priority:** CRITICAL — Nothing else matters until this works
**Platform:** QuikNation (Auset) — the boilerplate itself
**Description:** Bridge the gap between the Ausar Engine (which works) and actual feature activation. Right now: 47 features registered, 0 active, 0 implementations. After this epic: features can be activated, code loads dynamically, and the platform actually births products.

---

## Current State (Honest)

```
WORKING:
  ausar-engine.ts     ✅ Registers features, resolves dependencies
  maat-validator.ts    ✅ Validates configs
  feature-loader.ts    ✅ Auto-discovers feature.config.ts files
  Ra Intelligence      ✅ Claude API code exists (not wired)
  47 feature configs   ✅ Metadata is complete and correct

NOT WORKING:
  Feature activation   ❌ /auset-activate is a markdown file, not code
  Business logic       ❌ 0 lines of actual feature code behind configs
  Dynamic GraphQL      ❌ Schema is hardcoded, not feature-driven
  Dynamic routes       ❌ Express routes hardcoded, not from features
  Migrations           ❌ Feature migrations never run
  Frontend             ❌ Zero Auset code in frontend/
  Runtime control      ❌ No API to activate/deactivate features
  Existing products    ❌ QuikCarRental, Site962 don't use Auset at all
```

---

## Story 16.1: Feature Activation API

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Ausar Engine exists

### Description
Create the GraphQL API and REST endpoints that actually activate and deactivate features at runtime. This is the missing link — right now nothing ever calls `engine.activate()`.

### Acceptance Criteria
- [ ] GraphQL mutations: `activateFeature(name: String!)`, `deactivateFeature(name: String!)`
- [ ] GraphQL queries: `activeFeatures`, `availableFeatures`, `featureStatus(name: String!)`
- [ ] REST endpoint: `POST /api/features/:name/activate`, `POST /api/features/:name/deactivate`
- [ ] REST endpoint: `GET /api/features` (list all with status)
- [ ] Store active features in database table (`auset_active_features`)
- [ ] On server startup, load active features from DB and call `engine.activate()` for each
- [ ] Maat validation runs before activation — reject if config is invalid
- [ ] Missing env vars check before activation — warn but allow with flag
- [ ] Env var checks must include payment provider vars: Stripe (STRIPE_SECRET_KEY, etc.) AND Yapit (YAPIT_API_KEY, YAPIT_MERCHANT_ID, YAPIT_ENVIRONMENT, YAPIT_WEBHOOK_SECRET)
- [ ] Auth: only SITE_OWNER or ADMIN can activate/deactivate
- [ ] Activation event emitted (for other systems to react)
- [ ] Unit tests with >80% coverage

### Files to Create
```
backend/src/features/activation/
  activation.service.ts
  activation.routes.ts
  activation.schema.graphql
  activation.resolvers.ts
  __tests__/activation.spec.ts
backend/src/database/migrations/
  XXXXXX_create_auset_active_features.ts
backend/src/database/models/
  AusetActiveFeature.ts
```

---

## Story 16.2: Dynamic GraphQL Schema Loading

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Story 16.1

### Description
Make the GraphQL schema load dynamically based on active features. When `checkout` is activated, its GraphQL schema and resolvers are added to Apollo Server.

### Acceptance Criteria
- [ ] Create `DynamicSchemaLoader` that reads active features
- [ ] For each active feature with `graphqlSchema` path, load the .graphql file
- [ ] For each active feature with `graphqlResolvers` path, load the resolver module
- [ ] Merge all active feature schemas into the main Apollo Server schema
- [ ] Handle schema reloading when features are activated/deactivated (Apollo Server restart or schema stitching)
- [ ] Fall back gracefully if a feature's schema file doesn't exist yet (log warning, skip)
- [ ] Base schema (existing hardcoded) always loads
- [ ] Feature schemas extend the base schema
- [ ] Unit tests

### Files to Create
```
backend/src/features/schema-loader/
  dynamic-schema-loader.ts
  schema-merger.ts
  __tests__/schema-loader.spec.ts
```

### Files to Modify
```
backend/src/graphql/schema/index.ts  — integrate DynamicSchemaLoader
backend/src/index.ts                 — use dynamic schema on startup
```

---

## Story 16.3: Dynamic Route Registration

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Story 16.1

### Description
Make Express routes load dynamically based on active features. When `checkout` is activated, its REST routes are registered.

### Acceptance Criteria
- [ ] Create `DynamicRouteLoader` that reads active features
- [ ] For each active feature with `routes[]`, load and register the route module
- [ ] For each active feature with `middlewares[]`, load and register middleware
- [ ] Routes registered under `/api/features/{featureName}/` namespace to avoid conflicts
- [ ] Route deregistration when feature is deactivated (or full server restart)
- [ ] Graceful fallback if route file doesn't exist yet (log warning, skip)
- [ ] Existing hardcoded routes continue to work (backward compatible)
- [ ] Unit tests

### Files to Create
```
backend/src/features/route-loader/
  dynamic-route-loader.ts
  __tests__/route-loader.spec.ts
```

### Files to Modify
```
backend/src/index.ts — integrate DynamicRouteLoader after static routes
```

---

## Story 16.4: Feature Migration Runner

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Story 16.1

### Description
When a feature is activated, run its database migrations. Track which migrations have been applied per feature.

### Acceptance Criteria
- [ ] Create `FeatureMigrationRunner` that reads feature's `migrations[]` array
- [ ] Migration tracking table: `auset_feature_migrations` (feature_name, migration_file, applied_at)
- [ ] On activation: run any unapplied migrations for the feature
- [ ] On deactivation: optionally rollback migrations (with --force flag, not default)
- [ ] Migrations run against ALL environments per CLAUDE.md rules (.env.local, .env.develop, .env.production)
- [ ] Dry-run mode: show what migrations would run without executing
- [ ] Migration file convention: `backend/src/features/{category}/{feature}/migrations/`
- [ ] Error handling: if migration fails, rollback and report
- [ ] Unit tests

### Files to Create
```
backend/src/features/migration-runner/
  feature-migration-runner.ts
  __tests__/migration-runner.spec.ts
backend/src/database/migrations/
  XXXXXX_create_auset_feature_migrations.ts
backend/src/database/models/
  AusetFeatureMigration.ts
```

---

## Story 16.5: Implement `/auset-activate` as Real Command

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Stories 16.1-16.4

### Description
Make `/auset-activate` a real working Claude Code command that actually activates features — not just a markdown document.

### Acceptance Criteria
- [ ] Rewrite `.claude/commands/auset-activate.md` as an executable command
- [ ] Command flow:
  1. Parse feature name from argument
  2. Call Ausar Engine to resolve dependencies
  3. Run Maat validation on the feature config
  4. Check for missing env vars (warn or block)
  5. Run feature migrations (Story 16.4)
  6. Load GraphQL schema (Story 16.2)
  7. Register routes (Story 16.3)
  8. Update database (Story 16.1)
  9. Report success with Kemetic framing
- [ ] Mirror in `.cursor/commands/auset-activate.md`
- [ ] Error handling: clear messages when something fails
- [ ] `--dry-run` flag: show what would happen without doing it
- [ ] `--force` flag: activate even with missing env vars

### Files to Modify
```
.claude/commands/auset-activate.md  — rewrite as executable command
.cursor/commands/auset-activate.md  — mirror
```

---

## Story 16.6: Implement `/auset-status` Dashboard

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Story 16.1

### Description
Make `/auset-status` show the real state of the platform — active features, health, missing env vars, Maat validation results.

### Acceptance Criteria
- [ ] Show: total features, active features, inactive features
- [ ] Per-category breakdown: core (X/9 active), commerce (X/6 active), etc.
- [ ] Active feature list with health status (passing Maat validation? env vars present?)
- [ ] Missing env vars report
- [ ] Product config status: which products are configured, which features each uses
- [ ] Ausar Engine health: is it running?
- [ ] Ra Intelligence status: is Claude API key configured?
- [ ] Kemetic framing throughout
- [ ] Mirror in `.cursor/commands/auset-status.md`

### Files to Create/Modify
```
.claude/commands/auset-status.md   — real executable status dashboard
.cursor/commands/auset-status.md   — mirror
```

---

## Story 16.7: Extract QuikCarRental Features into Ausar

**Agent-Executable:** YES
**Estimated Scope:** Multi-session (large)
**Dependencies:** Stories 16.1-16.5

### Description
The first REAL test — take the existing hardcoded QuikCarRental code and refactor it to work through the Ausar Engine. This proves the platform actually works.

### Acceptance Criteria
- [ ] Identify all QuikCarRental-specific code in the backend (resolvers, routes, models, services)
- [ ] Move QuikCarRental-specific GraphQL schemas into feature directories
- [ ] Move QuikCarRental-specific resolvers into feature directories
- [ ] Move QuikCarRental-specific routes into feature directories
- [ ] Move QuikCarRental-specific migrations into feature directories
- [ ] Update `quikcarrental.auset.ts` product config to reference real files
- [ ] Test: deactivate a feature → its resolvers/routes disappear
- [ ] Test: reactivate → they come back
- [ ] ALL existing QuikCarRental functionality must continue to work
- [ ] Zero regressions — this is a refactor, not a rewrite

### Files to Move/Modify
```
# Move FROM:
backend/src/graphql/schema/modules/quikcarrental-*.graphql
backend/src/graphql/resolvers/quikcarrental/
backend/src/routes/quikcarrental/
backend/src/models/quikcarrental/

# Move TO:
backend/src/features/core/auth/schema.graphql
backend/src/features/core/auth/resolvers.ts
backend/src/features/core/payments/schema.graphql
backend/src/features/core/payments/resolvers.ts
backend/src/features/services/booking/schema.graphql
(etc. — each feature gets its own schema/resolvers/routes)
```

---

## Story 16.8: Feature Implementation Template & Generator

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Stories 16.1-16.4

### Description
Create a template and generator (Ptah — the divine craftsman) so that populating the 47 feature stubs with real code is fast and consistent.

### Acceptance Criteria
- [ ] Feature template: what every feature needs beyond feature.config.ts
  - `schema.graphql` — GraphQL type definitions and operations
  - `resolvers.ts` — Query/mutation resolvers with auth checks
  - `service.ts` — Business logic
  - `routes.ts` — REST endpoints (optional)
  - `migrations/` — Database migrations
  - `__tests__/` — Unit tests
- [ ] Generator command: `/auset-generate <feature-name>` scaffolds all files from template
- [ ] Generated code follows all patterns: `context.auth?.userId`, DataLoader, Kemetic naming
- [ ] Generated tests have >80% coverage scaffolding
- [ ] Mirror in `.cursor/commands/`

### Files to Create
```
.claude/commands/auset-generate.md
.cursor/commands/auset-generate.md
backend/src/features/_template/
  feature.config.template.ts
  schema.template.graphql
  resolvers.template.ts
  service.template.ts
  routes.template.ts
  __tests__/feature.template.spec.ts
```

---

## Story 16.9: Implement Core Features — Auth (Anpu)

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Story 16.8

### Description
Implement the `auth` feature with real code — Clerk integration, RBAC, multi-tenant. This is the most critical feature — every product needs it.

### Acceptance Criteria
- [ ] GraphQL schema: `me`, `users`, `roles`, `permissions`
- [ ] Resolvers: user CRUD, role assignment, permission checks
- [ ] Service: Clerk webhook sync, JWT validation, role guards
- [ ] Middleware: `requireAuth`, `requireRole`, `requireTenant`
- [ ] Multi-tenant: `tenant_id` on all queries
- [ ] Migrations: users, roles, permissions, role_permissions tables
- [ ] Tests: auth flow, RBAC enforcement, tenant isolation
- [ ] Integrates with existing Clerk setup in the boilerplate

### Files to Create
```
backend/src/features/core/auth/
  schema.graphql
  resolvers.ts
  auth.service.ts
  auth.middleware.ts
  migrations/001_create_auth_tables.ts
  __tests__/auth.spec.ts
```

---

## Story 16.10: Implement Core Features — Payments (Sobek)

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Story 16.9

### Description
Implement the `payments` feature with a **dual-provider pattern** — Stripe Connect (domestic US) AND Yapit/YapEX (global diaspora). The revenue engine must route payments to the correct provider based on geography and transaction type. Yapit is a Black-owned payment platform from the Virgin Islands that connects the global Black diaspora in ways Stripe cannot.

### Acceptance Criteria
- [ ] GraphQL schema: `createPaymentIntent`, `processRefund`, `payouts`, `platformFees`
- [ ] Resolvers: payment processing, refund handling, fee calculation
- [ ] Service: Stripe Connect integration, webhook handling, payout management
- [ ] Platform fee calculation based on product config (`platformFeePercent`)
- [ ] Connected account management
- [ ] Migrations: transactions, payouts, connected_accounts tables
- [ ] Tests: payment flow, fee calculation, webhook processing
- [ ] `PaymentRouter` class: routes payments to Stripe or Yapit based on geography/transaction type
- [ ] `YapitProvider` class: Money In, Money Out, Quick Pay, Bulk Payout, Escrow, Invoicing
- [ ] Provider selection logic: domestic US -> Stripe primary, global/diaspora -> Yapit primary
- [ ] Dual webhook handling: Stripe webhooks AND Yapit webhooks on separate endpoints
- [ ] Environment variables: `YAPIT_API_KEY`, `YAPIT_MERCHANT_ID`, `YAPIT_ENVIRONMENT`, `YAPIT_WEBHOOK_SECRET`
- [ ] Yapit sandbox integration: `https://api.yapit.app/api/merchant/sandbox/v1`
- [ ] Yapit production integration: `https://api.yapit.app/api/merchant/production/v1`
- [ ] Transaction records store `provider` field (stripe | yapit) for unified reporting
- [ ] Fallback logic: if primary provider fails, attempt secondary provider

### Files to Create
```
backend/src/features/core/payments/
  schema.graphql
  resolvers.ts
  payments.service.ts
  payment-router.ts          # Routes to Stripe or Yapit based on geography/transaction
  stripe-provider.ts         # Stripe Connect integration
  stripe-webhooks.ts
  yapit-provider.ts          # Yapit/YapEX: Money In/Out, Quick Pay, Bulk Payout, Escrow, Invoicing
  yapit-webhooks.ts          # Yapit webhook endpoint handler
  fee-calculator.ts
  migrations/001_create_payment_tables.ts
  migrations/002_add_provider_field.ts  # Add provider column (stripe|yapit) to transactions
  __tests__/payments.spec.ts
  __tests__/payment-router.spec.ts
  __tests__/yapit-provider.spec.ts
```

---

## Story 16.11: Implement Core Features — Notifications (Tehuti)

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Story 16.9

### Description
Implement notifications — SMS (Twilio), email (SendGrid), push (Expo), Slack.

### Acceptance Criteria
- [ ] GraphQL schema: `sendNotification`, `notificationPreferences`, `notificationHistory`
- [ ] Service: multi-channel notification router
- [ ] SMS: Twilio integration
- [ ] Email: SendGrid integration with templates
- [ ] Push: Expo push notifications (for mobile)
- [ ] Slack: webhook notifications
- [ ] User preferences: which channels are enabled per user
- [ ] Notification history and delivery tracking
- [ ] Migrations: notifications, notification_preferences tables
- [ ] Tests: routing, delivery, preferences

### Files to Create
```
backend/src/features/core/notifications/
  schema.graphql
  resolvers.ts
  notification.service.ts
  channels/sms.ts
  channels/email.ts
  channels/push.ts
  channels/slack.ts
  migrations/001_create_notification_tables.ts
  __tests__/notifications.spec.ts
```

---

## Story 16.12: Frontend Feature System

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Story 16.1

### Description
Create the frontend counterpart — fetch active features from the backend and conditionally render UI based on what's active.

### Acceptance Criteria
- [ ] Apollo Client hook: `useActiveFeatures()` — fetches active features from backend
- [ ] Feature gate component: `<FeatureGate feature="checkout">` — only renders children if feature is active
- [ ] Feature context provider: wraps app, provides feature state
- [ ] Feature-based navigation: menu items appear/disappear based on active features
- [ ] Feature loading states: show placeholder while checking feature status
- [ ] Admin UI for feature management (shows status, activate/deactivate buttons)
- [ ] Redux Persist: cache active features for instant UI
- [ ] Tests

### Files to Create
```
frontend/src/features/
  useActiveFeatures.ts
  FeatureGate.tsx
  FeatureProvider.tsx
  FeatureNavigation.tsx
  FeatureAdminPanel.tsx
  __tests__/features.spec.ts
frontend/src/graphql/
  features.queries.ts
```
