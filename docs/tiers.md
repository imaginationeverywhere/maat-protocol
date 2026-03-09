# Tier Definitions

Three tiers. Three roles. No overlap.

Each tier is defined by what it does, what it never does, the model requirements for that tier, and how it interfaces with the tiers above and below it.

---

## Tier 1: Architect

### What It Does

The Architect is the system's decision-maker. It holds the full context of the project — business requirements, technical constraints, existing architecture, past decisions. Every significant choice routes through the Architect.

Architect responsibilities:
- Define the system design and technical direction
- Review escalated issues from the Manager
- Break large goals into scoped work packages
- Resolve conflicts between requirements
- Make final calls on trade-offs (performance vs. simplicity, speed vs. correctness)
- Respond to the Manager when escalation requires a decision

The Architect is not a background process. It is active when engaged and idle when not. It does not run in a loop.

### What It Never Does

- Monitor build status, test output, or file changes
- Write, edit, or review code directly (it specifies; Workers implement)
- Dispatch Workers directly (the Manager dispatches)
- Run CLI commands, tools, or scripts
- Maintain awareness of real-time system state (that's the Manager's job)

If you find your Architect monitoring CI or writing code, you have a tier violation. Stop. Reassign the task to the correct tier.

### Model Requirements

The Architect tier requires strong reasoning capability. The problems it handles are ambiguous, high-stakes, and context-heavy. The model must:

- Handle long context windows (full codebase context, multi-session history)
- Reason through trade-offs without obvious right answers
- Generate detailed, precise specifications that Workers can follow without clarification
- Recognize when its own design assumptions are wrong and update them

**Recommended models:**
- `claude-opus-4-6` (Anthropic) — Best for complex reasoning and code architecture
- `gpt-5` / `o3` (OpenAI) — Strong for technical design
- `llama-3.1-405b` (Meta / local) — Capable open-source option for cost-sensitive setups
- `gemini-2.5-pro` (Google) — Strong multimodal reasoning

The Architect tier is your most expensive compute. That's acceptable — it runs rarely. Reserve it for decisions that actually require its capability.

### Interfaces

**Receives from:** Manager escalation reports (structured, written to a file the Architect reads)

**Sends to:** Work packages, specifications, and decisions written to files the Manager monitors

**Communication pattern:**
```
Manager writes: ESCALATION.md
  → "Found architectural conflict in auth module.
     Worker paused. Awaiting decision."

Architect reads: ESCALATION.md
  → Reviews, decides, writes response

Architect writes: DECISION.md
  → "Use UUID alias column. Migration spec in AUTH_SPEC.md.
     Resume Worker with updated spec."

Manager reads: DECISION.md
  → Dispatches Worker with updated spec
```

The Architect does not directly interact with Workers. All communication routes through the Manager tier.

---

## Tier 2: Manager

### What It Does

The Manager runs the Monitor-Decide-Dispatch (MDD) loop. It is the nervous system of the hierarchy — constantly observing, classifying, and routing work.

Manager responsibilities:
- **Monitor:** Continuously check system state (build output, test results, type errors, file changes, Worker completion status)
- **Decide:** Classify observations into one of three outcomes: do nothing, dispatch Worker, escalate to Architect
- **Dispatch:** Invoke Workers with precise, scoped task descriptions
- **Track:** Maintain awareness of active Workers and prevent overload (max 3–4 concurrent Workers)
- **Verify:** After a Worker completes, confirm the result before proceeding
- **Report:** Write structured escalation reports when issues exceed Worker scope

The Manager is a background process. It runs continuously in its own terminal or process. Its context window should stay clean — focused on the current monitoring state, not accumulating task history.

### What It Never Does

- Write code, edit files, or execute fixes directly
- Make architectural decisions
- Run more than 4 Workers simultaneously (queue instead)
- Escalate issues that are clearly Worker-scope
- Skip verification after a Worker reports completion
- Allow Workers to self-dispatch (all dispatch comes from Manager)

### The MDD Loop in Detail

