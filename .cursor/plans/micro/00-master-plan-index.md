# Master Plan Index — Auset Platform & NOI Platform

**Created:** 2026-03-07
**Author:** Amen Ra + Claude Opus 4.6
**Total Epics:** 16
**Total Stories:** 114
**Each story is agent-executable** — a single Claude Code or Cursor agent can pick up and complete one story independently.

---

## Directory Separation (CRITICAL)

| Platform | Repo | Directory | Owner |
|----------|------|-----------|-------|
| **Auset / QuikNation** | quik-nation-ai-boilerplate | `backend/`, `frontend/`, `mobile/` | Quik Nation (PLATFORM_OWNER) |
| **NOI Platform** | Separate repo (TBD) | `ali-platform/` (planning here, lives in own repo) | Nation of Islam (PLATFORM_OWNER) |

The NOI platform will be in its **OWN repository** with a copy of the Auset boilerplate. Planning is done here. Implementation lives there.

---

## AI Architecture

| | Anthropic | QuikNation | NOI |
|---|---|---|---|
| **The AI** | Claude | **Clara** (Clara Villarosa) | **Ali** (Muhammad Ali) |
| **Top Model** | Opus | **Mary** (Dr. Mary McLeod Bethune) | **Wallace** (Master Fard Muhammad) |
| **Balanced** | Sonnet | **Maya** (Dr. Maya Angelou) | **Elijah** (The Most Honorable Elijah Muhammad) |
| **Quick** | Haiku | **Nikki** (Dr. Nikki Giovanni) | **Louis** (The Honorable Minister Farrakhan) |

---

## Payment Architecture

| Provider | Role | Strengths | Status |
|----------|------|-----------|--------|
| **Stripe** | Primary (domestic) | Connect, Terminal, Subscriptions, mature ecosystem | Production |
| **Yapit/YapEX** | Primary (global/diaspora) | Caribbean/Africa reach, Escrow, Bulk Payout, Black-owned | Testing (World Cup Ready) |

Dual-provider pattern: Stripe for domestic US, Yapit for global diaspora connections. Both platforms (Auset + NOI) support both providers.

- **Yapit Sandbox:** `https://api.yapit.app/api/merchant/sandbox/v1`
- **Yapit Production:** `https://api.yapit.app/api/merchant/production/v1`
- **Yapit Features:** Money In/Out, Quick Pay, Bulk Payout, Escrow, Invoicing, Cards, Liquid Cash API, Commissions
- **Strategic Value:** Connects Black diaspora globally — what Stripe cannot do

---

## Epic Map

### QuikNation / Auset Platform (This Repo)

| Epic | Plan File | Stories | Priority | Source |
|------|-----------|---------|----------|--------|
| **01** | `01-clara-ai-platform.md` | 6 stories | HIGH | New build |
| **09** | `09-site962-integration.md` | 6 stories | HIGH | New build |
| **10** | `10-quiknation-website.md` | 6 stories | HIGH | Enhance existing |
| **12** | `12-site962-auset-migration.md` | 12 stories | HIGH | Migrate from /Quik-Nation/site962 |
| **13** | `13-quiknation-stripe-dashboard.md` | 7 stories | HIGH | Enhance /Quik-Nation/quiknation/frontend-stripe (Stripe + Yapit) |
| **14** | `14-quiknation-admin-panel.md` | 7 stories | HIGH | Enhance /Quik-Nation/quiknation/frontend-admin |
| **15** | `15-quiknation-investor-portal.md` | 7 stories | HIGH | Enhance /Quik-Nation/quiknation/frontend-investors |
| **16** | `16-auset-platform-activation.md` | 12 stories | **CRITICAL** | Make the platform actually work |

### NOI Platform (Own Repo — Planned Here)

| Epic | Plan File | Stories | Priority |
|------|-----------|---------|----------|
| **02** | `02-ali-ai-platform.md` | 8 stories | HIGH |
| **03** | `03-noi-platform-core.md` | 5 stories | HIGH |
| **04** | `04-noi-mosque-management.md` | 6 stories | HIGH |
| **05** | `05-noi-foi-mgt-modules.md` | 6 stories | HIGH |
| **06** | `06-noi-media-commerce.md` | 7 stories | HIGH |
| **07** | `07-noi-education-teachings.md` | 7 stories | HIGH |
| **08** | `08-noi-global-reach.md` | 6 stories | MEDIUM-HIGH |

### Shared / Legal

| Epic | Plan File | Stories | Priority |
|------|-----------|---------|----------|
| **11** | `11-ip-legal-protection.md` | 6 stories | CRITICAL |

---

