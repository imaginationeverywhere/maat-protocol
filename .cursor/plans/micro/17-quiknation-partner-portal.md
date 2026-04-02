# Epic 17: QuikNation Partner Portal — Revenue Engine

**Priority:** CRITICAL (partners have clients ready to pay)
**Platform:** QuikNation (Auset)
**Description:** Partner-facing portal where agencies, freelancers, and resellers manage their client sites, track commissions, onboard new clients, and get paid. This is the revenue engine — partners are the distribution layer.
**Author:** Dr. Mary McLeod Bethune (Product Owner)

---

## Context

Partners sign up at quiknation.com/partners, get a Stripe Connect account, and start referring clients. They need a dashboard to:
- See their referred clients and site status
- Track commission earnings
- Onboard new clients (requirements intake)
- Access marketing materials
- Manage their Stripe Connect payout settings

**Revenue Model:**
- Partner pricing: $199-$2,999 per client site
- Partner commission: 20% of each sale
- Payment: Auto-split via Stripe Connect or reseller invoice model

---

## Story 17.1: Partner Dashboard — Home

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Clerk auth (already deployed), Stripe Connect (boilerplate pattern)

### Description
Main partner dashboard — the first thing a partner sees after login. Overview of their portfolio, earnings, and quick actions.

### Acceptance Criteria
- [ ] Dashboard page at `/dashboard/partner`
- [ ] Stats cards: Total Clients, Active Sites, Pending Sites, Total Earnings, This Month Earnings
- [ ] Recent activity feed: new client signups, site launches, payouts
- [ ] Quick action buttons: "Add New Client", "View Earnings", "Get Referral Link"
- [ ] Referral link display with copy-to-clipboard
- [ ] Partner tier badge (Starter/Growth/Pro based on client count)
- [ ] Responsive — works on mobile (partners check on phone)
- [ ] Clerk auth guard — only users with `role: partner` access

### Files to Create
```
frontend/src/app/dashboard/partner/
  page.tsx
  layout.tsx
frontend/src/components/partner/
  PartnerStats.tsx
  ActivityFeed.tsx
  ReferralLink.tsx
  QuickActions.tsx
```

---

## Story 17.2: Client Management — Portfolio View

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Story 17.1

### Description
Partners manage their client portfolio — see all referred clients, site status, and actions available for each.

### Acceptance Criteria
- [ ] Client list page at `/dashboard/partner/clients`
- [ ] Table/card view toggle (cards on mobile, table on desktop)
- [ ] Each client shows: business name, site URL, tier, status (building/live/paused), monthly revenue
- [ ] Status badges: "Building" (yellow), "Live" (green), "Paused" (red), "Pending Payment" (orange)
- [ ] Click client to see detail page
- [ ] Search/filter by status, tier, date
- [ ] "Add Client" button → routes to intake form
- [ ] Sort by: newest, revenue, alphabetical

### Files to Create
```
frontend/src/app/dashboard/partner/clients/
  page.tsx
  [clientId]/page.tsx
frontend/src/components/partner/
  ClientList.tsx
  ClientCard.tsx
  ClientDetail.tsx
  ClientFilters.tsx
```

---

## Story 17.3: Client Onboarding — Requirements Intake

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Story 17.2

### Description
Multi-step form where partners onboard new clients. Captures business info, products/services, design preferences, and recommends a tier. This is the /get-started form from the partner's perspective.

### Acceptance Criteria
- [ ] Intake form at `/dashboard/partner/clients/new`
- [ ] 4-step wizard matching the public /get-started form:
  - Step 1: Business info (name, type, description, customers)
  - Step 2: Products & services (count, booking needs, payment status)
  - Step 3: Design preferences (logo upload, colors, style, reference URL)
  - Step 4: Review & tier recommendation (auto-calculated)
- [ ] Auto-tier recommendation based on: product count, booking needs, admin needs
- [ ] Partner can override tier recommendation
- [ ] Partner pricing shown (not direct pricing)
- [ ] Domain search inline (Cloudflare API integration placeholder)
- [ ] Submit creates client record + sends to backend
- [ ] Confirmation page with next steps and timeline
- [ ] Form data persists across steps (Redux or local state)

### Files to Create
```
frontend/src/app/dashboard/partner/clients/new/
  page.tsx
frontend/src/components/partner/intake/
  IntakeWizard.tsx
  BusinessInfoStep.tsx
  ProductsStep.tsx
  DesignStep.tsx
  ReviewStep.tsx
  TierRecommender.tsx
```

