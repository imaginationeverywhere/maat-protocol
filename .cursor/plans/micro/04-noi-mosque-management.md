# Epic 04: NOI Mosque Management System

**Priority:** HIGH
**Platform:** NOI (Sovereign)
**Description:** Every mosque gets its own portal. Roster management, event scheduling, broadcast integration, FOI/MGT coordination. This is the institutional backbone.

---

## Story 04.1: Mosque Directory & Locator

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Epic 03 (NOI Platform Core)

### Description
Build a searchable directory of all NOI mosques/study groups nationwide and internationally. Map-based locator.

### Acceptance Criteria
- [ ] Mosque directory page with search/filter
- [ ] Filter by: city, state, region, mosque number
- [ ] Map view using Mapbox/Google Maps showing all mosques
- [ ] Mosque detail page: name, number, minister, address, service times, contact
- [ ] "Find a Mosque Near Me" geolocation feature
- [ ] Sunday service times prominently displayed
- [ ] Jumu'ah prayer times
- [ ] International mosques/study groups included
- [ ] GraphQL queries: `mosques`, `mosqueById`, `mosquesNearMe`
- [ ] Admin: CRUD for mosque management

### Files to Create
```
ali-platform/frontend/src/app/mosques/
  page.tsx                    # Directory page
  [mosqueId]/page.tsx         # Mosque detail
ali-platform/frontend/src/components/mosques/
  MosqueDirectory.tsx
  MosqueCard.tsx
  MosqueMap.tsx
  MosqueDetail.tsx
  MosqueSearch.tsx
ali-platform/backend/src/modules/mosques/
  index.ts
  mosque.service.ts
  schema.graphql
  resolvers.ts
  __tests__/mosques.spec.ts
```

---

## Story 04.2: Mosque Portal Dashboard

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Story 04.1

### Description
Each mosque gets its own admin portal. The Student Minister and mosque leadership can manage their community.

### Acceptance Criteria
- [ ] Dashboard: member count, upcoming events, announcements, distribution stats
- [ ] Member roster (FOI and MGT counts)
- [ ] Quick actions: create event, send announcement, manage members
- [ ] Final Call distribution tracking (papers sold this week/month)
- [ ] Bean pie production/sales tracking
- [ ] Financial summary: tithes, event revenue, product sales — tracked across Stripe AND Yapit
- [ ] Yapit Bulk Payout for distributing FOI sales proceeds
- [ ] Sunday broadcast embed (from webcast.noi.org or self-hosted)
- [ ] Role-based access: Student Minister sees everything, FOI Captain sees FOI, etc.

### Files to Create
```
ali-platform/frontend/src/app/mosque-admin/
  page.tsx                    # Dashboard
  layout.tsx                  # Admin layout
ali-platform/frontend/src/components/mosque-admin/
  MosqueDashboard.tsx
  MemberRoster.tsx
  DistributionTracker.tsx
  FinancialSummary.tsx
  AnnouncementManager.tsx
  BroadcastEmbed.tsx
```

---

## Story 04.3: Member Management

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Story 04.2, Story 03.3

### Description
Manage mosque membership — add, edit, transfer between mosques, track FOI/MGT status.

### Acceptance Criteria
- [ ] Member list with search/filter
- [ ] Member profile: Muslim name, given name, join date, FOI/MGT status, roles
- [ ] Add new member flow
- [ ] Transfer member between mosques
- [ ] Track member's journey: Student Enrollment completion, FOI/MGT training status
- [ ] Member communication: send messages to all, FOI only, MGT only
- [ ] Attendance tracking (optional)
- [ ] Export member reports
- [ ] GraphQL mutations: `addMember`, `updateMember`, `transferMember`

### Files to Create
```
ali-platform/backend/src/modules/members/
  index.ts
  member.service.ts
  schema.graphql
  resolvers.ts
  __tests__/members.spec.ts
ali-platform/frontend/src/components/mosque-admin/
  MemberList.tsx
  MemberProfile.tsx
  AddMemberForm.tsx
  TransferMemberDialog.tsx
```

---

## Story 04.4: Mosque Event Management

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Story 04.2

### Description
Manage mosque events — local lectures, community events, Jumu'ah, Sunday services. Integration with Saviours' Day national event.

### Acceptance Criteria
- [ ] Create event: title, date, time, type (lecture, community, jumu'ah, study_group, special)
- [ ] Event registration/RSVP
- [ ] Event capacity management
- [ ] Recurring events (weekly Jumu'ah, Sunday broadcast)
- [ ] National events calendar (Saviours' Day, Holy Day of Atonement) auto-populated
- [ ] Event notifications via push/SMS/email
- [ ] Event check-in (QR code or manual)
- [ ] Post-event report (attendance, feedback)
- [ ] Public-facing event listing for community (non-members can see/register)

### Files to Create
```
ali-platform/backend/src/modules/events/
  index.ts
  event.service.ts
  schema.graphql
  resolvers.ts
  __tests__/events.spec.ts
ali-platform/frontend/src/components/events/
  EventCalendar.tsx
  EventCard.tsx
  EventDetail.tsx
  CreateEventForm.tsx
  EventCheckIn.tsx
  EventRegistration.tsx
```

---

## Story 04.5: Sunday Broadcast Integration

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Story 04.2

### Description
Integrate the weekly Sunday broadcast (currently webcast.noi.org at 10am CST) into the platform. Self-hosted streaming for deplatforming resilience.

### Acceptance Criteria
- [ ] Live stream embed from self-hosted infrastructure (not YouTube/Facebook)
- [ ] Schedule display: "Live every Sunday at 10am CST"
- [ ] Archive of past broadcasts (searchable by date, speaker, topic)
- [ ] Audio-only stream option (lower bandwidth)
- [ ] Chat/reaction features during live broadcast
- [ ] Viewer count and engagement metrics
- [ ] Push notification: "Live Now" when broadcast starts
- [ ] Download option for archived broadcasts
- [ ] Integration with Ali AI: "Summarize last Sunday's broadcast"

### Files to Create
```
ali-platform/backend/src/modules/broadcast/
  index.ts
  broadcast.service.ts
  streaming-provider.ts
  schema.graphql
  resolvers.ts
ali-platform/frontend/src/components/broadcast/
  LiveBroadcast.tsx
  BroadcastArchive.tsx
  BroadcastPlayer.tsx
  BroadcastChat.tsx
  BroadcastSchedule.tsx
```

---

## Story 04.6: Mosque Communication Tools

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Story 04.3

### Description
Communication tools for mosque leadership — announcements, messaging, notifications to members.

### Acceptance Criteria
- [ ] Announcement system: mosque-wide, FOI-only, MGT-only, national
- [ ] Push notifications to member app
- [ ] SMS notifications via Twilio (for members without app)
- [ ] Email newsletters
- [ ] Announcement templates for common communications
- [ ] Scheduled announcements (set to send at specific time)
- [ ] Read receipts / delivery confirmation
- [ ] National announcements pushed to ALL mosques

### Files to Create
```
ali-platform/backend/src/modules/communications/
  index.ts
  communication.service.ts
  notification-router.ts
  schema.graphql
  resolvers.ts
ali-platform/frontend/src/components/communications/
  AnnouncementComposer.tsx
  NotificationSettings.tsx
  CommunicationHistory.tsx
```