```
┌─────────────────────────────────────────────────────────┐
│                      MDD CYCLE                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  MONITOR                                                │
│  ├── Read: build logs, test output, tsc errors          │
│  ├── Read: Worker completion reports                    │
│  ├── Read: ESCALATION_RESPONSE.md (Architect decisions) │
│  └── Read: file change events                           │
│                                                         │
│  DECIDE (classify each observation)                     │
│  ├── Nothing to do → loop back to Monitor               │
│  ├── Simple fix → Dispatch Worker                       │
│  ├── Worker completed → Verify output                   │
│  └── Architectural issue → Write escalation report      │
│                                                         │
│  DISPATCH (when action required)                        │
│  ├── Check: active Workers < 4                          │
│  ├── Write: precise task description                    │
│  ├── Invoke: cursor agent / codex / aider               │
│  └── Log: task ID and expected output                   │
│                                                         │
│  Wait (30s – 5m depending on monitoring target)         │
│  └── Loop back to Monitor                               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### When to Skip (Do Nothing)

Not every observation requires action. The Manager must correctly identify when to do nothing:

- Build passed → no action (optionally dispatch notification Worker)
- Tests green → no action
- File changed but no errors → no action
- Worker is still running → wait, do not dispatch duplicate
- Issue already has an active Worker → do not dispatch again

Over-dispatching is as harmful as under-dispatching. A Manager that dispatches a Worker for every small observation will exhaust the Worker tier and create conflicting changes.

### When to Dispatch a Worker

Dispatch when:
- TypeScript / lint / format errors with a clear fix
- Test failures with a known fix pattern (import missing, mock outdated)
- Documentation needs updating after a code change
- A notification needs to be sent (build passed, PR ready)
- A routine task is clearly scoped and requires no design decisions

Dispatch rules:
1. Maximum 4 concurrent Workers
2. Each Worker gets one task — not a list
3. The task description must be self-contained — no "see earlier context"
4. Include the exact file, line, error, and expected fix when available

### When to Escalate to Architect

Escalate when:
- The required fix would change a function signature, API contract, or database schema
- Two requirements conflict and the resolution requires understanding intent
- A Worker has failed 2+ times on the same task
- Security implications are unclear
- The scope of a fix is larger than anticipated and could affect other systems
- Architectural patterns are inconsistent and require a design decision

Escalation format:
```markdown
# ESCALATION — [date] [time]

## Observation
[What the Manager observed — exact error/state]

## Attempted Action
[What Workers were dispatched, if any, and what they produced]

## Why Escalation Is Required
[Why this exceeds Worker scope — be specific]

## Suggested Options
[Optional: 2–3 possible approaches for the Architect to choose from]

## Worker Status
[Are Workers paused? Running? What is the current system state?]
```

### Model Requirements

The Manager tier does not require strong reasoning. It requires:

- Reliable instruction-following (structured loop, not creative problem-solving)
- Fast response time (the loop cycles frequently)
- Low cost (it runs continuously; token burn compounds quickly)
- Sufficient capability to classify issues as "simple" vs "architectural"

**Recommended models:**
- `claude-haiku-4-5` (Anthropic) — Fast, cheap, reliable instruction-following
- `gpt-4o-mini` (OpenAI) — Cost-effective, solid classification
- `llama3.2` via Ollama (local) — Free, unlimited, ideal for high-frequency loops
- `gemini-2.0-flash` (Google) — Fast and cheap with good throughput

The Manager tier is where you save money. A free local model handling monitoring allows you to spend your API budget where it matters: Architect decisions.

### Interfaces

**Receives from:** System state (logs, test output, file changes), Worker completion reports, Architect decisions (DECISION.md)

**Sends to:** Worker dispatch commands, escalation reports (ESCALATION.md)

---

## Tier 3: Workers

### What They Do

Workers execute. They receive scoped tasks from the Manager and produce concrete outputs: changed files, test results, notifications, reports. Each Worker handles exactly one task.

Worker outputs:
- Modified source files (bug fixes, feature additions)
- New files (tests, documentation, migrations)
- Executed commands (test runner, linter, formatter)
- External actions (Slack notification, GitHub comment, email)
- Reports (test results, lint summary, analysis)

Workers are stateless. Each invocation is independent. A Worker does not remember previous tasks. This is a feature — it prevents context drift and keeps Worker outputs predictable.

### Types of Workers

**Code Workers** — Write and modify code.
```bash
cursor agent --print "Fix the TypeScript error in auth/service.ts line 42.
The function validateUser() expects UserID but receives string.
Cast the argument: validateUser(userId as UserID).
Do not change function signatures." --apply
```

**Test Workers** — Run tests, interpret results, fix test failures.
```bash
cursor agent --print "Run: npm test -- --testPathPattern=auth.
If tests fail, check for missing mocks. The UserRepository mock
is in tests/mocks/user-repository.ts. Fix only the test file,
not the source." --apply
```

**Notification Workers** — Send messages, post comments, trigger webhooks.
```bash
cursor agent --print "Post a GitHub comment on PR #142 using the
gh CLI: 'Build passing. Tests green. Ready for review.'
Use: gh pr comment 142 --body 'Build passing...'"
```

**Analysis Workers** — Read, analyze, and report.
```bash
cursor agent --print "Run: npx tsc --noEmit. Collect all TypeScript
errors. Write a summary to TYPESCRIPT_ERRORS.md with: file, line,
error code, error message. One row per error."
```

**Migration Workers** — Database changes, dependency updates, config changes.
```bash
cursor agent --print "Run the database migration in
migrations/20260309_add_uuid_alias.sql against the local database.
Connection string is in .env.local. Report result to MIGRATION_RESULT.md."
```

### How to Dispatch Workers

The Manager invokes Workers via CLI. The dispatch command must be self-contained.

A good dispatch command includes:
1. **What to do** — the specific task
2. **Where to do it** — file path, line number, or command to run
3. **Constraints** — what NOT to change, what to preserve
4. **Output** — where to write results or confirmation

```bash
# Good dispatch: specific, scoped, constrained
cursor agent --print "
  Task: Fix the failing test in tests/auth/login.spec.ts
  Error: 'Cannot read property userId of undefined' at line 28
  Cause: The mock user object is missing the userId field
  Fix: Add userId: 'test-user-1' to the mock at line 15
  Constraint: Do not change the source file. Test file only.
  Output: Run the test and confirm it passes.