---

## Story 17.4: Earnings & Payouts — Commission Tracking

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Stripe Connect (boilerplate pattern)

### Description
Partners track their earnings, see commission breakdown per client, and manage Stripe Connect payout settings.

### Acceptance Criteria
- [ ] Earnings page at `/dashboard/partner/earnings`
- [ ] Earnings overview: Total Earned (all time), This Month, Pending, Next Payout Date
- [ ] Earnings chart: monthly bar chart showing commission trends
- [ ] Per-client commission breakdown table: client name, tier, amount, commission (20%), status (paid/pending)
- [ ] Payout history: date, amount, Stripe transfer ID, status
- [ ] "Manage Payouts" button → Stripe Connect Express dashboard link
- [ ] Commission rate displayed (20% standard)
- [ ] Reseller partners: show invoice-based view instead of auto-split

### Files to Create
```
frontend/src/app/dashboard/partner/earnings/
  page.tsx
frontend/src/components/partner/
  EarningsOverview.tsx
  EarningsChart.tsx
  CommissionBreakdown.tsx
  PayoutHistory.tsx
```

---

## Story 17.5: Partner Backend — GraphQL API

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** None (backend only)

### Description
Backend API for the partner portal — GraphQL schema, Sequelize models, resolvers with Clerk auth.

### Acceptance Criteria
- [ ] Partner model: id, clerk_id, email, name, company_name, partner_type (agency/freelancer/enterprise), tier, commission_rate, stripe_connect_id, referral_code, status
- [ ] ClientSite model: id, partner_id, business_name, site_url, tier, status (building/live/paused/pending_payment), monthly_revenue, created_at
- [ ] Commission model: id, partner_id, client_site_id, amount, commission_amount, stripe_transfer_id, status (pending/paid/failed), created_at
- [ ] GraphQL queries: myPartnerProfile, myClients, myEarnings, myPayouts, clientDetail(id)
- [ ] GraphQL mutations: createClient, updateClient, updatePartnerProfile, requestPayout
- [ ] Auth: All resolvers check `context.auth?.userId` + partner role
- [ ] Stripe Connect integration: create connected account, generate onboarding link, create transfer
- [ ] Referral code generation (unique per partner)

### Files to Create
```
backend/src/features/partner/
  partner.graphql
  partnerResolvers.ts
  partner.service.ts
  stripe-connect.service.ts
backend/src/models/
  Partner.ts
  ClientSite.ts
  Commission.ts
backend/src/migrations/
  YYYYMMDD-create-partner-tables.js
```

---

## Story 17.6: Partner Sign-Up — Public Page

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** None (frontend only, uses Magic Patterns design from docs)

### Description
Public-facing partner sign-up page at /partners. Matches the existing quiknation.com design system. This is Page 3 from the Magic Patterns prompts.

### Acceptance Criteria
- [ ] Partner page at `/partners`
- [ ] Hero: "Partner With Quik Nation" + stat badges (20% Commission, $199-$2,999 per project, Unlimited Referrals)
- [ ] How it works: 3-step cards (Sign Up → Share Link → Get Paid)
- [ ] Payment model section: Auto-Split vs Reseller cards
- [ ] Sign-up form: name, email, phone, company, how heard, payment preference
- [ ] Form submits to backend → creates Clerk user with partner role → triggers n8n workflow
- [ ] Testimonial placeholder section
- [ ] Design: dark purple-black theme (#0a0a12), purple accents (#7c3aed), matching quiknation.com exactly
- [ ] Mobile responsive

### Files to Create
```
frontend/src/app/partners/
  page.tsx
frontend/src/components/partners/
  PartnerHero.tsx
  HowItWorks.tsx
  PaymentModels.tsx
  PartnerSignUpForm.tsx
```

---

## Implementation Notes

**Design System:** All pages use the quiknation.com dark purple-black theme. See `docs/quiknation-magic-patterns-prompts.md` for exact specs.

**Auth Pattern:** Clerk with `role: partner` metadata. Public pages (17.6) don't require auth. Dashboard pages (17.1-17.4) require partner role.

**Stripe Connect Pattern:** Already built in boilerplate — see Annie Malone's patterns in other Herus (FMO, QCR). Express accounts with auto-split.

**n8n Workflows:** Partner onboarding workflow specified in `docs/quiknation-n8n-workflows.md` (Workflow 1). Partner notification workflows needed.
