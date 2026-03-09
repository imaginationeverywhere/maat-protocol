# Escalation Rules Template

Copy-paste template for defining escalation rules in your Maat Protocol setup. Define these rules before starting work. They are the contract between your Manager and Architect.

Replace `[PLACEHOLDER]` values with your project specifics.

---

## How to Use This Template

1. Copy this file to your project root as `ESCALATION_RULES.md`
2. Fill in the placeholders for your project
3. Include the completed rules in your Manager's system prompt
4. Reference it when training new contributors on the system

---

## Template: Escalation Rules

```markdown
# Escalation Rules — [PROJECT_NAME]

Last updated: [DATE]
Architect: [ARCHITECT_MODEL] (e.g., claude-opus-4-6)
Manager: [MANAGER_MODEL] (e.g., claude-haiku-4-5)
Workers: [WORKER_TOOL] (e.g., cursor agent, codex, aider)

---

## Level 1 — Worker Handles It

The Manager dispatches a Worker. No Architect involvement.

### Code Fixes
- TypeScript type errors (cast, missing import, undefined property access)
- Python type annotation errors (simple type mismatch)
- Lint errors (any rule with an auto-fix)
- Format violations (prettier, black, rustfmt)
- Missing imports or incorrect import paths
- Unused variable/import warnings
- JSDoc/docstring formatting

### Test Fixes
- Test failing due to outdated mock (mock returns wrong shape)
- Test failing due to missing mock setup
- Snapshot tests that need updating after intentional UI change
- Test timeout that needs a longer timeout value
- Import error in test file

### Routine Actions
- Sending notifications (Slack, GitHub comments, email)
- Updating documentation after code changes (README sections, JSDoc)
- Running database migrations (when migration file is already written)
- Bumping version numbers in package.json / pyproject.toml
- Updating changelogs

### Worker Dispatch Decision Rule
A Worker fix is appropriate when the Manager can write a task description
that a junior developer could execute in under 30 minutes without asking
any clarifying questions.

---

## Level 2 — Manager Reports to Architect

The Manager writes to ESCALATION.md and waits. No Worker is dispatched
for the affected area until the Architect responds.

### Design Conflicts
- A fix requires changing a public function signature
- A fix requires changing an API response shape
- Two requirements contradict each other (fix X breaks Y)
- The spec in DECISION.md conflicts with existing code behavior

### Repeated Worker Failure
- A Worker has failed [FAILURE_THRESHOLD] times on the same task
  (Default threshold: 2 failures)
- Worker succeeds but introduces a new, related error
- Worker output is correct but breaks an unrelated test

### Scope Expansion
- A "simple fix" turns out to require changes in [SCOPE_THRESHOLD]+ files
  (Default threshold: 4 files)
- A bug fix reveals that the root cause is in a dependency or shared utility
- A test fix would require changing the source file's behavior

### Uncertain Territory
- Security-related code (auth, encryption, permissions, input validation)
- Data model changes (database schema, API contracts, data types shared across services)
- Performance-sensitive code (query optimization, caching strategy, algorithm choice)
- [PROJECT_SPECIFIC_SENSITIVE_AREAS] — e.g., payment processing, PII handling

---

## Level 3 — Architect Decides

Architect-only territory. The Manager escalates and the entire affected work stream pauses.

### Architecture Changes
- New service, module, or package introduction
- Removing or deprecating existing functionality
- Changing the data flow between components
- Introducing a new dependency or removing an existing one

### Cross-Cutting Concerns
- Authentication strategy changes
- Logging, monitoring, or observability changes
- Error handling strategy changes
- Performance optimization strategy

### Strategic Decisions
- Build vs. buy (new library, service, or framework)
- [PROJECT_SPECIFIC_STRATEGIC_AREAS] — define what's strategic for your project

---

## Escalation Report Format

When escalating to Level 2 or 3, write ESCALATION.md in this format:

```
# ESCALATION — [DATE] [TIME]

## Summary
[One sentence: what happened and why it blocks progress]

## Observation
[Exact error message, test output, or state that triggered escalation]

## Attempted Actions
[List any Workers that were dispatched and what they produced]
- Worker 1: [task] — [result]
- Worker 2: [task] — [result]

## Why This Requires Architect Review
[Specific reason: which Level 2/3 rule applies]

## Options
[Optional: 2–3 possible approaches for the Architect to consider]
1. [Option A]: [brief description, trade-offs]
2. [Option B]: [brief description, trade-offs]
3. [Option C]: [brief description, trade-offs]

## Affected Areas
[Files, modules, or services that are blocked or affected]

