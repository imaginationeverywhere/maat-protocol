# Epic 01: Clara AI Platform (Quik Intelligence)

**Priority:** HIGH
**Platform:** QuikNation (Auset)
**Description:** Build Quik Intelligence — the public-facing AI platform. The AI is named Clara (after Clara Villarosa). Models: Mary (top/Opus-tier), Maya (balanced/Sonnet-tier), Nikki (quick/Haiku-tier).

---

## Story 01.1: Clara AI Core Architecture

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Auset Platform backend running

### Description
Create the Clara AI core module that routes requests to the appropriate model tier (Mary, Maya, Nikki) based on task complexity, user preference, or subscription tier.

### Acceptance Criteria
- [ ] Create `backend/src/features/ai/clara/` directory structure
- [ ] Create `ClaraIntelligence.ts` — main AI class with model routing
- [ ] Define `ClaraModel` enum: `MARY`, `MAYA`, `NIKKI`
- [ ] Implement `route()` method: determines best model based on query complexity
- [ ] Implement `chat()` method: sends prompt to selected model
- [ ] Implement `getModelInfo()`: returns name, story, and capability description for each model
- [ ] Create `clara.types.ts` with all interfaces
- [ ] Create `feature.config.ts` following AusarFeature standard
- [ ] Register in Ausar Engine under `ai` category
- [ ] Unit tests with >80% coverage

### Files to Create/Modify
```
backend/src/features/ai/clara/
  index.ts
  ClaraIntelligence.ts
  clara.types.ts
  clara-router.ts
  feature.config.ts
  __tests__/clara.spec.ts
```

### Key Code Pattern
```typescript
export enum ClaraModel {
  MARY = 'mary',    // Top tier — Dr. Mary McLeod Bethune
  MAYA = 'maya',    // Balanced — Dr. Maya Angelou
  NIKKI = 'nikki',  // Quick — Dr. Nikki Giovanni
}

export interface ClaraModelInfo {
  model: ClaraModel;
  name: string;
  namedAfter: string;
  story: string;
  tier: 'top' | 'balanced' | 'quick';
  bestFor: string[];
}
```

---

## Story 01.2: Clara Model Stories & Metadata

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Story 01.1

### Description
Create the storytelling content for each Clara model — who they were, why they matter, and what the model does. This content surfaces in the UI, onboarding, and "About" sections.

### Acceptance Criteria
- [ ] Create `backend/src/features/ai/clara/model-stories.ts`
- [ ] Clara story: Clara Villarosa, Hue-Man Bookstore, connected people to knowledge, Amen Ra's mentor
- [ ] Mary story: Dr. Mary McLeod Bethune, started school with $1.50 and 5 students, built Bethune-Cookman University, advisor to FDR
- [ ] Maya story: Dr. Maya Angelou, "I Know Why the Caged Bird Sings", poet laureate, said more with less
- [ ] Nikki story: Dr. Nikki Giovanni, poet laureate who loved Tupac, had "Thug Life" tattooed on her chest, no pretense
- [ ] Include the 1994 dinner story: Amen Ra had dinner with Clara Villarosa, Maya Angelou, Nikki Giovanni, and Cleo Parker Robinson
- [ ] Export as structured data that frontend can consume
- [ ] Include capability descriptions for each model tier

### Files to Create
```
backend/src/features/ai/clara/model-stories.ts
```

---

## Story 01.3: Clara API Routes & GraphQL Schema

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Story 01.1

### Description
Create the API layer for Clara — GraphQL schema, resolvers, and REST endpoints for AI chat, model selection, and usage tracking.

### Acceptance Criteria
- [ ] Create GraphQL schema: `clara.graphql`
- [ ] Queries: `claraChat`, `claraModels`, `claraModelInfo`, `claraUsage`
- [ ] Mutations: `claraSendMessage`, `claraSelectModel`, `claraCreateConversation`
- [ ] Create resolvers with `context.auth?.userId` validation
- [ ] REST endpoint: `POST /api/clara/chat` for webhook/external integrations
- [ ] Rate limiting per model tier
- [ ] Usage tracking per user/tenant
- [ ] Unit tests for resolvers

