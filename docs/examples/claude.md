# Maat Protocol: Anthropic Ecosystem

Complete working example using Claude Opus, Haiku, and Cursor Agent.

---

## Setup

**Prerequisites:**
- `claude` CLI installed and authenticated (`npm install -g @anthropic-ai/claude-code`)
- `cursor` installed with Agent mode enabled
- A project repository to orchestrate

**Tier assignments:**
```
Tier 1 — Architect:  claude (default model: claude-opus-4-6)
Tier 2 — Manager:    claude --model claude-haiku-4-5-20251001
Tier 3 — Workers:    cursor agent --print ... --apply
```

---

## Terminal Setup

Open three terminals. This is the physical separation of concerns.

```
┌─────────────────────────┐  ┌─────────────────────────┐
│   Terminal 1            │  │   Terminal 2            │
│   ARCHITECT             │  │   MANAGER               │
│   $ claude              │  │   $ claude --model      │
│   (claude-opus-4-6)     │  │     claude-haiku-4-5-   │
│                         │  │     20251001            │
│   Active when engaged   │  │   Always running        │
└─────────────────────────┘  └─────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│   Terminal 3 (or Background Processes)                   │
│   WORKERS                                                │
│   cursor agent --print "..." --apply                     │
│   (Spawned by Manager, run in background)                │
└──────────────────────────────────────────────────────────┘
```

---

## Step 1: Architect Session (Terminal 1)

Start the Architect with a system prompt that defines its role:

```bash
$ claude
```

Opening Architect prompt:
```
You are the Architect for this project.

Your role:
- Define technical direction and system design
- Review escalations from the Manager
- Write decisions to DECISION.md when the Manager escalates
- Break features into scoped work packages for the Manager to dispatch

Your rules:
- Do NOT monitor builds, test output, or file changes
- Do NOT write or edit code directly
- Do NOT dispatch Workers directly — specify work, let Manager dispatch
- ONLY engage when the Manager writes to ESCALATION.md

When you receive an escalation, read ESCALATION.md and write your
decision to DECISION.md. Be specific. Workers will execute from your spec.

Current project: [describe your project here]
```

The Architect is now ready. It waits. You use it when you need architectural decisions or when the Manager escalates.

---

## Step 2: Manager Loop (Terminal 2)

Start Haiku with its monitoring prompt. This is the continuous loop.

```bash
$ claude --model claude-haiku-4-5-20251001
```

Manager system prompt:
```
You are the Manager for this project. Run the Monitor-Decide-Dispatch loop.

MONITOR (check every 2 minutes):
1. Run: npx tsc --noEmit 2>&1 | head -50
2. Run: npm test -- --passWithNoTests 2>&1 | tail -30
3. Check: cat ESCALATION_RESPONSE.md (if it exists)
4. Check: ls -la *.worker.done 2>/dev/null

DECIDE for each observation:
- TypeScript errors → classify as simple (type cast, missing import) or complex
- Test failures → classify as simple (missing mock, import) or complex
- ESCALATION_RESPONSE.md exists → execute the Architect's decision
- Worker completion (.done file) → verify output, delete .done file

DISPATCH rules:
- Simple fix → cursor agent --print "[precise fix]" --apply
- Complex issue → write to ESCALATION.md, wait for Architect
- Max 4 concurrent Workers — check with: ls -la *.worker.pid 2>/dev/null | wc -l

After each cycle, wait 2 minutes and repeat.
Start your first monitoring cycle now.
```

The Manager loop runs. It will begin checking TypeScript errors, test output, and escalation responses on a 2-minute cycle.

---

## Step 3: Worker Dispatch Examples

Workers are spawned by the Manager. These are example commands the Manager will generate and run.

### TypeScript Fix Worker

```bash
cursor agent --print "
Fix TypeScript error in src/auth/service.ts:
  Error: Argument of type 'string' is not assignable to parameter of type 'UserID'
  Location: line 47, call to validateUser()
  Fix: Cast the argument: validateUser(userId as UserID)
  Do not change the function signature in service.ts or its type definitions.
  After fixing, confirm with: npx tsc --noEmit src/auth/service.ts
" --apply &
echo $! > auth-fix.worker.pid
```

