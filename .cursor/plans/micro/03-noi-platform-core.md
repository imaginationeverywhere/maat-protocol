# Epic 03: NOI Platform Core Infrastructure

**Priority:** HIGH
**Platform:** NOI (Sovereign — NOI is PLATFORM_OWNER)
**Description:** Build the core infrastructure for the NOI's own platform. NOI owns their AWS account. Quik Nation manages it as an organization. Built on Auset engine but fully sovereign.

---

## Story 03.1: NOI Platform Monorepo Scaffolding

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** None

### Description
Scaffold the NOI platform as a new monorepo built on the Auset engine. This is NOT inside the QuikNation boilerplate — it's a SEPARATE project that uses Auset as its foundation.

### Acceptance Criteria
- [ ] Create monorepo structure mirroring Auset but with NOI branding
- [ ] `ali-platform/` root with `frontend/`, `backend/`, `mobile/`, `infrastructure/`
- [ ] Package.json with NOI-specific metadata
- [ ] TypeScript configuration
- [ ] ESLint + Prettier configuration
- [ ] Docker configuration
- [ ] `.env.example` with NOI-specific environment variables
- [ ] CLAUDE.md with NOI platform context (proper titles, terminology)
- [ ] README.md with NOI platform overview

### Files to Create
```
ali-platform/
  package.json
  tsconfig.json
  .eslintrc.js
  .prettierrc
  docker-compose.yml
  .env.example
  CLAUDE.md
  README.md
  frontend/
    package.json
    tsconfig.json
    next.config.js
  backend/
    package.json
    tsconfig.json
  mobile/
    package.json
  infrastructure/
    package.json
```

---

## Story 03.2: NOI AWS Account Setup & Organization

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Story 03.1

### Description
Document and automate the NOI AWS account setup. The NOI has their OWN AWS account. Quik Nation manages it as an organization member.

### Acceptance Criteria
- [ ] Create `ali-platform/infrastructure/aws/` directory
- [ ] AWS Organization setup documentation (NOI = member account, Quik Nation = management)
- [ ] CDK stack for NOI infrastructure: VPC, EC2/ECS, RDS, S3, CloudFront
- [ ] IAM roles: NOI-admin, quiknation-managed-services, noi-developer (for training members)
- [ ] Cost budgets and alerts (NOI pays their own AWS bill)
- [ ] Separate from QuikNation billing entirely
- [ ] Security baseline: GuardDuty, CloudTrail, Config
- [ ] Domain setup: noi.org DNS management

### Files to Create
```
ali-platform/infrastructure/aws/
  README.md
  cdk/
    lib/noi-platform-stack.ts
    lib/noi-networking-stack.ts
    lib/noi-database-stack.ts
    lib/noi-storage-stack.ts
    lib/noi-iam-stack.ts
  docs/
    aws-organization-setup.md
    iam-roles.md
    cost-management.md
```

---

## Story 03.3: NOI Authentication & Member Management

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Story 03.1

### Description
Build authentication for the NOI platform. Members, ministers, FOI, MGT, mosque admins — each with appropriate access levels.

### Acceptance Criteria
- [ ] Auth system (Clerk or custom) with NOI-specific roles
- [ ] Roles: `member`, `student_minister`, `foi_captain`, `mgt_captain`, `mosque_admin`, `regional_minister`, `national_admin`
- [ ] Mosque-based tenant isolation (each mosque = a tenant)
- [ ] National-level admin can see all mosques
- [ ] Regional ministers can see mosques in their region
- [ ] Member profiles: Muslim name, mosque affiliation, FOI/MGT status
- [ ] Registration flow with mosque selection
- [ ] GraphQL schema and resolvers

### Files to Create
```
ali-platform/backend/src/modules/auth/
  index.ts
  noi-auth.ts
  noi-roles.ts
  noi-auth.types.ts
  schema.graphql
  resolvers.ts
  feature.config.ts
  __tests__/noi-auth.spec.ts
```

---

## Story 03.4: NOI Database Schema & Migrations

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Story 03.1, 03.3

### Description
Design the core database schema for the NOI platform — mosques, members, FOI/MGT, events, content.

### Acceptance Criteria
- [ ] Mosques table: name, number (Muhammad Mosque No. X), address, region, minister, contact
- [ ] Members table: muslim_name, given_name, mosque_id, foi_status, mgt_status, join_date, roles
- [ ] FOI table: member_id, rank, training_status, distribution_assignments
- [ ] MGT table: member_id, class_assignments, sister_captain_id
- [ ] Events table: mosque_id, event_type, date, capacity, registration
- [ ] Content table: type (article, lecture, study_guide), title, body, author, published_date
- [ ] All tables with proper indexes and constraints
- [ ] Seed data for Mosque Maryam (No. 2)

### Files to Create
```
ali-platform/backend/src/database/
  migrations/
    001_create_mosques.ts
    002_create_members.ts
    003_create_foi.ts
    004_create_mgt.ts
    005_create_events.ts
    006_create_content.ts
  seeds/
    mosque-maryam-seed.ts
  models/
    Mosque.ts
    Member.ts
    FOI.ts
    MGT.ts
    Event.ts
    Content.ts
```

---

## Story 03.5: NOI Platform Ausar Feature Activation

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Story 03.1

### Description
Configure which Auset features the NOI platform activates. Like QuikCarRental has its `.auset.ts` product config, the NOI platform has its own.

### Acceptance Criteria
- [ ] Create `ali-platform/backend/src/noi-platform.auset.ts`
- [ ] Core features: auth, payments (Stripe Connect + Yapit/YapEX dual provider), notifications (SMS/email/push), crm, file-storage, analytics, search, webhooks
- [ ] Commerce features: product-catalog (Final Call Store, bean pies, Clean N Fresh), checkout, subscriptions (Final Call subscription)
- [ ] Services features: booking (events, mosque rooms), delivery (Muhammad Farms produce)
- [ ] Engagement features: messaging (member communication), live-streaming (Sunday broadcast), social-media
- [ ] Enterprise features: multi-tenant (per-mosque), reporting, compliance
- [ ] AI features: chat (Ali), content-generation, recommendations
- [ ] Logistics features: maps (mosque locator), tracking (farm-to-mosque supply chain)
- [ ] Payment config: Stripe Connect for domestic US, Yapit for global diaspora, NOI platform fees on both
- [ ] Yapit payment provider configured alongside Stripe
- [ ] Global payment routing: domestic → Stripe, international → Yapit
- [ ] Yapit Bulk Payout for FOI newspaper/bean pie distribution payments
- [ ] Yapit Escrow for cooperative economics transactions

### Files to Create
```
ali-platform/backend/src/noi-platform.auset.ts
```
