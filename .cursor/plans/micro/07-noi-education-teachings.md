# Epic 07: NOI Education & Teachings Platform

**Priority:** HIGH
**Platform:** NOI (Sovereign)
**Description:** Digitize and make interactive the Teachings — Supreme Wisdom, Actual Facts, Student Enrollment, Problem Book, Study Guides, Theology of Time. Ali AI makes them conversational.

---

## Story 07.1: Study Guides Interactive Platform

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Epic 03 (NOI Platform Core)

### Description
Rebuild study.noi.org as an interactive learning platform. Self-Improvement Study Guides (Volumes 1-20+) with progress tracking, quizzes, and community discussion.

### Acceptance Criteria
- [ ] Study Guide library: all volumes listed with descriptions
- [ ] Reading interface: clean, distraction-free reading experience
- [ ] Progress tracking: bookmark where you left off, completion percentage
- [ ] Note-taking: personal notes per section
- [ ] Highlight and annotate text
- [ ] Quiz/self-assessment after each section
- [ ] Community discussion per Study Guide volume
- [ ] Current assignment tracking (mosque can set current assignment for members)
- [ ] Offline reading capability (PWA or app)
- [ ] Integration with Ali AI (Elijah model): "Explain this passage from Study Guide 17"

### Files to Create
```
ali-platform/backend/src/modules/education/study-guides/
  index.ts
  study-guide.service.ts
  progress.service.ts
  schema.graphql
  resolvers.ts
ali-platform/frontend/src/app/study/
  page.tsx
  [guideId]/page.tsx
  [guideId]/[sectionId]/page.tsx
ali-platform/frontend/src/components/study/
  StudyGuideLibrary.tsx
  StudyGuideReader.tsx
  StudyGuideProgress.tsx
  StudyGuideNotes.tsx
  StudyGuideQuiz.tsx
  StudyGuideDiscussion.tsx
```

---

## Story 07.2: Supreme Wisdom Lessons Interactive Module

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Story 07.1

### Description
The Supreme Wisdom Lessons — the foundational Q&A between Master Fard Muhammad and the Most Honorable Elijah Muhammad. Interactive study, memorization tools, and comprehension tracking.

### Acceptance Criteria
- [ ] All Supreme Wisdom Lessons displayed in Q&A format
- [ ] Memorization mode: flashcard-style with spaced repetition
- [ ] Self-test: quiz mode to check memorization
- [ ] Progress tracking: which lessons memorized, which need review
- [ ] Audio recordings of lessons (if available)
- [ ] Commentary and context for each lesson
- [ ] Cross-references to related Teachings
- [ ] Mosque-level tracking: how many members have completed memorization
- [ ] Ali AI integration: "Help me understand Lesson No. [X]"

### Files to Create
```
ali-platform/backend/src/modules/education/supreme-wisdom/
  index.ts
  supreme-wisdom.service.ts
  memorization.service.ts
  schema.graphql
  resolvers.ts
ali-platform/frontend/src/components/study/
  SupremeWisdomLessons.tsx
  SupremeWisdomFlashcards.tsx
  SupremeWisdomQuiz.tsx
  MemorizationTracker.tsx
```

---

## Story 07.3: Actual Facts & Student Enrollment Module

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Story 07.1

### Description
Actual Facts (mathematical/scientific facts) and Student Enrollment (Q&A for new students) as interactive learning modules.

### Acceptance Criteria
- [ ] Actual Facts: all facts displayed with memorization tools
- [ ] Flashcard mode for Actual Facts with spaced repetition
- [ ] Student Enrollment: all questions and answers in interactive format
- [ ] New member onboarding path: complete Student Enrollment before advancing
- [ ] Self-assessment quizzes for both
- [ ] Progress tracking visible to member and their mosque leadership
- [ ] Print-friendly versions for offline study
- [ ] Ali AI integration: "Quiz me on the Actual Facts"

### Files to Create
```
ali-platform/backend/src/modules/education/actual-facts/
  index.ts
  actual-facts.service.ts
  schema.graphql
  resolvers.ts
ali-platform/backend/src/modules/education/student-enrollment/
  index.ts
  student-enrollment.service.ts
  schema.graphql
  resolvers.ts
ali-platform/frontend/src/components/study/
  ActualFactsModule.tsx
  ActualFactsFlashcards.tsx
  StudentEnrollmentModule.tsx
  StudentEnrollmentQuiz.tsx
```

---

## Story 07.4: The Problem Book — Financial Literacy Module

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Story 07.1

### Description
The Problem Book — mathematical word problems that teach economic and social lessons. Digitized as an interactive financial literacy tool.

