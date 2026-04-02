# Epic 08: NOI Global Reach & Community Platform

**Priority:** MEDIUM-HIGH
**Platform:** NOI (Sovereign)
**Description:** Reach and connect with the Black man and woman across the planet. Multi-language, international mosques/study groups, digital dawah, global community.

## Yapit/YapEX — Critical Global Enabler

Yapit is the payment backbone of global reach. Stripe cannot process payments in many Caribbean, African, and Global South markets. Yapit — Black-owned from the Virgin Islands — enables the economic connections the Most Honorable Elijah Muhammad envisioned: the Black Man in America connecting with the Black Man around the globe.

Every payment flow in this epic should support Yapit as the PRIMARY international payment provider.

---

## Story 08.1: International Mosque/Study Group Network

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Epic 04 (Mosque Management)

### Description
Extend the mosque directory and management system internationally. The Final Call circulates in North America, Europe, Africa, and the Caribbean — the platform must reach everywhere.

### Acceptance Criteria
- [ ] International mosque/study group listings: country, city, leader, service times
- [ ] Region structure: North America, Caribbean, Europe, Africa, Central/South America
- [ ] Timezone-aware service times and event scheduling
- [ ] Country-specific contact information and local customs
- [ ] Map view: global mosque/study group map
- [ ] International coordinator dashboard
- [ ] Connect isolated study groups with larger mosques for mentorship
- [ ] International Final Call distribution tracking
- [ ] Yapit payment integration for international mosque operations (tithes, donations, product sales)
- [ ] Cross-border financial flows between US mosques and international study groups via Yapit

### Files to Create
```
ali-platform/backend/src/modules/international/
  index.ts
  international.service.ts
  schema.graphql
  resolvers.ts
ali-platform/frontend/src/components/international/
  GlobalMosqueMap.tsx
  InternationalDirectory.tsx
  RegionDashboard.tsx
```

---

## Story 08.2: Multi-Language Support

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Epic 03

### Description
Multi-language support for the global African diaspora. Arabic, French (West/Central Africa, Caribbean), Spanish (Central/South America), Portuguese (Brazil), Swahili (East Africa), and more.

### Acceptance Criteria
- [ ] i18n framework setup (next-intl or similar)
- [ ] Primary languages: English, Arabic, French, Spanish, Portuguese, Swahili
- [ ] Language selector in header/settings
- [ ] Content translation management system
- [ ] Auto-detect language from browser/location
- [ ] RTL support for Arabic
- [ ] Final Call articles translatable
- [ ] Ali AI: respond in the user's language
- [ ] Study Guides: translated editions where available
- [ ] User preference saved to profile

### Files to Create
```
ali-platform/frontend/src/i18n/
  config.ts
  locales/
    en.json
    ar.json
    fr.json
    es.json
    pt.json
    sw.json
ali-platform/frontend/src/components/common/
  LanguageSelector.tsx
ali-platform/backend/src/modules/translations/
  translation.service.ts
  schema.graphql
  resolvers.ts
```

---

## Story 08.3: Digital Dawah (Outreach) Tools

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Story 08.2

### Description
Digital tools for sharing the Teachings and inviting people to learn about the Nation of Islam. The digital equivalent of passing out The Final Call on the street corner.

### Acceptance Criteria
- [ ] Shareable content cards: quotes, articles, lecture clips formatted for social media
- [ ] "Invite to Study Group" digital invitation system
- [ ] Landing pages for seekers: "What is the Nation of Islam?" introductory content
- [ ] The Muslim Program displayed beautifully: "What the Muslims Want" / "What the Muslims Believe"
- [ ] Short video clips from lectures formatted for social sharing
- [ ] QR code generator: link to mosque info, events, or landing pages
- [ ] Track engagement: how many people clicked, viewed, attended
- [ ] Email drip campaign for interested contacts
- [ ] SMS outreach tools (Twilio)
- [ ] Donation acceptance from international contacts via Yapit

### Files to Create
```
ali-platform/backend/src/modules/dawah/
  index.ts
  dawah.service.ts
  invitation.service.ts
  schema.graphql
  resolvers.ts
ali-platform/frontend/src/app/learn/
  page.tsx
  muslim-program/page.tsx
  what-we-believe/page.tsx
ali-platform/frontend/src/components/dawah/
  ShareableContentCard.tsx
  InvitationCreator.tsx
  SeekerLandingPage.tsx
  MuslimProgram.tsx
  OutreachAnalytics.tsx
```

