# Epic 15: QuikNation Investor Portal (investors.quiknation.com)

**Priority:** HIGH
**Platform:** QuikNation (Auset)
**Source:** /Volumes/X10-Pro/Native-Projects/Quik-Nation/quiknation/frontend-investors (Next.js 15.4.6, port 3008)
**Description:** Complete and enhance the investor portal — investment opportunities, portfolio management, data room, real-time metrics, communication.

---

## Current State (What Exists)

```
frontend-investors/ (Next.js 15.4.6, port 3008)
├── Auth: Separate Clerk instance for investors
├── Dashboard with analytics subpage
├── Investment opportunities by product
├── Financial tools and portfolio management
├── Messages/communication
├── Documents/data room
├── Timeline visualization
├── Settings/preferences/security
├── Request invitation flow
├── Admin sections: client management, admin settings
├── Technologies: Redux Persist, D3, Recharts, TipTap editor, Socket.io
```

**Backend already has (12+ resolver files):**
- Investment queries: position, timeline, opportunity, portfolio, data-room
- Investment mutations: opportunity, position, data-room operations
- Subscriptions: real-time investment updates
- DataLoaders: batch query optimization
- 18+ models: InvestmentOpportunity, InvestorPosition, InvestmentReturn, DataRoom, etc.

---

## Story 15.1: Investor Dashboard Enhancement

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Backend investment resolvers exist

### Description
Enhance the investor dashboard with real-time portfolio overview, returns tracking, and platform performance metrics.

### Acceptance Criteria
- [ ] Portfolio value card: total invested, current value, total returns
- [ ] Returns chart: monthly/quarterly returns over time (Recharts)
- [ ] Position breakdown: pie chart by platform/product
- [ ] Platform performance table: each product with key metrics
- [ ] Recent activity: latest transactions, dividends, updates
- [ ] News/announcements from QuikNation leadership
- [ ] Real-time updates via Socket.io subscriptions
- [ ] Period selector: MTD, QTD, YTD, All-time
- [ ] Auset Platform story: help investors understand the technology powering everything
- [ ] Revenue tracking across BOTH Stripe and Yapit providers
- [ ] Yapit story for investors: Black-owned payment infrastructure, global diaspora reach

### Files to Create/Modify
```
frontend-investors/src/app/portal/dashboard/
  page.tsx                          # (enhance existing)
  analytics/page.tsx                # (enhance existing)
frontend-investors/src/components/dashboard/
  PortfolioOverview.tsx
  ReturnsChart.tsx
  PositionBreakdown.tsx
  PlatformPerformanceTable.tsx
  InvestorActivityFeed.tsx
  AusetPlatformStory.tsx
```

---

## Story 15.2: Investment Opportunities Explorer

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Story 15.1

### Description
Browse and evaluate investment opportunities across all QuikNation products/Heru — each product is an investment opportunity.

### Acceptance Criteria
- [ ] Opportunity list: all QuikNation products available for investment
- [ ] Opportunity detail: product description, market analysis, competitor comparison, financial projections
- [ ] Per-product data: QuikCarRental competes with Turo (show market size), QuikEvents competes with Eventbrite, etc.
- [ ] Investment tiers: minimum investment, expected returns, timeframe
- [ ] "Invest" flow: express interest, review terms, commit
- [ ] Market size visualization per opportunity
- [ ] Status: open for investment, fully funded, in progress
- [ ] Historical performance for launched products (QuikEvents/Site962, QuikCarRental)

### Files to Create/Modify
```
frontend-investors/src/app/portal/opportunities/
  page.tsx
  [productId]/page.tsx
frontend-investors/src/components/opportunities/
  OpportunityList.tsx
  OpportunityDetail.tsx
  MarketAnalysis.tsx
  InvestmentTiers.tsx
  InvestFlow.tsx
  CompetitorComparison.tsx
```

---

## Story 15.3: Portfolio & Position Management

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Story 15.1

### Description
Detailed portfolio management — view all positions, track returns, transaction history per position.

### Acceptance Criteria
- [ ] Position list: all investor's positions across products
- [ ] Position detail: investment amount, current value, returns (realized/unrealized)
- [ ] Transaction history per position: initial investment, additional investments, dividends, distributions
- [ ] Return calculation: IRR, MOIC, cash-on-cash
- [ ] Position timeline: key milestones for this investment
- [ ] Projected returns based on current platform growth
- [ ] Downloadable position statement (PDF)

### Files to Create/Modify
```
frontend-investors/src/app/portal/portfolio/
  page.tsx
  [positionId]/page.tsx
frontend-investors/src/components/portfolio/
  PositionList.tsx
  PositionDetail.tsx
  ReturnCalculator.tsx
  PositionTimeline.tsx
  PositionStatement.tsx
```