## Execution Strategy

### Phase 0: Make the Platform Work (CRITICAL — Do This First)
**Epic 16** (Auset Platform Activation) — Without this, nothing else matters.
- Stories 16.1-16.6: Activation API, dynamic schema/routes, migrations, commands
- Stories 16.7: Extract QuikCarRental into Ausar (proves it works)
- Stories 16.8: Feature generator (accelerates everything else)
- Stories 16.9-16.11: Core features with real code (auth, payments [Stripe + Yapit], notifications)
- Story 16.12: Frontend feature system

### Phase 1: Foundation (Parallel — 5 agents)
Run these simultaneously — they have no dependencies on each other:
- **Epic 11** (IP/Legal) — FIRST. Secure the names before anything goes public.
- **Epic 01** (Clara AI) — QuikNation's AI, stories 01.1-01.3 (backend)
- **Epic 03** (NOI Platform Core) — Scaffold the separate repo
- **Epic 12** (Site962 Migration) — Stories 12.1-12.2 (product config + DB schema)
- **Epic 10** (QuikNation.com) — Stories 10.1-10.3 (frontend only)

### Phase 2: Active Projects (Parallel — existing codebases)
These build on what already exists at /Quik-Nation/site962 and /Quik-Nation/quiknation:
- **Epic 12** Stories 12.3-12.7 (Site962 GraphQL modules)
- **Epic 13** (Stripe + Yapit Payment Dashboard) — Enhance existing frontend-stripe
- **Epic 14** (Admin Panel) — Enhance existing frontend-admin
- **Epic 15** (Investor Portal) — Enhance existing frontend-investors
- **Epic 02** (Ali AI) — All 8 stories can run in parallel with Clara

### Phase 3: Site962 Frontend + NOI Deep Modules (Parallel)
- **Epic 12** Stories 12.8-12.12 (Site962 frontend migration + tests + deployment)
- **Epic 04** (Mosque Management) — Depends on Epic 03
- **Epic 05** (FOI/MGT) — Depends on Epic 04
- **Epic 06** (Media/Commerce) — Depends on Epic 03
- **Epic 07** (Teachings/Education) — Depends on Epic 03 + Ali AI
- **Epic 09** (Site962 Multi-Product Integration) — After migration complete

### Phase 4: Global & Polish
- **Epic 08** (Global Reach) — Depends on Epics 03-07
- **Epic 01** Stories 01.4-01.6 (Clara frontend, onboarding)
- **Epic 10** Stories 10.4-10.6 (Clara demo, dev portal, membership)

## Existing Project References

| Project | Location | Stack | Status |
|---------|----------|-------|--------|
| **Site962** | /Volumes/X10-Pro/Native-Projects/Quik-Nation/site962 | Next.js 14, MongoDB, Mongoose, 778 TS files, 30+ models | Production (site962.com) |
| **QuikNation** | /Volumes/X10-Pro/Native-Projects/Quik-Nation/quiknation | 4 frontends (Next.js 15), Express+GraphQL backend, PostgreSQL, 10 Stripe platforms + Yapit | Production (quiknation.com) |

### QuikNation Subdomain Architecture
| Subdomain | Frontend | Port | Status |
|-----------|----------|------|--------|
| quiknation.com | frontend-main | 3006 | Production |
| admin.quiknation.com | frontend-admin | 3010 | Production |
| investors.quiknation.com | frontend-investors | 3008 | Production |
| stripe.quiknation.com | frontend-stripe | 3020 | Production |
| API | backend (Express+GraphQL) | 3005 | Production |

---

## How to Use These Plans

### In Claude Code:
```bash
# Read a plan
Read .claude/plans/micro/01-clara-ai-platform.md

# Create tasks from a plan
TaskCreate: subject="Story 01.1: Clara AI Core Architecture" ...

# An agent picks up and executes a story
```

### In Cursor:
```bash
# Plans are mirrored in .cursor/plans/micro/
# Open any plan file, Cursor agent reads it and executes
```

### Parallel Agent Workflow:
1. Agent A reads `01-clara-ai-platform.md` → claims Story 01.1
2. Agent B reads `03-noi-platform-core.md` → claims Story 03.1
3. Agent C reads `11-ip-legal-protection.md` → claims Story 11.1
4. All three work independently, no conflicts

---

## IP Protection Reminder

ALL names must be secured before public launch:
- **QuikNation**: Clara, Mary, Maya, Nikki, Quik Intelligence, Auset Platform, all product names
- **NOI**: Ali (CRITICAL — research Muhammad Ali estate licensing), Wallace, Elijah, Louis
- See Epic 11 for full IP protection plan
