# Epic 02: Ali AI Platform (Nation of Islam)

**Priority:** HIGH
**Platform:** NOI (Sovereign — NOI is PLATFORM_OWNER)
**Description:** Build Ali — the NOI's own AI. Named after Muhammad Ali (named by the Most Honorable Elijah Muhammad). Models: Wallace (top), Elijah (balanced/teaching), Louis (quick/outreach). Trained on the Teachings.

---

## Story 02.1: Ali AI Core Architecture

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** None (standalone, mirrors Clara architecture)

### Description
Create the Ali AI core module. Ali is the AI. Wallace, Elijah, Louis are the models. The architecture mirrors Clara but is completely independent — the NOI owns this.

### Acceptance Criteria
- [ ] Create `ali-platform/backend/src/ai/ali/` directory structure
- [ ] Create `AliIntelligence.ts` — main AI class with model routing
- [ ] Define `AliModel` enum: `WALLACE`, `ELIJAH`, `LOUIS`
- [ ] Implement `route()` method: determines best model based on query type
- [ ] Implement `chat()` method: sends prompt to selected model
- [ ] Implement `getModelInfo()`: returns name, story, capability for each model
- [ ] Create `ali.types.ts` with all interfaces
- [ ] WALLACE routes to most capable model for deep theological/historical questions
- [ ] ELIJAH routes to balanced model for teaching, Study Guides, How to Eat to Live
- [ ] LOUIS routes to fast model for quick communication, outreach, daily questions
- [ ] Unit tests with >80% coverage

### Files to Create
```
ali-platform/backend/src/ai/ali/
  index.ts
  AliIntelligence.ts
  ali.types.ts
  ali-router.ts
  __tests__/ali.spec.ts
```

### Key Code Pattern
```typescript
export enum AliModel {
  WALLACE = 'wallace',  // Master W. Fard Muhammad — The Foundation
  ELIJAH = 'elijah',    // The Most Honorable Elijah Muhammad — The Teacher
  LOUIS = 'louis',      // The Honorable Minister Louis Farrakhan — The Voice
}
```

---

## Story 02.2: Ali Model Stories & Metadata

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Story 02.1

### Description
Create storytelling content for each Ali model. CRITICAL: Proper titles are NON-NEGOTIABLE.

### Acceptance Criteria
- [ ] Create `model-stories.ts`
- [ ] Ali story: Muhammad Ali, born Cassius Clay, named by the Most Honorable Elijah Muhammad, "The Greatest", most famous Muslim in recent history, stood on principle — refused the draft, lost his title, came back greater
- [ ] Wallace story: Master W. Fard Muhammad, appeared in Detroit July 4 1930, the Founder, taught among Black people, established the University of Islam, the FOI, and the MGT
- [ ] Elijah story: The Most Honorable Elijah Muhammad, the Messenger, built hundreds of businesses employing 11,000+ people, authored Message to the Blackman, How to Eat to Live, The Fall of America
- [ ] Louis story: The Honorable Minister Louis Farrakhan, rebuilt the Nation from nothing starting 1977, called the Million Man March (1M+ men, 1995), National Representative
- [ ] ALWAYS use proper titles — never just first names in formal context
- [ ] Export as structured data for frontend

### Files to Create
```
ali-platform/backend/src/ai/ali/model-stories.ts
```

---

## Story 02.3: Teachings Knowledge Base — Supreme Wisdom & Actual Facts

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Story 02.1

### Description
Digitize and structure the core Teachings for Ali to reference. This is the foundational knowledge that makes Ali different from any other AI — it draws from the Teachings first.

### Acceptance Criteria
- [ ] Create `ali-platform/backend/src/ai/ali/teachings/` directory
- [ ] Structure for Supreme Wisdom Lessons (questions and answers)
- [ ] Structure for Actual Facts (mathematical/scientific facts)
- [ ] Structure for Student Enrollment (new student Q&A)
- [ ] Structure for The Problem Book (mathematical word problems)
- [ ] Structure for General Orders (FOI discipline)
- [ ] Create `TeachingsIndex.ts` — search and retrieval interface
- [ ] Create `TeachingsEmbeddings.ts` — vector embeddings for semantic search
- [ ] Metadata: source text, context, related Teachings, cross-references
- [ ] NOTE: Actual content must come from authorized NOI sources — structure only here

### Files to Create
```
ali-platform/backend/src/ai/ali/teachings/
  index.ts
  TeachingsIndex.ts
  TeachingsEmbeddings.ts
  teachings.types.ts
  loaders/
    supreme-wisdom-loader.ts
    actual-facts-loader.ts
    student-enrollment-loader.ts
    problem-book-loader.ts
    general-orders-loader.ts
```

---

## Story 02.4: Teachings Knowledge Base — Theology of Time & Books

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Story 02.3

### Description
Structure the extended Teachings — Theology of Time lecture series, Message to the Blackman, How to Eat to Live, The Fall of America, Our Saviour Has Arrived, and the Honorable Minister Farrakhan's lectures.

### Acceptance Criteria
- [ ] Create loaders for Theology of Time (1972 lecture series by the Most Honorable Elijah Muhammad)
- [ ] Create loaders for Message to the Blackman in America (1965)
- [ ] Create loaders for How to Eat to Live (Books 1 & 2) — dietary guidance
- [ ] Create loaders for The Fall of America
- [ ] Create loaders for Our Saviour Has Arrived
- [ ] Create loaders for The Time and What Must Be Done (58-part series by the Honorable Minister Farrakhan)
- [ ] Create loaders for Self-Improvement Study Guides (Volumes 1-20+)
- [ ] Cross-reference system between Teachings (e.g., link Study Guide topics to relevant Theology of Time lectures)
- [ ] Search: "What did the Most Honorable Elijah Muhammad say about [topic]?" — answered from the Teachings