### Acceptance Criteria
- [ ] All Problem Book problems displayed with interactive solving
- [ ] Step-by-step solution walkthroughs
- [ ] Modern equivalents: update dollar amounts to current values for relevance
- [ ] Economic principles extracted from each problem (savings, investment, business)
- [ ] Connection to Three-Year Economic Program principles
- [ ] Progress tracking and scoring
- [ ] Generate new practice problems in the same style
- [ ] Modern economic examples should reference both traditional banking AND Black-owned fintech (Yapit) as pathways to "Do for Self"
- [ ] Yapit case study: how a Black-owned payment platform connects the diaspora economically
- [ ] Ali AI integration: "Explain the economic lesson in Problem No. [X]"

### Files to Create
```
ali-platform/backend/src/modules/education/problem-book/
  index.ts
  problem-book.service.ts
  schema.graphql
  resolvers.ts
ali-platform/frontend/src/components/study/
  ProblemBookModule.tsx
  ProblemSolver.tsx
  ProblemExplanation.tsx
  EconomicLessons.tsx
```

---

## Story 07.5: Theology of Time Searchable Archive

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Story 07.1, Ali AI (Epic 02)

### Description
The Theology of Time — 1972 lecture series by the Most Honorable Elijah Muhammad. Digitized, transcribed, and made searchable with Ali AI context.

### Acceptance Criteria
- [ ] Complete lecture series indexed by date and topic
- [ ] Full text transcripts (searchable)
- [ ] Audio playback synced with transcript (if audio available)
- [ ] Topic index: what topics are covered in which lectures
- [ ] Search: "What did the Most Honorable Elijah Muhammad say about [topic] in Theology of Time?"
- [ ] Bookmark and annotate passages
- [ ] Cross-reference to related Teachings (Supreme Wisdom, How to Eat to Live, etc.)
- [ ] AI-generated summaries per lecture
- [ ] Ali AI integration: contextual Q&A about Theology of Time content

### Files to Create
```
ali-platform/backend/src/modules/education/theology-of-time/
  index.ts
  theology-of-time.service.ts
  transcript.service.ts
  schema.graphql
  resolvers.ts
ali-platform/frontend/src/app/theology-of-time/
  page.tsx
  [lectureId]/page.tsx
ali-platform/frontend/src/components/study/
  TheologyOfTimeSeries.tsx
  TheologyOfTimeLecture.tsx
  TranscriptViewer.tsx
  TopicIndex.tsx
```

---

## Story 07.6: How to Eat to Live — Dietary Guidance Platform

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Story 07.1, Ali AI

### Description
How to Eat to Live (Books 1 & 2) by the Most Honorable Elijah Muhammad — digitized as a practical dietary guidance and meal planning tool.

### Acceptance Criteria
- [ ] Complete text of How to Eat to Live (Books 1 & 2) in readable format
- [ ] Food guidance database: approved foods, prohibited foods, reasoning from Teachings
- [ ] Meal planner based on the dietary guidelines
- [ ] Recipes aligned with How to Eat to Live principles
- [ ] Community-submitted recipes (moderated)
- [ ] Fasting guidance: one meal per day, every other day protocols
- [ ] Health tracking: weight, meals, fasting schedule
- [ ] Shopping list generator based on approved foods
- [ ] Ali AI (Elijah model): "What does How to Eat to Live say about [food]?" or "Plan my meals for this week"

### Files to Create
```
ali-platform/backend/src/modules/education/how-to-eat-to-live/
  index.ts
  dietary-guidance.service.ts
  meal-planner.service.ts
  schema.graphql
  resolvers.ts
ali-platform/frontend/src/components/health/
  HowToEatToLive.tsx
  FoodGuidance.tsx
  MealPlanner.tsx
  RecipeLibrary.tsx
  FastingTracker.tsx
  ShoppingList.tsx
```

---

## Story 07.7: Muhammad University of Islam Integration

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Story 07.1

### Description
Integration with Muhammad University of Islam (MUI) — PreK-12 school adjacent to Mosque Maryam. Learning management, parent portal, curriculum support.

### Acceptance Criteria
- [ ] School information page: grades, programs, enrollment
- [ ] Parent portal: grades, attendance, communications with teachers
- [ ] Curriculum support: supplementary materials aligned with MUI curriculum
- [ ] Student progress tracking
- [ ] School event calendar
- [ ] Enrollment application system
- [ ] Teacher tools: assignment posting, grading, parent communication
- [ ] Integration with Study Guide modules for supplementary learning

### Files to Create
```
ali-platform/backend/src/modules/education/mui/
  index.ts
  school.service.ts
  schema.graphql
  resolvers.ts
ali-platform/frontend/src/app/education/mui/
  page.tsx
  parent-portal/page.tsx
  enrollment/page.tsx
ali-platform/frontend/src/components/education/
  MUISchoolInfo.tsx
  ParentPortal.tsx
  StudentProgress.tsx
  EnrollmentForm.tsx
```
