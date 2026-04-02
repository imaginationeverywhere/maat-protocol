# Epic 14: QuikNation Multi-Tenant Admin Panel (admin.quiknation.com)

**Priority:** HIGH
**Platform:** QuikNation (Auset)
**Source:** /Volumes/X10-Pro/Native-Projects/Quik-Nation/quiknation/frontend-admin (Next.js 15.3.5, port 3010)
**Description:** Complete and enhance the internal admin panel for Quik Nation staff. Content management, investor portal config, client project management, Auset Platform administration.

---

## Current State (What Exists)

```
frontend-admin/ (Next.js 15.3.5, port 3010)
├── Content management: products, investor portal config
├── Invitations system
├── RBAC: SITE_OWNER > SITE_ADMIN > ADMIN > STAFF > CUSTOMER_SERVICE
├── Redux Persist, Tailwind, Radix UI, Apollo Client, dnd-kit
├── Separate Clerk instance (CLERK_SECRET_KEY_ADMIN)
```

**Backend already has:**
- Admin GraphQL module with resolvers
- Content audit trail
- Workspace member management
- Role-based guards

---

## Story 14.1: Admin Dashboard Home

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Backend admin module exists

### Description
Build the main admin dashboard landing page with key metrics across all QuikNation platforms.

### Acceptance Criteria
- [ ] Overview cards: total users, total revenue (all platforms), active platforms, pending approvals
- [ ] Revenue chart: aggregate and per-platform (Recharts)
- [ ] Recent activity feed: latest transactions, user signups, events created
- [ ] Platform health status: each of the 10 platforms — up/down, last activity
- [ ] Quick actions: manage users, view reports, system settings
- [ ] Alert panel: items needing attention (failed webhooks, disputed payments, etc.)
- [ ] Staff online indicator (Socket.io)
- [ ] Revenue from both Stripe AND Yapit shown in aggregate and per-provider

### Files to Create/Modify
```
frontend-admin/src/app/admin/
  page.tsx                      # Dashboard home
  layout.tsx                    # Admin layout with sidebar
frontend-admin/src/components/admin/
  AdminDashboard.tsx
  PlatformHealthStatus.tsx
  RevenueOverview.tsx
  ActivityFeed.tsx
  AlertPanel.tsx
  QuickActions.tsx
```

---

## Story 14.2: Client Project Management

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Story 14.1

### Description
Manage all QuikNation client projects (My Voyages, World Cup Ready, DreamiHairCare, etc.) from the admin panel.

### Acceptance Criteria
- [ ] Client project list: name, status (active, onboarding, paused), platform, Stripe connected
- [ ] Project detail page: contact info, features activated, revenue, technical status
- [ ] Feature activation UI: which Ausar features are active for this client
- [ ] Onboarding checklist: steps to launch a new client project
- [ ] Client revenue tracking: platform fees earned per client
- [ ] Client communication log
- [ ] SLA monitoring: uptime, response time per client
- [ ] GraphQL queries/mutations for project management

### Files to Create
```
frontend-admin/src/app/admin/projects/
  page.tsx
  [projectId]/page.tsx
  create/page.tsx
frontend-admin/src/components/admin/projects/
  ProjectList.tsx
  ProjectDetail.tsx
  ProjectOnboardingChecklist.tsx
  FeatureActivationPanel.tsx
  ClientRevenueChart.tsx
backend/src/graphql/schema/modules/admin-projects.graphql
backend/src/graphql/resolvers/admin/
  projects-queries.ts
  projects-mutations.ts
```

---

## Story 14.3: Auset Feature Registry Admin

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Ausar Engine (backend/src/features/)

### Description
Admin UI for the Ausar Feature Registry — view all 47+ features, their status, which products use them, activate/deactivate.

### Acceptance Criteria
- [ ] Feature list: all 47+ features grouped by category
- [ ] Feature detail: name, description, dependencies, env vars, Neter mapping
- [ ] Status per product: which features are active for which Heru (product)
- [ ] Activate/deactivate feature for a product (calls Ausar Engine)
- [ ] Dependency graph visualization: see how features connect
- [ ] Missing env vars alert: highlight features with missing configuration
- [ ] Feature health: last activation, any errors since activation
- [ ] Maat validation status: pass/fail per feature per product

### Files to Create
```
frontend-admin/src/app/admin/features/
  page.tsx
  [featureName]/page.tsx
frontend-admin/src/components/admin/features/
  FeatureRegistryAdmin.tsx
  FeatureDetailAdmin.tsx
  FeatureStatusByProduct.tsx
  DependencyGraphAdmin.tsx
  EnvVarHealthCheck.tsx
  MaatValidationStatus.tsx
```

---

## Story 14.4: User & Role Management

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Story 14.1

### Description
Manage users across all QuikNation platforms — roles, permissions, tenant assignment.