### Files to Create
```
backend/src/features/ai/clara/
  schema.graphql
  resolvers.ts
  routes.ts
  __tests__/clara-api.spec.ts
```

---

## Story 01.4: Clara Frontend Chat Component

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Story 01.3

### Description
Build the frontend chat UI for Clara — model selector, chat interface, conversation history, and model story cards.

### Acceptance Criteria
- [ ] Create `frontend/src/components/clara/` directory
- [ ] `ClaraChat.tsx` — main chat interface
- [ ] `ClaraModelSelector.tsx` — choose between Mary, Maya, Nikki with story cards
- [ ] `ClaraMessageBubble.tsx` — styled message display
- [ ] `ClaraModelStoryCard.tsx` — displays who the model is named after with photo/story
- [ ] Apollo Client hooks for GraphQL queries/mutations
- [ ] Responsive design (mobile-first)
- [ ] Accessible (WCAG 2.1 AA)
- [ ] Dark mode support matching QuikNation brand (purple accents)

### Files to Create
```
frontend/src/components/clara/
  ClaraChat.tsx
  ClaraModelSelector.tsx
  ClaraMessageBubble.tsx
  ClaraModelStoryCard.tsx
  ClaraConversationHistory.tsx
  useClaraChat.ts
  clara.styles.ts
```

---

## Story 01.5: Clara Model Provider Integration

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Story 01.1

### Description
Wire Clara models to actual AI providers. Mary → Claude Opus / most capable, Maya → Claude Sonnet / balanced, Nikki → Claude Haiku / fast. With Cloudflare Workers AI fallback.

### Acceptance Criteria
- [ ] Create `clara-providers.ts` with provider abstraction
- [ ] Mary provider: Anthropic Claude Opus (primary), Cloudflare Workers AI Llama 70B (fallback)
- [ ] Maya provider: Anthropic Claude Sonnet (primary), Groq Llama (fallback)
- [ ] Nikki provider: Anthropic Claude Haiku (primary), Cloudflare Workers AI Llama 8B (fallback)
- [ ] Automatic fallback on provider failure
- [ ] Cost tracking per provider per request
- [ ] Prompt caching integration (Ra Intelligence prompt-caching feature)
- [ ] Environment variables: `CLARA_ANTHROPIC_API_KEY`, `CLARA_CLOUDFLARE_API_KEY`

### Note: Dual Payment Provider Awareness
Clara must understand the platform's dual payment providers (Stripe + Yapit/YapEX) when answering business queries about payments, international transactions, or financial features. No code changes needed in the provider layer — this is a prompt/knowledge awareness requirement. Clara should know:
- **Stripe** handles domestic US payment processing
- **Yapit** (Black-owned, Virgin Islands) handles international/diaspora payment processing
- When users ask about payments, international transactions, or "how do I accept payments from [country]", Clara routes the answer appropriately

### Files to Create
```
backend/src/features/ai/clara/
  clara-providers.ts
  __tests__/clara-providers.spec.ts
```

---

## Story 01.6: Clara Onboarding & Education Flow

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Story 01.4

### Description
Build the onboarding experience that teaches users about Clara and her models through the stories. First-time users learn who Clara Villarosa was, who Dr. Bethune was, etc. — the names teach before the AI is even used.

### Acceptance Criteria
- [ ] Create `frontend/src/components/clara/ClaraOnboarding.tsx`
- [ ] Step 1: "Meet Clara" — Clara Villarosa's story, what the AI does
- [ ] Step 2: "Choose Your Model" — interactive model selector with stories
- [ ] Step 3: "Your First Conversation" — guided first chat
- [ ] Animated transitions between steps
- [ ] "Learn More" expandable sections with full biographies
- [ ] Skip option for returning users
- [ ] Saves onboarding completion to user profile

### Files to Create
```
frontend/src/components/clara/
  ClaraOnboarding.tsx
  ClaraOnboardingStep.tsx
  ClaraBiographyCard.tsx
```
