# Epic 13: QuikNation Payment Dashboard — Stripe + Yapit (stripe.quiknation.com)

**Priority:** HIGH
**Platform:** QuikNation (Auset)
**Source:** /Volumes/X10-Pro/Native-Projects/Quik-Nation/quiknation/frontend-stripe (Next.js 15.4.6, port 3020)
**Description:** Complete and enhance the multi-platform payment dashboard that manages payments from BOTH Stripe AND Yapit/YapEX across ALL 10 QuikNation platforms simultaneously. This is the financial nerve center of the entire Auset ecosystem — dual-provider architecture for domestic (Stripe) and global diaspora (Yapit) payment flows.

---

## Current State (What Exists)

```
frontend-stripe/ (Next.js 15.4.6, port 3020)
├── Built pages: invoice payment, dashboard/transactions, dashboard/invoices
├── Access request system, sign-up flow
├── Test connection verification
├── Stripe.js, Socket.io, Redux Persist, Recharts
```

**Backend already has:**
- 10 Stripe platform configurations (I Demand Beauty, QuikBarber, QuikCarry, QuikDelivers, QuikDollars, QuikEvents, QuikHuddle, QuikNation, QuikSession, Site962)
- Invoice models, Transaction models, Payout models
- GraphQL resolvers for invoices and stripe-dashboard
- Stripe webhook handling

**Yapit Integration (NEW):**
- Yapit/YapEX: Black-owned payment platform from the Virgin Islands
- Enables global diaspora payments Stripe cannot handle
- Features: Money In/Out, Quick Pay, Bulk Payout, Escrow, Invoicing, Cards, Liquid Cash API, Commissions
- Dashboard must manage BOTH Stripe and Yapit payment flows
- Provider selector: view data by Stripe, Yapit, or combined
- Sandbox: `https://api.yapit.app/api/merchant/sandbox/v1`
- Production: `https://api.yapit.app/api/merchant/production/v1`
- Currently testing in World Cup Ready alongside Stripe

---

## Story 13.1: Multi-Platform Dashboard Overview

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Backend GraphQL stripe-dashboard module exists

### Description
Build the main dashboard showing aggregated financial data across all 10 platforms from BOTH Stripe and Yapit payment providers.

### Acceptance Criteria
- [ ] Dashboard overview: total revenue, transactions, payouts across all platforms
- [ ] Platform selector: filter by individual platform or view all
- [ ] **Provider selector: Stripe, Yapit, All** — filter/aggregate data by payment provider
- [ ] Revenue chart: daily/weekly/monthly/yearly with platform breakdown (Recharts)
- [ ] Key metrics cards: GMV, platform fees collected, net revenue, payout balance
- [ ] **Yapit-specific metrics:** Escrow balance, Bulk Payout totals, Quick Pay volume
- [ ] Transaction volume chart by platform and by provider
- [ ] Real-time updates via Socket.io subscriptions
- [ ] Date range picker for custom time periods
- [ ] Currency handling (USD primary, multi-currency support)
- [ ] Combined provider view: unified metrics across Stripe + Yapit

### Files to Create/Modify
```
frontend-stripe/src/app/dashboard/
  page.tsx                    # Main overview
  layout.tsx                  # Dashboard layout with sidebar
frontend-stripe/src/components/dashboard/
  DashboardOverview.tsx
  RevenueChart.tsx
  PlatformSelector.tsx
  ProviderSelector.tsx        # NEW: Stripe | Yapit | All toggle
  MetricsCards.tsx
  TransactionVolumeChart.tsx
frontend-stripe/src/graphql/
  dashboard.queries.ts
```

---

## Story 13.2: Transaction Management

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Story 13.1

### Description
Full transaction management view — search, filter, detail, export across all platforms and BOTH payment providers (Stripe and Yapit).

### Acceptance Criteria
- [ ] Transaction list with pagination (server-side)
- [ ] Filters: platform, status (succeeded, pending, failed, refunded), date range, amount range
- [ ] **Filter by provider: Stripe, Yapit, All**
- [ ] **Provider badge on each transaction** (Stripe or Yapit icon) for quick identification
- [ ] Search by: transaction ID, customer email, description
- [ ] Transaction detail view: full charge data, customer info, platform, fees, **provider**
- [ ] Refund flow: initiate full/partial refund with reason (routes to correct provider)
- [ ] Dispute management: view and respond to disputes
- [ ] Export: CSV/Excel download of filtered transactions (includes provider column)
- [ ] Real-time: new transactions appear without page refresh (both Stripe and Yapit)

### Files to Create/Modify
```
frontend-stripe/src/app/dashboard/transactions/
  page.tsx
  [transactionId]/page.tsx
frontend-stripe/src/components/transactions/
  TransactionList.tsx
  TransactionDetail.tsx
  TransactionFilters.tsx
  RefundDialog.tsx
  DisputeManager.tsx
  TransactionExport.tsx
```

---

## Story 13.3: Invoice Management

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Story 13.1

### Description
Complete invoice management — create, send, track, and collect invoices with payment plans.

### Acceptance Criteria
- [ ] Invoice list with status filters (draft, sent, paid, overdue, void)
- [ ] Create invoice: line items, tax, due date, payment plan option
- [ ] Invoice detail: full breakdown, payment history, customer communication
- [ ] Send invoice via email (SendGrid integration)
- [ ] Payment plan support: split invoice into installments
- [ ] Invoice payment page: `/pay/[invoiceId]` (public, no auth needed)
- [ ] Recurring invoices
- [ ] Overdue notifications and reminders
- [ ] Invoice PDF generation
- [ ] Metrics: outstanding AR, average days to pay, collection rate