### Acceptance Criteria
- [ ] User directory: search across all 3 Clerk instances (main, investors, admin)
- [ ] User detail: profile, roles, platform access, activity log
- [ ] Role management: assign/revoke roles per platform
- [ ] Role hierarchy enforcement: SITE_OWNER > SITE_ADMIN > ADMIN > STAFF > CUSTOMER_SERVICE
- [ ] Invitation system: invite users to specific platforms/roles
- [ ] Bulk actions: assign role to multiple users, deactivate accounts
- [ ] Audit log: who changed what role when
- [ ] Workspace management: create/edit workspaces (tenants)

### Files to Create
```
frontend-admin/src/app/admin/users/
  page.tsx
  [userId]/page.tsx
  roles/page.tsx
  invitations/page.tsx
frontend-admin/src/components/admin/users/
  UserDirectory.tsx
  UserDetail.tsx
  RoleManager.tsx
  InvitationSystem.tsx
  AuditLog.tsx
```

---

## Story 14.5: Content Management System

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Story 14.1

### Description
Complete the CMS for managing content across quiknation.com — hero sections, product pages, testimonials, team bios, news.

### Acceptance Criteria
- [ ] Homepage editor: hero, features, testimonials, CTA, partner logos
- [ ] Products page editor: add/edit/reorder products (existing feature)
- [ ] Team/leadership page editor: bios, photos, roles
- [ ] News/blog editor: create articles, schedule publishing
- [ ] Media library: upload and manage images, videos
- [ ] Content preview: see changes before publishing
- [ ] Content versioning: rollback to previous versions
- [ ] Content audit trail (existing model: ContentAuditTrail)
- [ ] Drag-and-drop reordering (dnd-kit already installed)

### Files to Create/Modify
```
frontend-admin/src/app/admin/content/
  homepage/page.tsx
  products/page.tsx               # (enhance existing)
  team/page.tsx
  news/page.tsx
  media/page.tsx
frontend-admin/src/components/admin/content/
  HomepageEditor.tsx
  ProductEditor.tsx
  TeamEditor.tsx
  NewsEditor.tsx
  MediaLibrary.tsx
  ContentPreview.tsx
  ContentVersionHistory.tsx
```

---

## Story 14.6: Investor Portal Administration

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Story 14.1

### Description
Admin tools for managing the investor portal — configure dashboards, manage investor access, update financial data, manage data room.

### Acceptance Criteria
- [ ] Investor list: all investors, access level, investment amount, status
- [ ] Investor approval flow: request → review → approve/deny
- [ ] Dashboard configuration: what data shows on investor dashboard (existing feature — enhance)
- [ ] Financial data management: update metrics, projections, revenue figures
- [ ] Data room management: upload/organize documents, set access permissions
- [ ] Business plan editor: edit per-product investment materials (existing — enhance)
- [ ] Notification management: send updates to all investors
- [ ] Investor activity monitoring: who viewed what, when

### Files to Create/Modify
```
frontend-admin/src/app/admin/investors/
  page.tsx
  [investorId]/page.tsx
  approvals/page.tsx
  data-room/page.tsx
frontend-admin/src/components/admin/investors/
  InvestorList.tsx
  InvestorApproval.tsx
  DashboardConfigurator.tsx
  DataRoomAdmin.tsx
  InvestorActivityMonitor.tsx
```

---

## Story 14.7: System Settings & Configuration

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Story 14.1

### Description
System-level settings — Stripe configuration, Clerk configuration, email/SMS settings, deployment status.

### Acceptance Criteria
- [ ] Stripe settings: view/update API keys per platform (encrypted display)
- [ ] Clerk settings: instance status, user counts per instance
- [ ] Email settings: SendGrid configuration, default templates
- [ ] SMS settings: Twilio configuration, usage stats
- [ ] AWS settings: S3 buckets, CloudFront distributions
- [ ] Deployment status: Amplify builds, backend health, database status
- [ ] Environment variable management (read-only display for security)
- [ ] System logs viewer: recent errors, warnings
- [ ] Feature flags: enable/disable features globally
- [ ] Yapit settings: API keys, merchant ID, environment (sandbox/production), webhook configuration
- [ ] Payment provider management: enable/disable Stripe or Yapit per platform
- [ ] Provider health check: verify Stripe and Yapit API connectivity

### Files to Create
```
frontend-admin/src/app/admin/settings/
  page.tsx
  stripe/page.tsx
  auth/page.tsx
  email/page.tsx
  sms/page.tsx
  deployment/page.tsx
  logs/page.tsx
frontend-admin/src/components/admin/settings/
  StripeSettings.tsx
  AuthSettings.tsx
  EmailSettings.tsx
  DeploymentStatus.tsx
  SystemLogs.tsx
  FeatureFlags.tsx
```
