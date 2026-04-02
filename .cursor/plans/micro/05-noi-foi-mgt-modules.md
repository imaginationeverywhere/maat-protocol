# Epic 05: NOI FOI & MGT Modules

**Priority:** HIGH
**Platform:** NOI (Sovereign)
**Description:** Operational tools for the Fruit of Islam (men) and Muslim Girls Training & General Civilization Class (women). Training, distribution tracking, drill management, organizational discipline.

---

## Story 05.1: FOI Roster & Training Management

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Epic 04 (Mosque Management)

### Description
FOI operational management — roster, ranks, training status, General Orders compliance.

### Acceptance Criteria
- [ ] FOI roster per mosque: member name, rank, training level, join date
- [ ] Training module tracker: General Orders completion status per member
- [ ] Physical fitness tracking (PT schedules, progress)
- [ ] Uniform/dress code compliance tracking
- [ ] FOI Captain dashboard: roster overview, training gaps, upcoming schedules
- [ ] Student Supreme Captain: national FOI overview across all mosques
- [ ] Promote/demote rank functionality
- [ ] FOI-only communication channel
- [ ] GraphQL schema and resolvers

### Files to Create
```
ali-platform/backend/src/modules/foi/
  index.ts
  foi.service.ts
  foi.types.ts
  schema.graphql
  resolvers.ts
  feature.config.ts
  __tests__/foi.spec.ts
ali-platform/frontend/src/components/foi/
  FOIDashboard.tsx
  FOIRoster.tsx
  FOITrainingTracker.tsx
  FOIMemberProfile.tsx
  FOIRankManager.tsx
```

---

## Story 05.2: FOI Distribution Tracking (Final Call & Bean Pies)

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Story 05.1

### Description
Track Final Call newspaper and bean pie distribution — assignments, sales, inventory, revenue per member and per mosque.

### Acceptance Criteria
- [ ] Distribution assignment: assign papers/pies to FOI members
- [ ] Check-out system: member takes X papers/pies
- [ ] Check-in system: member returns unsold, reports sold count
- [ ] Revenue tracking per member, per mosque, per week/month
- [ ] Inventory management: papers received from HQ, pies baked/received
- [ ] Leaderboard: top distributors (gamification within the FOI)
- [ ] Weekly/monthly distribution reports
- [ ] National distribution analytics (all mosques aggregated)
- [ ] Yapit Bulk Payout for disbursing paper/pie sales revenue to FOI members
- [ ] Dual-provider revenue tracking: payments received via Stripe or Yapit
- [ ] Integration with Three-Year Economic Program module

### Files to Create
```
ali-platform/backend/src/modules/foi/distribution/
  index.ts
  distribution.service.ts
  distribution.types.ts
  schema.graphql
  resolvers.ts
  __tests__/distribution.spec.ts
ali-platform/frontend/src/components/foi/
  DistributionDashboard.tsx
  DistributionAssignment.tsx
  DistributionCheckIn.tsx
  DistributionLeaderboard.tsx
  DistributionReport.tsx
```

---

## Story 05.3: FOI Drill Competition Management

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Story 05.1

### Description
Manage FOI drill competitions, especially for Saviours' Day national competition.

### Acceptance Criteria
- [ ] Drill team roster per mosque
- [ ] Practice schedule management
- [ ] Competition registration (local, regional, national)
- [ ] Scoring system for drill competitions
- [ ] Video upload for drill review (self-hosted, not YouTube)
- [ ] Judges panel management for competitions
- [ ] Historical competition results archive
- [ ] Saviours' Day drill competition bracket/schedule

### Files to Create
```
ali-platform/backend/src/modules/foi/drill/
  index.ts
  drill.service.ts
  schema.graphql
  resolvers.ts
ali-platform/frontend/src/components/foi/
  DrillTeamRoster.tsx
  DrillSchedule.tsx
  DrillCompetition.tsx
  DrillScoring.tsx
```

---

## Story 05.4: FOI Security Coordination

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Story 05.1

### Description
FOI security team coordination for mosque security, events, and community patrols.

### Acceptance Criteria
- [ ] Security shift scheduling per mosque
- [ ] Event security assignment and coordination
- [ ] Check-in/check-out for security shifts
- [ ] Incident reporting system
- [ ] Communication channel for active security teams
- [ ] National event security coordination (Saviours' Day, etc.)
- [ ] Training module for security procedures
- [ ] CRITICAL: No sensitive security details exposed to non-FOI users

### Files to Create
```
ali-platform/backend/src/modules/foi/security/
  index.ts
  security.service.ts
  schema.graphql
  resolvers.ts
ali-platform/frontend/src/components/foi/
  SecuritySchedule.tsx
  SecurityShiftManager.tsx
  IncidentReport.tsx
```

---

## Story 05.5: MGT & GCC Roster & Class Management

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Epic 04 (Mosque Management)

### Description
MGT operational management — roster, class scheduling, curriculum tracking, Sister Captain coordination.

### Acceptance Criteria
- [ ] MGT roster per mosque: member name, class level, join date
- [ ] Class scheduling: sewing, cooking, child-rearing, general civilization
- [ ] Curriculum tracking: which modules completed per member
- [ ] Sister Captain dashboard: roster overview, class attendance, upcoming schedules
- [ ] Student National MGT & GCC Captain: national overview across all mosques
- [ ] Class materials management (recipes, patterns, curriculum documents)
- [ ] MGT-only communication channel
- [ ] Attendance tracking for classes
- [ ] Certificate/completion tracking

### Files to Create
```
ali-platform/backend/src/modules/mgt/
  index.ts
  mgt.service.ts
  mgt.types.ts
  schema.graphql
  resolvers.ts
  feature.config.ts
  __tests__/mgt.spec.ts
ali-platform/frontend/src/components/mgt/
  MGTDashboard.tsx
  MGTRoster.tsx
  MGTClassSchedule.tsx
  MGTCurriculum.tsx
  MGTMemberProfile.tsx
  MGTAttendance.tsx
```

---

## Story 05.6: MGT Vending & Economic Activities

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Story 05.5

### Description
Track MGT economic activities — bean pie baking, food preparation for events, product sales (Clean N Fresh, Fashahnn).

### Acceptance Criteria
- [ ] Bean pie production tracking: ingredients, batches, inventory
- [ ] Event food preparation coordination
- [ ] Product sales tracking: Clean N Fresh, Fashahnn, baked goods
- [ ] Yapit payment acceptance for product sales (Clean N Fresh, Fashahnn, baked goods)
- [ ] Revenue tracking across both Stripe and Yapit providers
- [ ] Revenue reporting per mosque
- [ ] Recipe management and standardization
- [ ] Supply ordering and inventory
- [ ] Integration with Three-Year Economic Program module

### Files to Create
```
ali-platform/backend/src/modules/mgt/vending/
  index.ts
  vending.service.ts
  schema.graphql
  resolvers.ts
ali-platform/frontend/src/components/mgt/
  VendingDashboard.tsx
  ProductionTracker.tsx
  InventoryManager.tsx
  SalesReport.tsx
```