" --apply

# Bad dispatch: vague, unbounded
cursor agent --print "Fix the auth tests" --apply
```

### Worker Concurrency

The Manager enforces a maximum of 4 concurrent Workers. This limit exists because:
- Workers writing to the same files create conflicts
- Too many concurrent Workers makes verification difficult
- Most systems can't absorb 8+ simultaneous changes cleanly

When the queue exceeds 4 active Workers, the Manager holds new tasks and dispatches them as existing Workers complete.

### Worker Failure Handling

Workers fail. The Manager handles failure:

```
Worker completes → Manager verifies output
  ├── Success: log completion, loop back to Monitor
  ├── Partial success: dispatch follow-up Worker with correction
  └── Failure (2nd attempt): escalate to Architect with Worker output
```

A Worker that fails twice on the same task is a signal of a Manager decision error — the task was wrongly classified as "simple" and likely requires architectural review.

### Model Requirements for Workers

Workers use CLI-based code agents, not conversational LLMs:
- **Cursor Agent** — IDE-integrated, strong code generation and file editing
- **Codex CLI** (`codex`) — OpenAI's terminal code agent, excellent for JS/TS
- **Aider** — Open source, works with any LLM backend via API
- **GitHub Copilot CLI** — For teams already in the GitHub ecosystem

The "model" powering the Worker tool is configurable. For Aider, you can point it at any API. For Cursor Agent, it uses its built-in model. The key is that Workers operate via terminal commands — no interactive session required.

---

## Tier Interaction Summary

```
┌────────────────────────────────────────────────────────────┐
│                    TIER INTERACTION MAP                    │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ┌──────────────────┐                                      │
│  │   ARCHITECT       │  Tier 1 — Active when engaged       │
│  │   (Opus / GPT-5)  │  Handles: design, decisions         │
│  └────────┬─────────┘  Never: monitors, codes              │
│           │ writes DECISION.md                             │
│           │ reads ESCALATION.md                            │
│  ┌────────┴─────────┐                                      │
│  │   MANAGER        │  Tier 2 — Always running             │
│  │  (Haiku / Mini)  │  Handles: MDD loop, dispatch         │
│  └────────┬─────────┘  Never: codes, decides architecture  │
│           │ dispatches commands                            │
│           │ reads Worker outputs                           │
│  ┌────────┴─────────┐                                      │
│  │    WORKERS       │  Tier 3 — Spawned on demand          │
│  │ (Cursor / Aider) │  Handles: execution, output          │
│  └──────────────────┘  Never: decides, escalates directly  │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

The Architect talks to the Manager. The Manager talks to Workers. Workers report to the Manager. Nothing skips a tier.

This is not bureaucracy. This is accountability. When you know which tier caused a problem, you know how to fix it.