---

## Story 15.4: Data Room (Secure Document Access)

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Story 15.1

### Description
Secure data room for investor documents — legal agreements, financial reports, pitch decks, audit reports. S3-backed with access control.

### Acceptance Criteria
- [ ] Folder structure: Legal, Financials, Product Decks, Board Minutes, Tax Documents
- [ ] Document viewer: PDF viewer inline, download option
- [ ] Access control: different investors see different documents based on tier
- [ ] Upload tracking: who uploaded, when, version history
- [ ] Watermarking: investor-specific watermarks on sensitive documents
- [ ] Activity log: who viewed what document, when
- [ ] Notification: alert investors when new documents are added
- [ ] NDA tracking: require NDA before accessing certain folders
- [ ] Search across all documents

### Files to Create/Modify
```
frontend-investors/src/app/portal/documents/
  page.tsx                          # (enhance existing)
  [folderId]/page.tsx
  [folderId]/[documentId]/page.tsx
frontend-investors/src/components/documents/
  DataRoomExplorer.tsx
  DocumentViewer.tsx
  AccessControlBadge.tsx
  DocumentActivityLog.tsx
  NDAGate.tsx
```

---

## Story 15.5: Financial Reports & Metrics

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Story 15.1

### Description
Financial reporting for investors — quarterly reports, revenue metrics, growth analytics, projections.

### Acceptance Criteria
- [ ] Quarterly report viewer: formatted financial reports per quarter
- [ ] Revenue dashboard: platform-wide revenue broken down by product
- [ ] Growth metrics: user growth, transaction growth, GMV growth per platform
- [ ] Unit economics: CAC, LTV, churn rate per platform
- [ ] Burn rate and runway (for early-stage products)
- [ ] Financial projections: 12-month, 3-year, 5-year
- [ ] Comparison: projected vs actual performance
- [ ] Exportable: PDF download of any report
- [ ] Clara AI integration: "Summarize Q4 performance" or "Compare QuikCarRental to QuikEvents"
- [ ] Revenue breakdown by payment provider: Stripe vs Yapit
- [ ] Yapit global transaction metrics: international payment volume, diaspora reach
- [ ] Provider diversification narrative for investors: reduced dependency on single provider

### Files to Create/Modify
```
frontend-investors/src/app/portal/financials/
  page.tsx
  reports/[quarter]/page.tsx
  projections/page.tsx
frontend-investors/src/components/financials/
  QuarterlyReport.tsx
  RevenueDashboard.tsx
  GrowthMetrics.tsx
  UnitEconomics.tsx
  ProjectionCharts.tsx
  FinancialExport.tsx
```

---

## Story 15.6: Investor Communication Hub

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Story 15.1

### Description
Secure communication between QuikNation leadership and investors — messages, announcements, Q&A.

### Acceptance Criteria
- [ ] Message center: inbox/sent/drafts
- [ ] Direct messaging to QuikNation leadership
- [ ] Announcement feed: updates from leadership visible to all investors
- [ ] Q&A threads: investors can ask questions, leadership responds
- [ ] File attachments in messages
- [ ] Read receipts
- [ ] Notification preferences: email, push, in-app
- [ ] Real-time messaging via Socket.io
- [ ] Archive: searchable message history

### Files to Create/Modify
```
frontend-investors/src/app/portal/messages/
  page.tsx                          # (enhance existing)
  [threadId]/page.tsx
frontend-investors/src/components/messages/
  MessageCenter.tsx
  MessageThread.tsx
  MessageComposer.tsx
  AnnouncementFeed.tsx
  QAThread.tsx
```

---

## Story 15.7: Investor Onboarding & KYC

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Story 15.1

### Description
Investor onboarding flow — invitation request, KYC verification, accreditation check, agreement signing.

### Acceptance Criteria
- [ ] Request invitation page (existing — enhance)
- [ ] Invitation approval by admin
- [ ] KYC verification flow: identity verification, address verification
- [ ] Accredited investor certification (SEC requirements)
- [ ] Investment agreement signing: DocuSign or in-app signature
- [ ] Onboarding status tracker: applied → verified → approved → active
- [ ] Welcome experience: introduction to QuikNation, Auset Platform, investment opportunities
- [ ] Tax document collection: W-9 for US investors

### Files to Create/Modify
```
frontend-investors/src/app/onboarding/
  page.tsx
  kyc/page.tsx
  accreditation/page.tsx
  agreement/page.tsx
  welcome/page.tsx
frontend-investors/src/components/onboarding/
  InvestorOnboarding.tsx
  KYCVerification.tsx
  AccreditationCheck.tsx
  AgreementSigning.tsx
  OnboardingTracker.tsx
```