---

## Story 08.4: Community Forum & Discussion

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Epic 03

### Description
Community discussion platform — a safe space for Brothers, Sisters, and the broader community to discuss the Teachings, current events, and community building. Not dependent on Facebook groups.

### Acceptance Criteria
- [ ] Discussion forums organized by topic: Teachings, Economics, Health, Current Events, Education
- [ ] Thread-based discussions with replies
- [ ] Moderation tools: approve, flag, remove posts
- [ ] Member-only discussions (institutional layer)
- [ ] Public discussions (community layer — open to all)
- [ ] Pin important discussions
- [ ] Search across all discussions
- [ ] User reputation / contribution tracking
- [ ] Notification when someone replies to your discussion
- [ ] Integration with Ali AI: "What are Brothers and Sisters saying about [topic]?"

### Files to Create
```
ali-platform/backend/src/modules/community/
  index.ts
  forum.service.ts
  moderation.service.ts
  schema.graphql
  resolvers.ts
ali-platform/frontend/src/app/community/
  page.tsx
  [topicSlug]/page.tsx
  [topicSlug]/[threadId]/page.tsx
ali-platform/frontend/src/components/community/
  ForumTopicList.tsx
  ThreadView.tsx
  CreateThread.tsx
  ReplyComposer.tsx
  ModerationPanel.tsx
```

---

## Story 08.5: NOI Mobile App (React Native)

**Agent-Executable:** YES
**Estimated Scope:** Multi-session (large)
**Dependencies:** All backend APIs from Epics 02-08

### Description
Unified NOI mobile app replacing the current Nation of Islam App (App Store ID: 1082701263). Everything in one app.

### Acceptance Criteria
- [ ] React Native app (iOS + Android)
- [ ] Ali AI chat interface
- [ ] Mosque locator with map
- [ ] Live broadcast streaming
- [ ] The Final Call news reader
- [ ] Study Guide reader with offline support
- [ ] Store with checkout
- [ ] Event calendar and registration
- [ ] Push notifications (mosque announcements, broadcast alerts, news)
- [ ] Member profile and mosque affiliation
- [ ] FOI/MGT tools (role-based access)
- [ ] Bean pie/Final Call distribution tracker (FOI)
- [ ] NOI branding throughout
- [ ] Deep linking to specific content
- [ ] Yapit payment SDK integration alongside Stripe for mobile payments

### Files to Create
```
ali-platform/mobile/
  src/
    screens/
      HomeScreen.tsx
      AliChatScreen.tsx
      MosqueFinderScreen.tsx
      NewsScreen.tsx
      StudyScreen.tsx
      StoreScreen.tsx
      EventsScreen.tsx
      ProfileScreen.tsx
      BroadcastScreen.tsx
    components/
      (mirrors frontend components adapted for React Native)
    navigation/
      AppNavigator.tsx
      TabNavigator.tsx
    hooks/
      useAliChat.ts
      useBroadcast.ts
    services/
      api.ts
      notifications.ts
```

---

## Story 08.6: Knowledge Transfer — Developer Training Program

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** None

### Description
Create the curriculum and infrastructure for teaching NOI members software development and AI. "Do for Self" in technology — the goal is the Nation builds its own technical workforce.

### Acceptance Criteria
- [ ] Training program structure document: beginner → intermediate → advanced
- [ ] Beginner track: HTML/CSS, JavaScript basics, using AI tools
- [ ] Intermediate track: React/Next.js, Node.js/Express, databases, API development
- [ ] Advanced track: AI/ML engineering, DevOps, cloud infrastructure (AWS)
- [ ] Each track uses the NOI platform codebase as the learning project
- [ ] Mentorship matching: Quik Nation developers paired with NOI learners
- [ ] Project-based learning: contribute to the actual platform as assignments
- [ ] Progress tracking and certification
- [ ] Video tutorials (self-hosted on the platform)
- [ ] Ali AI as a coding tutor: "How do I build a React component?"
- [ ] Eventually: NOI members can maintain and extend the platform independently

### Files to Create
```
ali-platform/docs/developer-training/
  README.md
  curriculum/
    01-beginner-track.md
    02-intermediate-track.md
    03-advanced-track.md
    04-ai-ml-track.md
    05-devops-track.md
  mentorship/
    matching-guide.md
    mentor-expectations.md
  projects/
    beginner-projects.md
    intermediate-projects.md
    advanced-projects.md
```