### Test Fix Worker

```bash
cursor agent --print "
Fix failing test in tests/auth/login.spec.ts
  Error: Cannot read properties of undefined (reading 'id') at line 34
  Cause: The mock UserRepository returns undefined for findById()
  Fix: In the mock setup (line 18), change:
    mockUserRepo.findById.mockResolvedValue(undefined)
  to:
    mockUserRepo.findById.mockResolvedValue({ id: 'test-user-1', email: 'test@example.com' })
  Only edit the test file. Do not change source files.
  Run: npm test -- tests/auth/login.spec.ts to confirm.
" --apply &
echo $! > auth-test-fix.worker.pid
```

### Notification Worker

```bash
cursor agent --print "
All tests are passing. Send a Slack notification using the Slack CLI:
  slack send --channel '#builds' --text 'Build passing ✓ All tests green. Branch: main'
If the Slack CLI is not installed, use curl with the webhook in .env:
  curl -X POST \$SLACK_WEBHOOK_URL -H 'Content-type: application/json' \
    --data '{\"text\":\"Build passing. All tests green. Branch: main\"}'
Write the result (success or error) to NOTIFICATION.result
" --apply &
echo $! > notify.worker.pid
```

---

## Step 4: Escalation Flow

When the Manager encounters an issue beyond Worker scope:

**Manager writes ESCALATION.md:**
```markdown
# ESCALATION — 2026-03-09 14:32

## Observation
Three Workers have attempted to fix the pagination implementation.
All three failed. The issue is that the current offset-based pagination
conflicts with the real-time update requirement added in the last sprint.

## Attempted Actions
- Worker 1: Tried to fix SQL query offset calculation — test still fails
- Worker 2: Tried to add cursor-based pagination — broke existing API contract
- Worker 3: Tried to cache the offset — introduced stale data bugs

## Why Escalation Is Required
The pagination approach is architecturally incompatible with real-time
updates. This requires a design decision: do we change the pagination
strategy, accept eventual consistency, or implement a different approach?

## Options
1. Keyset/cursor pagination (no offsets, real-time safe)
2. Accept stale count in paginated views (simpler, some UX tradeoff)
3. Separate read model for paginated views (CQRS, more complex)

## Worker Status
All pagination Workers are paused. The feature is blocked.
```

**Architect reads escalation, writes DECISION.md:**
```markdown
# DECISION — 2026-03-09 14:45

## Escalation: Pagination + Real-time Conflict

Decision: Use keyset pagination (option 1).

Implementation spec:
- Replace offset/limit with cursor-based pagination
- Cursor = base64-encoded { id, timestamp } of last item
- API change: /api/items?cursor=<token>&limit=20
- Response adds: { items: [...], nextCursor: '<token>', hasMore: boolean }
- Update the OpenAPI spec in docs/api.yaml
- Update the frontend useItems hook in src/hooks/useItems.ts
- Write a migration script if existing bookmark cursors need updating

The current API consumers are internal only — breaking change is acceptable.
Update tests to use cursor-based assertions.
```

**Manager reads DECISION.md, dispatches Workers:**
```bash
# Worker 1: Update API endpoint
cursor agent --print "
Implement keyset pagination in src/api/items.ts per DECISION.md:
- Remove offset/limit params, add cursor param
- Cursor is base64({ id, timestamp }) of last item
- Add nextCursor and hasMore to response
- Update OpenAPI spec in docs/api.yaml
" --apply &

# Worker 2: Update frontend hook
cursor agent --print "
Update src/hooks/useItems.ts to use cursor-based pagination per DECISION.md:
- Replace page/offset state with cursor state
- Load more by passing nextCursor as cursor param
- Track hasMore for infinite scroll termination
" --apply &
```

---

## Cost Analysis

Real-world cost breakdown for a 10-hour active development day:

| Tier | Model | Estimated Daily Usage | Price | Daily Cost |
|------|-------|----------------------|-------|------------|
| Architect | claude-opus-4-6 | 30 messages × ~1,500 tokens | $15/M output | ~$0.68 |
| Manager | claude-haiku-4-5 | 300 cycles × ~800 tokens | $1.25/M output | ~$0.30 |
| Workers | cursor agent | ~40 tasks | ~$19/mo subscription | ~$0.63/day |
| **Total** | | | | **~$1.61/day** |

**Without Maat Protocol (Opus doing everything):**

| Approach | Messages | Tokens | Cost |
|---------|---------|--------|------|
| Single Opus session | 330 msgs | ~495,000 output | ~$7.43 |
| Opus monitoring loop | +300 cycles | +240,000 output | +$3.60 |
| **Total** | | | **~$11.03/day** |

**Savings with Maat Protocol: ~85%** on a typical development day.

For teams running 24/7 monitoring (CI/CD, production observability):

| Setup | Monthly Cost |
|-------|-------------|
| Opus monitoring 24/7 | ~$216/month |
| Haiku monitoring 24/7 | ~$18/month |
| Local Llama monitoring | $0/month |

---

## Using `/loop` for the Manager

Claude Code's `/loop` command makes the Manager easier to sustain:

```bash
$ claude --model claude-haiku-4-5-20251001

# Inside the Claude session:
/loop 2m "
Check TypeScript errors with: npx tsc --noEmit 2>&1 | head -30
Check test status with: npm test -- --passWithNoTests 2>&1 | tail -20
If errors exist, dispatch a cursor agent to fix them.
If all clear, do nothing.
"
```

The `/loop` command runs the prompt on a 2-minute interval. The Manager context accumulates observations and dispatch history. Reset the context every 30–60 minutes to keep Haiku's context clean.

---

## Full Working Session Example

Here's a condensed view of what a real session looks like:

```
[Terminal 1 — Architect]
$ claude
> [Waiting for work or escalations]

[Terminal 2 — Manager, Haiku running /loop]
14:00: Monitoring cycle 1
  - tsc: 3 errors in auth/service.ts, types/user.ts, api/handler.ts
  - tests: 12 passing, 0 failing
  Decision: Dispatch type-fix Worker for each error file (3 Workers)

14:00: Dispatching Workers...
  cursor agent "Fix TS2345 in auth/service.ts:47" --apply &
  cursor agent "Fix TS2322 in types/user.ts:12" --apply &
  cursor agent "Fix TS2339 in api/handler.ts:88" --apply &

14:02: Monitoring cycle 2
  - tsc: 1 error remaining (types/user.ts Worker still running)
  - 2 Workers completed (.done files found)
  - Worker auth/service.ts: SUCCESS
  - Worker api/handler.ts: SUCCESS
  Decision: Wait for remaining Worker

14:04: Monitoring cycle 3
  - tsc: 0 errors
  - tests: 12 passing
  - All Workers complete
  Decision: Clean. No action.
  [Dispatch notification Worker to Slack]

[All clear. Architect not engaged. Cost: ~$0.02 for this session]
```

---

## Tips for the Anthropic Ecosystem

**Keep Haiku's context clean.** The Manager loop accumulates context fast. Use `/clear` or restart the session every 1–2 hours. The loop state lives in the monitored files, not the context window.

**Give Cursor precise scopes.** The more specific the `cursor agent --print` command, the better the output. Include: file path, line number, error message, and constraint ("do not change function signature").

**Use DECISION.md as a protocol.** Don't have the Architect send messages directly to the Manager in chat. Write to DECISION.md. The Manager polls for it. This enforces the async communication pattern and keeps tiers cleanly separated.

**Monitor active Workers.** Before dispatching, always check `pgrep -f "cursor agent" | wc -l`. If over 4, wait. Concurrent Workers editing the same file create conflicts.

**Escalate early.** If a Worker fails twice on the same task, escalate immediately. Two failures signal a classification error — the task was misidentified as "simple." Don't dispatch a third Worker.