### Files to Create/Modify
```
frontend-stripe/src/app/dashboard/invoices/
  page.tsx
  create/page.tsx
  [invoiceId]/page.tsx
frontend-stripe/src/app/pay/
  [invoiceId]/page.tsx           # Public payment page
frontend-stripe/src/components/invoices/
  InvoiceList.tsx
  InvoiceDetail.tsx
  CreateInvoiceForm.tsx
  PaymentPlanBuilder.tsx
  InvoicePaymentPage.tsx
  InvoiceMetrics.tsx
```

---

## Story 13.4: Payout Management

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Story 13.1

### Description
Manage payouts to connected accounts across all platforms from BOTH Stripe and Yapit — track disbursements, schedule payouts, view balance, and manage Yapit Bulk Payouts for diaspora recipients.

### Acceptance Criteria
- [ ] Payout list: all payouts across platforms with status, **filterable by provider (Stripe, Yapit, All)**
- [ ] Platform balance view: available, pending, reserved per platform
- [ ] Manual payout trigger (for platforms that aren't on auto-payout)
- [ ] Payout schedule management: daily, weekly, monthly per platform
- [ ] Connected account directory: all Stripe Connect accounts with status
- [ ] **Yapit Bulk Payout management:** create, review, approve, and track bulk payouts to diaspora recipients
- [ ] **Yapit Escrow tracking:** view escrow holds, release conditions, and escrow balance
- [ ] Payout detail: bank info, amount, timeline, failures, **provider**
- [ ] Payout failure handling: retry, update bank info
- [ ] Reconciliation: match payouts with transactions (across both providers)

### Files to Create
```
frontend-stripe/src/app/dashboard/payouts/
  page.tsx
  [payoutId]/page.tsx
frontend-stripe/src/app/dashboard/accounts/
  page.tsx
  [accountId]/page.tsx
frontend-stripe/src/components/payouts/
  PayoutList.tsx
  PayoutDetail.tsx
  PlatformBalances.tsx
  ConnectedAccountDirectory.tsx
  PayoutScheduleManager.tsx
```

---

## Story 13.5: Platform Fee Analytics

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Story 13.1

### Description
Deep analytics on platform fees from BOTH Stripe and Yapit — the revenue engine of QuikNation. Show exactly how much each platform generates in fees across both payment providers.

### Acceptance Criteria
- [ ] Platform fee breakdown: total fees per platform, per month, **per provider**
- [ ] Fee trend charts: growth over time per platform
- [ ] Fee vs GMV ratio per platform
- [ ] Top earning platforms ranking
- [ ] Fee projections: based on current trends, project future revenue
- [ ] Comparison view: platform A vs platform B
- [ ] **Provider fee comparison:** Stripe fees vs Yapit fees side-by-side (processing costs, net margins)
- [ ] **Yapit commission tracking:** Yapit's commission structure and your margins
- [ ] Exportable reports for accounting (includes provider breakdown)
- [ ] Integration with QuikNation investor portal data

### Files to Create
```
frontend-stripe/src/app/dashboard/analytics/
  page.tsx
  fees/page.tsx
  projections/page.tsx
frontend-stripe/src/components/analytics/
  FeeBreakdown.tsx
  FeeTrends.tsx
  PlatformRanking.tsx
  FeeProjections.tsx
  PlatformComparison.tsx
```

---

## Story 13.6: Stripe Connect Onboarding Flow

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Story 13.1

### Description
Streamline the Stripe Connect onboarding for new vendors/organizers/service providers joining any QuikNation platform.

### Acceptance Criteria
- [ ] Onboarding flow: select platform → create Connect account → verify identity → start accepting payments
- [ ] KYC status tracking: pending, verified, requires_action, restricted
- [ ] Document upload for verification
- [ ] Platform-specific onboarding requirements
- [ ] Onboarding progress dashboard for admins
- [ ] Email notifications at each onboarding step
- [ ] Bulk invite: invite multiple vendors to onboard at once

### Files to Create
```
frontend-stripe/src/app/onboarding/
  page.tsx
  [platformId]/page.tsx
  status/page.tsx
frontend-stripe/src/components/onboarding/
  OnboardingWizard.tsx
  KYCStatusTracker.tsx
  DocumentUpload.tsx
  BulkInvite.tsx
```

---

## Story 13.7: Webhook Event Monitor

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Story 13.1

### Description
Real-time webhook event monitoring for BOTH Stripe and Yapit — see every webhook as it arrives from either provider, debug failures, retry failed webhooks.

### Acceptance Criteria
- [ ] Live webhook feed: real-time display of incoming events via Socket.io
- [ ] **Dual-provider feed:** Stripe webhooks AND Yapit webhooks in a unified timeline
- [ ] **Provider indicator** on each event (Stripe or Yapit badge)
- [ ] Event types: Stripe (payment_intent.succeeded, charge.refunded, payout.paid, etc.) AND Yapit (money_in.completed, escrow.released, bulk_payout.processed, etc.)
- [ ] Filter by: platform, event type, status (succeeded, failed), **provider (Stripe, Yapit, All)**
- [ ] Event detail: full webhook payload, processing result, provider source
- [ ] Failed webhook retry button (routes retry to correct provider)
- [ ] Webhook delivery stats: success rate, average latency, **broken down by provider**
- [ ] Alert configuration: notify on specific failure patterns

### Files to Create
```
frontend-stripe/src/app/dashboard/webhooks/
  page.tsx
  [eventId]/page.tsx
frontend-stripe/src/components/webhooks/
  WebhookFeed.tsx
  WebhookDetail.tsx
  WebhookFilters.tsx
  WebhookStats.tsx
  WebhookRetry.tsx
```