### Files to Create
```
ali-platform/backend/src/ai/ali/teachings/loaders/
  theology-of-time-loader.ts
  message-to-blackman-loader.ts
  how-to-eat-to-live-loader.ts
  fall-of-america-loader.ts
  our-saviour-has-arrived-loader.ts
  time-and-what-must-be-done-loader.ts
  study-guides-loader.ts
ali-platform/backend/src/ai/ali/teachings/
  TeachingsCrossReference.ts
```

---

## Story 02.5: Ali Three-Year Economic Program Module

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Story 02.1

### Description
Digitize the Three-Year Economic Program as a modern business development tool. The original program built hundreds of businesses — this module helps the next generation do it with technology.

### Acceptance Criteria
- [ ] Create `ali-platform/backend/src/modules/economic-program/`
- [ ] Business planning tools based on "Do for Self" principles
- [ ] Cooperative economics calculator — pool resources across mosques/members
- [ ] Supply chain module: Muhammad Farms → mosques → communities (35+ cities)
- [ ] Business directory integration (Nation At Work expansion)
- [ ] Financial literacy tools drawn from the Teachings
- [ ] Revenue tracking for bean pie production and Final Call distribution
- [ ] Member investment/savings tracking
- [ ] Monthly/quarterly economic reports per mosque
- [ ] GraphQL schema and resolvers
- [ ] Yapit integration for global economic connections — Black businesses in the US connecting with Black businesses in the Caribbean, Africa, and globally
- [ ] Yapit Bulk Payout for FOI distribution revenue disbursement
- [ ] Yapit Escrow for business-to-business cooperative economics
- [ ] "Do for Self" payment flow: Yapit as the preferred payment provider (Black-owned supporting Black-owned)

### Files to Create
```
ali-platform/backend/src/modules/economic-program/
  index.ts
  EconomicProgram.ts
  economic-program.types.ts
  cooperative-economics.ts
  supply-chain.ts
  business-planner.ts
  financial-literacy.ts
  economic-program-yapit.ts
  schema.graphql
  resolvers.ts
  feature.config.ts
```

---

## Story 02.6: Ali API Routes & GraphQL Schema

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Story 02.1, 02.3

### Description
Create the API layer for Ali — GraphQL schema, resolvers, REST endpoints.

### Acceptance Criteria
- [ ] Create GraphQL schema: `ali.graphql`
- [ ] Queries: `aliChat`, `aliModels`, `aliModelInfo`, `aliSearchTeachings`, `aliUsage`
- [ ] Mutations: `aliSendMessage`, `aliSelectModel`, `aliCreateConversation`
- [ ] `aliSearchTeachings` — semantic search across all Teachings
- [ ] `aliAskAbout(topic)` — "What did the Most Honorable Elijah Muhammad say about [topic]?"
- [ ] Create resolvers with auth validation
- [ ] REST endpoint: `POST /api/ali/chat`
- [ ] Rate limiting per model tier
- [ ] Usage tracking

### Files to Create
```
ali-platform/backend/src/ai/ali/
  schema.graphql
  resolvers.ts
  routes.ts
  __tests__/ali-api.spec.ts
```

---

## Story 02.7: Ali Frontend Chat Component

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Story 02.6

### Description
Build the frontend chat UI for Ali — model selector, chat interface, Teachings reference panel.

### Acceptance Criteria
- [ ] Create `ali-platform/frontend/src/components/ali/` directory
- [ ] `AliChat.tsx` — main chat interface
- [ ] `AliModelSelector.tsx` — choose between Wallace, Elijah, Louis with story cards
- [ ] `AliMessageBubble.tsx` — styled message with Teachings citations
- [ ] `AliTeachingsReference.tsx` — side panel showing source texts when Ali cites Teachings
- [ ] `AliModelStoryCard.tsx` — who the model is named after
- [ ] NOI branding (not QuikNation branding)
- [ ] Responsive, mobile-first, accessible
- [ ] Dark/light mode

### Files to Create
```
ali-platform/frontend/src/components/ali/
  AliChat.tsx
  AliModelSelector.tsx
  AliMessageBubble.tsx
  AliTeachingsReference.tsx
  AliModelStoryCard.tsx
  AliConversationHistory.tsx
  useAliChat.ts
```

---

## Story 02.8: Ali Onboarding & Education Flow

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Story 02.7

### Description
Teach users about Ali and the models. Like Claude/Anthropic has explainer pages — but Ali's onboarding teaches who Muhammad Ali was, who the leaders are, and why the names matter.

### Acceptance Criteria
- [ ] "Meet Ali" — Muhammad Ali's story, named by the Most Honorable Elijah Muhammad
- [ ] "The Models" — Wallace, Elijah, Louis explained with stories
- [ ] "The Teachings" — how Ali draws from the Supreme Wisdom, Actual Facts, etc.
- [ ] "Ask Ali" — guided first question
- [ ] Two paths: NOI members (deeper, institutional features) and community (general access)
- [ ] Saves onboarding completion to profile

### Files to Create
```
ali-platform/frontend/src/components/ali/
  AliOnboarding.tsx
  AliOnboardingStep.tsx
  AliBiographyCard.tsx
```