## Worker Status
[Are Workers paused? Is any work in progress? What is the current state?]
```

---

## Manager Decision Checklist

Before dispatching a Worker, the Manager should confirm:

□ The task can be described in one clear sentence
□ The affected file(s) and line number(s) are known
□ The fix does not change public function signatures
□ The fix does not change API response shapes
□ The fix has not been attempted and failed before
□ The number of active Workers is below [MAX_WORKERS]

If any box is unchecked, escalate instead of dispatching.

---

## Architect Response SLA

[Optional — fill in expected response times]

- Level 2 escalation: Architect reviews within [RESPONSE_TIME] (e.g., 30 minutes, same day)
- Level 3 escalation: Architect reviews within [RESPONSE_TIME] (e.g., 2 hours, same day)
- While waiting: Workers on unrelated tasks may continue; affected area is paused

---

## Project-Specific Rules

[Add rules specific to your codebase here]

Example entries:
- Any change to `src/auth/` or `src/payments/` → escalate regardless of apparent simplicity
- Database migrations: always escalate for review before running in staging or production
- Changes to `[CRITICAL_FILE]` → Level 3, Architect reviews directly
- API changes in `[PUBLIC_API_PATH]` → Level 3, check for consumer compatibility
```

---

## Filled Example: TypeScript API Project

```markdown
# Escalation Rules — user-api

Last updated: 2026-03-09
Architect: claude-opus-4-6
Manager: claude-haiku-4-5 (local Ollama fallback: llama3.2)
Workers: cursor agent

## Level 1 — Worker Handles It

### Code Fixes
- TypeScript type errors (cast, missing import, undefined property)
- ESLint errors with available auto-fix
- Prettier formatting violations
- Missing imports or incorrect import paths

### Test Fixes
- Test failing due to outdated mock shape
- Snapshot test needing update after intentional change
- Missing mock setup in beforeEach

### Routine Actions
- Slack notifications via webhook
- JSDoc updates after code changes
- Version bump in package.json

## Level 2 — Escalate to Architect

### Trigger: Repeated Failure
- Worker has failed 2 times on same task

### Trigger: Scope Expansion
- Fix requires changes in 4+ files

### Trigger: Uncertain Territory
- Any change in src/auth/
- Any change in src/payments/
- Any change in src/middleware/security.ts

## Level 3 — Architect Decides

- New package introduction
- Database schema changes
- API response shape changes (breaking)
- Authentication strategy

## Project-Specific Rules
- NEVER auto-fix anything in migrations/ — always escalate
- Changes to User or Account models → Level 3
- Rate limiting config changes → Level 2
```

---

## Quick Reference Card

```
┌─────────────────────────────────────────────────────────────┐
│              ESCALATION DECISION TREE                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  New observation ─────────────────────────────────────────► │
│                                                             │
│  Is the fix describable in one sentence?                    │
│  └── NO  → ESCALATE (scope too large)                       │
│  └── YES ↓                                                  │
│                                                             │
│  Does the fix change a public signature or API shape?       │
│  └── YES → ESCALATE (architectural change)                  │
│  └── NO  ↓                                                  │
│                                                             │
│  Is this in a sensitive area (auth, payments, data model)?  │
│  └── YES → ESCALATE (high-risk area)                        │
│  └── NO  ↓                                                  │
│                                                             │
│  Has this task failed before?                               │
│  └── 2+ times → ESCALATE (misclassified as simple)          │
│  └── 0–1 times ↓                                            │
│                                                             │
│  → DISPATCH WORKER                                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Escalation Anti-Patterns

**Over-escalating:** The Manager escalates every error to the Architect. Result: Architect spends time on trivial issues, loses time for real architectural work, and gets frustrated with the protocol.

**Under-escalating:** The Manager dispatches Workers for architectural issues. Workers "fix" the issue in a way that violates design intent. Technical debt accumulates silently.

**Stale escalations:** The Manager escalates, the Architect responds in DECISION.md, but the Manager doesn't check for the response. The affected work stream stays blocked indefinitely.

**Duplicate escalations:** The Manager writes a new ESCALATION.md on every cycle while waiting for the Architect. The Architect receives the same escalation 10 times. Solution: write ESCALATION.md once, then set a flag (`ESCALATION_PENDING=true`) and skip re-escalating until the Architect responds.

---

## Maintaining the Escalation Log

Beyond ESCALATION.md (current escalation) and DECISION.md (current decision), maintain an archive for retrospectives:

```bash
# After an escalation is resolved, archive it:
timestamp=$(date +%Y%m%d_%H%M)
cp ESCALATION.md escalations/${timestamp}_escalation.md
cp DECISION.md escalations/${timestamp}_decision.md
```

Review escalations weekly:
- Which issues were escalated that could have been Worker-handled?
- Which Worker dispatches should have been escalated?
- Are there patterns suggesting the Manager's classification needs tuning?

Tune the Manager's classification prompt based on these reviews. The escalation rules are a living document.
